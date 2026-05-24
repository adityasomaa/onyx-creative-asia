/**
 * WhatsApp chats query layer.
 *
 * Backs the /agents/chats list + detail pages, and the webhook
 * upsertWaChat() / insertWaMessage() entry points used by
 * /api/inbound/whatsapp.
 *
 * Schema lives in supabase/migrations/0010_wa_chats.sql. A DB trigger
 * (fn_bump_wa_chat_on_message) keeps wa_chats.last_message_*, message_count,
 * and is_read in sync whenever a new wa_message row is inserted, so the
 * insertWaMessage() helper here doesn't need to update wa_chats manually.
 *
 * Display-name rules:
 *   - First insert: display_name = formatPhone(wa_identifier)
 *     for contacts, or wa_group_name for groups. display_name_source='auto'.
 *   - Operator rename: sets display_name + display_name_source='operator'.
 *   - Subsequent webhook events: refresh wa_pushname / wa_group_name
 *     (always), but NEVER touch display_name when source='operator'.
 *     When source='auto', refresh display_name from latest phone format.
 */

import { getServerSupabase } from "@/lib/supabase";
import {
  decryptJSON,
  encryptJSON,
  vaultIsConfigured,
  type EncryptedBlob,
} from "@/lib/crypto-vault";

export type WaChatKind = "contact" | "group";

export type WaChatClassification =
  | "pending"
  | "business"
  | "personal"
  | "manual_business"
  | "manual_ignored";

export type WaMessageDirection = "in" | "out";

export type WaDisplayNameSource = "auto" | "operator";

export type WaChatRow = {
  id: string;
  kind: WaChatKind;
  wa_identifier: string;
  display_name: string | null;
  display_name_source: WaDisplayNameSource;
  wa_pushname: string | null;
  wa_group_name: string | null;
  classification: WaChatClassification;
  classification_reason: string | null;
  classification_model: string | null;
  is_read: boolean;
  archived: boolean;
  last_message_at: string | null;
  last_message_preview: string | null;
  last_message_from_name: string | null;
  last_message_direction: WaMessageDirection | null;
  message_count: number;
  /** LLM-generated action-phrase subject (refreshed per inbound message). */
  subject: string | null;
  subject_updated_at: string | null;
  created_at: string;
};

export type WaMessageRow = {
  id: string;
  chat_id: string;
  direction: WaMessageDirection;
  from_phone: string;
  from_pushname: string | null;
  body_md: string;
  payload_json: Record<string, unknown>;
  sent_at: string;
};

/* ============================================================
 * Project-context vault shapes
 * ============================================================ */

export type ChatLink = {
  label: string;
  url: string;
  notes?: string;
};

export type ChatSocialAccount = {
  platform: string; // 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | etc.
  handle: string;
  business_id?: string;
  access_level?: string; // 'admin' | 'editor' | 'analyst' | etc.
  notes?: string;
};

export type ChatDeliverable = {
  name: string;
  status: "todo" | "in_progress" | "review" | "done" | "blocked";
  deadline?: string; // ISO date
  file_url?: string;
  notes?: string;
};

export type ChatReportingItem = {
  kpi: string;
  frequency: "weekly" | "biweekly" | "monthly" | "quarterly";
  recipient?: string;
  last_sent_at?: string;
  notes?: string;
};

export type ChatCredential = {
  service: string; // 'WordPress admin', 'Gmail', 'IG Business', etc.
  login: string;
  password: string; // plaintext on the wire ONLY — encrypted at rest
  mfa_notes?: string;
  scope?: string; // 'admin' | 'editor' | 'read' | etc.
  notes?: string;
};

export type WaChatContextRow = {
  chat_id: string;
  brief_md: string | null;
  links: ChatLink[];
  social_accounts: ChatSocialAccount[];
  deliverables: ChatDeliverable[];
  reporting_setup: ChatReportingItem[];
  /** Decrypted on read. Null when nothing stored OR when vault key
   *  can't decrypt (key rotated / row tampered). */
  credentials: ChatCredential[] | null;
  /** True when the row has encrypted credentials but we couldn't
   *  decrypt — signals key mismatch to the UI. */
  credentials_undecryptable: boolean;
  updated_at: string;
  updated_by: string | null;
};

/* ============================================================
 * Inbox tabs
 * ============================================================ */

export type WaChatTab = "active" | "personal" | "archived" | "all";

export const WA_CHAT_TAB_LABEL: Record<WaChatTab, string> = {
  active: "Inbox",
  personal: "Personal / Ignored",
  archived: "Archived",
  all: "All",
};

export const WA_CHAT_TABS: WaChatTab[] = [
  "active",
  "personal",
  "archived",
  "all",
];

/* ============================================================
 * Phone-number formatting (display only)
 * ============================================================ */

/**
 * "+62 895 4133 7282" style — pleasant to scan in the inbox.
 * Falls back to the raw digits if we can't parse.
 */
export function formatPhoneForDisplay(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.length < 8) return rawPhone;

  // Indonesia heuristic: starts with 62, rest is the subscriber number.
  if (digits.startsWith("62")) {
    const rest = digits.slice(2);
    // Group as: 3-4-4 (typical IDN mobile) or fall back to 3-3-3-3.
    if (rest.length <= 11) {
      const parts: string[] = [];
      parts.push(rest.slice(0, 3));
      if (rest.length > 3) parts.push(rest.slice(3, 7));
      if (rest.length > 7) parts.push(rest.slice(7));
      return `+62 ${parts.filter(Boolean).join(" ")}`;
    }
  }
  // Generic fallback: + then groups of 3-4
  return `+${digits.match(/.{1,4}/g)?.join(" ") ?? digits}`;
}

/* ============================================================
 * List + detail queries (used by /agents/chats pages)
 * ============================================================ */

export type ListWaChatsOptions = {
  tab?: WaChatTab;
  limit?: number;
};

export async function listWaChats(
  opts: ListWaChatsOptions = {}
): Promise<WaChatRow[]> {
  const sb = getServerSupabase();
  if (!sb) return [];

  const tab = opts.tab ?? "active";
  let q = sb
    .from("wa_chats")
    .select("*")
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .limit(opts.limit ?? 200);

  if (tab === "active") {
    q = q
      .eq("archived", false)
      .in("classification", ["business", "pending", "manual_business"]);
  } else if (tab === "personal") {
    q = q
      .eq("archived", false)
      .in("classification", ["personal", "manual_ignored"]);
  } else if (tab === "archived") {
    q = q.eq("archived", true);
  }

  const { data, error } = await q;
  if (error) {
    console.warn("[db/wa-chats] listWaChats:", error.message);
    return [];
  }
  return (data ?? []) as WaChatRow[];
}

export async function countUnreadActiveChats(): Promise<number> {
  const sb = getServerSupabase();
  if (!sb) return 0;
  const { count, error } = await sb
    .from("wa_chats")
    .select("id", { count: "exact", head: true })
    .eq("archived", false)
    .eq("is_read", false)
    .in("classification", ["business", "pending", "manual_business"]);
  if (error) {
    console.warn("[db/wa-chats] countUnreadActiveChats:", error.message);
    return 0;
  }
  return count ?? 0;
}

export async function getWaChatById(id: string): Promise<WaChatRow | null> {
  const sb = getServerSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from("wa_chats")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.warn("[db/wa-chats] getWaChatById:", error.message);
    return null;
  }
  return (data ?? null) as WaChatRow | null;
}

export async function listMessagesForChat(
  chatId: string
): Promise<WaMessageRow[]> {
  const sb = getServerSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("wa_messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("sent_at", { ascending: true });
  if (error) {
    console.warn("[db/wa-chats] listMessagesForChat:", error.message);
    return [];
  }
  return (data ?? []) as WaMessageRow[];
}

/* ============================================================
 * Project-context vault: get + upsert
 * ============================================================ */

type ContextRowRaw = {
  chat_id: string;
  brief_md: string | null;
  links: ChatLink[] | null;
  social_accounts: ChatSocialAccount[] | null;
  deliverables: ChatDeliverable[] | null;
  reporting_setup: ChatReportingItem[] | null;
  secrets_ciphertext: string | null;
  secrets_iv: string | null;
  secrets_tag: string | null;
  updated_at: string;
  updated_by: string | null;
};

export async function getChatContext(
  chatId: string
): Promise<WaChatContextRow> {
  const sb = getServerSupabase();
  // Default empty context if no DB or no row yet.
  const empty: WaChatContextRow = {
    chat_id: chatId,
    brief_md: null,
    links: [],
    social_accounts: [],
    deliverables: [],
    reporting_setup: [],
    credentials: [],
    credentials_undecryptable: false,
    updated_at: new Date().toISOString(),
    updated_by: null,
  };
  if (!sb) return empty;

  const { data, error } = await sb
    .from("wa_chat_context")
    .select("*")
    .eq("chat_id", chatId)
    .maybeSingle();

  if (error) {
    console.warn("[db/wa-chats] getChatContext:", error.message);
    return empty;
  }
  if (!data) return empty;

  const row = data as ContextRowRaw;

  // Decrypt credentials. Empty/null → []. Decrypt failure → flag for UI.
  let credentials: ChatCredential[] | null = [];
  let undecryptable = false;
  if (row.secrets_ciphertext && row.secrets_iv && row.secrets_tag) {
    try {
      const blob: EncryptedBlob = {
        ciphertext: row.secrets_ciphertext,
        iv: row.secrets_iv,
        tag: row.secrets_tag,
      };
      credentials = decryptJSON<ChatCredential[]>(blob);
      if (!credentials) {
        undecryptable = true;
        credentials = [];
      }
    } catch (err) {
      console.warn("[db/wa-chats] vault decrypt failed:", err);
      undecryptable = true;
      credentials = [];
    }
  }

  return {
    chat_id: row.chat_id,
    brief_md: row.brief_md,
    links: row.links ?? [],
    social_accounts: row.social_accounts ?? [],
    deliverables: row.deliverables ?? [],
    reporting_setup: row.reporting_setup ?? [],
    credentials,
    credentials_undecryptable: undecryptable,
    updated_at: row.updated_at,
    updated_by: row.updated_by,
  };
}

export type UpsertChatContextInput = {
  chatId: string;
  brief_md?: string | null;
  links?: ChatLink[];
  social_accounts?: ChatSocialAccount[];
  deliverables?: ChatDeliverable[];
  reporting_setup?: ChatReportingItem[];
  credentials?: ChatCredential[];
  updatedBy?: string | null;
};

/**
 * Upsert a chat's context. Encrypts credentials with AES-256-GCM
 * before storing. Returns true on success.
 */
export async function upsertChatContext(
  input: UpsertChatContextInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getServerSupabase();
  if (!sb) return { ok: false, error: "Supabase env not configured" };

  // Encrypt credentials if provided. Refuse to silently drop secrets
  // when the vault key isn't set — operator needs to know.
  let secretsBlob: EncryptedBlob | null = null;
  const credsArr = input.credentials ?? null;
  const hasCreds = Array.isArray(credsArr) && credsArr.length > 0;
  if (hasCreds) {
    const vault = vaultIsConfigured();
    if (!vault.ok) {
      return {
        ok: false,
        error: `Cannot store credentials: ${vault.reason}`,
      };
    }
    try {
      secretsBlob = encryptJSON(credsArr);
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  const payload: Record<string, unknown> = {
    chat_id: input.chatId,
    brief_md: input.brief_md ?? null,
    links: input.links ?? [],
    social_accounts: input.social_accounts ?? [],
    deliverables: input.deliverables ?? [],
    reporting_setup: input.reporting_setup ?? [],
    updated_by: input.updatedBy ?? null,
    secrets_ciphertext: secretsBlob?.ciphertext ?? null,
    secrets_iv: secretsBlob?.iv ?? null,
    secrets_tag: secretsBlob?.tag ?? null,
  };

  const { error } = await sb
    .from("wa_chat_context")
    .upsert(payload, { onConflict: "chat_id" });

  if (error) {
    console.error("[db/wa-chats] upsertChatContext:", error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/* ============================================================
 * Webhook entry points — used by /api/inbound/whatsapp
 * ============================================================ */

export type UpsertWaChatInput = {
  kind: WaChatKind;
  waIdentifier: string;
  /** Sender's WA profile name (pushname). Stored separately from display_name. */
  pushname?: string | null;
  /** For groups only. */
  groupName?: string | null;
};

/**
 * Find an existing chat by (kind, wa_identifier) or create a fresh one.
 * Returns { chat, isFresh } — isFresh=true means this was the first
 * inbound event from this contact/group (caller should run the classifier).
 *
 * Always refreshes wa_pushname / wa_group_name on existing rows.
 * Only touches display_name when display_name_source='auto' (operator
 * rename is sticky).
 */
export async function upsertWaChat(
  input: UpsertWaChatInput
): Promise<{ chat: WaChatRow; isFresh: boolean } | null> {
  const sb = getServerSupabase();
  if (!sb) return null;

  const { data: existing, error: lookupErr } = await sb
    .from("wa_chats")
    .select("*")
    .eq("kind", input.kind)
    .eq("wa_identifier", input.waIdentifier)
    .maybeSingle();

  if (lookupErr) {
    console.error("[db/wa-chats] lookup failed:", lookupErr.message);
    return null;
  }

  if (existing) {
    const updates: Record<string, unknown> = {};

    // Always refresh the WA-side names (these are reference, not display).
    if (input.pushname && input.pushname !== existing.wa_pushname) {
      updates.wa_pushname = input.pushname;
    }
    if (input.groupName && input.groupName !== existing.wa_group_name) {
      updates.wa_group_name = input.groupName;
    }

    // Only refresh display_name when operator hasn't renamed.
    if (existing.display_name_source === "auto") {
      const autoName =
        input.kind === "group"
          ? input.groupName ?? input.waIdentifier
          : formatPhoneForDisplay(input.waIdentifier);
      if (autoName && autoName !== existing.display_name) {
        updates.display_name = autoName;
      }
    }

    if (Object.keys(updates).length > 0) {
      const { data: updated } = await sb
        .from("wa_chats")
        .update(updates)
        .eq("id", existing.id)
        .select("*")
        .single();
      return { chat: (updated ?? existing) as WaChatRow, isFresh: false };
    }
    return { chat: existing as WaChatRow, isFresh: false };
  }

  // Fresh insert. display_name defaults to:
  //   contact → formatted phone
  //   group   → group name (fall back to identifier)
  const initialName =
    input.kind === "group"
      ? input.groupName ?? input.waIdentifier
      : formatPhoneForDisplay(input.waIdentifier);

  const { data: inserted, error: insertErr } = await sb
    .from("wa_chats")
    .insert({
      kind: input.kind,
      wa_identifier: input.waIdentifier,
      display_name: initialName,
      display_name_source: "auto",
      wa_pushname: input.pushname ?? null,
      wa_group_name: input.groupName ?? null,
      classification: "pending",
      is_read: false,
      archived: false,
    })
    .select("*")
    .single();

  if (insertErr || !inserted) {
    console.error("[db/wa-chats] insert failed:", insertErr?.message);
    return null;
  }
  return { chat: inserted as WaChatRow, isFresh: true };
}

export type InsertWaMessageInput = {
  chatId: string;
  direction: WaMessageDirection;
  fromPhone: string;
  fromPushname: string | null;
  body: string;
  payload: Record<string, unknown>;
};

export async function insertWaMessage(
  input: InsertWaMessageInput
): Promise<WaMessageRow | null> {
  const sb = getServerSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from("wa_messages")
    .insert({
      chat_id: input.chatId,
      direction: input.direction,
      from_phone: input.fromPhone,
      from_pushname: input.fromPushname,
      body_md: input.body,
      payload_json: input.payload,
    })
    .select("*")
    .single();
  if (error) {
    console.error("[db/wa-chats] insertWaMessage:", error.message);
    return null;
  }
  return data as WaMessageRow;
}

/* ============================================================
 * Operator-facing mutations (server actions call into these)
 * ============================================================ */

export async function setChatClassification(
  chatId: string,
  classification: WaChatClassification,
  reason?: string | null,
  model?: string | null
): Promise<boolean> {
  const sb = getServerSupabase();
  if (!sb) return false;
  const patch: Record<string, unknown> = { classification };
  if (reason !== undefined) patch.classification_reason = reason;
  if (model !== undefined) patch.classification_model = model;
  const { error } = await sb
    .from("wa_chats")
    .update(patch)
    .eq("id", chatId);
  if (error) {
    console.error("[db/wa-chats] setChatClassification:", error.message);
    return false;
  }
  return true;
}

export async function markChatRead(
  chatId: string,
  isRead: boolean = true
): Promise<boolean> {
  const sb = getServerSupabase();
  if (!sb) return false;
  const { error } = await sb
    .from("wa_chats")
    .update({ is_read: isRead })
    .eq("id", chatId);
  if (error) {
    console.error("[db/wa-chats] markChatRead:", error.message);
    return false;
  }
  return true;
}

export async function setChatArchived(
  chatId: string,
  archived: boolean
): Promise<boolean> {
  const sb = getServerSupabase();
  if (!sb) return false;
  const { error } = await sb
    .from("wa_chats")
    .update({ archived })
    .eq("id", chatId);
  if (error) {
    console.error("[db/wa-chats] setChatArchived:", error.message);
    return false;
  }
  return true;
}

/**
 * Persist a fresh LLM-generated subject for a chat. Called fire-and-forget
 * from the webhook after each inbound message.
 */
export async function setChatSubject(
  chatId: string,
  subject: string
): Promise<boolean> {
  const sb = getServerSupabase();
  if (!sb) return false;
  const { error } = await sb
    .from("wa_chats")
    .update({
      subject: subject.slice(0, 200),
      subject_updated_at: new Date().toISOString(),
    })
    .eq("id", chatId);
  if (error) {
    console.error("[db/wa-chats] setChatSubject:", error.message);
    return false;
  }
  return true;
}

/**
 * Fetch the last N inbound message bodies for a chat (oldest → newest).
 * Used to give the subject-refresh LLM call thread context.
 */
export async function getRecentInboundBodies(
  chatId: string,
  limit: number = 6
): Promise<string[]> {
  const sb = getServerSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("wa_messages")
    .select("body_md, sent_at, direction")
    .eq("chat_id", chatId)
    .eq("direction", "in")
    .order("sent_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.warn("[db/wa-chats] getRecentInboundBodies:", error.message);
    return [];
  }
  const rows = (data ?? []) as { body_md: string }[];
  // Re-reverse to oldest → newest for the LLM prompt.
  return rows.map((r) => r.body_md).reverse();
}

/**
 * Operator renames the chat. Sets display_name_source='operator' which
 * locks the name from any future webhook auto-updates.
 *
 * Pass an empty string to RESET back to auto (display_name will be
 * recomputed from the phone or group name on the next webhook event).
 */
export async function renameChatDisplayName(
  chatId: string,
  newName: string
): Promise<boolean> {
  const sb = getServerSupabase();
  if (!sb) return false;
  const trimmed = newName.trim();
  if (trimmed.length === 0) {
    // Reset to auto mode — leave display_name as-is; next webhook will refresh.
    const { error } = await sb
      .from("wa_chats")
      .update({ display_name_source: "auto" })
      .eq("id", chatId);
    if (error) {
      console.error("[db/wa-chats] renameChatDisplayName (reset):", error.message);
      return false;
    }
    return true;
  }
  const { error } = await sb
    .from("wa_chats")
    .update({
      display_name: trimmed.slice(0, 120),
      display_name_source: "operator",
    })
    .eq("id", chatId);
  if (error) {
    console.error("[db/wa-chats] renameChatDisplayName:", error.message);
    return false;
  }
  return true;
}
