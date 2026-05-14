import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/agents-auth";
import { getServerSupabase } from "@/lib/supabase";
import { getProfile } from "@/lib/db/profile";
import { sendReply } from "@/lib/email";
import { sendWhatsApp } from "@/lib/fonnte";
import { canSendWhatsApp, logWhatsAppSend } from "@/lib/wa-safety";

export const runtime = "nodejs";

/**
 * POST /api/submissions/[id]/reply
 *
 * Sends an operator-authored reply to the lead via the channel they
 * originally arrived on (or the channel the operator explicitly picks).
 *
 * Body: { channel: "email" | "whatsapp", body: string }
 *
 * On success:
 *   - Submission row's status flips to "replied"
 *   - triaged_at + triaged_by stamped with the operator's username
 *   - An agent_runs row is inserted: input_md = the typed body,
 *     output_md = the channel + delivery id, agent = "account-manager"
 *
 * Auth: same cookie-session check as the PATCH endpoint.
 */

type Channel = "email" | "whatsapp";

async function assertSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await assertSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  }

  let body: { channel?: unknown; body?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const channel = body.channel === "email" || body.channel === "whatsapp" ? (body.channel as Channel) : null;
  const replyText = typeof body.body === "string" ? body.body.trim() : "";

  if (!channel) {
    return NextResponse.json(
      { ok: false, error: "Pick a channel (email or whatsapp)." },
      { status: 400 }
    );
  }
  if (!replyText) {
    return NextResponse.json(
      { ok: false, error: "Reply body is required." },
      { status: 400 }
    );
  }
  if (replyText.length > 5000) {
    return NextResponse.json(
      { ok: false, error: "Reply too long (max 5000 chars)." },
      { status: 400 }
    );
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "DB not configured." },
      { status: 500 }
    );
  }

  // Fetch the submission to know who to reply to
  const { data: submission, error: subErr } = await supabase
    .from("submissions")
    .select("id, subject, from_name, from_email, from_phone, status")
    .eq("id", id)
    .maybeSingle();

  if (subErr || !submission) {
    return NextResponse.json(
      { ok: false, error: "Submission not found." },
      { status: 404 }
    );
  }

  // Pull the operator's signature for the email branch
  const profile = await getProfile();

  let deliveryId: string | null = null;

  if (channel === "email") {
    if (!submission.from_email) {
      return NextResponse.json(
        { ok: false, error: "No email on this submission." },
        { status: 400 }
      );
    }
    const res = await sendReply({
      toName: submission.from_name ?? "there",
      toEmail: submission.from_email,
      originalSubject: submission.subject,
      body: replyText,
      signature: profile.email_signature,
    });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: res.error ?? "Email send failed." },
        { status: 502 }
      );
    }
    deliveryId = res.id ?? null;
  } else {
    // whatsapp
    if (!submission.from_phone) {
      return NextResponse.json(
        { ok: false, error: "No WhatsApp number on this submission." },
        { status: 400 }
      );
    }

    // Safety gate — working hours / daily quota / cooldown / interval.
    // Any deny here returns 429 (Too Many Requests) so the dashboard
    // can show the reason inline without conflating it with a 500.
    const allow = await canSendWhatsApp(submission.from_phone);
    if (!allow.ok) {
      // Log the blocked attempt for auditability.
      void logWhatsAppSend({
        target: submission.from_phone,
        message: replyText,
        ok: false,
        error: `BLOCKED: ${allow.code} — ${allow.reason}`,
        sender: session.username,
        submissionId: id,
      });
      return NextResponse.json(
        { ok: false, error: allow.reason, code: allow.code },
        { status: 429 }
      );
    }

    const res = await sendWhatsApp({
      target: submission.from_phone,
      message: replyText,
    });

    // Always log — success or fail — so the rolling counters stay
    // honest and we can audit anything Meta might flag.
    void logWhatsAppSend({
      target: submission.from_phone,
      message: replyText,
      ok: res.ok,
      error: res.ok ? undefined : res.error,
      sender: session.username,
      submissionId: id,
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: res.error },
        { status: 502 }
      );
    }
    deliveryId = res.id ?? null;
  }

  // Update the submission status — log-only on failure (the message
  // already went out, the dashboard state is secondary)
  const nowIso = new Date().toISOString();
  const { error: updateErr } = await supabase
    .from("submissions")
    .update({
      status: "replied",
      triaged_at: nowIso,
      triaged_by: session.username,
    })
    .eq("id", id);
  if (updateErr) {
    console.error("[reply] status update failed:", updateErr);
  }

  // Log the reply in agent_runs against the account-manager agent
  // (best-effort — keeps the activity feed honest).
  const { data: agent } = await supabase
    .from("agents")
    .select("id")
    .eq("slug", "account-manager")
    .maybeSingle();
  if (agent?.id) {
    await supabase.from("agent_runs").insert({
      agent_id: agent.id,
      input_md: replyText,
      output_md: `Sent via ${channel}${
        deliveryId ? ` (delivery id: ${deliveryId})` : ""
      }`,
      status: "success",
      started_at: nowIso,
      completed_at: nowIso,
      duration_ms: 0,
    });
  }

  return NextResponse.json({ ok: true, channel, deliveryId });
}
