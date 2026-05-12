/**
 * Submissions queries — inbound briefs from form, email, WhatsApp, manual.
 *
 * The list view at /agents/submissions shows the most recent first.
 * Detail at /agents/submissions/[id] reads the full body + attached files.
 */

import { getServerSupabase } from "@/lib/supabase";
import type {
  FileRow,
  SubmissionRow,
  SubmissionStatus,
  SubmissionWithRefs,
} from "./types";

export const SUBMISSION_STATUSES: SubmissionStatus[] = [
  "new",
  "triaged",
  "qualified",
  "replied",
  "archived",
  "spam",
];

export const SUBMISSION_STATUS_LABEL: Record<SubmissionStatus, string> = {
  new: "New",
  triaged: "Triaged",
  qualified: "Qualified",
  replied: "Replied",
  archived: "Archived",
  spam: "Spam",
};

export const SUBMISSION_SOURCE_LABEL = {
  form: "Web form",
  email: "Email",
  whatsapp: "WhatsApp",
  manual: "Manual",
} as const;

export type ListSubmissionsOptions = {
  status?: SubmissionStatus | "all";
  type?: import("./types").InquiryType | "all";
  limit?: number;
};

export async function listSubmissions(
  opts: ListSubmissionsOptions = {}
): Promise<SubmissionWithRefs[]> {
  const sb = getServerSupabase();
  if (!sb) return [];

  let q = sb
    .from("submissions")
    .select(
      "*, client:clients(id, slug, name), project:projects(id, title, stage)"
    )
    .order("received_at", { ascending: false })
    .limit(opts.limit ?? 100);

  if (opts.status && opts.status !== "all") {
    q = q.eq("status", opts.status);
  }
  if (opts.type && opts.type !== "all") {
    q = q.eq("inquiry_type", opts.type);
  }

  const { data, error } = await q;
  if (error) {
    console.warn("[db/submissions] listSubmissions:", error.message);
    return [];
  }
  return (data ?? []) as unknown as SubmissionWithRefs[];
}

export const INQUIRY_TYPE_LABEL: Record<
  import("./types").InquiryType,
  string
> = {
  general: "Question",
  project: "Project",
  career: "Career",
  partnership: "Partnership",
  unknown: "Unknown",
};

export const INQUIRY_TYPES: import("./types").InquiryType[] = [
  "general",
  "project",
  "career",
  "partnership",
  "unknown",
];

export async function getSubmissionById(
  id: string
): Promise<SubmissionWithRefs | null> {
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
  return (data ?? null) as unknown as SubmissionWithRefs | null;
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

/** Counts grouped by status — for the dashboard cards. */
export async function countSubmissionsByStatus(): Promise<
  Record<SubmissionStatus, number>
> {
  const empty = Object.fromEntries(
    SUBMISSION_STATUSES.map((s) => [s, 0])
  ) as Record<SubmissionStatus, number>;

  const sb = getServerSupabase();
  if (!sb) return empty;

  const { data, error } = await sb.from("submissions").select("status");
  if (error || !data) {
    if (error) console.warn("[db/submissions] countByStatus:", error.message);
    return empty;
  }

  const counts = { ...empty };
  for (const row of data as Pick<SubmissionRow, "status">[]) {
    if (row.status in counts) counts[row.status] += 1;
  }
  return counts;
}
