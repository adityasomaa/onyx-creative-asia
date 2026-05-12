/**
 * Shared DB row types for the Onyx Agents platform.
 *
 * Mirrors the schema in supabase/migrations/0002_agents_platform.sql.
 * Keep these in sync when you alter a column — TypeScript won't catch a
 * mismatch (Supabase responses are untyped without generated bindings).
 */

export type ClientStatus = "lead" | "active" | "paused" | "closed";

export type ClientRow = {
  id: string;
  slug: string;
  name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contract_url: string | null;
  status: ClientStatus;
  notes_md: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectStage =
  | "intake"
  | "scoping"
  | "in_progress"
  | "review"
  | "done"
  | "inactive";

export type ProjectRow = {
  id: string;
  client_id: string | null;
  title: string;
  brief_md: string | null;
  stage: ProjectStage;
  disciplines: string[];
  due_date: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
};

export type SubmissionSource = "form" | "email" | "whatsapp" | "manual";

export type SubmissionStatus =
  | "new"
  | "triaged"
  | "qualified"
  | "replied"
  | "archived"
  | "spam";

export type SubmissionRow = {
  id: string;
  source: SubmissionSource;
  from_name: string | null;
  from_email: string | null;
  from_phone: string | null;
  subject: string | null;
  body_md: string | null;
  interest: string[];
  budget_band: string | null;
  status: SubmissionStatus;
  client_id: string | null;
  project_id: string | null;
  due_date: string | null;
  payload_json: Record<string, unknown>;
  received_at: string;
  triaged_at: string | null;
  triaged_by: string | null;
};

export type FileKind = "asset" | "deliverable" | "attachment" | "contract";

export type FileRow = {
  id: string;
  project_id: string | null;
  submission_id: string | null;
  kind: FileKind;
  name: string;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  uploaded_by: string | null;
  uploaded_at: string;
};

export type AgentStatus = "idle" | "working" | "blocked";

export type AgentRow = {
  id: string;
  slug: string;
  name: string;
  role: string;
  number: string;
  manifesto: string;
  replaces: string | null;
  tools: string[];
  hands_off_to: string[];
  charter: string[];
  status: AgentStatus;
  current_task: string | null;
  created_at: string;
};

export type AgentRunStatus =
  | "pending"
  | "running"
  | "success"
  | "error"
  | "cancelled";

export type AgentRunRow = {
  id: string;
  agent_id: string | null;
  project_id: string | null;
  flow_id: string | null;
  input_md: string | null;
  output_md: string | null;
  status: AgentRunStatus;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
  duration_ms: number | null;
};

export type FlowRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  graph_json: { nodes: unknown[]; edges: unknown[] };
  trigger_kind: string;
  trigger_config: Record<string, unknown>;
  enabled: boolean;
  last_run_at: string | null;
  created_at: string;
};

/* ---- joined / view-shaped types used by the UI ---- */

export type SubmissionWithRefs = SubmissionRow & {
  client: Pick<ClientRow, "id" | "slug" | "name"> | null;
  project: Pick<ProjectRow, "id" | "title" | "stage"> | null;
};

export type ProjectWithClient = ProjectRow & {
  client: Pick<ClientRow, "id" | "slug" | "name"> | null;
};

export type AgentRunWithRefs = AgentRunRow & {
  agent: Pick<AgentRow, "id" | "slug" | "name" | "number"> | null;
  project: Pick<ProjectRow, "id" | "title"> | null;
};
