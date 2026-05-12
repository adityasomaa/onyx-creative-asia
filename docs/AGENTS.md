# Onyx Agents Platform

Private internal console for the studio's automation roster + project ops.
Lives at `agents.onyxcreative.asia` (subdomain), gated by a branded
sign-in screen with HMAC-signed cookie sessions.

The platform replaces the old static dashboard. As of v0.2 it has:

| Path | Purpose |
|---|---|
| `/` (subdomain root) | **Roster** — 4 agents, flow diagram, active work, recent activity |
| `/<slug>` | **Agent detail** — manifesto, charter, tools, ownership, activity |
| `/submissions` | **Inbound log** — every brief from form, email, WhatsApp |
| `/submissions/:id` | **Submission detail** — body, sender, files, linked project |
| `/dashboard` | **Studio ops** — project / submission / client counts + bar charts |
| `/flow` | **Flows registry** — workflow definitions + Phase 1–4 roadmap |
| `/onboarding/:client` | Per-client portal (Phase 2 — page not yet shipped) |
| `/results/:client` | Per-client analytics (Phase 2 — page not yet shipped) |

All pages SSR from Supabase via the service-role key (see
`src/lib/db/*`). When the DB is unreachable, agents queries fall back to
the hardcoded roster in `src/lib/agents.ts` so the roster page always
renders.

---

## Setup — one-time

### 1. Database (Supabase)

The platform requires three env vars to talk to Supabase:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your project URL (https://xxxxx.supabase.co) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role secret — **server-only**, never expose |

Add to Vercel → Settings → Environment Variables (Production + Preview).

Then run the migrations in the Supabase SQL editor in order:

1. `supabase/migrations/0001_leads_table.sql` — the contact-form leads
   table (already in place if your contact form works)
2. `supabase/migrations/0002_agents_platform.sql` — 8 tables: clients,
   projects, submissions, files, agents, agent_runs, flows, credentials
3. `supabase/migrations/0003_seed_agents_platform.sql` — seeds 4 agents,
   3 real clients + 2 leads, 4 projects, 7 mocked submissions, 3 flow
   definitions

All migration files are re-runnable (`create table if not exists`,
`on conflict do nothing`), so it's safe to re-execute after edits.

> **RLS is disabled** in Phase 1 — only the server (service-role key)
> ever reads/writes. RLS policies come online in Phase 2 when the
> `/onboarding/:client` and `/results/:client` portals open to clients.

### 2. Auth (session credentials)

In Vercel → Environment Variables, also add:

| Name | Value |
|---|---|
| `DASHBOARD_USER` | username (e.g. `onyx`) |
| `DASHBOARD_PASSWORD` | long random password (40+ chars) |
| `DASHBOARD_SECRET` | 32+ random bytes — HMAC key for session cookies. Generate with `openssl rand -base64 48` |

The platform uses an HMAC-SHA256-signed cookie session, NOT Basic Auth.
Sessions last 7 days. Rotating `DASHBOARD_SECRET` invalidates every
active session instantly — exactly what you want if you suspect a leak.

### 3. Resend (outbound email)

The `/api/leads` route fires two emails per submission: a branded
auto-reply to the visitor and an internal notification to
`hello@onyxcreative.asia`. Without `RESEND_API_KEY` set, emails are
skipped and only the DB write happens — the form still works.

1. Sign up at https://resend.com (free tier: 3k emails/mo, 100/day)
2. **Domains → Add Domain → `onyxcreative.asia`**
3. Resend gives you 3 DNS records — a TXT for SPF, a CNAME for DKIM,
   a TXT for DMARC. Add them in Hostinger DNS:

   | Type | Name | Content |
   |---|---|---|
   | TXT | `send` | (Resend gives the SPF value) |
   | CNAME | `resend._domainkey` | (Resend gives the DKIM target) |
   | TXT | `_dmarc` | (Resend gives the DMARC value) |

4. Wait for verification (5–30 min). Status goes green in Resend.
5. **API Keys → Create API Key** → scope: `Sending access`, domain:
   `onyxcreative.asia` → copy.
6. Add to Vercel env vars (Production + Preview):

   | Name | Value |
   |---|---|
   | `RESEND_API_KEY` | `re_xxxxxxxxxxxxxxxxxxxxxxxx` |
   | `RESEND_FROM` | `Onyx Creative Asia <hello@onyxcreative.asia>` |
   | `INTERNAL_NOTIFY_EMAIL` | `hello@onyxcreative.asia` |

   Mark `RESEND_API_KEY` as **Sensitive**.

7. Redeploy. Submit the contact form — you should get the auto-reply
   in your inbox + the internal notification at `hello@`.

> **Before domain verification**, Resend lets you send from
> `onboarding@resend.dev`. Useful for local testing (set
> `RESEND_FROM=onboarding@resend.dev` in `.env.local`) but mail lands
> in spam — never use this in production.

### 4. Email sender avatar (BIMI + Gravatar)

The mini avatar Gmail / Apple Mail shows next to the sender name comes
from one of two sources:

**Easy path — Gravatar (works in Apple Mail + many clients within hours):**
1. Sign up at https://gravatar.com using `hello@onyxcreative.asia`
2. Upload `public/logo.svg` (or a 512×512 PNG export of it)
3. That's it — Gravatar-aware clients now show the Onyx mark
   automatically. Gmail does NOT use Gravatar; for Gmail use BIMI below.

**Proper path — BIMI (works in Yahoo, AOL, Fastmail without VMC):**
BIMI requires DMARC enforcement (quarantine or reject policy) + a
hosted SVG logo with strict constraints (SVG 1.2 Tiny PS profile —
no text elements, no scripts, no external refs, fixed square viewBox).

A BIMI-compliant logo is already in the repo: `public/bimi-logo.svg`.
It serves at `https://onyxcreative.asia/bimi-logo.svg`.

1. **Tighten DMARC** in Hostinger DNS — change `_dmarc.onyxcreative.asia`
   from `p=none` to:
   ```
   v=DMARC1; p=quarantine; rua=mailto:hello@onyxcreative.asia;
   ```
   Wait 48 hours, check Resend deliverability metrics. If ok, tighten
   further to `p=reject`.

2. **Add the BIMI DNS record** in Hostinger:

   | Type | Name | Value |
   |---|---|---|
   | TXT | `default._bimi` | `v=BIMI1; l=https://onyxcreative.asia/bimi-logo.svg;` |

3. **Verify** via https://bimigroup.org/bimi-generator/ — it'll fetch
   the record + the SVG and tell you what's missing. Should pass green.

4. **Reality check — Gmail specifically:**
   For the logo to display in **Gmail**, you also need a Verified Mark
   Certificate (VMC) from DigiCert or Entrust (~$1.5k/yr, requires a
   registered trademark on the logo). Without VMC, BIMI works on
   Yahoo, AOL, Fastmail — but **Gmail will keep showing the default
   grey-circle avatar**. There's no workaround for this on Gmail's
   side; it's a deliberate Google policy.

   Three options for Gmail avatar coverage:
   - **Buy VMC** — Entrust starting at ~$1.2k/year, DigiCert ~$1.5k.
     Requires a registered trademark on the logo. Worth it once
     outbound volume justifies the trust signal.
   - **Migrate to Google Workspace** — switch `hello@onyxcreative.asia`
     to Google Workspace (~$6/user/mo), set a profile photo. Gmail
     then shows that photo for emails sent via the Workspace account.
   - **Recipient-side workaround** — for high-value clients, ask them
     to add `hello@onyxcreative.asia` to their Google contacts with
     the Onyx logo as the contact photo. Avatar shows for that recipient
     only.

> **Note**: email avatars cannot animate. BIMI explicitly requires
> static SVG. The animated wordmark in the email body (inline SVG with
> SMIL) is the workaround — it plays in Apple Mail, degrades to static
> in Gmail / Outlook.

### 5. DNS — add the subdomain

In Hostinger DNS panel, add:

| Type | Name | Content | TTL |
|---|---|---|---|
| CNAME | `agents` | `cname.vercel-dns.com` | 14400 |

### 6. Vercel — add the domain

In Vercel project → Settings → Domains:

1. Click **Add Domain**
2. Enter `agents.onyxcreative.asia`
3. Vercel verifies the CNAME automatically (give it 5–10 min)
4. SSL certificate provisions automatically

### 7. Verify

Visit `https://agents.onyxcreative.asia` — unauthenticated visitors
land on the branded `/login` page. Sign in with the credentials from
step 2. The dashboard sets a 7-day signed cookie; logout button sits
in the top-right of every page.

---

## How the routing works

A request to `agents.onyxcreative.asia/anything` is intercepted by two
pieces:

1. **`next.config.ts`** rewrites — based on the `host` header, the
   visitor-facing paths are rewritten internally to `/agents/<path>`.
   The visitor never sees `/agents/` in their URL.

   Rewrites are **explicit per route**, not a catch-all — a catch-all
   would also intercept `/_next/*`, `/fonts/*`, and the rewritten
   target itself. When you add a new top-level page under
   `/agents/<page>`, add the matching rewrite in `next.config.ts`.

2. **`src/middleware.ts`** — runs before every request:
   - On the subdomain: require a valid signed session cookie or
     redirect to `/login`
   - On the main domain: hitting `/agents/*` directly returns 404 so
     the platform can't be reached without the subdomain

`onyxcreative.asia` stays public. The platform is private.

---

## Editing the roster

The roster is now **DB-driven**. Two ways to edit:

1. **Live edit in Supabase** — go to the `agents` table in the Supabase
   editor and change a row. The next page load reflects it.

2. **Source-controlled edit** — modify the seed file at
   `supabase/migrations/0003_seed_agents_platform.sql`. Since it uses
   `on conflict (slug) do nothing`, re-running it won't update an
   existing row — you'll need to either drop the row first or run an
   explicit `update` from the SQL editor.

The hardcoded fallback in `src/lib/agents.ts` is what renders when the
DB is unreachable (preview deploys without env vars, migrations not yet
applied). Keep it roughly in sync with the seed file so the fallback
makes sense.

---

## Roadmap

### Phase 1 — Foundation (✓ current)

- Supabase schema with 8 tables
- DB-driven roster, submissions, dashboard, flows registry
- Branded login + signed cookie sessions
- Subdomain split with explicit rewrites

### Phase 2 — Live ingest + portals

- POST `/api/leads` writes to `public.submissions` (not just `leads`)
- Gmail polling worker reads inbox → `submissions` (`source = 'email'`)
- WhatsApp Business API webhook → `submissions` (`source = 'whatsapp'`)
- `/onboarding/:client` page: contract status, file uploads (Supabase
  Storage), progress timeline
- `/results/:client` page: analytics from connected platforms
- Supabase Auth + RLS policies so clients only see their own rows

### Phase 3 — Flow graph editor

- React Flow renders the `flows.graph_json` DAG
- Read-only UI — flows are edited via code commits
- Each node references an agent + a tool/MCP call
- Test runs from the UI (dry-run with mocked outputs)

### Phase 4 — Autonomous runtime

- Claude Agent SDK loop executes a flow end-to-end on trigger
- Cron triggers (`cron.daily`, `cron.weekly`) via Vercel Cron
- Webhook triggers (`submission.new`, `gmail.received`)
- Every run lands in `agent_runs` with input/output/status/duration
- Credentials resolved at runtime from `public.credentials` pointers
  → Supabase Vault or Vercel env (the table stores `secret_ref`, never
  the secret itself)

---

## Local development

```bash
npm run dev
# open http://localhost:3000/agents
# sign in with the credentials from your .env.local
```

The middleware allows `localhost:3000/agents` so you don't need to
configure a fake subdomain locally. On any deployed environment, only
the `agents.onyxcreative.asia` host serves the platform.

If `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` aren't set,
DB queries return empty arrays and the agents page falls back to the
hardcoded roster.

---

## Security notes

- Sessions are HMAC-SHA256-signed cookies (`onyx_agents_session`),
  HTTP-only + Secure + SameSite=Lax, 7-day TTL. Payload is
  `username:expiresAt`, so an attacker can't extend their own session
  without re-signing.
- `DASHBOARD_SECRET` is the HMAC key. Rotate it any time you suspect a
  leak — every active session is invalidated instantly.
- Credentials check is constant-time so usernames don't leak via timing.
- `robots: { index: false, follow: false }` is set on the platform
  layout so search engines won't index it even if auth ever lapses.
- Supabase RLS is **off** in Phase 1 — only the server (service-role
  key) reads/writes. Treat the platform like an internal admin: no
  client-side DB calls.
- `credentials.secret_ref` stores **pointers** (`env:NAME` or
  `vault:KEY`), never secret material itself.
- For solo internal use this is sufficient. If the team grows, swap to
  Supabase Auth + a real identity provider before sharing the URL widely.
- Never commit `.env.local` — credentials live in Vercel env vars only.
