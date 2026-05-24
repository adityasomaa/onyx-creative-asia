import { NextResponse } from "next/server";
import { sendInternalNotification } from "@/lib/email";
import { sendWhatsApp, normaliseTarget } from "@/lib/fonnte";
import { canSendWhatsApp, logWhatsAppSend } from "@/lib/wa-safety";
import { classifyWhatsAppChat } from "@/lib/wa/classify";
import { refreshChatSubject } from "@/lib/wa/subject";
import {
  getRecentInboundBodies,
  insertSubmissionMessage,
  setAutoSubject,
  setSubmissionClassification,
  upsertWaSubmission,
  type SubmissionFullRow,
} from "@/lib/db/submissions";

export const runtime = "nodejs";

/**
 * POST /api/inbound/whatsapp
 *
 * Fonnte webhook receiver — unified submissions inbox.
 *
 * Flow:
 *   1. Validate secret + parse payload (form-encoded or JSON).
 *   2. Detect kind: group vs 1:1 contact.
 *   3. upsertWaSubmission() — find the active (non-archived) submission
 *      for this contact/group, or create a fresh one.
 *   4. insertSubmissionMessage() — append the inbound message. The
 *      fn_bump_submission_on_message trigger updates last_*, message_count,
 *      and bumps status back to 'new' if previously read/replied/archived.
 *   5. On FRESH submission only: run Gemini classifier (business vs
 *      personal) and persist the verdict.
 *   6. Subject auto-refresh (synchronous — Vercel terminates fire-and-forget).
 *   7. If business: fire downstream email + optional auto-reply.
 *      Personal: stays silent.
 *
 * Fonnte expects a fast 200 OK or it retries. We persist + classify +
 * subject-refresh synchronously, then return.
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
  if (ct.includes("application/json")) {
    try {
      return (await req.json()) as Payload;
    } catch {
      return {};
    }
  }
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
  // ---------- Master kill switch ----------
  const inboundOn = process.env.WA_INBOUND_ENABLED === "true";
  if (!inboundOn) {
    return NextResponse.json({ ok: true, skipped: "inbound-disabled" });
  }

  // ---------- Secret check ----------
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
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const payload = await parsePayload(req);

  // ---------- Skip non-message events ----------
  const message = pickString(payload, "message", "text");
  const senderRaw = pickString(payload, "sender", "from", "phone");
  if (!message || !senderRaw) {
    return NextResponse.json({ ok: true, skipped: "no-message-or-sender" });
  }

  // ---------- Group detection ----------
  const memberField = pickString(payload, "member");
  const groupFlag = pickString(
    payload,
    "isgroup",
    "is_group",
    "groupid",
    "group"
  ).toLowerCase();
  const groupFlagSet =
    groupFlag === "true" ||
    groupFlag === "1" ||
    groupFlag === "yes" ||
    groupFlag.length > 4;
  const senderDigits = senderRaw.replace(/^\+/, "");
  const senderLooksLikeGroup = /[^0-9]/.test(senderDigits);
  const isGroup =
    memberField.length > 0 || groupFlagSet || senderLooksLikeGroup;

  const actualSenderRaw = isGroup && memberField ? memberField : senderRaw;
  const senderPhone =
    normaliseTarget(actualSenderRaw) ?? actualSenderRaw.replace(/\D/g, "");
  if (!senderPhone || senderPhone.length < 6) {
    console.info("[wa-inbound] skipped — couldn't resolve sender phone", {
      isGroup,
      senderRaw: senderRaw.slice(0, 24),
      memberField: memberField.slice(0, 24),
    });
    return NextResponse.json({ ok: true, skipped: "unresolvable-sender" });
  }

  // ---------- Names ----------
  const pushname =
    pickString(payload, "name", "pushname", "sender_name") || null;
  const groupName = isGroup
    ? pickString(payload, "groupname", "group_name", "chatname") || null
    : null;

  // ---------- Upsert submission ----------
  const submissionIdentifier = isGroup ? senderRaw : senderPhone;
  const upserted = await upsertWaSubmission({
    waKind: isGroup ? "group" : "contact",
    waIdentifier: submissionIdentifier,
    pushname,
    groupName,
  });
  if (!upserted) {
    console.error("[wa-inbound] failed to upsert submission");
    return NextResponse.json({ ok: false, error: "upsert-failed" });
  }
  const { submission, isFresh } = upserted;

  // ---------- Insert message ----------
  const inserted = await insertSubmissionMessage({
    submissionId: submission.id,
    direction: "in",
    fromPhone: senderPhone,
    fromPushname: pushname,
    fromName: pushname,
    body: message,
    payload,
  });
  if (!inserted) {
    console.error("[wa-inbound] failed to insert message");
    return NextResponse.json({ ok: false, error: "insert-failed" });
  }

  // ---------- Classify on fresh submissions ----------
  let effectiveClassification = submission.classification;
  if (isFresh) {
    const verdict = await classifyWhatsAppChat({
      message,
      pushname,
      fromPhone: senderPhone,
      isGroup,
    });
    await setSubmissionClassification(
      submission.id,
      verdict.classification,
      verdict.reason,
      verdict.model
    );
    effectiveClassification = verdict.classification;
    console.info("[wa-inbound] classified fresh submission", {
      submissionId: submission.id,
      classification: verdict.classification,
      reason: verdict.reason.slice(0, 80),
    });
  }

  // ---------- Silent path for personal classifications ----------
  const isInboxSilent =
    effectiveClassification === "personal" ||
    effectiveClassification === "manual_ignored";

  if (isInboxSilent) {
    console.info("[wa-inbound] silent submission — no downstream", {
      submissionId: submission.id,
      classification: effectiveClassification,
    });
    return NextResponse.json({
      ok: true,
      submissionId: submission.id,
      messageId: inserted.id,
      classification: effectiveClassification,
      silent: true,
    });
  }

  // ---------- Subject auto-refresh (SYNCHRONOUS) ----------
  // Vercel serverless terminates fire-and-forget tasks after the
  // response is sent. The inbox primary column is `subject` so we
  // pay the ~1s LLM round-trip up front.
  try {
    const recent = await getRecentInboundBodies(submission.id, 6);
    const verdict = await refreshChatSubject({
      latestMessage: message,
      recentMessages: recent.slice(0, -1),
      previousSubject: submission.subject,
    });
    // setAutoSubject is a no-op if the operator has manually pinned
    // the subject (subject_source='operator') — protects manual edits.
    await setAutoSubject(submission.id, verdict.subject);
    console.info("[wa-inbound] subject refreshed", {
      submissionId: submission.id,
      subject: verdict.subject.slice(0, 80),
    });
  } catch (err) {
    console.error("[wa-inbound] subject refresh failed:", err);
  }

  // ---------- Fire-and-forget downstream tasks ----------
  const autoReplyOn = process.env.WA_AUTO_REPLY_ENABLED === "true";

  type DownstreamLabel = "email" | "auto-reply";
  const tasks: Array<{ label: DownstreamLabel; promise: Promise<unknown> }> =
    [];

  tasks.push({
    label: "email",
    promise: sendInternalNotification({
      fromName: submission.display_name ?? senderPhone,
      fromEmail: `${senderPhone}@whatsapp`,
      inquiryType: "general",
      highlight: buildEmailHighlight(submission, isGroup, groupName),
      metaRows: buildEmailMetaRows({
        submission,
        senderPhone,
        pushname,
        isGroup,
        groupName,
        isFresh,
        classification: effectiveClassification,
      }),
      body: message,
      submissionId: submission.id,
    }),
  });

  if (autoReplyOn && isFresh) {
    tasks.push({
      label: "auto-reply",
      promise: (async () => {
        const replyMsg = buildAutoReply(
          submission.display_name ?? senderPhone
        );
        const allow = await canSendWhatsApp(senderPhone);
        if (!allow.ok) {
          await logWhatsAppSend({
            target: senderPhone,
            message: replyMsg,
            ok: false,
            error: `BLOCKED auto-reply: ${allow.code} — ${allow.reason}`,
            submissionId: submission.id,
          });
          return { ok: false, error: allow.reason };
        }
        const res = await sendWhatsApp({
          target: senderPhone,
          message: replyMsg,
        });
        if (res.ok) {
          await insertSubmissionMessage({
            submissionId: submission.id,
            direction: "out",
            fromPhone: senderPhone,
            fromPushname: "Onyx (auto)",
            fromName: "Onyx (auto)",
            body: replyMsg,
            payload: { auto_reply: true, fonnte_result: res },
          });
        }
        await logWhatsAppSend({
          target: senderPhone,
          message: replyMsg,
          ok: res.ok,
          error: res.ok ? undefined : res.error,
          submissionId: submission.id,
        });
        return res;
      })(),
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

  return NextResponse.json({
    ok: true,
    submissionId: submission.id,
    messageId: inserted.id,
    classification: effectiveClassification,
    isFresh,
  });
}

/* ============================================================
 * Email + reply helpers
 * ============================================================ */

function buildEmailHighlight(
  _submission: SubmissionFullRow,
  isGroup: boolean,
  groupName: string | null
): string {
  if (isGroup) return `WhatsApp · ${groupName ?? "group"}`;
  return "WhatsApp";
}

function buildEmailMetaRows(opts: {
  submission: SubmissionFullRow;
  senderPhone: string;
  pushname: string | null;
  isGroup: boolean;
  groupName: string | null;
  isFresh: boolean;
  classification: string;
}): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [
    {
      label: "Channel",
      value: opts.isGroup ? "WhatsApp (group)" : "WhatsApp",
    },
    { label: "Phone", value: opts.senderPhone },
  ];
  if (opts.pushname) {
    rows.push({ label: "WA profile", value: opts.pushname });
  }
  if (opts.isGroup && opts.groupName) {
    rows.push({ label: "Group", value: opts.groupName });
  }
  if (!opts.isFresh) {
    rows.push({ label: "Thread", value: "follow-up" });
  }
  rows.push({ label: "Classification", value: opts.classification });
  return rows;
}

function buildAutoReply(name: string): string {
  const looksLikePhone = /\+?\d{6,}/.test(name);
  const firstName = looksLikePhone
    ? "there"
    : (name.split(/\s+/)[0] || "there").toLowerCase();
  return (
    `halo ${firstName}, terima kasih udah message kita di sini.\n\n` +
    `kita baca semua message langsung, dan akan balas dalam 24 jam. ` +
    `kalau urgent, langsung balas thread ini aja.\n\n` +
    `— onyx creative asia`
  );
}
