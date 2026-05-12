/**
 * Flows queries — read-only for Phase 1.
 *
 * The /flow page lists every registered workflow, its trigger, and whether
 * it's currently enabled. Visualisation (React Flow nodes) + runtime
 * (Claude Agent SDK loop) land in Phase 3 + 4.
 */

import { getServerSupabase } from "@/lib/supabase";
import type { FlowRow } from "./types";

export const TRIGGER_LABEL: Record<string, string> = {
  "submission.new": "When a submission arrives",
  "cron.daily": "Every day",
  "cron.weekly": "Every week",
  "cron.monthly": "Every month",
  manual: "Manual",
};

export async function listFlows(): Promise<FlowRow[]> {
  const sb = getServerSupabase();
  if (!sb) return [];

  const { data, error } = await sb
    .from("flows")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.warn("[db/flows] listFlows:", error.message);
    return [];
  }
  return (data ?? []) as FlowRow[];
}
