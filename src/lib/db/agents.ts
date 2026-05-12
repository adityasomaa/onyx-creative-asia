/**
 * Agents queries.
 *
 * Reads the live agent roster from Supabase, with a hardcoded fallback to
 * src/lib/agents.ts when the DB isn't available (preview deploys without
 * env vars, or migrations not yet run). The dashboard always renders.
 */

import { getServerSupabase } from "@/lib/supabase";
import {
  AGENTS as FALLBACK_AGENTS,
  ACTIVE_PROJECTS as FALLBACK_PROJECTS,
  ACTIVITY as FALLBACK_ACTIVITY,
  type Agent,
} from "@/lib/agents";
import type {
  AgentRow,
  AgentRunWithRefs,
  ProjectWithClient,
} from "./types";

/** Convert a DB row to the UI's Agent shape. */
function rowToAgent(r: AgentRow): Agent {
  return {
    slug: r.slug,
    name: r.name,
    role: r.role,
    number: r.number,
    manifesto: r.manifesto,
    replaces: r.replaces ?? "",
    tools: r.tools ?? [],
    handsOffTo: r.hands_off_to ?? [],
    charter: r.charter ?? [],
    status: r.status,
    currentTask: r.current_task ?? undefined,
  };
}

/** Roster — sorted by `number` ascending (01 → 04). */
export async function listAgents(): Promise<Agent[]> {
  const sb = getServerSupabase();
  if (!sb) return FALLBACK_AGENTS;

  const { data, error } = await sb
    .from("agents")
    .select("*")
    .order("number", { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.warn("[db/agents] listAgents fallback:", error.message);
    return FALLBACK_AGENTS;
  }
  return (data as AgentRow[]).map(rowToAgent);
}

/** Single agent by slug. */
export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  const sb = getServerSupabase();
  if (!sb) return FALLBACK_AGENTS.find((a) => a.slug === slug) ?? null;

  const { data, error } = await sb
    .from("agents")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    if (error) console.warn("[db/agents] getAgentBySlug fallback:", error.message);
    return FALLBACK_AGENTS.find((a) => a.slug === slug) ?? null;
  }
  return rowToAgent(data as AgentRow);
}

/* ---------- active projects (joined with client) ---------- */

export type DashboardProject = {
  id: string;
  title: string;
  client: string;
  ownerSlug: string;
  status: string;
  startedAt: string;
  nextMilestone?: string;
};

const PROJECT_STAGE_LABEL: Record<string, string> = {
  intake: "Intake",
  scoping: "Drafting scope",
  in_progress: "In progress",
  review: "Internal review",
  done: "Done",
  inactive: "Inactive",
};

const DISCIPLINE_OWNER: Record<string, string> = {
  web: "maker",
  paid_media: "maker",
  social: "maker",
  brand: "maker",
  ai_systems: "strategist",
};

export async function listActiveProjects(): Promise<DashboardProject[]> {
  const sb = getServerSupabase();
  if (!sb) return FALLBACK_PROJECTS;

  const { data, error } = await sb
    .from("projects")
    .select("id, title, stage, disciplines, started_at, due_date, client:clients(id, slug, name)")
    .in("stage", ["intake", "scoping", "in_progress", "review"])
    .order("started_at", { ascending: false });

  if (error || !data) {
    if (error) console.warn("[db/agents] listActiveProjects fallback:", error.message);
    return FALLBACK_PROJECTS;
  }

  const rows = data as unknown as ProjectWithClient[];
  return rows.map((p) => ({
    id: p.id,
    title: p.title,
    client: p.client?.name ?? "—",
    ownerSlug: DISCIPLINE_OWNER[p.disciplines?.[0] ?? "web"] ?? "maker",
    status: PROJECT_STAGE_LABEL[p.stage] ?? p.stage,
    startedAt: (p.started_at ?? "").slice(0, 10),
    nextMilestone: p.due_date ? `Due · ${p.due_date}` : undefined,
  }));
}

/* ---------- recent activity (agent_runs joined with agent + project) ---------- */

export type DashboardActivity = {
  id: string;
  at: string;
  agentSlug: string;
  description: string;
};

export async function listRecentActivity(limit = 8): Promise<DashboardActivity[]> {
  const sb = getServerSupabase();
  if (!sb) return FALLBACK_ACTIVITY;

  const { data, error } = await sb
    .from("agent_runs")
    .select(
      "id, status, output_md, input_md, started_at, agent:agents(id, slug, name, number), project:projects(id, title)"
    )
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    if (error) console.warn("[db/agents] listRecentActivity fallback:", error.message);
    return FALLBACK_ACTIVITY;
  }

  const rows = data as unknown as AgentRunWithRefs[];
  return rows.map((r) => {
    const summary =
      r.output_md ??
      r.input_md ??
      (r.status === "running" ? "Working…" : `(${r.status})`);
    const projectSuffix = r.project ? ` · ${r.project.title}` : "";
    return {
      id: r.id,
      at: r.started_at,
      agentSlug: r.agent?.slug ?? "director",
      description: `${summary}${projectSuffix}`,
    };
  });
}
