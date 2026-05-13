-- ============================================================
-- Onyx Agents Platform — dashboard operator profile
-- Run order: after 0004.
-- Safe to re-run.
-- ============================================================

-- ---------- 1. dashboard_profile (single row) ----------
-- Stores the operator's display name, avatar URL, email signature,
-- and reply-tone preference. Single row because the dashboard auth
-- is env-var based (one user). Identified by id='primary' so we can
-- always upsert against it.
create table if not exists public.dashboard_profile (
  id              text primary key default 'primary',
  display_name    text,
  avatar_url      text,
  email_signature text,
  reply_tone      text default 'restrained',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Seed the row so it always exists.
insert into public.dashboard_profile (id, display_name, email_signature)
values (
  'primary',
  'Onyx',
  'Talk soon,
The Onyx Creative Asia team
Bali · onyxcreative.asia'
)
on conflict (id) do nothing;

-- ---------- 2. dashboard-avatars storage bucket (public) ----------
-- Public so the avatar URL can render in the dashboard chrome
-- without signed URL juggling. The bucket only holds the operator's
-- profile pic — non-sensitive.
insert into storage.buckets (id, name, public)
values ('dashboard-avatars', 'dashboard-avatars', true)
on conflict (id) do nothing;

-- ============================================================
-- DONE — verify with:
--   select * from public.dashboard_profile;
--   select id, public from storage.buckets where id = 'dashboard-avatars';
-- ============================================================
