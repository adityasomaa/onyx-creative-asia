-- ============================================================
-- Onyx Agents Platform — inquiry types + career-cv storage bucket
-- Run order: after 0003.
-- Safe to re-run.
-- ============================================================

-- ---------- 1. inquiry_type column on submissions ----------
-- 'general' | 'project' | 'career' | 'partnership' | 'unknown'
alter table public.submissions
  add column if not exists inquiry_type text not null default 'unknown';

create index if not exists submissions_inquiry_type_idx
  on public.submissions(inquiry_type);

-- ---------- 2. department + portfolio + cover_letter cache ----------
-- All three live in payload_json as well, but mirroring the most
-- queried fields here keeps the /agents/submissions list query simple
-- without needing jsonb lookups.
alter table public.submissions
  add column if not exists department text;
alter table public.submissions
  add column if not exists portfolio_url text;
alter table public.submissions
  add column if not exists company_name text;

-- ---------- 3. career-cvs storage bucket ----------
-- Private bucket. Only the service-role key (used from /api/leads on
-- the Next.js server) can read/write. Visitors never see the raw URL —
-- the dashboard generates a signed URL when an internal user opens the
-- submission.
insert into storage.buckets (id, name, public)
values ('career-cvs', 'career-cvs', false)
on conflict (id) do nothing;

-- ---------- 4. Storage RLS — block all anon access ----------
-- (Storage RLS is on by default; explicitly verifying no policies are
-- created here. Server inserts via service_role bypass RLS.)

-- ============================================================
-- DONE — verify with:
--   select inquiry_type, count(*) from public.submissions group by 1;
--   select id from storage.buckets where id = 'career-cvs';
-- ============================================================
