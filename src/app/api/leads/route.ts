import { NextResponse } from "next/server";
import { getServerSupabase, type Lead } from "@/lib/supabase";
import { sendAutoReply, sendInternalNotification } from "@/lib/email";

export const runtime = "nodejs";

/**
 * POST /api/leads
 *
 * Contact-form ingest. As of Phase 2a, every submission:
 *   1. Writes to `public.leads`         (legacy table, kept for back-compat)
 *   2. Writes to `public.submissions`   (the agents platform inbox)
 *   3. Sends a branded auto-reply to the submitter (Resend)
 *   4. Notifies hello@onyxcreative.asia internally (Resend)
 *
 * Failures in any step beyond the primary DB insert are logged but
 * NOT propagated to the caller — the form should always feel
 * successful to the visitor.
 */

function isEmail(s: unknown): s is string {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/** Make a short, useful subject for the submissions table when the
 * form doesn't include one. */
function deriveSubject(name: string, services: string[]): string {
  const svc = services.length > 0 ? services.join(" · ") : "general inquiry";
  return `${name} — ${svc}`;
}

export async function POST(req: Request) {
  let body: Partial<Lead>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const services = Array.isArray(body.services)
    ? body.services.filter((s): s is string => typeof s === "string")
    : [];
  const company = typeof body.company === "string" ? body.company.trim() : null;
  const budget = typeof body.budget === "string" ? body.budget.trim() : null;

  if (!name || name.length > 200) {
    return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "Valid email required." }, { status: 400 });
  }
  if (!message || message.length > 5000) {
    return NextResponse.json({ ok: false, error: "Message is required." }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    // No DB → still try the emails so dev can verify Resend integration.
    console.warn("[leads] Supabase env not set — logging instead.", {
      name,
      email,
      services,
      message: message.slice(0, 80),
    });
    await Promise.allSettled([
      sendAutoReply({ toName: name, toEmail: email, services, budget, message }),
      sendInternalNotification({
        fromName: name,
        fromEmail: email,
        services,
        budget,
        message,
        source: "form",
        submissionId: null,
      }),
    ]);
    return NextResponse.json({ ok: true, mock: true });
  }

  // 1. Legacy leads table (kept so anything pointing at it still works)
  const leadsInsert = supabase.from("leads").insert({
    name,
    email,
    company,
    budget,
    services,
    message,
    source: "website",
  });

  // 2. Platform submissions table — this is what /agents/submissions reads
  const submissionsInsert = supabase
    .from("submissions")
    .insert({
      source: "form",
      from_name: name,
      from_email: email,
      subject: deriveSubject(name, services),
      body_md: message,
      interest: services,
      budget_band: budget,
      status: "new",
      payload_json: { company, raw_services: services },
    })
    .select("id")
    .single();

  const [leadsRes, submissionsRes] = await Promise.all([
    leadsInsert,
    submissionsInsert,
  ]);

  if (leadsRes.error) {
    // Legacy table write — log only, don't fail the request (the new
    // submissions table is the real source of truth now).
    console.error("[leads] legacy insert error", leadsRes.error);
  }

  if (submissionsRes.error) {
    // This one matters — without the submission row the brief is invisible.
    console.error("[leads] submissions insert error", submissionsRes.error);
    return NextResponse.json(
      { ok: false, error: "Could not save submission." },
      { status: 500 }
    );
  }

  const submissionId = submissionsRes.data?.id ?? null;

  // 3 + 4 — fire emails in parallel. Email failures should not break
  // the form: the brief is already saved, we'll see it in the dashboard
  // even if Resend hiccups.
  void Promise.allSettled([
    sendAutoReply({ toName: name, toEmail: email, services, budget, message }),
    sendInternalNotification({
      fromName: name,
      fromEmail: email,
      services,
      budget,
      message,
      source: "form",
      submissionId,
    }),
  ]).then((results) => {
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(
          `[leads] email ${i === 0 ? "auto-reply" : "internal"} rejected:`,
          r.reason
        );
      } else if (r.value.ok === false) {
        console.error(
          `[leads] email ${i === 0 ? "auto-reply" : "internal"} failed:`,
          r.value.error
        );
      }
    });
  });

  return NextResponse.json({ ok: true, submissionId });
}
