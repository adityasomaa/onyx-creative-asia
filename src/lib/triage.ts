/**
 * Submission triage worker.
 *
 * Takes a freshly-inserted submission and asks the LLM to:
 *   1. Confirm / override the inquiry_type the form chose.
 *   2. Write a one-sentence summary for the list view.
 *   3. Extract structured fields: budget hint, urgency, disciplines.
 *   4. Pick a priority bucket: urgent / normal / low.
 *
 * Then, if classified as a `project` inquiry, auto-creates a row in
 * public.projects, links it back to the submission, and assigns an
 * owning agent based on the extracted disciplines.
 *
 * The whole pipeline is best-effort — failures get logged but don't
 * mutate the submission's status, so an operator can always step in
 * manually if triage misfires.
 */

import { getServerSupabase } from "@/lib/supabase";
import { generateStructured } from "@/lib/llm";
import type { InquiryType } from "@/lib/db/types";

const PRIORITY_VALUES = ["urgent", "normal", "low"] as const;
type Priority = (typeof PRIORITY_VALUES)[number];

const DISCIPLINES = [
  "web",
  "paid_media",
  "social",
  "ai_systems",
  "brand",
  "other",
] as const;
type Discipline = (typeof DISCIPLINES)[number];

const TYPES: InquiryType[] = [
  "general",
  "project",
  "career",
  "partnership",
];

/* ============================================================
 * Discipline → owning agent mapping (deterministic, no LLM needed)
 * ============================================================ */

const DISCIPLINE_TO_AGENT: Record<Discipline, string> = {
  web: "maker",
  paid_media: "maker",
  social: "maker",
  brand: "maker",
  ai_systems: "strategist",
  other: "director",
};

function pickOwnerAgent(disciplines: Discipline[]): string {
  // First non-"other" discipline wins. If only "other" or empty, director.
  for (const d of disciplines) {
    if (d !== "other") return DISCIPLINE_TO_AGENT[d];
  }
  return "director";
}

/* ============================================================
 * triageSubmission — main entry
 * ============================================================ */

export type TriageInput = {
  id: string;
  source: string;
  inquiry_type: InquiryType | string;
  from_name: string | null;
  from_email: string | null;
  subject: string | null;
  body_md: string | null;
  /** What the form pre-populated (project type, budget band, etc) */
  budget_band: string | null;
  interest: string[];
};

export type TriageOutput = {
  inquiry_type: InquiryType;
  summary: string;
  priority: Priority;
  disciplines: Discipline[];
  budget_hint: string | null;
  urgency_signals: string | null;
};

export type TriageResult =
  | { ok: true; triage: TriageOutput; model: string; projectId: string | null }
  | { ok: false; error: string };

/**
 * Run triage on a submission row. Updates the row + maybe creates a
 * project row + maybe updates an agent's current_task.
 *
 * Returns the LLM output so the caller can log it. Caller is expected
 * to invoke this fire-and-forget after the initial insert — we don't
 * block the form submit on the LLM round-trip.
 */
export async function triageSubmission(
  s: TriageInput
): Promise<TriageResult> {
  const promptBody = buildTriagePrompt(s);

  const llmRes = await generateStructured({
    prompt: promptBody,
    temperature: 0.1,
    maxOutputTokens: 500,
    schema: {
      inquiry_type: {
        kind: "string",
        enum: TYPES,
        description:
          "Pick the best inquiry type for this message. The form's pre-classification is a hint — override only if the body clearly contradicts.",
      },
      summary: {
        kind: "string",
        description:
          "One-sentence editorial summary (under 120 chars). No exclamations. Lead with what they want, not pleasantries.",
      },
      priority: {
        kind: "string",
        enum: [...PRIORITY_VALUES],
        description:
          "'urgent' = explicit deadline within 7 days OR named launch / live event. 'normal' = standard inquiry. 'low' = vague, exploratory, or out-of-fit.",
      },
      disciplines: {
        kind: "array",
        itemType: "string",
        description:
          "Which Onyx disciplines this needs. Allowed values: web, paid_media, social, ai_systems, brand, other.",
      },
      budget_hint: {
        kind: "string",
        nullable: true,
        description:
          "Extracted budget reference if explicitly mentioned (e.g. '$5k', 'IDR 50 jt'). Null if absent.",
      },
      urgency_signals: {
        kind: "string",
        nullable: true,
        description:
          "Short phrase quoting any deadline / urgency wording (e.g. 'launch Sept 15'). Null if none.",
      },
    },
  });

  if (!llmRes.ok) {
    return { ok: false, error: llmRes.error };
  }

  // Normalise the LLM output through our enum guards
  const inquiry_type = coerceEnum(
    llmRes.data.inquiry_type,
    TYPES,
    (s.inquiry_type as InquiryType) || "general"
  ) as InquiryType;
  const priority = coerceEnum(
    llmRes.data.priority,
    [...PRIORITY_VALUES] as readonly string[],
    "normal"
  ) as Priority;
  const disciplinesRaw = Array.isArray(llmRes.data.disciplines)
    ? (llmRes.data.disciplines as unknown[])
    : [];
  const disciplines = disciplinesRaw
    .map((d) =>
      coerceEnum(d, [...DISCIPLINES] as readonly string[], "other")
    )
    .filter((d, i, arr) => arr.indexOf(d) === i) as Discipline[];

  const summary = typeof llmRes.data.summary === "string"
    ? llmRes.data.summary.trim().slice(0, 280)
    : "";

  const triage: TriageOutput = {
    inquiry_type,
    summary,
    priority,
    disciplines,
    budget_hint:
      typeof llmRes.data.budget_hint === "string"
        ? llmRes.data.budget_hint.trim() || null
        : null,
    urgency_signals:
      typeof llmRes.data.urgency_signals === "string"
        ? llmRes.data.urgency_signals.trim() || null
        : null,
  };

  // Persist to submissions
  const supabase = getServerSupabase();
  if (!supabase) {
    return { ok: false, error: "DB unavailable." };
  }

  // Merge into payload_json.triage without clobbering existing keys.
  // Also pull from_phone / from_email — the dedup window below needs
  // them to find the sender's other recent submissions.
  const { data: existing } = await supabase
    .from("submissions")
    .select("payload_json, project_id, from_phone, from_email")
    .eq("id", s.id)
    .maybeSingle();
  const existingPayload =
    (existing?.payload_json as Record<string, unknown> | null) ?? {};

  const { error: updErr } = await supabase
    .from("submissions")
    .update({
      inquiry_type: triage.inquiry_type,
      priority: triage.priority,
      triage_summary: triage.summary,
      triage_model: llmRes.model,
      payload_json: {
        ...existingPayload,
        triage: {
          ...triage,
          model: llmRes.model,
          ranAt: new Date().toISOString(),
        },
      },
    })
    .eq("id", s.id);

  if (updErr) {
    console.error("[triage] update failed:", updErr);
    return { ok: false, error: updErr.message };
  }

  // ============================================================
  // Sender-window dedup (14 days).
  //
  // Before spawning a new project, look back at the sender's other
  // submissions in the last 14 days. If any of them already has a
  // project linked, link THIS submission to that same project — don't
  // create a duplicate ledger entry every time a lead follows up.
  //
  // Match logic: same from_phone OR same from_email. Cross-channel
  // dedup (e.g. emailed first, WA'd later) isn't covered yet — that
  // needs a contacts table. Window = 14 days because beyond that
  // it's reasonable to treat it as a fresh project.
  //
  // We do this BEFORE the inquiry_type=='project' check, so a
  // follow-up "general" question from someone who already has a
  // project still gets linked to that project for context — the
  // operator sees the thread coherently.
  // ============================================================
  let projectId: string | null = existing?.project_id ?? null;

  if (!projectId) {
    projectId = await findRecentProjectForSender({
      fromPhone: existing?.from_phone ?? null,
      fromEmail: existing?.from_email ?? null,
      excludeSubmissionId: s.id,
    });
    if (projectId) {
      const { error: linkErr } = await supabase
        .from("submissions")
        .update({ project_id: projectId })
        .eq("id", s.id);
      if (linkErr) {
        console.error("[triage] dedup link failed:", linkErr);
      } else {
        console.info("[triage] linked to existing project via 14d dedup", {
          submissionId: s.id,
          projectId,
        });
      }
    }
  }

  // Only spawn a NEW project if (a) still no link from dedup and (b)
  // LLM classified this as a project. Other inquiry types never create
  // projects on their own — operator can manually convert later.
  if (triage.inquiry_type === "project" && !projectId) {
    projectId = await autoCreateProject({
      submissionId: s.id,
      title: deriveProjectTitle(s, triage),
      brief: s.body_md ?? "",
      disciplines: triage.disciplines,
      budgetHint: triage.budget_hint,
      ownerAgentSlug: pickOwnerAgent(triage.disciplines),
    });
  }

  return { ok: true, triage, model: llmRes.model, projectId };
}

/* ============================================================
 * Sender-window dedup helper
 * ============================================================ */

const DEDUP_WINDOW_DAYS = 14;

/**
 * Find the most recent project_id linked to ANY submission from the
 * same sender (by phone or email) within the dedup window. Returns
 * null if nothing matches — caller falls back to autoCreateProject.
 *
 * Doesn't check project status (intake/in-progress/done) — even a
 * "done" project from 10 days ago is a better link than spawning
 * duplicate. Operator can re-route via the detail page if needed.
 */
async function findRecentProjectForSender(opts: {
  fromPhone: string | null;
  fromEmail: string | null;
  excludeSubmissionId: string;
}): Promise<string | null> {
  const supabase = getServerSupabase();
  if (!supabase) return null;

  // Need at least one identifier — anonymous submissions can't dedup.
  const orClauses: string[] = [];
  if (opts.fromPhone) orClauses.push(`from_phone.eq.${opts.fromPhone}`);
  if (opts.fromEmail) orClauses.push(`from_email.eq.${opts.fromEmail}`);
  if (orClauses.length === 0) return null;

  const cutoffIso = new Date(
    Date.now() - DEDUP_WINDOW_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data, error } = await supabase
    .from("submissions")
    .select("project_id, received_at")
    .neq("id", opts.excludeSubmissionId)
    .not("project_id", "is", null)
    .gte("received_at", cutoffIso)
    .or(orClauses.join(","))
    .order("received_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[triage] dedup lookup failed:", error);
    return null;
  }
  return (data?.project_id as string | null) ?? null;
}

/* ============================================================
 * Prompt builder
 * ============================================================ */

function buildTriagePrompt(s: TriageInput): string {
  const sourceLabel =
    s.source === "form"
      ? "Web contact form"
      : s.source === "whatsapp"
        ? "WhatsApp"
        : s.source === "email"
          ? "Email"
          : s.source;

  const lines = [
    `An inbound submission landed in the studio inbox. Triage it.`,
    ``,
    `Source: ${sourceLabel}`,
    `Form pre-classified type: ${s.inquiry_type}`,
    `From: ${s.from_name ?? "Anonymous"}${s.from_email ? ` <${s.from_email}>` : ""}`,
  ];
  if (s.budget_band) lines.push(`Form budget band: ${s.budget_band}`);
  if (s.interest.length > 0) {
    lines.push(`Form interest tags: ${s.interest.join(", ")}`);
  }
  lines.push(`Subject: ${s.subject ?? "(none)"}`);
  lines.push(``);
  lines.push(`Body:`);
  lines.push(s.body_md?.trim() || "(empty)");
  lines.push(``);
  lines.push(
    `Return strict JSON matching the schema. Don't editorialise outside the summary field.`
  );
  return lines.join("\n");
}

/* ============================================================
 * Project auto-creation
 * ============================================================ */

const DISCIPLINE_TO_PROJECT_COL: Record<Discipline, string> = {
  web: "web",
  paid_media: "paid_media",
  social: "social",
  ai_systems: "ai_systems",
  brand: "brand",
  other: "web", // fallback
};

async function autoCreateProject(opts: {
  submissionId: string;
  title: string;
  brief: string;
  disciplines: Discipline[];
  budgetHint: string | null;
  ownerAgentSlug: string;
}): Promise<string | null> {
  const supabase = getServerSupabase();
  if (!supabase) return null;

  const dbDisciplines = opts.disciplines
    .map((d) => DISCIPLINE_TO_PROJECT_COL[d])
    .filter((d, i, arr) => arr.indexOf(d) === i);

  const { data: project, error: projErr } = await supabase
    .from("projects")
    .insert({
      title: opts.title,
      brief_md: opts.brief,
      stage: "intake",
      disciplines: dbDisciplines,
    })
    .select("id")
    .single();

  if (projErr || !project) {
    console.error("[triage] auto-create project failed:", projErr);
    return null;
  }

  const projectId = project.id as string;

  // Link the submission to the new project
  await supabase
    .from("submissions")
    .update({ project_id: projectId })
    .eq("id", opts.submissionId);

  // Bump the owning agent's current_task so the roster reflects it
  await supabase
    .from("agents")
    .update({
      status: "working",
      current_task: `Scoping ${opts.title.slice(0, 80)}`,
    })
    .eq("slug", opts.ownerAgentSlug);

  // Audit trail in agent_runs
  const { data: agent } = await supabase
    .from("agents")
    .select("id")
    .eq("slug", opts.ownerAgentSlug)
    .maybeSingle();
  if (agent?.id) {
    const nowIso = new Date().toISOString();
    await supabase.from("agent_runs").insert({
      agent_id: agent.id,
      project_id: projectId,
      input_md: `Auto-assigned from submission ${opts.submissionId}.`,
      output_md: `Project created: "${opts.title}"${
        opts.budgetHint ? ` (budget hint: ${opts.budgetHint})` : ""
      }`,
      status: "success",
      started_at: nowIso,
      completed_at: nowIso,
      duration_ms: 0,
    });
  }

  return projectId;
}

/* ============================================================
 * Helpers
 * ============================================================ */

function coerceEnum(
  raw: unknown,
  allowed: readonly string[],
  fallback: string
): string {
  if (typeof raw !== "string") return fallback;
  return allowed.includes(raw) ? raw : fallback;
}

function deriveProjectTitle(
  s: TriageInput,
  triage: TriageOutput
): string {
  // Prefer the triage summary if it's short enough; else clean the
  // form subject; else fall back to "<name> — <discipline>".
  const summaryFit =
    triage.summary && triage.summary.length <= 80 ? triage.summary : null;
  if (summaryFit) return summaryFit;
  if (s.subject && s.subject.length <= 80) return s.subject;
  const disc =
    triage.disciplines[0] && triage.disciplines[0] !== "other"
      ? triage.disciplines[0]
      : "scope";
  return `${s.from_name ?? "Lead"} — ${disc}`;
}
