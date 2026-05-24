"use server";

/**
 * Server actions for /agents/submissions (unified inbox).
 *
 * - markSubmissionOpenedAction       — flip 'new' → 'read' on detail open
 * - setSubmissionStatusAction        — manual status changes (read / replied / archived / new)
 * - setSubmissionClassificationAction — Bring back / Ignore future / Reset
 * - renameSubmissionAction           — operator display name (sticky)
 * - setOperatorSubjectAction         — manual subject override (sticky)
 * - releaseSubjectLockAction         — clear subject_source='operator' lock
 * - upsertContextAction              — save brief / links / socials / deliverables / reporting / credentials
 * - sendReplyAction                  — outbound WA reply (when wa_kind='contact')
 *
 * All require an authenticated dashboard session. Server actions are
 * gated by the /agents layout's middleware, but we double-check session
 * at the top of each so they're safe even if called directly.
 */

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/agents-auth";
import { sendWhatsApp } from "@/lib/fonnte";
import { canSendWhatsApp, logWhatsAppSend } from "@/lib/wa-safety";
import { getServerSupabase } from "@/lib/supabase";
import {
  archiveSubmission,
  insertSubmissionMessage,
  markSubmissionOpened,
  renameSubmissionDisplayName,
  setOperatorSubject,
  setSubmissionClassification,
  setSubmissionStatus,
  upsertSubmissionContext,
  type ChatCredential,
  type ChatDeliverable,
  type ChatLink,
  type ChatReportingItem,
  type ChatSocialAccount,
  type Classification,
} from "@/lib/db/submissions";
import type { SubmissionStatus } from "@/lib/db/types";

async function requireAuthedOperator(): Promise<
  { ok: true; operator: string } | { ok: false; error: string }
> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (!session) return { ok: false, error: "Not authenticated" };
  return { ok: true, operator: session.username };
}

function revalidateBoth(id: string) {
  revalidatePath("/agents/submissions");
  revalidatePath(`/agents/submissions/${id}`);
}

/* ============================================================
 * Status (open / replied / archived / re-open)
 * ============================================================ */

export async function markSubmissionOpenedAction(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAuthedOperator();
  if (!auth.ok) return { ok: false, error: auth.error };
  const ok = await markSubmissionOpened(id);
  if (ok) revalidateBoth(id);
  return { ok };
}

export async function setSubmissionStatusAction(
  id: string,
  status: SubmissionStatus
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAuthedOperator();
  if (!auth.ok) return { ok: false, error: auth.error };
  const ok = await setSubmissionStatus(id, status);
  if (ok) revalidateBoth(id);
  return { ok };
}

export async function archiveSubmissionAction(
  id: string,
  archived: boolean
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAuthedOperator();
  if (!auth.ok) return { ok: false, error: auth.error };
  const ok = await archiveSubmission(id, archived);
  if (ok) revalidateBoth(id);
  return { ok };
}

/* ============================================================
 * Classification (Bring back / Ignore future)
 * ============================================================ */

export async function setSubmissionClassificationAction(
  id: string,
  classification: Classification
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAuthedOperator();
  if (!auth.ok) return { ok: false, error: auth.error };
  const ok = await setSubmissionClassification(
    id,
    classification,
    `manual override by ${auth.operator}`,
    null
  );
  if (ok) revalidateBoth(id);
  return { ok };
}

/* ============================================================
 * Display name (operator rename, sticky against LLM)
 * ============================================================ */

export async function renameSubmissionAction(
  id: string,
  newName: string
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAuthedOperator();
  if (!auth.ok) return { ok: false, error: auth.error };
  const ok = await renameSubmissionDisplayName(id, newName);
  if (ok) revalidateBoth(id);
  return { ok };
}

/* ============================================================
 * Subject (operator override, sticky against LLM)
 * ============================================================ */

export async function setOperatorSubjectAction(
  id: string,
  subject: string
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAuthedOperator();
  if (!auth.ok) return { ok: false, error: auth.error };
  const ok = await setOperatorSubject(id, subject);
  if (ok) revalidateBoth(id);
  return { ok };
}

/* ============================================================
 * Project context vault (encrypted credentials)
 * ============================================================ */

export type ContextFormPayload = {
  brief_md: string;
  links: ChatLink[];
  social_accounts: ChatSocialAccount[];
  deliverables: ChatDeliverable[];
  reporting_setup: ChatReportingItem[];
  credentials: ChatCredential[];
};

export async function upsertContextAction(
  id: string,
  payload: ContextFormPayload
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAuthedOperator();
  if (!auth.ok) return { ok: false, error: auth.error };
  const res = await upsertSubmissionContext({
    submissionId: id,
    brief_md: payload.brief_md || null,
    links: payload.links,
    social_accounts: payload.social_accounts,
    deliverables: payload.deliverables,
    reporting_setup: payload.reporting_setup,
    credentials: payload.credentials,
    updatedBy: auth.operator,
  });
  if (res.ok) revalidatePath(`/agents/submissions/${id}`);
  return res.ok ? { ok: true } : { ok: false, error: res.error };
}

/* ============================================================
 * Send reply (outbound WA — only for wa_kind='contact')
 * ============================================================ */

export async function sendWaReplyAction(
  id: string,
  rawMessage: string
): Promise<{ ok: boolean; error?: string }> {
  const auth = await requireAuthedOperator();
  if (!auth.ok) return { ok: false, error: auth.error };

  const message = rawMessage.trim();
  if (!message) return { ok: false, error: "Empty message" };
  if (message.length > 4000)
    return { ok: false, error: "Message exceeds 4000 chars" };

  const sb = getServerSupabase();
  if (!sb) return { ok: false, error: "Supabase not configured" };

  const { data: submission, error: lookupErr } = await sb
    .from("submissions")
    .select("id, source, wa_kind, wa_identifier, from_phone")
    .eq("id", id)
    .maybeSingle();
  if (lookupErr || !submission) {
    return { ok: false, error: lookupErr?.message ?? "Submission not found" };
  }
  if (submission.source !== "whatsapp") {
    return {
      ok: false,
      error: "WhatsApp reply is only available for source=whatsapp.",
    };
  }
  if (submission.wa_kind === "group") {
    return {
      ok: false,
      error: "Group replies aren't supported — respond in WhatsApp directly.",
    };
  }
  const target =
    (submission.wa_identifier as string | null) ??
    (submission.from_phone as string | null);
  if (!target) return { ok: false, error: "No target phone on submission" };

  // Safety gate
  const allow = await canSendWhatsApp(target);
  if (!allow.ok) {
    await logWhatsAppSend({
      target,
      message,
      ok: false,
      error: `BLOCKED reply: ${allow.code} — ${allow.reason}`,
      submissionId: id,
      sender: auth.operator,
    });
    return { ok: false, error: allow.reason };
  }

  const res = await sendWhatsApp({ target, message });
  if (res.ok) {
    await insertSubmissionMessage({
      submissionId: id,
      direction: "out",
      fromPhone: target,
      fromPushname: auth.operator,
      fromName: auth.operator,
      body: message,
      payload: { fonnte_result: res, sent_by: auth.operator },
    });
  }
  await logWhatsAppSend({
    target,
    message,
    ok: res.ok,
    error: res.ok ? undefined : res.error,
    sender: auth.operator,
    submissionId: id,
  });

  if (res.ok) {
    revalidateBoth(id);
    return { ok: true };
  }
  return { ok: false, error: res.error };
}
