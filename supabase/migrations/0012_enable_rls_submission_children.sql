-- 0012_enable_rls_submission_children.sql
--
-- Fix the two CRITICAL "RLS Disabled in Public" findings from the
-- Supabase security advisor:
--   - public.submission_messages  (client conversation threads)
--   - public.submission_context   (project vault: brief, links, and the
--                                   AES-256-GCM encrypted credentials)
--
-- Migration 0011 created both tables but forgot to enable row level
-- security, so they were reachable with the PUBLIC anon key. Both are
-- accessed ONLY through the service-role client (getServerSupabase,
-- which bypasses RLS), so enabling RLS with NO policy is safe:
--   - server access (service_role) keeps working
--   - anon / authenticated get denied (no policy = deny all)
--
-- This matches the service-role-only pattern already used by
-- public.leads. Especially important now the project is shared by
-- multiple apps under one anon key.

alter table public.submission_messages enable row level security;
alter table public.submission_context  enable row level security;
