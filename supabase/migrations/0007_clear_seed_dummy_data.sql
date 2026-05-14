-- ============================================================
-- Onyx Agents Platform — clear seed dummy data
-- Run order: after 0006.
-- Safe to re-run (deletes are idempotent on an already-empty table).
-- ============================================================

-- Migration 0003 seeded:
--   · 5 clients (3 real + 2 leads) for visualization
--   · 4 projects tied to those clients
--   · 7 mocked submissions
--   · 4 mocked agent_runs
-- All of it was for dashboard previews. The operator wants the
-- /agents internal site to reflect ONLY real data going forward, so
-- they can see what the platform has actually processed vs. what's
-- still empty waiting for real channels.
--
-- This migration wipes the transactional tables and lets real
-- submissions / projects / runs accrue from the next contact-form
-- submission onward.
--
-- KEPT untouched:
--   · public.agents          (4-agent roster — the studio's design)
--   · public.flows           (3 flow templates — designed in code)
--   · public.dashboard_profile (the operator's personalisation)
--   · public.credentials     (no seeds, but kept for runtime use)
--
-- Order matters because of FK constraints — children first.
-- ============================================================

-- 1. agent_runs has FKs to projects (set null) and agents (cascade).
delete from public.agent_runs;

-- 2. files reference both projects and submissions — cascade on delete.
delete from public.files;

-- 3. submissions reference clients + projects (both set null on delete).
delete from public.submissions;

-- 4. projects reference clients (cascade on delete from clients).
delete from public.projects;

-- 5. clients are top-level — safe to delete last.
delete from public.clients;

-- ============================================================
-- DONE — every transactional table is now empty.
-- Verify with:
--   select count(*) from public.clients;       -- expect 0
--   select count(*) from public.projects;      -- expect 0
--   select count(*) from public.submissions;   -- expect 0
--   select count(*) from public.agent_runs;    -- expect 0
--   select count(*) from public.files;         -- expect 0
--   select count(*) from public.agents;        -- expect 4 (kept)
--   select count(*) from public.flows;         -- expect 3 (kept)
-- ============================================================
