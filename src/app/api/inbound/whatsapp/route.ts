import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { sendInternalNotification } from "@/lib/email";
import { sendWhatsApp, normaliseTarget } from "@/lib/fonnte";

export const runtime = "nodejs";

/**
 * POST /api/inbound/whatsapp
 *
 * Fonnte webhook receiver. Configure this URL in the Fonnte dashboard:
 *   Device → Webhook → URL = https://onyxcreative.asia/api/inbound/whatsapp?secret=<FONNTE_WEBHOOK_SECRET>
 * (Use the same string in Vercel env as `FONNTE_WEBHOOK_SECRET`.)
 *
 * What it does:
 *   1. Verifies the query-param secret matches our env var.
 *   2. Parses Fonnte's payload (form-encoded by default, JSON if you
 *      flip the dashboard switch). Skips group messages.
 *   3. Inserts a row into public.submissions with source='whatsapp'.
 *   4. Fires an auto-reply WA back to the sender ("we got it") and an
 *      internal email notification to hello@onyxcreative.asia. Both
 *      are best-effort and don't block the 200 we return to Fonnte.
 *
 * Fonnte expects a fast 200 OK or it retries. We always return 200
 * after the DB insert and log async sends.
 */

type Payload = Record<string, unknown>;

function pickString(payload: Payload, ...keys: string[]): string {
  for (const k of keys) {
    const v = payload[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

async function parsePayload(req: Request): Promise<Payload> {
  const ct = req.headers.get("content-type") ?? "";
  // JSON path
  if (ct.includes("application/json")) {
    try {
      return (await req.json()) as Payload;
    } catch {
      return {};
    }
  }
  // form-encoded path (Fonnte's default)
  try {
    const fd = await req.formData();
    const out: Payload = {};
    for (const [k, v] of fd.entries()) {
      out[k] = typeof v === "string" ? v : String(v);
    }
    return out;
  } catch {
    return {};
  }
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const secretParam = url.searchParams.get("secret") ?? "";
  const expected = process.env.FONNTE_WEBHOOK_SECRET ?? "";

  if (!expected) {
    console.error("[wa-inbound] FONNTE_WEBHOOK_SECRET not configured.");
    return NextResponse.json(
      { ok: false, error: "Webhook secret not configured." },
      { status: 503 }
    );
  }
  if (secretParam !== expected) {
    console.warn("[wa-inbound] secret mismatch", {
      received: secretParam.slice(0, 6),
    });
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const payload = await parsePayload(req);

  // ----- Skip events we don't want as submissions ------------------
  // Fonnte may post status/ack/delete events too. Real incoming
  // messages have non-empty `message` + non-empty `sender`.
  const message = pickString(payload, "message", "text");
  const senderRaw = pickString(payload, "sender", "from", "phone");
  const isGroup =
    pickString(payload, "isgroup", "is_group", "groupid", "group").length > 0;

  if (!message || !senderRaw) {
    // Fonnte still expects 200 — telling it "rejected" makes it retry.
    return NextResponse.json({ ok: true, skipped: "no-message-or-sender" });
  }
  if (isGroup) {
    return NextResponse.json({ ok: true, skipped: "group-message" });
  }

  const sender = normaliseTarget(senderRaw) ?? senderRaw.replace(/\D/g, "");
  const name =
    pickString(payload, "name", "pushname", "sender_name") || sender;

  // Make a short subject so the list view reads cleanly without
  // expanding the body.
  const subjectFromBody = message.split(/\r?\n/)[0].slice(0, 80) || "(no subject)";
  const subject = `${name} — ${subjectFromBody}`;

  const supabase = getServerSupabase();
  if (!supabase) {
    console.error("[wa-inbound] Supabase env not configured.");
    // Still 200 — we don't want Fonnte to retry, the message is in
    // the webhook log on Fonnte's side anyway.
    return NextResponse.json({ ok: true, mock: true });
  }

  const { data: inserted, error: insertErr } = await supabase
    .from("submissions")
    .insert({
      source: "whatsapp",
      inquiry_type: "general", // operator re-classifies via Action column
      from_name: name,
      from_phone: sender,
      subject,
      body_md: message,
      interest: [],
      status: "new",
      payload_json: payload,
    })
    .select("id")
    .single();

  if (insertErr || !inserted) {
    console.error("[wa-inbound] insert failed:", insertErr);
    // 200 to avoid retry; the operator can read the Fonnte side and
    // we'll see this in Vercel logs.
    return NextResponse.json({
      ok: false,
      handled: true,
      error: insertErr?.message ?? "insert failed",
    });
  }

  const submissionId = inserted.id as string;

  // Fire-and-forget downstream actions:
  //   - Internal notification email (always — operator awareness)
  //   - WhatsApp auto-reply (gated by WA_AUTO_REPLY_ENABLED env flag,
  //     default OFF. Flip to "true" in Vercel env when you want the
  //     'we got your message' reply to fire automatically.)
  //
  // We don't await — Fonnte should get its 200 back fast.
  const autoReplyOn = process.env.WA_AUTO_REPLY_ENABLED === "true";

  type DownstreamLabel = "email" | "auto-reply";
  const tasks: Array<{ label: DownstreamLabel; promise: Promise<unknown> }> = [
    {
      label: "email",
      promise: sendInternalNotification({
        fromName: name,
        fromEmail: `${sender}@whatsapp`, // synthetic — Resend won't reply to it
        inquiryType: "general",
        highlight: "WhatsApp",
        metaRows: [
          { label: "Channel", value: "WhatsApp" },
          { label: "Phone", value: sender },
        ],
        body: message,
        submissionId,
      }),
    },
  ];

  if (autoReplyOn) {
    tasks.push({
      label: "auto-reply",
      promise: sendWhatsApp({
        target: sender,
        message: buildAutoReply(name),
      }),
    });
  }

  void Promise.allSettled(tasks.map((t) => t.promise)).then((results) => {
    results.forEach((r, i) => {
      const label = tasks[i].label;
      if (r.status === "rejected") {
        console.error(`[wa-inbound] downstream ${label} rejected:`, r.reason);
      } else if (
        typeof r.value === "object" &&
        r.value !== null &&
        "ok" in r.value &&
        (r.value as { ok: boolean }).ok === false
      ) {
        console.error(
          `[wa-inbound] downstream ${label} failed:`,
          (r.value as { error?: string }).error
        );
      }
    });
  });

  return NextResponse.json({ ok: true, submissionId });
}

/* ============================================================
 * Auto-reply copy — short, bilingual-friendly, brand voice.
 *
 * Plain text, no formatting (WA strips most), keeps it under 250 chars
 * so it renders on one screen on most phones.
 * ============================================================ */

function buildAutoReply(name: string): string {
  const firstName = name.split(/\s+/)[0] || "there";
  return (
    `Halo ${firstName}, thanks for the message — udah masuk ke tim Onyx.\n\n` +
    `Kita read every message ourselves and we'll get back to you within 24h. ` +
    `Kalau urgent, langsung balas thread ini aja.\n\n` +
    `— Onyx Creative Asia`
  );
}
