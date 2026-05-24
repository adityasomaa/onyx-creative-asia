"use server";

/**
 * Server actions for /agents/chats.
 *
 * - markChatReadAction        — flip is_read true/false
 * - setChatClassificationAction — Bring back / Ignore future / Reset to auto
 * - setChatArchivedAction     — archive / unarchive
 * - renameChatAction          — operator-set display name (sticky)
 * - upsertChatContextAction   — save brief / links / socials / deliverables / reporting
 * - upsertChatCredentialsAction — save encrypted credentials separately so we
 *                                 can lock down which UI gestures need re-auth later
 * - sendChatReplyAction       — outbound WA reply, mirrored into wa_messages
 *
 * All require an authenticated agents session — guarded by the
 * /agents layout's session middleware, plus we double-check at the
 * top of each action so they're safe to call from any client.
 */

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/agents-auth";
import { sendWhatsApp } from "@/lib/fonnte";
import { canSendWhatsApp, logWhatsAppSend } from "@/lib/wa-safety";
import {
  insertWaMessage,
  markChatRead,
  renameChatDisplayName,
  setChatArchived,
  setChatClassification,
  upsertChatContext,
  type ChatCredential,
  type ChatDeliverable,
  type ChatLink,
  type ChatReportingItem,
  type ChatSocialAccount,
  type WaChatClassification,
} from "@/lib/db/wa-chats";
import { getServerSupabase } from "@/lib/supabase";

async function requireAuthedOperator(): Promise<{
  ok: true;
  operator: string;
} | { ok: false; error: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (!session) {
    return { ok: false, error: "Not authenticated" };
  }
  return { ok: true, operator: session.username };
}

/* ============================================================
 * Read state
 * ============================================================ */

export async function markChatReadAction(
  chatId: string,
  isRead: boolean = true
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAuthedOperator();
  if (!auth.ok) return { ok: false, error: auth.error };
  const ok = await markChatRead(chatId, isRead);
  if (ok) {
    revalidatePath("/agents/chats");
    revalidatePath(`/agents/chats/${chatId}`);
  }
  return { ok };
}

/* ============================================================
 * Classification (Bring back / Ignore future)
 * ============================================================ */

export async function setChatClassificationAction(
  chatId: string,
  classification: WaChatClassification
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAuthedOperator();
  if (!auth.ok) return { ok: false, error: auth.error };
  const ok = await setChatClassification(
    chatId,
    classification,
    `manual override by ${auth.operator}`,
    null
  );
  if (ok) {
    revalidatePath("/agents/chats");
    revalidatePath(`/agents/chats/${chatId}`);
  }
  return { ok };
}

/* ============================================================
 * Archive / unarchive
 * ============================================================ */

export async function setChatArchivedAction(
  chatId: string,
  archived: boolean
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAuthedOperator();
  if (!auth.ok) return { ok: false, error: auth.error };
  const ok = await setChatArchived(chatId, archived);
  if (ok) {
    revalidatePath("/agents/chats");
    revalidatePath(`/agents/chats/${chatId}`);
  }
  return { ok };
}

/* ============================================================
 * Rename
 * ============================================================ */

export async function renameChatAction(
  chatId: string,
  newName: string
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAuthedOperator();
  if (!auth.ok) return { ok: false, error: auth.error };
  const ok = await renameChatDisplayName(chatId, newName);
  if (ok) {
    revalidatePath("/agents/chats");
    revalidatePath(`/agents/chats/${chatId}`);
  }
  return { ok };
}

/* ============================================================
 * Context vault upsert
 * ============================================================ */

export type ContextFormPayload = {
  brief_md: string;
  links: ChatLink[];
  social_accounts: ChatSocialAccount[];
  deliverables: ChatDeliverable[];
  reporting_setup: ChatReportingItem[];
  credentials: ChatCredential[];
};

export async function upsertChatContextAction(
  chatId: string,
  payload: ContextFormPayload
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAuthedOperator();
  if (!auth.ok) return { ok: false, error: auth.error };

  const res = await upsertChatContext({
    chatId,
    brief_md: payload.brief_md || null,
    links: payload.links,
    social_accounts: payload.social_accounts,
    deliverables: payload.deliverables,
    reporting_setup: payload.reporting_setup,
    credentials: payload.credentials,
    updatedBy: auth.operator,
  });

  if (res.ok) {
    revalidatePath(`/agents/chats/${chatId}`);
  }
  return res.ok ? { ok: true } : { ok: false, error: res.error };
}

/* ============================================================
 * Send reply (outbound WA)
 * ============================================================ */

export async function sendChatReplyAction(
  chatId: string,
  rawMessage: string
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAuthedOperator();
  if (!auth.ok) return { ok: false, error: auth.error };

  const message = rawMessage.trim();
  if (!message) return { ok: false, error: "Empty message" };
  if (message.length > 4000) {
    return { ok: false, error: "Message exceeds 4000 chars" };
  }

  // Look up the chat so we know where to send.
  const sb = getServerSupabase();
  if (!sb) return { ok: false, error: "Supabase not configured" };

  const { data: chat, error: chatErr } = await sb
    .from("wa_chats")
    .select("id, kind, wa_identifier")
    .eq("id", chatId)
    .maybeSingle();
  if (chatErr || !chat) {
    return { ok: false, error: chatErr?.message ?? "Chat not found" };
  }
  if (chat.kind === "group") {
    return {
      ok: false,
      error:
        "Group replies are not supported yet — reply directly in WhatsApp.",
    };
  }

  const target = chat.wa_identifier as string;

  // Safety gate
  const allow = await canSendWhatsApp(target);
  if (!allow.ok) {
    await logWhatsAppSend({
      target,
      message,
      ok: false,
      error: `BLOCKED reply: ${allow.code} — ${allow.reason}`,
      chatId,
      sender: auth.operator,
    });
    return { ok: false, error: allow.reason };
  }

  const res = await sendWhatsApp({ target, message });
  let mirroredMessageId: string | null = null;
  if (res.ok) {
    const mirrored = await insertWaMessage({
      chatId,
      direction: "out",
      fromPhone: target,
      fromPushname: auth.operator,
      body: message,
      payload: { fonnte_result: res, sent_by: auth.operator },
    });
    mirroredMessageId = mirrored?.id ?? null;
    // Outbound mark the chat as read (operator just engaged with it).
    await markChatRead(chatId, true);
  }
  await logWhatsAppSend({
    target,
    message,
    ok: res.ok,
    error: res.ok ? undefined : res.error,
    sender: auth.operator,
    chatId,
    messageId: mirroredMessageId,
  });

  if (res.ok) {
    revalidatePath(`/agents/chats/${chatId}`);
    revalidatePath("/agents/chats");
    return { ok: true };
  }
  return { ok: false, error: res.error };
}
