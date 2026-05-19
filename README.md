# Onyx Creative Asia

In-house operating system for an independent design + AI studio in Bali. One Next.js codebase serves two products on two domains: the public marketing site (`onyxcreative.asia`) and a cookie-gated internal dashboard (`agents.onyxcreative.asia`) that ingests inquiries from web forms and WhatsApp, classifies them with an LLM, and routes each one to the right team member with full conversation context.

**Live:** [onyxcreative.asia](https://onyxcreative.asia) · **Internal dashboard:** [agents.onyxcreative.asia](https://agents.onyxcreative.asia) *(cookie-gated, no-index)*

---

## What the automation does

The system ingests inquiries from three channels — a public web contact form, WhatsApp direct messages, and WhatsApp groups — into a unified `submissions` table, then runs every inbound message through a Google Gemini pipeline that classifies inquiry type (`project` / `question` / `career` / `partnership`), assigns a priority bucket from urgency signals in the body, extracts structured fields (budget hint, disciplines, deadline phrases), and decides downstream actions.

Project-type inquiries auto-spawn a `projects` row, link the submission, and bump the owning agent's status based on a discipline-to-role routing table (`web` / `paid_media` / `social` / `brand` → Maker; `ai_systems` → Strategist; everything else → Director). Follow-up messages from the same contact within a 14-day window are appended to the existing thread instead of creating duplicates, and triage re-runs on the cumulative conversation so priority reflects all signals — not just the latest line.

The same LLM layer also polishes operator-typed reply drafts with channel-aware tone rules (lowercase chat brevity for WhatsApp, structured paragraphs for email), preserving every concrete commitment the operator made while cleaning the phrasing. Operator stays in the loop for every outgoing message — the LLM never sends on its own.

Brand voice is encoded as a system instruction (`ONYX_SYSTEM_INSTRUCTION` in `src/lib/llm.ts`) baked into every Gemini call, so output reads as the studio across all surfaces — not a generic assistant. The LLM client is provider-agnostic with `generateText()` and `generateStructured()` exports, so swapping Gemini → Claude / Mistral is a single-file change. Cost engineering: switched from `gemini-2.5-flash` (20 free req/day, killed by daily traffic) to `gemini-2.5-flash-lite` (~1000 req/day) after measuring real usage; thinking-token-aware `maxOutputTokens` calibrated empirically.

Safety + reliability: every outbound WhatsApp send is gated through a kill switch (`WA_AUTO_REPLY_ENABLED`) plus rate-limit guards (per-recipient cooldown, daily cap, working-hours window, min-interval) to avoid Meta ban triggers; downstream tasks fire-and-forget via `Promise.allSettled` so the form response time stays instant even when triage + project creation + agent assignment + internal email all run in parallel; failures log silently and never break the 200 we return to the webhook caller.

---

## Architecture map

```
Inbound channels                  Pipeline                              Outputs
───────────────                   ────────                              ───────
Web form (4 inquiry types)  ─┐
WhatsApp DM                  ├──→ /api/leads | /api/inbound/whatsapp
WhatsApp group               ─┘         │
                                        ▼
                              submissions table (unified)
                                        │
                              fire-and-forget Promise.allSettled
                                        │
                  ┌─────────────────────┼─────────────────────┐
                  ▼                     ▼                     ▼
        Gemini triage          Internal email          WA auto-reply
        (structured JSON)      (Resend)                (gated, off by default)
                  │
                  ├──→ submissions.priority / triage_summary / disciplines
                  ├──→ payload_json.triage (full audit)
                  └──→ if inquiry_type=project AND no recent project:
                            spawn projects row
                            assign agent by discipline
                            log agent_run audit trail
```

---

## Stack

- **Next.js 15** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS** + Framer Motion + Lenis (frontend animation)
- **Supabase** (Postgres + Storage + RLS-aware migrations)
- **Google Gemini 2.5 Flash Lite** via `@google/genai` (LLM layer)
- **Resend** (transactional email)
- **Fonnte** (WhatsApp gateway via webhook)
- **Vercel** (deployment, auto-CI/CD from `main`)

---

## Key files (where the automation lives)

```
src/
  lib/
    llm.ts              # Provider-agnostic Gemini wrapper.
                        #   generateText() — free-form completion
                        #   generateStructured() — JSON-schema mode
                        # Embeds ONYX_SYSTEM_INSTRUCTION on every call.
    triage.ts           # Classify + extract + decide.
                        # Includes 14-day sender-window dedup,
                        # auto-create project, agent assignment.
    reply-enhance.ts    # Polish operator draft per tone + channel.
                        # Hard constraint: never invents new commitments.
    wa-safety.ts        # Rate-limit guards for outbound WhatsApp.
  app/
    api/
      leads/route.ts                       # Web form ingress
      inbound/whatsapp/route.ts            # Fonnte webhook ingress
      submissions/[id]/triage/route.ts     # Manual re-triage
      submissions/[id]/enhance-reply/route.ts  # Reply polish
    agents/                                # Internal dashboard (cookie-gated)
      submissions/
        page.tsx                           # Inbox with priority chips
        [id]/page.tsx                      # Detail + TriageCard + ReplyBox
supabase/
  migrations/                              # Schema evolution
```

---

## Local development

```bash
npm install
cp .env.example .env.local
# Fill in:
#   NEXT_PUBLIC_SUPABASE_URL
#   NEXT_PUBLIC_SUPABASE_ANON_KEY
#   SUPABASE_SERVICE_ROLE_KEY
#   GEMINI_API_KEY
#   GEMINI_MODEL=gemini-2.5-flash-lite
#   RESEND_API_KEY
#   FONNTE_TOKEN
#   FONNTE_WEBHOOK_SECRET
#   WA_INBOUND_ENABLED=true   # default off
#   WA_AUTO_REPLY_ENABLED=false   # safer to keep off
npm run dev
```

Open <http://localhost:3000>. Without Supabase env vars the contact form runs in **mock mode** (submissions logged to server console). Without `GEMINI_API_KEY` the triage step no-ops and the operator can re-trigger it later from the detail page.

---

## Deploying

GitHub → Vercel auto-CI/CD from `main` branch. Apply the same env vars in **Project Settings → Environment Variables**. Production domain mapped in **Settings → Domains**.

---

## Design tokens (marketing site)

```ts
ink: #0E0E0E   // ash black, deep but not pure black
bone: #F4F1EC  // soft warm off-white
```

Type: Neue Montreal (Light / Regular / Medium / Bold + italics). Editorial monochrome aesthetic, no gradients, no heavy shadows. All easing via `out-expo` / `out-quart` / `in-out-quart`. Only `transform` and `opacity` animate. Respects `prefers-reduced-motion`.
