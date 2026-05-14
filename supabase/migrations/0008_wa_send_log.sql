-- ============================================================
-- Onyx Agents Platform — WhatsApp outbound audit log
-- Run order: after 0007.
-- Safe to re-run.
-- ============================================================

-- Every successful + failed outbound WA send (via Fonnte) writes one
-- row here. The platform uses it to enforce rate limits, per-recipient
-- cooldowns, and a global minimum-interval that together keep the
-- WhatsApp number from looking bot-like to Meta's spam-detection.
--
-- We intentionally keep this lightweight — no FK to submissions
-- (sends without a parent submission are possible later), just enough
-- columns to query "how many sends in the last 24h?" and "when was
-- the last send to this number?".

create table if not exists public.wa_send_log (
  id            uuid primary key default gen_random_uuid(),
  target_phone  text not null,
  message       text,
  ok            boolean not null default false,
  error         text,
  sender        text,                    -- operator username (from session)
  submission_id uuid references public.submissions(id) on delete set null,
  sent_at       timestamptz not null default now()
);

-- Query patterns we care about:
--   1. count(*) where sent_at > now() - interval '24 hours' AND ok=true
--   2. max(sent_at) where target_phone = ? AND ok=true
--   3. max(sent_at) where ok=true
-- All three covered by these two indexes.
create index if not exists wa_send_log_sent_at_idx
  on public.wa_send_log(sent_at desc);

create index if not exists wa_send_log_target_sent_at_idx
  on public.wa_send_log(target_phone, sent_at desc);

-- ============================================================
-- DONE — verify with:
--   select count(*) from public.wa_send_log;
-- ============================================================
