-- ============================================================
-- Onyx Agents Platform — normalize legacy submission rows
-- Run order: after 0005.
-- Safe to re-run.
-- ============================================================

-- Migration 0004 added inquiry_type with default 'unknown', and
-- pre-existing seed rows inherited that. Active statuses got narrowed
-- to new/replied/archived in a code-level UI change, but the DB still
-- holds legacy values (triaged, qualified, spam) on those seed rows.
-- This migration cleans that drift.

-- 1. Inquiry types: every row still tagged 'unknown' becomes 'general'.
--    Operators can re-classify per row via the dashboard's "Move to type"
--    action if a row is actually a project / career / partnership.
update public.submissions
   set inquiry_type = 'general'
 where inquiry_type = 'unknown'
    or inquiry_type is null;

-- 2. Statuses: collapse the three legacy values into the new flow.
--    - 'triaged'   → 'new'      (operator hasn't replied yet)
--    - 'qualified' → 'new'      (still actionable, just flagged)
--    - 'spam'      → 'archived' (kept off the active board)
update public.submissions
   set status = 'new'
 where status in ('triaged', 'qualified');

update public.submissions
   set status = 'archived'
 where status = 'spam';

-- ============================================================
-- DONE — verify with:
--   select inquiry_type, count(*) from public.submissions group by 1;
--   select status,       count(*) from public.submissions group by 1;
-- Both should only show the active enum values.
-- ============================================================
