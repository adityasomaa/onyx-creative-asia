-- Leads table — stores incoming "Start a project" submissions from the website.

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

-- Row Level Security: lock down public access. Inserts happen via the
-- service_role key from our Next.js API route, which bypasses RLS.
alter table public.leads enable row level security;

-- (No public policies on purpose — only the service role can read/write.)
