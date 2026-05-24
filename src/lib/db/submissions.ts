/**
 * Unified Submissions query layer.
 *
 * After migration 0011 the `submissions` table is the single inbox for
 * every channel (form, email, WhatsApp). Each submission owns:
 *   - many `submission_messages` rows (the thread; 1 for form, N for WA)
 *   - up to one `submission_context` row (the project vault: brief,
 *     links, social accounts, deliverables, reporting, encrypted creds)
 *
 * Status flow:
 *   new → read → replied → archived
 *   (plus legacy: triaged, qualified, spam — kept renderable but not
 *   in the active filter list)
 *
 * Read/unread is just `status = 'new'`. Opening the detail page flips
 * to 'read'. Sending an outbound message flips to 'replied' via the
 * fn_bump_submission_on_message trigger.
 */

import { getServerSupabase } from "@/lib/supabase";
import {
  decryptJSON,
  encryptJSON,
  vaultIsConfigured,
  type EncryptedBlob,
} from "@/lib/crypto-vault";
import type {
  FileRow,
  InquiryType,
  Priority,
  SubmissionRow,
  SubmissionSource,
  SubmissionStatus,
  SubmissionWithRefs,
} from "./types";

/* ============================================================
 * Status + source constants (used by /agents/submissions UI)
 * ============================================================ */

/**
 * The four active statuses surfaced in filters + the operator's mental
 * model. Legacy values ('triaged' / 'qualified' / 'spam') still render
 * if they're on a row, but they don't show up as filter tabs.
 */
export const SUBMISSION_STATUSES: SubmissionStatus[] = [
  "new",
  "read",
  "replied",
  "archived",
];

export const SUBMISSION_STATUS_LABEL: Record<SubmissionStatus, string> = {
  new: "New",
  read: "Read",
  replied: "Replied",
  archived: "Archived",
  // Legacy
  triaged: "Triaged",
  qualified: "Qualified",
  spam: "Spam",
};

export const SUBMISSION_SOURCE_LABEL: Record<SubmissionSource, string> = {
  form: "Web form",
  email: "Email",
  whatsapp: "WhatsApp",
  manual: "Manual",
};

export const INQUIRY_TYPE_LABEL: Record<InquiryType, string> = {
  general: "Question",
  project: "Project",
  career: "Career",
  partnership: "Partnership",
  unknown: "Unknown",
};

export const INQUIRY_TYPES: InquiryType[] = [
  "general",
  "project",
  "career",
  "partnership",
];

/* ============================================================
 * Inbox tabs — classification-aware
 * ============================================================ */

export type InboxTab = "inbox" | "personal" | "archived" | "all";

export const INBOX_TAB_LABEL: Record<InboxTab, string> = {
  inbox: "Inbox",
  personal: "Personal / Ignored",
  archived: "Archived",
  all: "All",
};

export const INBOX_TABS: InboxTab[] = ["inbox", "personal", "archived", "all"];

/* ============================================================
 * Classification (Gemini auto-tag for WA + operator override)
 * ============================================================ */

export type Classification =
  | "pending"
  | "business"
  | "personal"
  | "manual_business"
  | "manual_ignored";

/** Sources WHERE we run the LLM classifier. Form/email are always
 *  treated as business (they're inherent intent). */
export const CLASSIFIED_SOURCES: SubmissionSource[] = ["whatsapp"];

/* ============================================================
 * Extended row types (after migration 0011)
 * ============================================================ */

export type DisplayNameSource = "auto" | "operator";
export type SubjectSource = "auto" | "operator";
export type WaKind = "contact" | "group";
export type MessageDirection = "in" | "out";

export type SubmissionFullRow = SubmissionRow & {
  classification: Classification;
  classification_reason: string | null;
  classification_model: string | null;
  subject_source: SubjectSource;
  subject_updated_at: string | null;
  display_name: string | null;
  display_name_source: DisplayNameSource;
  wa_pushname: string | null;
  wa_group_name: string | null;
  wa_kind: WaKind | null;
  wa_identifier: string | null;
  last_event_at: string | null;
  last_message_preview: string | null;
  last_message_from_name: string | null;
  last_message_direction: MessageDirection | null;
  message_count: number;
};

export type SubmissionWithRefsFull = SubmissionWithRefs & {
  classification: Classification;
  classification_reason: string | null;
  classification_model: string | null;
  subject_source: SubjectSource;
  subject_updated_at: string | null;
  display_name: string | null;
  display_name_source: DisplayNameSource;
  wa_pushname: string | null;
  wa_group_name: string | null;
  wa_kind: WaKind | null;
  wa_identifier: string | null;
  last_event_at: string | null;
  last_message_preview: string | null;
  last_message_from_name: string | null;
  last_message_direction: MessageDirection | null;
  message_count: number;
};

export type SubmissionMessageRow = {
  id: string;
  submission_id: string;
  direction: MessageDirection;
  from_phone: string | null;
  from_pushname: string | null;
  from_name: string | null;
  body_md: string;
  payload_json: Record<string, unknown>;
  sent_at: string;
};

/* ============================================================
 * Project-context vault shapes
 * ============================================================ */

export type ChatLink = { label: string; url: string; notes?: string };

export type ChatSocialAccount = {
  platform: string;
  handle: string;
  business_id?: string;
  access_level?: string;
  notes?: string;
};

export type ChatDeliverable = {
  name: string;
  status: "todo" | "in_progress" | "review" | "done" | "blocked";
  deadline?: string;
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
  service: string;
  login: string;
  password: string;
  mfa_notes?: string;
  scope?: string;
  notes?: string;
};

export type SubmissionContextRow = {
  submission_id: string;
  brief_md: string | null;
  links: ChatLink[];
  social_accounts: ChatSocialAccount[];
  deliverables: ChatDeliverable[];
  reporting_setup: ChatReportingItem[];
  credentials: ChatCredential[] | null;
  credentials_undecryptable: boolean;
  updated_at: string;
  updated_by: string | null;
};

/* ============================================================
 * Phone formatting (display only)
 * ============================================================ */

export function formatPhoneForDisplay(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.length < 8) return rawPhone;
  if (digits.startsWith("62")) {
    const rest = digits.slice(2);
    if (rest.length <= 11) {
      const parts: string[] = [];
      parts.push(rest.slice(0, 3));
      if (rest.length > 3) parts.push(rest.slice(3, 7));
      if (rest.length > 7) parts.push(rest.slice(7));
      return `+62 ${parts.filter(Boolean).join(" ")}`;
    }
  }
  return `+${digits.match(/.{1,4}/g)?.join(" ") ?? digits}`;
}

/* ============================================================
 * List + detail queries (used by /agents/submissions pages)
 * ============================================================ */

export type ListSubmissionsOptions = {
  tab?: InboxTab;
  source?: SubmissionSource | "all";
  type?: InquiryType | "all";
  status?: SubmissionStatus | "all";
  limit?: number;
};

export async function listSubmissions(
  opts: ListSubmissionsOptions = {}
): Promise<SubmissionWithRefsFull[]> {
  const sb = getServerSupabase();
  if (!sb) return [];

  const tab = opts.tab ?? "inbox";
  let q = sb
    .from("submissions")
    .select(
      "*, client:clients(id, slug, name), project:projects(id, title, stage)"
    )
    .order("last_event_at", { ascending: false, nullsFirst: false })
    .limit(opts.limit ?? 200);

  if (tab === "inbox") {
    q = q
      .neq("status", "archived")
      .neq("status", "spam")
      .in("classification", ["business", "pending", "manual_business"]);
  } else if (tab === "personal") {
    q = q
      .neq("status", "archived")
      .in("classification", ["personal", "manual_ignored"]);
  } else if (tab === "archived") {
    q = q.eq("status", "archived");
  }

  if (opts.source && opts.source !== "all") q = q.eq("source", opts.source);
  if (opts.type && opts.type !== "all") q = q.eq("inquiry_type", opts.type);
  if (opts.status && opts.status !== "all") q = q.eq("status", opts.status);

  const { data, error } = await q;
  if (error) {
    console.warn("[db/submissions] listSubmissions:", error.message);
    return [];
  }
  return (data ?? []) as unknown as SubmissionWithRefsFull[];
}

export async function countUnreadInbox(): Promise<number> {
  const sb = getServerSupabase();
  if (!sb) return 0;
  const { count, error } = await sb
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("status", "new")
    .in("classification", ["business", "pending", "manual_business"]);
  if (error) {
    console.warn("[db/submissions] countUnreadInbox:", error.message);
    return 0;
  }
  return count ?? 0;
}

export async function getSubmissionById(
  id: string
): Promise<SubmissionWithRefsFull | null> {
  const sb = getServerSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from("submissions")
    .select(
      "*, client:clients(id, slug, name), project:projects(id, title, stage)"
    )
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.warn("[db/submissions] getSubmissionById:", error.message);
    return null;
  }
  return (data ?? null) as unknown as SubmissionWithRefsFull | null;
}

export async function listMessagesForSubmission(
  submissionId: string
): Promise<SubmissionMessageRow[]> {
  const sb = getServerSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("submission_messages")
    .select("*")
    .eq("submission_id", submissionId)
    .order("sent_at", { ascending: true });
  if (error) {
    console.warn("[db/submissions] listMessagesForSubmission:", error.message);
    return [];
  }
  return (data ?? []) as SubmissionMessageRow[];
}

export async function listFilesForSubmission(
  submissionId: string
): Promise<FileRow[]> {
  const sb = getServerSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("files")
    .select("*")
    .eq("submission_id", submissionId)
    .order("uploaded_at", { ascending: false });
  if (error) {
    console.warn("[db/submissions] listFilesForSubmission:", error.message);
    return [];
  }
  return (data ?? []) as FileRow[];
}

export async function countSubmissionsByStatus(): Promise<
  Record<SubmissionStatus, number>
> {
  const empty = Object.fromEntries(
    SUBMISSION_STATUSES.map((s) => [s, 0])
  ) as Record<SubmissionStatus, number>;
  const sb = getServerSupabase();
  if (!sb) return empty;
  const { data, error } = await sb.from("submissions").select("status");
  if (error || !data) return empty;
  const counts = { ...empty };
  for (const row of data as Pick<SubmissionRow, "status">[]) {
    if (row.status in counts) counts[row.status] += 1;
  }
  return counts;
}

/* ============================================================
 * Project-context vault: get + upsert
 * ============================================================ */

type ContextRowRaw = {
  submission_id: string;
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

export async function getSubmissionContext(
  submissionId: string
): Promise<SubmissionContextRow> {
  const sb = getServerSupabase();
  const empty: SubmissionContextRow = {
    submission_id: submissionId,
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
    .from("submission_context")
    .select("*")
    .eq("submission_id", submissionId)
    .maybeSingle();
  if (error) {
    console.warn("[db/submissions] getSubmissionContext:", error.message);
    return empty;
  }
  if (!data) return empty;

  const row = data as ContextRowRaw;
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
      console.warn("[db/submissions] vault decrypt failed:", err);
      undecryptable = true;
      credentials = [];
    }
  }

  return {
    submission_id: row.submission_id,
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

export type UpsertContextInput = {
  submissionId: string;
  brief_md?: string | null;
  links?: ChatLink[];
  social_accounts?: ChatSocialAccount[];
  deliverables?: ChatDeliverable[];
  reporting_setup?: ChatReportingItem[];
  credentials?: ChatCredential[];
  updatedBy?: string | null;
};

export async function upsertSubmissionContext(
  input: UpsertContextInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getServerSupabase();
  if (!sb) return { ok: false, error: "Supabase env not configured" };

  let secretsBlob: EncryptedBlob | null = null;
  const credsArr = input.credentials ?? null;
  const hasCreds = Array.isArray(credsArr) && credsArr.length > 0;
  if (hasCreds) {
    const vault = vaultIsConfigured();
    if (!vault.ok) {
      return { ok: false, error: `Cannot store credentials: ${vault.reason}` };
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
    submission_id: input.submissionId,
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
    .from("submission_context")
    .upsert(payload, { onConflict: "submission_id" });

  if (error) {
    console.error("[db/submissions] upsertSubmissionContext:", error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

/* ============================================================
 * WhatsApp inbound entry points
 * ============================================================ */

export type UpsertWaSubmissionInput = {
  waKind: WaKind;
  waIdentifier: string;
  pushname?: string | null;
  groupName?: string | null;
};

/**
 * Find the active (non-archived) submission for this WA contact/group,
 * or create a fresh one. Returns { submission, isFresh } — isFresh=true
 * triggers the LLM classifier on the next message.
 *
 * Refreshes wa_pushname / wa_group_name on every call. Touches
 * display_name only when display_name_source='auto'.
 */
export async function upsertWaSubmission(
  input: UpsertWaSubmissionInput
): Promise<{ submission: SubmissionFullRow; isFresh: boolean } | null> {
  const sb = getServerSupabase();
  if (!sb) return null;

  // Find an active (non-archived) submission for this WA identifier.
  const { data: existing, error: lookupErr } = await sb
    .from("submissions")
    .select("*")
    .eq("wa_kind", input.waKind)
    .eq("wa_identifier", input.waIdentifier)
    .neq("status", "archived")
    .order("received_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lookupErr) {
    console.error("[db/submissions] WA lookup failed:", lookupErr.message);
    return null;
  }

  if (existing) {
    const row = existing as SubmissionFullRow;
    const updates: Record<string, unknown> = {};

    if (input.pushname && input.pushname !== row.wa_pushname) {
      updates.wa_pushname = input.pushname;
    }
    if (input.groupName && input.groupName !== row.wa_group_name) {
      updates.wa_group_name = input.groupName;
    }
    if (row.display_name_source === "auto") {
      const autoName =
        input.waKind === "group"
          ? input.groupName ?? input.waIdentifier
          : formatPhoneForDisplay(input.waIdentifier);
      if (autoName && autoName !== row.display_name) {
        updates.display_name = autoName;
      }
    }
    if (Object.keys(updates).length > 0) {
      const { data: updated } = await sb
        .from("submissions")
        .update(updates)
        .eq("id", row.id)
        .select("*")
        .single();
      return {
        submission: (updated ?? row) as SubmissionFullRow,
        isFresh: false,
      };
    }
    return { submission: row, isFresh: false };
  }

  // Fresh insert.
  const initialName =
    input.waKind === "group"
      ? input.groupName ?? input.waIdentifier
      : formatPhoneForDisplay(input.waIdentifier);

  const { data: inserted, error: insertErr } = await sb
    .from("submissions")
    .insert({
      source: "whatsapp",
      inquiry_type: "general",
      from_name: input.pushname ?? initialName,
      from_phone:
        input.waKind === "contact" ? input.waIdentifier : null,
      subject: null, // filled by LLM subject refresh
      body_md: null, // body lives in submission_messages going forward
      interest: [],
      status: "new",
      classification: "pending",
      display_name: initialName,
      display_name_source: "auto",
      wa_pushname: input.pushname ?? null,
      wa_group_name: input.groupName ?? null,
      wa_kind: input.waKind,
      wa_identifier: input.waIdentifier,
      message_count: 0, // trigger will bump to 1 on first message
      payload_json: {},
    })
    .select("*")
    .single();

  if (insertErr || !inserted) {
    console.error(
      "[db/submissions] WA insert failed:",
      insertErr?.message
    );
    return null;
  }
  return { submission: inserted as SubmissionFullRow, isFresh: true };
}

export type InsertMessageInput = {
  submissionId: string;
  direction: MessageDirection;
  fromPhone?: string | null;
  fromPushname?: string | null;
  fromName?: string | null;
  body: string;
  payload?: Record<string, unknown>;
};

export async function insertSubmissionMessage(
  input: InsertMessageInput
): Promise<SubmissionMessageRow | null> {
  const sb = getServerSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from("submission_messages")
    .insert({
      submission_id: input.submissionId,
      direction: input.direction,
      from_phone: input.fromPhone ?? null,
      from_pushname: input.fromPushname ?? null,
      from_name: input.fromName ?? null,
      body_md: input.body,
      payload_json: input.payload ?? {},
    })
    .select("*")
    .single();
  if (error) {
    console.error(
      "[db/submissions] insertSubmissionMessage:",
      error.message
    );
    return null;
  }
  return data as SubmissionMessageRow;
}

/**
 * Recent inbound messages for a submission, oldest → newest, for the
 * subject-refresh LLM prompt context.
 */
export async function getRecentInboundBodies(
  submissionId: string,
  limit: number = 6
): Promise<string[]> {
  const sb = getServerSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("submission_messages")
    .select("body_md, sent_at, direction")
    .eq("submission_id", submissionId)
    .eq("direction", "in")
    .order("sent_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.warn(
      "[db/submissions] getRecentInboundBodies:",
      error.message
    );
    return [];
  }
  const rows = (data ?? []) as { body_md: string }[];
  return rows.map((r) => r.body_md).reverse();
}

/* ============================================================
 * Operator-facing mutations
 * ============================================================ */

export async function setSubmissionClassification(
  submissionId: string,
  classification: Classification,
  reason?: string | null,
  model?: string | null
): Promise<boolean> {
  const sb = getServerSupabase();
  if (!sb) return false;
  const patch: Record<string, unknown> = { classification };
  if (reason !== undefined) patch.classification_reason = reason;
  if (model !== undefined) patch.classification_model = model;
  const { error } = await sb
    .from("submissions")
    .update(patch)
    .eq("id", submissionId);
  if (error) {
    console.error(
      "[db/submissions] setSubmissionClassification:",
      error.message
    );
    return false;
  }
  return true;
}

export async function setSubmissionStatus(
  submissionId: string,
  status: SubmissionStatus
): Promise<boolean> {
  const sb = getServerSupabase();
  if (!sb) return false;
  const { error } = await sb
    .from("submissions")
    .update({ status })
    .eq("id", submissionId);
  if (error) {
    console.error("[db/submissions] setSubmissionStatus:", error.message);
    return false;
  }
  return true;
}

/**
 * Flip 'new' → 'read' on first detail-page open. No-op if the status
 * is already past 'new' (e.g. 'replied').
 */
export async function markSubmissionOpened(
  submissionId: string
): Promise<boolean> {
  const sb = getServerSupabase();
  if (!sb) return false;
  const { error } = await sb
    .from("submissions")
    .update({ status: "read" })
    .eq("id", submissionId)
    .eq("status", "new"); // only flip when still 'new'
  if (error) {
    console.error(
      "[db/submissions] markSubmissionOpened:",
      error.message
    );
    return false;
  }
  return true;
}

export async function archiveSubmission(
  submissionId: string,
  archived: boolean
): Promise<boolean> {
  return setSubmissionStatus(submissionId, archived ? "archived" : "read");
}

/**
 * Operator rename. Sets display_name_source='operator' which locks the
 * name from any future auto-derivation.
 * Pass an empty string to reset back to 'auto'.
 */
export async function renameSubmissionDisplayName(
  submissionId: string,
  newName: string
): Promise<boolean> {
  const sb = getServerSupabase();
  if (!sb) return false;
  const trimmed = newName.trim();
  if (trimmed.length === 0) {
    const { error } = await sb
      .from("submissions")
      .update({ display_name_source: "auto" })
      .eq("id", submissionId);
    if (error) {
      console.error(
        "[db/submissions] renameSubmissionDisplayName (reset):",
        error.message
      );
      return false;
    }
    return true;
  }
  const { error } = await sb
    .from("submissions")
    .update({
      display_name: trimmed.slice(0, 120),
      display_name_source: "operator",
    })
    .eq("id", submissionId);
  if (error) {
    console.error(
      "[db/submissions] renameSubmissionDisplayName:",
      error.message
    );
    return false;
  }
  return true;
}

/**
 * Persist an LLM-generated subject. Skips silently when the operator
 * has manually set a subject (subject_source='operator').
 */
export async function setAutoSubject(
  submissionId: string,
  subject: string
): Promise<boolean> {
  const sb = getServerSupabase();
  if (!sb) return false;
  const { error } = await sb
    .from("submissions")
    .update({
      subject: subject.slice(0, 200),
      subject_updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId)
    .eq("subject_source", "auto");
  if (error) {
    console.error("[db/submissions] setAutoSubject:", error.message);
    return false;
  }
  return true;
}

/**
 * Operator manual subject edit. Locks subject_source='operator' so
 * future LLM refreshes don't overwrite. Pass an empty string to
 * release the lock (next inbound message will re-derive via LLM).
 */
export async function setOperatorSubject(
  submissionId: string,
  subject: string
): Promise<boolean> {
  const sb = getServerSupabase();
  if (!sb) return false;
  const trimmed = subject.trim();
  if (trimmed.length === 0) {
    const { error } = await sb
      .from("submissions")
      .update({ subject_source: "auto" })
      .eq("id", submissionId);
    if (error) {
      console.error(
        "[db/submissions] setOperatorSubject (reset):",
        error.message
      );
      return false;
    }
    return true;
  }
  const { error } = await sb
    .from("submissions")
    .update({
      subject: trimmed.slice(0, 200),
      subject_source: "operator",
      subject_updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId);
  if (error) {
    console.error("[db/submissions] setOperatorSubject:", error.message);
    return false;
  }
  return true;
}

/* ============================================================
 * Re-exports of type aliases the rest of the codebase relies on.
 * ============================================================ */
export type { Priority, SubmissionRow, SubmissionWithRefs };
