/**
 * Projects queries — feeds the dashboard cards and active-work list.
 */

import { getServerSupabase } from "@/lib/supabase";
import type {
  ProjectRow,
  ProjectStage,
  ProjectWithClient,
} from "./types";

export const PROJECT_STAGES: ProjectStage[] = [
  "intake",
  "scoping",
  "in_progress",
  "review",
  "done",
  "inactive",
];

export const PROJECT_STAGE_LABEL: Record<ProjectStage, string> = {
  intake: "Intake",
  scoping: "Scoping",
  in_progress: "In progress",
  review: "Review",
  done: "Done",
  inactive: "Inactive",
};

/** Dashboard groupings used in the top-of-page cards. */
export type ProjectBuckets = {
  incoming: number;
  inProgress: number;
  done: number;
  inactive: number;
};

export async function countProjectsByBucket(): Promise<ProjectBuckets> {
  const empty: ProjectBuckets = {
    incoming: 0,
    inProgress: 0,
    done: 0,
    inactive: 0,
  };
  const sb = getServerSupabase();
  if (!sb) return empty;

  const { data, error } = await sb.from("projects").select("stage");
  if (error || !data) {
    if (error) console.warn("[db/projects] countByBucket:", error.message);
    return empty;
  }

  const out = { ...empty };
  for (const row of data as Pick<ProjectRow, "stage">[]) {
    switch (row.stage) {
      case "intake":
      case "scoping":
        out.incoming += 1;
        break;
      case "in_progress":
      case "review":
        out.inProgress += 1;
        break;
      case "done":
        out.done += 1;
        break;
      case "inactive":
        out.inactive += 1;
        break;
    }
  }
  return out;
}

/** Raw count per stage — for charting. */
export async function countProjectsByStage(): Promise<
  Record<ProjectStage, number>
> {
  const empty = Object.fromEntries(
    PROJECT_STAGES.map((s) => [s, 0])
  ) as Record<ProjectStage, number>;

  const sb = getServerSupabase();
  if (!sb) return empty;

  const { data, error } = await sb.from("projects").select("stage");
  if (error || !data) {
    if (error) console.warn("[db/projects] countByStage:", error.message);
    return empty;
  }

  const counts = { ...empty };
  for (const row of data as Pick<ProjectRow, "stage">[]) {
    if (row.stage in counts) counts[row.stage] += 1;
  }
  return counts;
}

export async function listProjectsWithClient(): Promise<ProjectWithClient[]> {
  const sb = getServerSupabase();
  if (!sb) return [];

  const { data, error } = await sb
    .from("projects")
    .select("*, client:clients(id, slug, name)")
    .order("started_at", { ascending: false });

  if (error) {
    console.warn("[db/projects] listWithClient:", error.message);
    return [];
  }
  return (data ?? []) as unknown as ProjectWithClient[];
}
