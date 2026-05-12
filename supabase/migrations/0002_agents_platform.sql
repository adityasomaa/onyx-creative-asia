-- ============================================================
-- Onyx Agents Platform — initial schema
-- Run order: after 0001_leads_table.sql.
-- Safe to re-run: every `create table` is wrapped `if not exists`.
-- ============================================================

-- ---------- CLIENTS ----------
create table if not exists public.clients (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  contact_name  text,
  contact_email text,
  contact_phone text,
  contract_url  text,
  -- 'lead' | 'active' | 'paused' | 'closed'
  status        text not null default 'lead',
  notes_md      text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists clients_status_idx on public.clients(status);

-- ---------- PROJECTS ----------
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid references public.clients(id) on delete cascade,
  title         text not null,
  brief_md      text,
  -- 'intake' | 'scoping' | 'in_progress' | 'review' | 'done' | 'inactive'
  stage         text not null default 'intake',
  -- 'web' | 'paid_media' | 'social' | 'ai_systems' | 'brand' (csv-ish)
  disciplines   text[] not null default '{}',
  due_date      date,
  started_at    timestamptz default now(),
  completed_at  timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists projects_stage_idx       on public.projects(stage);
create index if not exists projects_client_id_idx   on public.projects(client_id);
create index if not exists projects_due_date_idx    on public.projects(due_date);

-- ---------- SUBMISSIONS (inbound) ----------
create table if not exists public.submissions (
  id            uuid primary key default gen_random_uuid(),
  -- 'form' | 'email' | 'whatsapp' | 'manual'
  source        text not null,
  from_name     text,
  from_email    text,
  from_phone    text,
  subject       text,
  body_md       text,
  -- denormalised tags from the source
  interest      text[] not null default '{}',
  budget_band   text,
  -- 'new' | 'triaged' | 'qualified' | 'replied' | 'archived' | 'spam'
  status        text not null default 'new',
  client_id     uuid references public.clients(id) on delete set null,
  project_id    uuid references public.projects(id) on delete set null,
  due_date      date,
  payload_json  jsonb not null default '{}'::jsonb,
  received_at   timestamptz not null default now(),
  triaged_at    timestamptz,
  triaged_by    text
);
create index if not exists submissions_status_idx       on public.submissions(status);
create index if not exists submissions_received_at_idx  on public.submissions(received_at desc);
create index if not exists submissions_source_idx       on public.submissions(source);

-- ---------- FILES ----------
create table if not exists public.files (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid references public.projects(id) on delete cascade,
  submission_id uuid references public.submissions(id) on delete cascade,
  -- 'asset' | 'deliverable' | 'attachment' | 'contract'
  kind          text not null,
  name          text not null,
  storage_path  text not null,
  mime_type     text,
  size_bytes    bigint,
  uploaded_by   text,
  uploaded_at   timestamptz not null default now()
);
create index if not exists files_project_id_idx    on public.files(project_id);
create index if not exists files_submission_id_idx on public.files(submission_id);

-- ---------- AGENTS ----------
create table if not exists public.agents (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name            text not null,
  role            text not null,
  -- display badge: '01', '02', ...
  number          text not null,
  manifesto       text not null,
  replaces        text,
  tools           text[] not null default '{}',
  hands_off_to    text[] not null default '{}',
  charter         text[] not null default '{}',
  -- 'idle' | 'working' | 'blocked'
  status          text not null default 'idle',
  current_task    text,
  created_at      timestamptz not null default now()
);

-- ---------- AGENT RUNS ----------
create table if not exists public.agent_runs (
  id            uuid primary key default gen_random_uuid(),
  agent_id      uuid references public.agents(id) on delete cascade,
  project_id    uuid references public.projects(id) on delete set null,
  flow_id       uuid, -- references flows(id), set in 0003 to avoid forward-ref
  input_md      text,
  output_md     text,
  -- 'pending' | 'running' | 'success' | 'error' | 'cancelled'
  status        text not null default 'pending',
  error_message text,
  started_at    timestamptz not null default now(),
  completed_at  timestamptz,
  duration_ms   integer
);
create index if not exists agent_runs_agent_id_idx    on public.agent_runs(agent_id);
create index if not exists agent_runs_started_at_idx  on public.agent_runs(started_at desc);
create index if not exists agent_runs_status_idx      on public.agent_runs(status);

-- ---------- FLOWS ----------
create table if not exists public.flows (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  description   text,
  -- React Flow graph: { nodes: [...], edges: [...] }
  graph_json    jsonb not null default '{"nodes":[],"edges":[]}'::jsonb,
  -- which trigger fires this flow: 'submission.new', 'cron.daily', 'manual', ...
  trigger_kind  text not null default 'manual',
  trigger_config jsonb not null default '{}'::jsonb,
  enabled       boolean not null default false,
  last_run_at   timestamptz,
  created_at    timestamptz not null default now()
);

-- backfill the FK on agent_runs.flow_id now that flows exists
alter table public.agent_runs
  drop constraint if exists agent_runs_flow_id_fkey;
alter table public.agent_runs
  add constraint agent_runs_flow_id_fkey
  foreign key (flow_id) references public.flows(id) on delete set null;

-- ---------- CREDENTIALS ----------
-- Stores POINTERS to secrets. Actual secret values live in Supabase Vault
-- (preferred) or in Vercel env vars. We never put secret material in
-- this table.
create table if not exists public.credentials (
  id            uuid primary key default gen_random_uuid(),
  -- 'gmail' | 'whatsapp' | 'trello' | 'make' | 'slack' | 'airtable' | ...
  provider      text not null,
  name          text not null,
  -- pointer: 'env:GMAIL_REFRESH_TOKEN' or 'vault:onyx-gmail-prod' etc.
  secret_ref    text not null,
  scopes        text[] not null default '{}',
  expires_at    timestamptz,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);
create index if not exists credentials_provider_idx on public.credentials(provider);

-- ============================================================
-- RLS: disabled for Phase 1 (service-role reads from server only).
-- Will be enabled per-table in 0003 when client portals land.
-- ============================================================
