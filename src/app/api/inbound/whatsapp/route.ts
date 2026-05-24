import { NextResponse } from "next/server";
import { sendInternalNotification } from "@/lib/email";
import { sendWhatsApp, normaliseTarget } from "@/lib/fonnte";
import { canSendWhatsApp, logWhatsAppSend } from "@/lib/wa-safety";
import { classifyWhatsAppChat } from "@/lib/wa/classify";
import { refreshChatSubject } from "@/lib/wa/subject";
import {
  getRecentInboundBodies,
  insertWaMessage,
  setChatClassification,
  setChatSubject,
  upsertWaChat,
  type WaChatRow,
} from "@/lib/db/wa-chats";

export const runtime = "nodejs";

/**
 * POST /api/inbound/whatsapp
 *
 * Fonnte webhook receiver — projects-style inbox.
 *
 * Flow:
 *   1. Validate secret + parse payload (form-encoded or JSON).
 *   2. Detect kind: group vs 1:1 contact.
 *   3. upsertWaChat() — find or create the wa_chat row.
 *   4. insertWaMessage() — append the inbound message (trigger handles
 *      last_message_*, is_read=false, message_count++).
 *   5. On FRESH chat only: run Gemini classifier (business vs personal)
 *      and persist the verdict.
 *   6. If business (or pending → treated as business): fire downstream
 *      email + optional auto-reply. Personal chats stay silent.
 *
 * Fonnte expects a fast 200 OK or it retries. Always return 200 once
 * the message is persisted; downstream tasks run fire-and-forget.
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

  // Actual sender phone (member field for groups; sender field otherwise).
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
  const pushname = pickString(payload, "name", "pushname", "sender_name") || null;
  const groupName = isGroup
    ? pickString(payload, "groupname", "group_name", "chatname") || null
    : null;

  // ---------- Upsert chat row ----------
  // Chat identifier:
  //   group   → use the group id (senderRaw — the raw group id from Fonnte)
  //   contact → use the normalised sender phone
  const chatIdentifier = isGroup ? senderRaw : senderPhone;
  const upserted = await upsertWaChat({
    kind: isGroup ? "group" : "contact",
    waIdentifier: chatIdentifier,
    pushname,
    groupName,
  });
  if (!upserted) {
    console.error("[wa-inbound] failed to upsert chat");
    return NextResponse.json({ ok: false, error: "upsert-failed" });
  }
  const { chat, isFresh } = upserted;

  // ---------- Insert message ----------
  // The DB trigger updates wa_chats.last_message_*, message_count, and
  // sets is_read=false — we don't need to do any of that manually.
  const inserted = await insertWaMessage({
    chatId: chat.id,
    direction: "in",
    fromPhone: senderPhone,
    fromPushname: pushname,
    body: message,
    payload,
  });
  if (!inserted) {
    console.error("[wa-inbound] failed to insert message");
    return NextResponse.json({ ok: false, error: "insert-failed" });
  }

  // ---------- Classify on fresh chats ----------
  // Run the LLM classifier ONLY on the first inbound event from a chat.
  // Subsequent events keep the existing classification. Operator can
  // override anytime from the chat detail page.
  let effectiveClassification = chat.classification;
  if (isFresh) {
    const verdict = await classifyWhatsAppChat({
      message,
      pushname,
      fromPhone: senderPhone,
      isGroup,
    });
    await setChatClassification(
      chat.id,
      verdict.classification,
      verdict.reason,
      verdict.model
    );
    effectiveClassification = verdict.classification;
    console.info("[wa-inbound] classified fresh chat", {
      chatId: chat.id,
      classification: verdict.classification,
      reason: verdict.reason.slice(0, 80),
    });
  }

  // ---------- Downstream: notification + auto-reply ----------
  // Personal chats stay silent — no email, no auto-reply, no triage.
  // Pending/business/manual_business all fire downstream actions.
  const isInboxSilent =
    effectiveClassification === "personal" ||
    effectiveClassification === "manual_ignored";

  if (isInboxSilent) {
    console.info("[wa-inbound] silent chat — no downstream", {
      chatId: chat.id,
      classification: effectiveClassification,
    });
    return NextResponse.json({
      ok: true,
      chatId: chat.id,
      messageId: inserted.id,
      classification: effectiveClassification,
      silent: true,
    });
  }

  const autoReplyOn = process.env.WA_AUTO_REPLY_ENABLED === "true";

  type DownstreamLabel = "email" | "auto-reply" | "subject-refresh";
  const tasks: Array<{ label: DownstreamLabel; promise: Promise<unknown> }> = [];

  // Subject auto-refresh — runs on every inbound (fresh + follow-up).
  // The inbox list scans subjects, not raw previews; we want them to
  // describe the work being asked for, not the sender.
  tasks.push({
    label: "subject-refresh",
    promise: (async () => {
      const recent = await getRecentInboundBodies(chat.id, 6);
      const verdict = await refreshChatSubject({
        latestMessage: message,
        recentMessages: recent.slice(0, -1), // exclude the latest (already in latestMessage)
        previousSubject: chat.subject,
      });
      await setChatSubject(chat.id, verdict.subject);
      return verdict;
    })(),
  });

  // Email notification — always on (operator awareness).
  tasks.push({
    label: "email",
    promise: sendInternalNotification({
      fromName: chat.display_name ?? senderPhone,
      fromEmail: `${senderPhone}@whatsapp`, // synthetic
      inquiryType: "general",
      highlight: buildEmailHighlight(chat, isGroup, groupName),
      metaRows: buildEmailMetaRows({
        chat,
        senderPhone,
        pushname,
        isGroup,
        groupName,
        isFresh,
        classification: effectiveClassification,
      }),
      body: message,
      // submissionId omitted — internal email template tolerates null
    }),
  });

  // Auto-reply — fresh chats only, gated by env, gated by safety.
  if (autoReplyOn && isFresh) {
    tasks.push({
      label: "auto-reply",
      promise: (async () => {
        const replyMsg = buildAutoReply(chat.display_name ?? senderPhone);
        const allow = await canSendWhatsApp(senderPhone);
        if (!allow.ok) {
          await logWhatsAppSend({
            target: senderPhone,
            message: replyMsg,
            ok: false,
            error: `BLOCKED auto-reply: ${allow.code} — ${allow.reason}`,
            chatId: chat.id,
          });
          return { ok: false, error: allow.reason };
        }
        const res = await sendWhatsApp({
          target: senderPhone,
          message: replyMsg,
        });
        if (res.ok) {
          // Mirror our outbound into wa_messages so the thread shows it.
          await insertWaMessage({
            chatId: chat.id,
            direction: "out",
            fromPhone: senderPhone, // recipient at our end
            fromPushname: "Onyx (auto)",
            body: replyMsg,
            payload: { auto_reply: true, fonnte_result: res },
          });
        }
        await logWhatsAppSend({
          target: senderPhone,
          message: replyMsg,
          ok: res.ok,
          error: res.ok ? undefined : res.error,
          chatId: chat.id,
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
    chatId: chat.id,
    messageId: inserted.id,
    classification: effectiveClassification,
    isFresh,
  });
}

/* ============================================================
 * Email + reply helpers
 * ============================================================ */

function buildEmailHighlight(
  chat: WaChatRow,
  isGroup: boolean,
  groupName: string | null
): string {
  if (isGroup) return `WhatsApp · ${groupName ?? "group"}`;
  return "WhatsApp";
}

function buildEmailMetaRows(opts: {
  chat: WaChatRow;
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
  // Take the first token only and lowercase. If the name is a phone
  // number ("+62 895..."), use "there" instead — feels weird to greet
  // someone with their digits.
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
