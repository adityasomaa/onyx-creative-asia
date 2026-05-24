-- ============================================================
-- 0011_unify_submissions.sql — collapse Chats into Submissions.
--
-- After 0010 we had two parallel inboxes: `submissions` (form / email /
-- manual) and `wa_chats` (WhatsApp). This migration unifies them into a
-- single `submissions` model so every inbound landing across all
-- channels shares one inbox, one detail view, and one project-context
-- vault.
--
-- Changes:
--   1. Extend `submissions`:
--        - classification (+ reason/model) — Gemini auto-tag
--        - subject_source (+ subject_updated_at) — LLM-vs-operator lock
--        - display_name (+ source) — operator can rename, lock against auto
--        - wa_pushname / wa_group_name / wa_kind / wa_identifier — WA-only
--        - last_event_at / last_message_preview / last_message_from_name
--          / last_message_direction / message_count — denorm of newest msg
--        - status extended: now allows 'read' in the check constraint
--
--   2. Create `submission_messages` (1:N) — append-only thread log.
--      Form submissions get exactly one row backfilled from body_md.
--      WhatsApp gets one per inbound/outbound event.
--
--   3. Create `submission_context` (1:1) — project vault: brief, links,
--      social accounts, deliverables, reporting, and AES-256-GCM-encrypted
--      credentials blob.
--
--   4. Drop the WA-specific tables: wa_chats, wa_messages, wa_chat_context.
--      The test data from the migration 0010 smoke test goes with them
--      (operator explicitly chose "wipe + start fresh").
--
--   5. Triggers:
--        - submission_messages insert → bump submissions' last_*, message_count,
--          and status (in → 'new' if previously closed; out → 'replied' if open)
--        - submission_context UPDATE → refresh updated_at
-- ============================================================

-- ---------- 1. Extend `submissions` ----------
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS classification text NOT NULL DEFAULT 'business'
    CHECK (classification IN (
      'pending', 'business', 'personal', 'manual_business', 'manual_ignored'
    )),
  ADD COLUMN IF NOT EXISTS classification_reason text,
  ADD COLUMN IF NOT EXISTS classification_model text,

  ADD COLUMN IF NOT EXISTS subject_source text NOT NULL DEFAULT 'auto'
    CHECK (subject_source IN ('auto', 'operator')),
  ADD COLUMN IF NOT EXISTS subject_updated_at timestamptz,

  ADD COLUMN IF NOT EXISTS display_name text,
  ADD COLUMN IF NOT EXISTS display_name_source text NOT NULL DEFAULT 'auto'
    CHECK (display_name_source IN ('auto', 'operator')),

  -- WhatsApp-specific fields. Nullable for non-WA sources.
  ADD COLUMN IF NOT EXISTS wa_pushname text,
  ADD COLUMN IF NOT EXISTS wa_group_name text,
  ADD COLUMN IF NOT EXISTS wa_kind text
    CHECK (wa_kind IS NULL OR wa_kind IN ('contact', 'group')),
  ADD COLUMN IF NOT EXISTS wa_identifier text,

  -- Denormalised newest-event data (populated by trigger on message
  -- insert).
  ADD COLUMN IF NOT EXISTS last_event_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_message_preview text,
  ADD COLUMN IF NOT EXISTS last_message_from_name text,
  ADD COLUMN IF NOT EXISTS last_message_direction text
    CHECK (last_message_direction IS NULL
        OR last_message_direction IN ('in', 'out')),
  ADD COLUMN IF NOT EXISTS message_count int NOT NULL DEFAULT 1;

-- Extend status check to allow 'read' (the new chats-style "opened" state).
ALTER TABLE public.submissions
  DROP CONSTRAINT IF EXISTS submissions_status_check;
ALTER TABLE public.submissions
  ADD CONSTRAINT submissions_status_check
  CHECK (status IN (
    'new', 'read', 'replied', 'archived',
    -- Legacy values kept so old rows don't violate the constraint.
    'triaged', 'qualified', 'spam'
  ));

-- Partial unique index: at most ONE non-archived submission per
-- (wa_kind, wa_identifier). New inbound from the same contact appends
-- to the existing active submission. Archive a submission to start a
-- new thread on the next inbound.
CREATE UNIQUE INDEX IF NOT EXISTS submissions_wa_active_unique_idx
  ON public.submissions (wa_kind, wa_identifier)
  WHERE wa_kind IS NOT NULL AND status <> 'archived';

CREATE INDEX IF NOT EXISTS submissions_classification_idx
  ON public.submissions (classification);
CREATE INDEX IF NOT EXISTS submissions_last_event_at_idx
  ON public.submissions (last_event_at DESC NULLS LAST);

-- ---------- 2. submission_messages ----------
CREATE TABLE IF NOT EXISTS public.submission_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  submission_id uuid NOT NULL
    REFERENCES public.submissions(id) ON DELETE CASCADE,

  -- 'in'  = received from the external channel (form / WA inbound / email)
  -- 'out' = sent by the operator via the dashboard
  direction text NOT NULL CHECK (direction IN ('in', 'out')),

  -- Sender identity. All nullable so form / email events fit too.
  from_phone text,
  from_pushname text,
  from_name text,

  body_md text NOT NULL,

  -- Full upstream payload (Fonnte body / form fields / send result).
  payload_json jsonb NOT NULL DEFAULT '{}'::jsonb,

  sent_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.submission_messages IS
  'Append-only thread log for a submission. Form submissions have 1 row; WhatsApp threads have many.';

CREATE INDEX IF NOT EXISTS submission_messages_submission_id_sent_at_idx
  ON public.submission_messages (submission_id, sent_at);
CREATE INDEX IF NOT EXISTS submission_messages_direction_idx
  ON public.submission_messages (direction);

-- ---------- 3. submission_context (project vault, 1:1) ----------
CREATE TABLE IF NOT EXISTS public.submission_context (
  submission_id uuid PRIMARY KEY
    REFERENCES public.submissions(id) ON DELETE CASCADE,

  brief_md text,

  links jsonb NOT NULL DEFAULT '[]'::jsonb,
  social_accounts jsonb NOT NULL DEFAULT '[]'::jsonb,
  deliverables jsonb NOT NULL DEFAULT '[]'::jsonb,
  reporting_setup jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- AES-256-GCM-encrypted credentials blob (see src/lib/crypto-vault.ts).
  secrets_ciphertext text,
  secrets_iv text,
  secrets_tag text,

  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text
);

COMMENT ON TABLE public.submission_context IS
  'Project context vault for a submission. Credentials encrypted at rest with AES-256-GCM.';

-- ---------- 4. Triggers ----------
-- Bump newest-message metadata + status on submission_messages INSERT.
CREATE OR REPLACE FUNCTION public.fn_bump_submission_on_message()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  preview text;
BEGIN
  preview := regexp_replace(NEW.body_md, E'[\\r\\n]+', ' ', 'g');
  IF length(preview) > 200 THEN
    preview := substring(preview FROM 1 FOR 197) || '...';
  END IF;

  UPDATE public.submissions
     SET last_event_at = NEW.sent_at,
         last_message_preview = preview,
         last_message_from_name = COALESCE(
           NEW.from_name, NEW.from_pushname, NEW.from_phone
         ),
         last_message_direction = NEW.direction,
         message_count = message_count + 1,
         status = CASE
           -- Inbound after the operator was done with it → reopen.
           WHEN NEW.direction = 'in'
             AND status IN ('read', 'replied', 'archived')
             THEN 'new'
           -- Outbound while the thread was still active → mark replied.
           WHEN NEW.direction = 'out'
             AND status IN ('new', 'read')
             THEN 'replied'
           ELSE status
         END
   WHERE id = NEW.submission_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_submission_messages_bump ON public.submission_messages;
CREATE TRIGGER trg_submission_messages_bump
  AFTER INSERT ON public.submission_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_bump_submission_on_message();

-- Refresh updated_at on submission_context updates.
CREATE OR REPLACE FUNCTION public.fn_bump_submission_context_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_submission_context_updated_at ON public.submission_context;
CREATE TRIGGER trg_submission_context_updated_at
  BEFORE UPDATE ON public.submission_context
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_bump_submission_context_updated_at();

-- ---------- 5. Backfill existing form submissions ----------
-- For every existing submission that doesn't yet have a thread row,
-- insert ONE submission_messages row from its body_md. The trigger will
-- fire and increment message_count, so we reset it back to 1 after.
INSERT INTO public.submission_messages
  (submission_id, direction, from_phone, from_pushname, from_name, body_md, payload_json, sent_at)
SELECT
  s.id,
  'in',
  s.from_phone,
  NULL,
  s.from_name,
  COALESCE(NULLIF(s.body_md, ''), '(no body recorded)'),
  '{}'::jsonb,
  s.received_at
FROM public.submissions s
WHERE NOT EXISTS (
  SELECT 1 FROM public.submission_messages m WHERE m.submission_id = s.id
);

-- Backfill display_name + last_event_at + reset message_count for
-- the rows we just touched. Existing rows are treated as already-seen
-- (status='read') unless they were still 'new' in the legacy model.
UPDATE public.submissions
   SET message_count = 1,
       last_event_at = COALESCE(last_event_at, received_at),
       display_name = COALESCE(display_name, from_name);

-- ---------- 6. wa_send_log: drop chat/message FKs ----------
-- The chat_id / message_id columns from 0010 referenced wa_chats /
-- wa_messages, both about to be dropped. Outbound replies going
-- forward log against submission_id (already present).
ALTER TABLE public.wa_send_log
  DROP COLUMN IF EXISTS chat_id,
  DROP COLUMN IF EXISTS message_id;

-- ---------- 7. Drop the WA-only tables ----------
DROP TRIGGER IF EXISTS trg_wa_messages_bump_chat ON public.wa_messages;
DROP TRIGGER IF EXISTS trg_chat_context_updated_at ON public.wa_chat_context;
DROP FUNCTION IF EXISTS public.fn_bump_wa_chat_on_message();
DROP FUNCTION IF EXISTS public.fn_bump_chat_context_updated_at();

DROP TABLE IF EXISTS public.wa_chat_context;
DROP TABLE IF EXISTS public.wa_messages;
DROP TABLE IF EXISTS public.wa_chats;
