import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { sendInternalNotification } from "@/lib/email";
import { sendWhatsApp, normaliseTarget } from "@/lib/fonnte";
import { canSendWhatsApp, logWhatsAppSend } from "@/lib/wa-safety";
import { triageSubmission } from "@/lib/triage";

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
  // ---------- Master kill switch ----------
  // WA_INBOUND_ENABLED gates the whole pipeline. Default OFF — the
  // platform is currently linked to a personal WA number and the
  // operator doesn't want chats becoming submissions yet. Flip to
  // "true" in Vercel env vars (then redeploy) once the dedicated
  // business number is connected.
  //
  // We still return 200 so Fonnte doesn't retry; just log + skip.
  const inboundOn = process.env.WA_INBOUND_ENABLED === "true";
  if (!inboundOn) {
    return NextResponse.json({ ok: true, skipped: "inbound-disabled" });
  }

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
  // Fonnte posts status / ack / delete events too. A real inbound
  // message has non-empty `message` AND something we can use as
  // sender (either a phone in `sender`, or `member` if it's a group).
  const message = pickString(payload, "message", "text");
  const senderRaw = pickString(payload, "sender", "from", "phone");

  if (!message || !senderRaw) {
    return NextResponse.json({ ok: true, skipped: "no-message-or-sender" });
  }

  // ----- Group-message detection -----------------------------------
  // Groups are NOW processed (operator opted in). We still detect them
  // because the actual sender lives in `member` (group payload) rather
  // than `sender` (which is the group id itself). We also stash the
  // group context in payload_json so the operator can see "from group X".
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
    groupFlag.length > 4; // a non-empty group id string
  const senderDigits = senderRaw.replace(/^\+/, "");
  const senderLooksLikeGroup = /[^0-9]/.test(senderDigits);
  const isGroup =
    memberField.length > 0 || groupFlagSet || senderLooksLikeGroup;

  // For groups, use `member` as the actual sender phone (the person
  // who typed). Fall back to senderRaw if the payload didn't include
  // member (some Fonnte tiers/payload variants).
  const actualSenderRaw = isGroup && memberField ? memberField : senderRaw;
  const sender =
    normaliseTarget(actualSenderRaw) ?? actualSenderRaw.replace(/\D/g, "");

  // Skip if after group-resolution we still don't have a numeric
  // phone — happens for system/broadcast events.
  if (!sender || sender.length < 6) {
    console.info("[wa-inbound] skipped — couldn't resolve sender phone", {
      isGroup,
      senderRaw: senderRaw.slice(0, 24),
      memberField: memberField.slice(0, 24),
    });
    return NextResponse.json({ ok: true, skipped: "unresolvable-sender" });
  }

  const name =
    pickString(payload, "name", "pushname", "sender_name") || sender;
  const groupName = isGroup
    ? pickString(payload, "groupname", "group_name", "chatname") ||
      senderRaw // fallback: the group id is at least something
    : null;

  // ----- Subject -----
  const subjectFromBody =
    message.split(/\r?\n/)[0].slice(0, 80) || "(no subject)";
  const subject = isGroup
    ? `${name} (in ${groupName ?? "group"}) — ${subjectFromBody}`
    : `${name} — ${subjectFromBody}`;

  const supabase = getServerSupabase();
  if (!supabase) {
    console.error("[wa-inbound] Supabase env not configured.");
    return NextResponse.json({ ok: true, mock: true });
  }

  // ============================================================
  // One-thread-per-contact rule.
  //
  // Operator wants: same person chatting again = same submission row
  // (not a new one). So before inserting, look back at THIS phone's
  // recent non-archived submissions in the last 14 days. If found,
  // append the new message to body_md, refresh status to "new", and
  // re-run triage on the merged thread.
  //
  // This keeps the inbox clean (one row per contact) and gives Gemini
  // the full conversation context to refine priority / urgency.
  // ============================================================
  const FOLLOWUP_WINDOW_DAYS = 14;
  const cutoffIso = new Date(
    Date.now() - FOLLOWUP_WINDOW_DAYS * 86_400_000
  ).toISOString();
  const { data: existingThread } = await supabase
    .from("submissions")
    .select("id, body_md, payload_json")
    .eq("source", "whatsapp")
    .eq("from_phone", sender)
    .neq("status", "archived")
    .gte("received_at", cutoffIso)
    .order("received_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const stampedMessage =
    `\n\n— ${new Date().toLocaleString("en-GB", {
      timeZone: "Asia/Makassar",
      hour12: false,
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })} —\n${message}`;

  let submissionId: string;
  let isFreshThread = false;

  if (existingThread?.id) {
    // ----- Append path -----
    const prevBody = (existingThread.body_md ?? "").trim();
    const newBody = prevBody ? prevBody + stampedMessage : message;
    const prevPayload =
      (existingThread.payload_json as Record<string, unknown> | null) ?? {};
    const prevEvents = Array.isArray(prevPayload.wa_events)
      ? (prevPayload.wa_events as unknown[])
      : [];
    const nextEvents = [
      ...prevEvents,
      { at: new Date().toISOString(), payload },
    ];

    const { error: updErr } = await supabase
      .from("submissions")
      .update({
        body_md: newBody,
        status: "new", // bump back to NEW so operator sees the follow-up
        payload_json: { ...prevPayload, wa_events: nextEvents },
      })
      .eq("id", existingThread.id);

    if (updErr) {
      console.error("[wa-inbound] append failed:", updErr);
      return NextResponse.json({
        ok: false,
        handled: true,
        error: updErr.message,
      });
    }
    submissionId = existingThread.id as string;
    console.info("[wa-inbound] appended to existing thread", {
      submissionId,
      sender,
      isGroup,
    });
  } else {
    // ----- Fresh insert path -----
    isFreshThread = true;
    const { data: inserted, error: insertErr } = await supabase
      .from("submissions")
      .insert({
        source: "whatsapp",
        inquiry_type: "general",
        from_name: name,
        from_phone: sender,
        subject,
        body_md: message,
        interest: [],
        status: "new",
        payload_json: isGroup
          ? {
              ...payload,
              wa_group: { id: senderRaw, name: groupName },
              wa_events: [{ at: new Date().toISOString(), payload }],
            }
          : {
              ...payload,
              wa_events: [{ at: new Date().toISOString(), payload }],
            },
      })
      .select("id")
      .single();

    if (insertErr || !inserted) {
      console.error("[wa-inbound] insert failed:", insertErr);
      return NextResponse.json({
        ok: false,
        handled: true,
        error: insertErr?.message ?? "insert failed",
      });
    }
    submissionId = inserted.id as string;
  }

  // For triage we want the FULL conversation context so Gemini can
  // re-prioritize based on accumulated signal — not just the latest
  // line. On append-path that means body_md = previous body + new
  // message; on fresh-path it's just the new message.
  const triageBody = existingThread?.body_md
    ? (existingThread.body_md.trim() + stampedMessage).trim()
    : message;

  // Fire-and-forget downstream actions:
  //   - Internal notification email (always — operator awareness)
  //   - Triage (always — refreshes priority / disciplines on every new msg)
  //   - WhatsApp auto-reply (only on FRESH threads, gated by env flag —
  //     we don't want to send "we got it" every follow-up message)
  const autoReplyOn = process.env.WA_AUTO_REPLY_ENABLED === "true";

  type DownstreamLabel = "email" | "auto-reply" | "triage";
  const tasks: Array<{ label: DownstreamLabel; promise: Promise<unknown> }> = [
    {
      label: "email",
      promise: sendInternalNotification({
        fromName: name,
        fromEmail: `${sender}@whatsapp`, // synthetic — Resend won't reply to it
        inquiryType: "general",
        highlight: isGroup ? `WhatsApp · ${groupName ?? "group"}` : "WhatsApp",
        metaRows: [
          { label: "Channel", value: isGroup ? "WhatsApp (group)" : "WhatsApp" },
          { label: "Phone", value: sender },
          ...(isGroup && groupName ? [{ label: "Group", value: groupName }] : []),
          ...(isFreshThread
            ? []
            : [{ label: "Thread", value: "follow-up (appended)" }]),
        ],
        body: message,
        submissionId,
      }),
    },
    {
      // Same Gemini triage as form submissions, but we feed the FULL
      // merged conversation so priority reflects the cumulative signal.
      label: "triage",
      promise: triageSubmission({
        id: submissionId,
        source: "whatsapp",
        inquiry_type: "general",
        from_name: name,
        from_email: null,
        subject,
        body_md: triageBody,
        budget_band: null,
        interest: [],
      }),
    },
  ];

  // Only fire auto-reply on the FRESH first message of a thread —
  // follow-ups shouldn't get "halo, thanks" every time.
  if (autoReplyOn && isFreshThread) {
    // The auto-reply also has to pass the safety guard. Wrap the
    // whole send in a task that checks first, logs the outcome, and
    // never throws.
    tasks.push({
      label: "auto-reply",
      promise: (async () => {
        const replyMsg = buildAutoReply(name);
        const allow = await canSendWhatsApp(sender);
        if (!allow.ok) {
          await logWhatsAppSend({
            target: sender,
            message: replyMsg,
            ok: false,
            error: `BLOCKED auto-reply: ${allow.code} — ${allow.reason}`,
            submissionId,
          });
          return { ok: false, error: allow.reason };
        }
        const res = await sendWhatsApp({ target: sender, message: replyMsg });
        await logWhatsAppSend({
          target: sender,
          message: replyMsg,
          ok: res.ok,
          error: res.ok ? undefined : res.error,
          submissionId,
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

  return NextResponse.json({ ok: true, submissionId });
}

/* ============================================================
 * Auto-reply copy — short, bilingual-friendly, brand voice.
 *
 * Plain text, no formatting (WA strips most), keeps it under 250 chars
 * so it renders on one screen on most phones.
 * ============================================================ */

function buildAutoReply(name: string): string {
  const firstName = (name.split(/\s+/)[0] || "there").toLowerCase();
  // All lowercase to match the operator's WhatsApp typing style.
  // Same casing rule as enhanceReply — keeps the studio voice
  // consistent whether the operator types it themselves or it's
  // auto-sent on first contact.
  return (
    `halo ${firstName}, terima kasih udah message kita di sini.\n\n` +
    `kita baca semua message langsung, dan akan balas dalam 24 jam. ` +
    `kalau urgent, langsung balas thread ini aja.\n\n` +
    `— onyx creative asia`
  );
}
