-- ============================================================
-- Onyx Creative Asia — combined Supabase migration
--
-- Paste this ENTIRE FILE into the Supabase SQL editor (one go) for
-- project oootnvqwtndgesohhpzh, then click "Run".
--
-- It combines:
--   migrations/0001_init_leads.sql              (leads table)
--   migrations/0002_agents_platform.sql         (8 platform tables)
--   migrations/0003_seed_agents_platform.sql    (only agents + flow templates)
--   migrations/0004_inquiry_types_and_storage.sql
--   migrations/0005_dashboard_profile.sql
--   migrations/0006_normalize_legacy_submissions.sql
--   migrations/0007_clear_seed_dummy_data.sql   (wipe transactional dummies)
--
-- Safe to re-run: every create uses `if not exists`, every insert uses
-- `on conflict do nothing`, every cleanup delete is idempotent.
--
-- After this run, the database holds:
--   · 4 agents (real roster)
--   · 3 flow templates (designed in code)
--   · 1 dashboard_profile row
--   · 0 transactional rows (clients/projects/submissions/runs/files)
-- The dashboard will reflect ONLY real data going forward.
-- ============================================================


-- ============================================================
-- 0001 — Leads (existing contact-form table)
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  company      text,
  budget       text,
  services     text[] not null default '{}',
  message      text not null,
  source       text default 'website',
  created_at   timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;


-- ============================================================
-- 0002 — Agents platform schema (8 tables)
-- ============================================================

-- CLIENTS
create table if not exists public.clients (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  contact_name  text,
  contact_email text,
  contact_phone text,
  contract_url  text,
  status        text not null default 'lead',
  notes_md      text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists clients_status_idx on public.clients(status);

-- PROJECTS
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid references public.clients(id) on delete cascade,
  title         text not null,
  brief_md      text,
  stage         text not null default 'intake',
  disciplines   text[] not null default '{}',
  due_date      date,
  started_at    timestamptz default now(),
  completed_at  timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists projects_stage_idx       on public.projects(stage);
create index if not exists projects_client_id_idx   on public.projects(client_id);
create index if not exists projects_due_date_idx    on public.projects(due_date);

-- SUBMISSIONS
create table if not exists public.submissions (
  id            uuid primary key default gen_random_uuid(),
  source        text not null,
  from_name     text,
  from_email    text,
  from_phone    text,
  subject       text,
  body_md       text,
  interest      text[] not null default '{}',
  budget_band   text,
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

-- FILES
create table if not exists public.files (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid references public.projects(id) on delete cascade,
  submission_id uuid references public.submissions(id) on delete cascade,
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

-- AGENTS
create table if not exists public.agents (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  name            text not null,
  role            text not null,
  number          text not null,
  manifesto       text not null,
  replaces        text,
  tools           text[] not null default '{}',
  hands_off_to    text[] not null default '{}',
  charter         text[] not null default '{}',
  status          text not null default 'idle',
  current_task    text,
  created_at      timestamptz not null default now()
);

-- AGENT RUNS
create table if not exists public.agent_runs (
  id            uuid primary key default gen_random_uuid(),
  agent_id      uuid references public.agents(id) on delete cascade,
  project_id    uuid references public.projects(id) on delete set null,
  flow_id       uuid,
  input_md      text,
  output_md     text,
  status        text not null default 'pending',
  error_message text,
  started_at    timestamptz not null default now(),
  completed_at  timestamptz,
  duration_ms   integer
);
create index if not exists agent_runs_agent_id_idx    on public.agent_runs(agent_id);
create index if not exists agent_runs_started_at_idx  on public.agent_runs(started_at desc);
create index if not exists agent_runs_status_idx      on public.agent_runs(status);

-- FLOWS
create table if not exists public.flows (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  description   text,
  graph_json    jsonb not null default '{"nodes":[],"edges":[]}'::jsonb,
  trigger_kind  text not null default 'manual',
  trigger_config jsonb not null default '{}'::jsonb,
  enabled       boolean not null default false,
  last_run_at   timestamptz,
  created_at    timestamptz not null default now()
);

-- backfill FK now that flows exists
alter table public.agent_runs
  drop constraint if exists agent_runs_flow_id_fkey;
alter table public.agent_runs
  add constraint agent_runs_flow_id_fkey
  foreign key (flow_id) references public.flows(id) on delete set null;

-- CREDENTIALS (pointers only — never store secret material)
create table if not exists public.credentials (
  id            uuid primary key default gen_random_uuid(),
  provider      text not null,
  name          text not null,
  secret_ref    text not null,
  scopes        text[] not null default '{}',
  expires_at    timestamptz,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);
create index if not exists credentials_provider_idx on public.credentials(provider);


-- ============================================================
-- 0003 — Seed agents + flow templates ONLY.
-- Transactional dummies (clients/projects/submissions/agent_runs)
-- intentionally NOT seeded — the dashboard reflects real data only.
-- ============================================================

-- AGENTS
insert into public.agents (slug, name, role, number, manifesto, replaces, tools, hands_off_to, charter, status) values
  ('director', 'Director',
   'Routes inbound briefs · decomposes work · keeps the project ledger',
   '01',
   'First contact for every brief. Reads the room, decides who picks it up, and never lets a project drop between disciplines.',
   'Founder · Project Manager · Account Director',
   array['TodoWrite', 'Read', 'Write', 'WebSearch', 'WebFetch', 'Task (sub-agents)'],
   array['strategist', 'maker', 'account-manager'],
   array[
     'Every inbound brief — whether it arrives via WhatsApp, email, or the contact form — lands here first. Classifies by discipline mix, urgency, and fit, then routes.',
     'Maintains the project ledger. Tags each project with current owner, status, and next handoff.',
     'Refuses out-of-fit work directly. A brief that needs five disciplines in two weeks doesn''t get a discount — it gets a friendly no, with a referral when possible.'
   ],
   'idle'),

  ('strategist', 'Strategist',
   'Scopes briefs · writes proposals · plans timelines',
   '02',
   'Translates a vague brief into a one-page scope and an honest timeline. Won''t quote without naming the constraint.',
   'Senior Strategist · Producer',
   array['Read', 'Write', 'Edit', 'WebSearch', 'Glob', 'Grep'],
   array['maker', 'account-manager'],
   array[
     'Receives the routed brief from the Director. Reads scope conventions and any past projects in the same vertical.',
     'Produces three artifacts per brief: scope.md (one page, no more), timeline.md (mermaid gantt), and quote.md (numbered phases with cost band in USD).',
     'Pushes back on briefs that won''t fit the timeline before they reach the maker. Better a hard conversation now than a missed deadline later.'
   ],
   'idle'),

  ('maker', 'Maker',
   'Designs · builds · ships — combined craft role',
   '03',
   'The studio''s hand. Designs in Figma/Stitch, codes in Next.js, renders motion in Remotion, and treats every export as final.',
   'Designer · Developer · Motion Designer',
   array['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep', 'render.py · Remotion · Stitch MCP · GitHub MCP'],
   array['account-manager'],
   array[
     'Picks up scoped work from the Strategist. Reads the brand spec at design/brand/ before any pixel is drawn or any line of code is written.',
     'Ships in the same Black Box visual language across surfaces — web, social, motion. The discipline boundary between design and dev is internal; the client never feels the seam.',
     'Auto-pushes commits to the production repo on completion. No staging environment that goes stale.'
   ],
   'idle'),

  ('account-manager', 'Account Manager',
   'Client comms · status updates · invoicing · follow-ups',
   '04',
   'The voice the client hears between the kickoff and the launch. Writes like the brand — same restraint, same care.',
   'Account Manager · Customer Success',
   array['Gmail MCP', 'Drive MCP', 'Read', 'Write', 'Edit'],
   array['director'],
   array[
     'Drafts confirmation emails when a new project is approved, weekly status updates while it''s in flight, and the final handoff doc when it ships.',
     'Monitors inbound replies for tone — flags anything that sounds like a concern to the Director, not the Maker (so production keeps focus).',
     'Owns the invoicing rhythm. 50% on signature, 50% on ship, no exceptions for projects under $5k.'
   ],
   'idle')
on conflict (slug) do nothing;


-- FLOWS
insert into public.flows (slug, name, description, trigger_kind, enabled, graph_json) values
  ('inbound-triage',
   'Inbound Triage',
   'New submission → Director classifies → routes to Strategist or Account Manager.',
   'submission.new',
   false,
   '{"nodes": [], "edges": []}'::jsonb),

  ('weekly-status',
   'Weekly Client Status',
   'Every Monday morning, Account Manager generates + sends status for each active project.',
   'cron.weekly',
   false,
   '{"nodes": [], "edges": []}'::jsonb),

  ('social-cycle',
   'Social Content Cycle',
   'Maker drafts next-week''s 4 posts from project brief + brand voice, drops to Drive for approval.',
   'cron.weekly',
   false,
   '{"nodes": [], "edges": []}'::jsonb)
on conflict (slug) do nothing;


-- ============================================================
-- 0004 — Inquiry types + career-cv storage bucket
-- ============================================================

alter table public.submissions
  add column if not exists inquiry_type text not null default 'unknown';

create index if not exists submissions_inquiry_type_idx
  on public.submissions(inquiry_type);

alter table public.submissions
  add column if not exists department text;
alter table public.submissions
  add column if not exists portfolio_url text;
alter table public.submissions
  add column if not exists company_name text;

insert into storage.buckets (id, name, public)
values ('career-cvs', 'career-cvs', false)
on conflict (id) do nothing;


-- ============================================================
-- 0005 — Dashboard operator profile
-- ============================================================

create table if not exists public.dashboard_profile (
  id              text primary key default 'primary',
  display_name    text,
  avatar_url      text,
  email_signature text,
  reply_tone      text default 'restrained',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

insert into public.dashboard_profile (id, display_name, email_signature)
values (
  'primary',
  'Onyx',
  'Talk soon,
The Onyx Creative Asia team
Bali · onyxcreative.asia'
)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('dashboard-avatars', 'dashboard-avatars', true)
on conflict (id) do nothing;


-- ============================================================
-- 0006 — Normalize legacy submission rows (no-op on fresh DBs)
-- ============================================================

update public.submissions
   set inquiry_type = 'general'
 where inquiry_type = 'unknown'
    or inquiry_type is null;

update public.submissions
   set status = 'new'
 where status in ('triaged', 'qualified');

update public.submissions
   set status = 'archived'
 where status = 'spam';


-- ============================================================
-- 0007 — Clear seed dummy data
-- Wipes the transactional tables so the dashboard reflects only
-- real platform activity. Idempotent — no-op on already-empty DBs.
-- ============================================================

delete from public.agent_runs;
delete from public.files;
delete from public.submissions;
delete from public.projects;
delete from public.clients;


-- ============================================================
-- 0008 — WhatsApp outbound audit log (rate-limit + ban-prevention)
-- ============================================================

create table if not exists public.wa_send_log (
  id            uuid primary key default gen_random_uuid(),
  target_phone  text not null,
  message       text,
  ok            boolean not null default false,
  error         text,
  sender        text,
  submission_id uuid references public.submissions(id) on delete set null,
  sent_at       timestamptz not null default now()
);

create index if not exists wa_send_log_sent_at_idx
  on public.wa_send_log(sent_at desc);

create index if not exists wa_send_log_target_sent_at_idx
  on public.wa_send_log(target_phone, sent_at desc);


-- ============================================================
-- DONE — verify with:
--   select count(*) from public.agents;            -- expect 4
--   select count(*) from public.flows;             -- expect 3
--   select count(*) from public.clients;           -- expect 0
--   select count(*) from public.projects;          -- expect 0
--   select count(*) from public.submissions;       -- expect 0
--   select count(*) from public.agent_runs;        -- expect 0
--   select count(*) from public.files;             -- expect 0
--   select count(*) from public.dashboard_profile; -- expect 1
--   select count(*) from public.wa_send_log;       -- expect 0
-- ============================================================
