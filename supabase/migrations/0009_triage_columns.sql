-- ============================================================
-- Onyx Agents Platform — LLM triage columns on submissions
-- Run order: after 0008.
-- Safe to re-run.
-- ============================================================

-- The auto-triage worker (src/lib/triage.ts) runs after every inbound
-- submission, classifies it, summarises it, extracts a priority, and
-- optionally auto-creates a project. The output is split between:
--   · Three queryable columns on submissions (so the dashboard can
--     filter / sort cheaply): priority, triage_summary, triage_model
--   · Full structured output in payload_json.triage (for audit + future
--     re-classification without re-querying the LLM)

alter table public.submissions
  add column if not exists priority text;
-- Allowed values: 'urgent' | 'normal' | 'low' (no CHECK constraint so
-- the LLM can return something off-list and we surface it as-is).

alter table public.submissions
  add column if not exists triage_summary text;
-- One-sentence summary written by the LLM, used in list views.

alter table public.submissions
  add column if not exists triage_model text;
-- Which LLM produced the triage, e.g. 'gemini-2.5-flash'. Useful for
-- knowing when to re-triage if we upgrade models.

create index if not exists submissions_priority_idx
  on public.submissions(priority);

-- ============================================================
-- DONE — verify with:
--   \d public.submissions
--   select column_name from information_schema.columns
--    where table_name = 'submissions'
--      and column_name in ('priority','triage_summary','triage_model');
-- ============================================================
