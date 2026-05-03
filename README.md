# Onyx Creative Asia

Studio website for **Onyx Creative Asia** — built with Next.js 15, Tailwind CSS, Framer Motion, Lenis, and Supabase. Designed in the Fleava-inspired editorial direction (ash black + soft white, Neue Montreal type).

## Stack

- **Next.js 15** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS 3** with custom design tokens
- **Framer Motion** for page/scroll animation, **Lenis** for smooth scroll
- **Supabase** for the contact / lead form
- **Vercel** hosting, **GitHub** source control

## Local development

```bash
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
npm run dev
```

Open <http://localhost:3000>. The contact form will run in **mock mode** if Supabase env vars are missing — submissions are logged to the server console instead of the DB.

## Project structure

```
src/
  app/
    layout.tsx              # root layout, loads font, Loader, Nav, Footer
    page.tsx                # home
    works/page.tsx
    services/page.tsx
    about/page.tsx
    contact/page.tsx
    api/leads/route.ts      # POST endpoint that writes to Supabase
  components/
    Loader.tsx              # intro page loader (Fleava-style)
    Nav.tsx                 # sticky nav + mobile menu
    Footer.tsx              # CTA + sitemap + giant wordmark
    SmoothScroll.tsx        # Lenis wrapper
    Cursor.tsx              # custom cursor with hover state
    Reveal.tsx              # scroll-in animation primitive
    Marquee.tsx
    home/                   # home-page sections
    contact/ContactForm.tsx # multi-field inquiry form, posts to /api/leads
  lib/
    cn.ts                   # className helper
    data.ts                 # PROJECTS, SERVICES, STATS, CLIENTS
    supabase.ts             # client + server Supabase factories
public/
  fonts/                    # Neue Montreal (.ttf) — loaded via @font-face
supabase/
  migrations/0001_init_leads.sql
```

## Setting up Supabase

1. Go to <https://supabase.com>, sign in, **New Project**. Name it `onyx-creative-asia`. Pick a region close to your users (e.g. **Singapore** for Asia).
2. Wait for provisioning (~2 min). Once ready, open the project.
3. **SQL Editor → New query**, paste the contents of `supabase/migrations/0001_init_leads.sql`, click **Run**.
4. **Project Settings → API**. Copy these into your `.env.local`:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` *(never expose client-side)*
5. Restart `npm run dev`. Submit the contact form — verify the row lands in **Table Editor → leads**.

> **Why service_role for inserts?** Row-level security is on. The API route (`src/app/api/leads/route.ts`) runs server-side and uses the service_role key, which bypasses RLS so the public site never needs write permission directly to your DB.

## Deploying to GitHub + Vercel

### One-time: push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — Onyx Creative Asia"
gh repo create onyx-creative-asia --private --source=. --remote=origin --push
# or, manually:
#   create the repo on github.com, then:
#   git remote add origin git@github.com:<you>/onyx-creative-asia.git
#   git branch -M main
#   git push -u origin main
```

### Vercel setup

1. <https://vercel.com> → **Add New → Project** → import the GitHub repo.
2. Framework auto-detected as **Next.js**. Leave defaults.
3. **Environment Variables** — add the same three from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. **Deploy**. First build takes ~2 min. Every push to `main` after that auto-deploys.
5. Optional: **Settings → Domains** → add `onyxcreative.asia` (or your domain).

## Design tokens

```ts
ink: #0E0E0E   // ash black (deep but not pure black)
bone: #F4F1EC  // soft warm off-white
```

Type scale uses `clamp()` so headlines feel right from 320px → 1920px.

## Animation principles

- Durations 150–400ms for UI; 800–1200ms for hero/section reveals.
- All easing through one of: `out-expo`, `out-quart`, `in-out-quart`.
- Only `transform` and `opacity` animate (never `width`, `height`, `top`).
- Respects `prefers-reduced-motion` (see `globals.css`).

## What lives where (data → UI)

Projects, services, stats, and client list live in `src/lib/data.ts` — edit there to update what shows on the marketing pages. The contact form is the only piece backed by Supabase.

If you later want a CMS for case studies or a journal, the same `lib/supabase.ts` setup extends cleanly — add a `projects` or `posts` table and read from it in the page's `loader`.
