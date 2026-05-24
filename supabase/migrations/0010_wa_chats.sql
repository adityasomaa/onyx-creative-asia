-- ============================================================
-- 0010_wa_chats.sql — WhatsApp inbox rebuild.
--
-- Replaces the "every WA message becomes a submission" model
-- with a proper conversation model:
--
--   wa_chats          — one row per WhatsApp contact OR group.
--                       Holds read/unread state, latest-message metadata,
--                       classification (business vs personal vs pending),
--                       editable display name, and archived flag.
--
--   wa_messages       — one row per WhatsApp event (inbound + outbound).
--                       Owned by a chat. Drives the thread view.
--
--   wa_chat_context   — operator-editable project context for a chat:
--                       brief, links, social accounts, deliverables,
--                       reporting setup, and AES-256-GCM-encrypted
--                       credentials. 1:1 with wa_chats.
--
-- Personal/spam chats are auto-classified by Gemini on the first
-- message and stay out of the inbox unless the operator manually
-- promotes them.
--
-- All existing WA-sourced submissions are deleted. Form submissions
-- and other sources are preserved.
-- ============================================================

-- ---------- wa_chats ----------------------------------------
CREATE TABLE IF NOT EXISTS public.wa_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 'contact' (1:1 chat) or 'group' (WA group)
  kind text NOT NULL CHECK (kind IN ('contact', 'group')),

  -- For contact: normalised phone (62xxx...). For group: Fonnte group id.
  wa_identifier text NOT NULL,

  -- Display name shown in the inbox + chat header.
  --
  -- Default on first inbound: a formatted version of the phone number
  -- (e.g. "+62 895 4133 7282") so the operator immediately sees who
  -- they're looking at without leaking the sender's WA profile name.
  --
  -- Operator can rename inline from the detail page — that flips
  -- display_name_source to 'operator' and locks the name from any
  -- future webhook updates.
  display_name text,

  -- 'auto'     — display_name auto-populated from phone number on insert.
  -- 'operator' — operator has renamed; webhook must NOT overwrite.
  display_name_source text NOT NULL DEFAULT 'auto'
    CHECK (display_name_source IN ('auto', 'operator')),

  -- The sender's own WhatsApp profile name. Stored separately from
  -- display_name so it shows up as reference ("WA profile: Ucup")
  -- without overriding what the operator named the chat.
  -- Refreshed on every inbound event.
  wa_pushname text,

  -- For groups: the group name from the payload. Same separation
  -- principle as wa_pushname.
  wa_group_name text,

  -- Gemini classification on the FIRST message of the chat:
  --   pending          — classifier hasn't run / failed (treated as business)
  --   business         — auto-classified as a business inquiry
  --   personal         — auto-classified as personal; chat is hidden by default
  --   manual_business  — operator manually promoted a personal chat back to inbox
  --   manual_ignored   — operator manually demoted a business chat to ignored
  classification text NOT NULL DEFAULT 'pending'
    CHECK (classification IN (
      'pending', 'business', 'personal', 'manual_business', 'manual_ignored'
    )),

  -- Optional one-liner reason from Gemini (audit trail for the call).
  classification_reason text,
  classification_model text,

  -- Inbox read state. Flipped to false on every new inbound message,
  -- flipped to true when the operator opens the chat detail.
  is_read boolean NOT NULL DEFAULT false,

  -- Operator can archive a chat to hide it from the default inbox view
  -- without losing the history.
  archived boolean NOT NULL DEFAULT false,

  -- Denormalised latest-message data — populated by trigger on every
  -- wa_message insert so the list view doesn't need a subquery per row.
  last_message_at timestamptz,
  last_message_preview text,
  last_message_from_name text,
  last_message_direction text CHECK (last_message_direction IN ('in', 'out')),

  message_count int NOT NULL DEFAULT 0,

  -- LLM-generated action-phrase subject. Updated on every new inbound
  -- message via fire-and-forget Gemini call. Short (6–12 words), present
  -- tense, NO sender name — e.g. "asking to update website hero copy"
  -- or "sharing logo brief and brand colors". This is what shows up as
  -- the primary column in the inbox list (replaces showing the sender
  -- name + raw preview).
  subject text,
  subject_updated_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),

  -- A given phone/group can only have ONE chat row. Webhook upserts
  -- against (kind, wa_identifier).
  UNIQUE (kind, wa_identifier)
);

COMMENT ON TABLE public.wa_chats IS
  'One row per WhatsApp contact or group. Holds the conversation thread metadata.';

CREATE INDEX IF NOT EXISTS wa_chats_last_message_at_idx
  ON public.wa_chats (last_message_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS wa_chats_is_read_idx
  ON public.wa_chats (is_read);
CREATE INDEX IF NOT EXISTS wa_chats_classification_idx
  ON public.wa_chats (classification);
CREATE INDEX IF NOT EXISTS wa_chats_archived_idx
  ON public.wa_chats (archived);

-- ---------- wa_messages -------------------------------------
CREATE TABLE IF NOT EXISTS public.wa_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  chat_id uuid NOT NULL REFERENCES public.wa_chats(id) ON DELETE CASCADE,

  -- 'in' = inbound from WA (webhook). 'out' = sent by operator via /agents.
  direction text NOT NULL CHECK (direction IN ('in', 'out')),

  -- Always set: phone of the actual sender (for groups, this is the
  -- member field, not the group id).
  from_phone text NOT NULL,

  -- Snapshot of the sender's WA profile name at time of message.
  from_pushname text,

  body_md text NOT NULL,

  -- Full Fonnte payload (inbound) or send result (outbound) for audit.
  payload_json jsonb NOT NULL DEFAULT '{}'::jsonb,

  sent_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.wa_messages IS
  'Append-only log of WhatsApp messages (both directions) belonging to a wa_chat.';

CREATE INDEX IF NOT EXISTS wa_messages_chat_id_sent_at_idx
  ON public.wa_messages (chat_id, sent_at);
CREATE INDEX IF NOT EXISTS wa_messages_direction_idx
  ON public.wa_messages (direction);

-- ---------- wa_chat_context (project vault) -----------------
-- 1:1 with wa_chats. Holds everything an agent (LLM or human) would
-- need to execute a project end-to-end:
--   - brief_md            — free-form description
--   - links               — JSON array of { label, url, notes }
--   - social_accounts     — JSON array of { platform, handle, business_id, access_level, notes }
--   - deliverables        — JSON array of { name, status, deadline, file_url }
--   - reporting_setup     — JSON array of { kpi, frequency, recipient, last_sent_at }
--   - secrets_*           — AES-256-GCM-encrypted credentials blob
--
-- Credentials are encrypted client-side (in the Next.js server) with a
-- key derived from CHAT_CONTEXT_SECRET (env var). The plaintext JSON
-- inside is the array: [{ service, login, password, mfa_notes, scope }].
-- We store IV + auth tag + ciphertext separately for AES-GCM.
-- If CHAT_CONTEXT_SECRET is rotated, existing rows become un-decryptable
-- (acceptable for an MVP — document in env example).
CREATE TABLE IF NOT EXISTS public.wa_chat_context (
  chat_id uuid PRIMARY KEY REFERENCES public.wa_chats(id) ON DELETE CASCADE,

  brief_md text,

  links jsonb NOT NULL DEFAULT '[]'::jsonb,
  social_accounts jsonb NOT NULL DEFAULT '[]'::jsonb,
  deliverables jsonb NOT NULL DEFAULT '[]'::jsonb,
  reporting_setup jsonb NOT NULL DEFAULT '[]'::jsonb,

  -- Encrypted credentials blob. NULL when there are no stored secrets.
  -- All three columns must be NULL or all set together.
  secrets_ciphertext text,
  secrets_iv text,
  secrets_tag text,

  -- Audit fields
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text
);

COMMENT ON TABLE public.wa_chat_context IS
  'Project context vault for a WA chat. Credentials encrypted at rest with AES-256-GCM.';

-- ---------- wa_send_log: link to chats/messages -------------
ALTER TABLE public.wa_send_log
  ADD COLUMN IF NOT EXISTS chat_id uuid
    REFERENCES public.wa_chats(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS message_id uuid
    REFERENCES public.wa_messages(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS wa_send_log_chat_id_idx
  ON public.wa_send_log (chat_id);

-- ---------- Wipe old WA submissions -------------------------
ALTER TABLE public.wa_send_log
  DROP CONSTRAINT IF EXISTS wa_send_log_submission_id_fkey;

ALTER TABLE public.wa_send_log
  ADD CONSTRAINT wa_send_log_submission_id_fkey
    FOREIGN KEY (submission_id)
    REFERENCES public.submissions(id)
    ON DELETE SET NULL;

UPDATE public.wa_send_log
   SET submission_id = NULL
 WHERE submission_id IN (
   SELECT id FROM public.submissions WHERE source = 'whatsapp'
 );

DELETE FROM public.submissions WHERE source = 'whatsapp';

-- ---------- Triggers ----------------------------------------
-- Keep wa_chats.last_message_* / message_count / is_read in sync
-- whenever a new wa_message is inserted.
CREATE OR REPLACE FUNCTION public.fn_bump_wa_chat_on_message()
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

  UPDATE public.wa_chats
     SET last_message_at = NEW.sent_at,
         last_message_preview = preview,
         last_message_from_name = COALESCE(NEW.from_pushname, NEW.from_phone),
         last_message_direction = NEW.direction,
         message_count = message_count + 1,
         is_read = CASE WHEN NEW.direction = 'in' THEN false ELSE is_read END
   WHERE id = NEW.chat_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_wa_messages_bump_chat ON public.wa_messages;
CREATE TRIGGER trg_wa_messages_bump_chat
  AFTER INSERT ON public.wa_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_bump_wa_chat_on_message();

-- Keep wa_chat_context.updated_at fresh on any UPDATE.
CREATE OR REPLACE FUNCTION public.fn_bump_chat_context_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_chat_context_updated_at ON public.wa_chat_context;
CREATE TRIGGER trg_chat_context_updated_at
  BEFORE UPDATE ON public.wa_chat_context
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_bump_chat_context_updated_at();
