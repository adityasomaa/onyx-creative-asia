# Onyx Agents Dashboard

Private internal console for the studio's automation roster. Lives at
`agents.onyxcreative.asia` (subdomain) and is gated by Basic Auth.

The dashboard is a view onto the agent system defined in
`src/lib/agents.ts` (in Fase 2 this will read from
`.claude/agents/<slug>.md` directly). Today it renders:

- **Roster** — the four MVP agents (Director, Strategist, Maker, Account
  Manager) with status, tools, and current task
- **Flow diagram** — how an inbound brief moves through the system
- **Active work** — projects currently in flight, with current owner
- **Recent activity** — latest agent invocations

Per-agent detail pages live at `/agents/<slug>`.

---

## Setup — one-time

### 1. Environment variables (Vercel)

In Vercel project settings → Environment Variables, add:

| Name | Value |
|---|---|
| `DASHBOARD_USER` | username (e.g. `onyx`) |
| `DASHBOARD_PASSWORD` | long random password (40+ chars) |
| `DASHBOARD_SECRET` | 32+ random bytes — signs session cookies. Generate with `openssl rand -base64 48` |

Apply each to **Production** and **Preview** (Development env can't take
sensitive vars — that's fine, dev runs against `.env.local`). After
saving, trigger a redeploy so the env vars are baked in.

> The dashboard uses a signed cookie session, NOT Basic Auth. The
> session lasts 7 days. `DASHBOARD_SECRET` is what HMAC-signs the
> cookie — rotating it invalidates every active session, which is
> exactly what you want when you suspect a leak.

### 2. DNS — add the subdomain

In Hostinger DNS panel, add:

| Type | Name | Content | TTL |
|---|---|---|---|
| CNAME | `agents` | `cname.vercel-dns.com` | 14400 |

### 3. Vercel — add the domain

In Vercel project → Settings → Domains:

1. Click **Add Domain**
2. Enter `agents.onyxcreative.asia`
3. Vercel verifies the CNAME automatically (give it 5–10 min after
   adding in step 2)
4. SSL certificate provisions automatically

### 4. Verify

Visit `https://agents.onyxcreative.asia` — unauthenticated visitors
are redirected to a branded `/login` page. Sign in with the credentials
from step 1. The dashboard sets a 7-day signed cookie; logout button
sits in the top-right.

---

## How the routing works

A request to `agents.onyxcreative.asia/anything` is intercepted by
two pieces:

1. **`next.config.ts`** rewrites — based on the `host` header, every
   path is rewritten internally to `/agents/<path>`. The visitor never
   sees `/agents/` in their URL.

2. **`src/middleware.ts`** — runs before every request:
   - If the host is `agents.onyxcreative.asia`, requires Basic Auth
   - If the host is the main domain and the path starts with `/agents`,
     returns 404 (so the dashboard can't be reached without the subdomain)

`onyxcreative.asia` stays public. The dashboard is private.

---

## Editing the roster

For now the roster is hardcoded in `src/lib/agents.ts`. To add an
agent or change a role:

1. Edit `AGENTS` in `src/lib/agents.ts` — each entry follows the
   `Agent` type at the top of the file
2. Commit + push — Vercel redeploys automatically

In Fase 2, this file will be replaced by a build-time loader that
reads `.claude/agents/*.md` frontmatter so the dashboard auto-syncs
with what Claude Code actually has available.

---

## Roadmap

### Fase 1 — Static dashboard (current)

- Static roster + mocked active work + mocked activity feed
- Basic Auth gate
- Subdomain split

### Fase 2 — Live data

- Read agent definitions from `.claude/agents/*.md`
- Read active projects from `social/_planner/active.md`
- Read activity from git log + Drive sync history
- All still read-only

### Fase 3 — Control panel

- Trigger agents from the UI (POST → Claude Agent SDK runner on Vercel
  function or external worker)
- Live status updates (server-sent events or polling)
- Per-agent inbox: pending tasks, drafts to approve
- Slack/Discord bot mirror

### Fase 4 — Autonomous runtime

- Cron-triggered agent runs (Monday standup, weekly social drop,
  invoice reminders)
- Memory store (Postgres or vector DB) for past-decisions context
- Audit log of every agent action

---

## Local development

```bash
npm run dev
# open http://localhost:3000/agents
# Basic Auth: onyx / onyx (the dev fallback)
```

The middleware allows `localhost:3000/agents` so you don't need to
configure a fake subdomain locally. On any deployed environment, only
the `agents.onyxcreative.asia` host serves the dashboard.

---

## Security notes

- Sessions are HMAC-SHA256 signed cookies (`onyx_agents_session`),
  HTTP-only + Secure + SameSite=Lax, 7-day TTL. The payload is
  `username:expiresAt`, so an attacker can't extend their own session
  without re-signing.
- `DASHBOARD_SECRET` is the HMAC key. Rotate it any time you suspect a
  leak — every active session is invalidated instantly.
- Credentials check is constant-time so usernames don't leak via timing.
- `robots: { index: false, follow: false }` is set on the dashboard
  layout so search engines won't index it even if the auth ever lapses.
- For solo internal use this is sufficient. If the team grows, swap to
  NextAuth + a real identity provider before sharing the URL widely.
- Never commit `.env.local` — credentials are env vars in Vercel only.
