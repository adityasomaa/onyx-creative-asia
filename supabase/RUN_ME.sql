-- ============================================================
-- Onyx Creative Asia — combined Supabase migration
--
-- Paste this ENTIRE FILE into the Supabase SQL editor (one go) for
-- project oootnvqwtndgesohhpzh, then click "Run".
--
-- It combines:
--   migrations/0001_init_leads.sql        (leads table)
--   migrations/0002_agents_platform.sql   (8 platform tables)
--   migrations/0003_seed_agents_platform.sql (4 agents + clients + projects + submissions)
--
-- Safe to re-run: every create uses `if not exists`, every insert uses
-- `on conflict do nothing`.
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
-- 0003 — Seed data
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
   'working'),

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

-- CLIENTS
insert into public.clients (slug, name, contact_email, status, notes_md) values
  ('great-bali-properties', 'Great Bali Properties',
   'agent@greatbaliproperties.com', 'active',
   'Premium villa marketplace. Phase 2 in progress — listing detail revamp.'),

  ('radcruiters', 'RADcruiters',
   'team@onlineresults.radcruiters.com', 'active',
   'Recruitment-marketing agency in NL. AI intake automation live; expansion scoping.'),

  ('the-hair-extensions-bali', 'The Hair Extensions Bali',
   'studio@thehairextensionsbali.com', 'active',
   'Premium salon in Kerobokan. Brand + site shipped, social retainer ongoing.'),

  ('northpeak-coffee', 'Northpeak Coffee',
   'hello@northpeak.example', 'lead',
   'NL-based specialty coffee. Inquired about paid media. Awaiting reply.'),

  ('atlas-realty', 'Atlas Realty',
   'sales@atlasrealty.example', 'lead',
   'Indonesian realty group. Looking at AI agent for lead qualification.')
on conflict (slug) do nothing;

-- PROJECTS
insert into public.projects (client_id, title, brief_md, stage, disciplines, due_date, started_at)
select c.id,
       'Phase 2 — listing detail revamp',
       'New listing-detail page with embedded WhatsApp routing, gallery refresh, and IDR/USD switch.',
       'in_progress',
       array['web'],
       date '2026-05-25',
       now() - interval '4 days'
from public.clients c where c.slug = 'great-bali-properties'
on conflict do nothing;

insert into public.projects (client_id, title, brief_md, stage, disciplines, due_date, started_at)
select c.id,
       'AI intake — pipeline expansion',
       'Extend Make.com pipeline with Slack notification, vacancy auto-tagging, and Airtable enrichment.',
       'scoping',
       array['ai_systems'],
       date '2026-05-22',
       now() - interval '2 days'
from public.clients c where c.slug = 'radcruiters'
on conflict do nothing;

insert into public.projects (client_id, title, brief_md, stage, disciplines, due_date, started_at)
select c.id,
       'May social cycle — 4 carousels',
       'Editorial cycle: 4 posts (process, transformations, color science, BTS).',
       'in_progress',
       array['social'],
       date '2026-05-30',
       now() - interval '7 days'
from public.clients c where c.slug = 'the-hair-extensions-bali'
on conflict do nothing;

insert into public.projects (client_id, title, brief_md, stage, disciplines, due_date)
select c.id,
       'Brand identity — logo + wordmark',
       'Full identity system. Wordmark, color, type, motion principles.',
       'done',
       array['brand'],
       date '2026-03-15'
from public.clients c where c.slug = 'the-hair-extensions-bali'
on conflict do nothing;

-- SUBMISSIONS
insert into public.submissions (source, from_name, from_email, subject, body_md, interest, budget_band, status, received_at)
values
  ('form', 'Maya Suryadi', 'maya@suryadigroup.com',
   'Web project for ecommerce launch',
   'Hi Onyx, we are launching a Bali-based ecommerce for handmade ceramics. Looking for the full web build + brand + first paid run. Budget around $5-10k. Timeline before September. Can we talk?',
   array['Web Development', 'Brand & Design', 'Paid Media'],
   '$5k–$10k',
   'new',
   now() - interval '2 hours'),

  ('email', 'David Tan', 'david@northpeak.example',
   'Paid media retainer — coffee brand',
   'Northpeak Coffee here. We''re running our own ads but want to bring in a partner for quarterly creative refresh + media buying. Standing budget about $3k/mo. References attached.',
   array['Paid Media'],
   '$3k–$5k',
   'triaged',
   now() - interval '1 day'),

  ('whatsapp', 'Pratiwi Wibowo', null,
   null,
   'Halo, saya tertarik untuk bangun website portofolio fotografi. Kira-kira budget berapa ya untuk web yang simple tapi premium? Thanks.',
   array['Web Development'],
   '$1k–$3k',
   'new',
   now() - interval '5 hours'),

  ('email', 'Atlas Realty Team', 'sales@atlasrealty.example',
   'AI agent for incoming leads',
   'We get 100+ inquiries a week. Want to qualify them automatically — schedule visits, answer FAQs, hand the warm ones to humans. Have you done this kind of thing?',
   array['AI Systems'],
   '$10k+',
   'qualified',
   now() - interval '2 days'),

  ('form', 'Anonymous', 'careers@gigantor.example',
   '(missing subject)',
   'Hello, we are a recruitment agency in Singapore looking for someone to do our social media. Please send rate card.',
   array['Social Media'],
   'Not sure yet',
   'archived',
   now() - interval '4 days'),

  ('whatsapp', 'Bayu Saputra', null,
   null,
   'Bro, lagi cari yang bisa handle ads buat warung kopi gw di Canggu. Budget kecil sih, sekitar 1 juta per bulan. Bisa?',
   array['Paid Media'],
   '< $1k',
   'replied',
   now() - interval '3 days'),

  ('form', 'Chiara Rosso', 'c.rosso@studio.example',
   'Co-production for a brand book',
   'I run a small studio in Milan. We have a client that wants a brand book printed and the design budget got blown out. Looking for a partner to absorb the design work. ~$4k.',
   array['Brand & Design'],
   '$3k–$5k',
   'triaged',
   now() - interval '6 days')
on conflict do nothing;

-- AGENT RUNS
insert into public.agent_runs (agent_id, project_id, input_md, output_md, status, started_at, completed_at, duration_ms)
select a.id, p.id,
       'New brief routed from Director.',
       'Drafted scope.md + timeline.md + quote.md. Estimated 6-week build, $6k band.',
       'success',
       now() - interval '2 hours' - interval '2 minutes',
       now() - interval '2 hours' - interval '20 seconds',
       100000
from public.agents a, public.projects p
where a.slug = 'strategist'
  and p.title like 'AI intake%'
on conflict do nothing;

insert into public.agent_runs (agent_id, project_id, input_md, output_md, status, started_at, completed_at, duration_ms)
select a.id, p.id,
       'Listing detail revamp — phase 2 build.',
       'Rendered new listing template. WhatsApp routing wired. Currency switch live in staging.',
       'success',
       now() - interval '4 hours',
       now() - interval '3 hours' - interval '15 minutes',
       2700000
from public.agents a, public.projects p
where a.slug = 'maker'
  and p.title like 'Phase 2%'
on conflict do nothing;

insert into public.agent_runs (agent_id, project_id, input_md, output_md, status, started_at, completed_at, duration_ms)
select a.id, p.id,
       'Weekly status email to client.',
       'Sent. Client confirmed Friday review session.',
       'success',
       now() - interval '1 day',
       now() - interval '1 day' + interval '40 seconds',
       40000
from public.agents a, public.projects p
where a.slug = 'account-manager'
  and p.title like 'May social%'
on conflict do nothing;

insert into public.agent_runs (agent_id, input_md, status, started_at)
select a.id, 'Triaging Maya Suryadi inbound', 'running', now() - interval '15 minutes'
from public.agents a where a.slug = 'director'
on conflict do nothing;

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
-- DONE — verify with:
--   select count(*) from public.agents;       -- expect 4
--   select count(*) from public.clients;      -- expect 5
--   select count(*) from public.projects;     -- expect 4
--   select count(*) from public.submissions;  -- expect 7
--   select count(*) from public.flows;        -- expect 3
-- ============================================================
