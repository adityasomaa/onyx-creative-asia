# Onyx Creative Asia — Studio Workspace

This single folder is the **whole studio operating system**: the live website code, the design source-of-truth, and the social media production pipeline. One Claude Code session covers all three modes.

| Mode | Folder | Public? |
|---|---|---|
| **Web code** | `/src`, `/public`, `/supabase`, `/next.config.ts`, etc. | ✅ Public on GitHub |
| **Design** | `/design/` | ❌ Local-only (gitignored) |
| **Social** | `/social/` | ❌ Local-only (gitignored) |

> **Privacy boundary is enforced by `.gitignore`.** `/design/` and `/social/` never get pushed to the public GitHub repo. Don't relax those rules — they hold client briefs, unreleased campaigns, and deliverables.

---

## How to figure out what mode you're in

Look at what the user is asking for. Match the verbs:

| User intent | Mode | Where to work |
|---|---|---|
| "Edit the homepage / fix this on the site / deploy" | Web code | `/src/`, push triggers Vercel |
| "Update the brand spec / new color token / change the voice" | Design | `/design/brand/` |
| "New client onboarding / brief / deliverable" | Design | `/design/clients/<slug>/` |
| "Pitch deck / proposal doc / brand book PDF" | Design | `/design/marketing/` or `/design/clients/<slug>/` |
| "Instagram post / Reel / story / TikTok / LinkedIn" | Social | `/social/<platform>/<campaign>/` |
| "Plan the week / editorial calendar / scheduling" | Social | `/social/_planner/` |

When ambiguous, ask. When you've decided, **read the matching `CLAUDE.md`** before starting:

- Code mode: this file is enough; engineering happens in `src/`. See `/README.md` for stack details.
- Design mode: read `/design/CLAUDE.md` and the relevant file in `/design/brand/`.
- Social mode: read `/social/CLAUDE.md` and the brand spec under `/design/brand/`.

---

## Top-level map

```
ONYX CREATIVE ASIA/
├── CLAUDE.md              ← you are here — master context
├── README.md              ← human-facing project README
├── package.json           ← Next.js 15 + Tailwind + Framer Motion + Supabase
├── src/                   ← website source (App Router)
├── public/                ← website static assets (fonts, hero video, posters)
├── supabase/              ← migrations for the leads table
├── design/                ← brand spec, client work, design templates [PRIVATE]
└── social/                ← Instagram/LinkedIn/TikTok content production [PRIVATE]
```

---

## Brand at a glance (every mode shares this)

**Studio:** Onyx Creative Asia — independent studio building brands, performance marketing, and AI systems for ambitious teams across Asia.

**Locations:** Bali, Indonesia.

**4 disciplines, one team:** Web Development · Paid Media · Social Media · AI Systems.

**Tagline:** *Brand, performance, and AI systems for ambitious teams.*

**Position:** small studio, opinionated, no hand-offs, ships fast.

| Token | Value |
|---|---|
| Color — Ink | `#0E0E0E` |
| Color — Bone | `#F4F1EC` |
| Type | Neue Montreal (Light · Regular · Medium · Bold + italics) |
| Aesthetic | Monochrome Y2K editorial — "Black Box" (see `design/brand/PHILOSOPHY.md`) |
| Motion | 150–400ms UI; 800–1200ms section reveals; out-expo / out-quart / in-out-quart |

Full specs in `design/brand/COLORS.md`, `TYPOGRAPHY.md`, `VOICE.md`, `MOTION.md`, `PHILOSOPHY.md`.

---

## Web code — quick reference

- **Stack:** Next.js 15 (App Router, Turbopack) · TypeScript · Tailwind CSS · Framer Motion · Lenis · Supabase.
- **Live URL:** https://onyxcreative.asia (Vercel auto-deploy from `main` branch on GitHub).
- **Design tokens (single source of truth for engineering):** `tailwind.config.ts`.
- **Project data (case studies):** `src/lib/data.ts`.
- **Hero video:** `public/videos/hero.mp4` (with `.webm` + `.webp` poster fallbacks).
- **Local dev:** `npm run dev` → http://localhost:3000.
- **Auto-push:** the `origin` remote has an embedded fine-grained PAT, so `git push` from this session works without prompts. Don't print the URL via `git remote -v` (token leaks).

When you change a brand token in code, also update the matching markdown file in `design/brand/` so the design and engineering sides don't drift.

---

## Design mode — quick reference

See `design/CLAUDE.md` for full guidance.

You're in design mode when the deliverable is **non-code** (PDF, deck, brand book, client brief, Figma file, brand asset export). Work happens inside `design/`.

The `design/` folder is gitignored. To version-control it, use a separate **private** repo or local-only workflow.

When a design has to ship to the website (e.g. new hero variant, updated palette token, new project image):

1. Export from `design/` to the right path under `public/` or `src/`.
2. Update the markdown spec in `design/brand/` if the tokens shifted.
3. Commit + push the code change. (Auto-push ✓.)

---

## Social mode — quick reference

See `social/CLAUDE.md` for full guidance.

You're in social mode when producing **scheduled content** for IG / LinkedIn / TikTok / X. Each campaign or weekly batch lives under `social/<platform>/<campaign-slug>/`.

The visual system is the same as the website (Black Box monochrome). Use brand assets from `design/brand/assets/` and tools (Python renderer, Remotion templates) from `social/_tools/`.

Don't post directly from this session — posts get exported here, the user schedules manually (or via a scheduler tool).

---

## Hand-off rules between modes

| From → To | What changes hands |
|---|---|
| Design → Code | Asset paths in `public/`, token changes in `tailwind.config.ts`, copy in `src/lib/data.ts` |
| Code → Design | Live spec changes (new color, new motion, new copy) → mirror in `design/brand/` |
| Design → Social | Brand assets exported to `design/brand/assets/` get pulled into `social/<platform>/<campaign>/` |
| Social → Design | Visual experiments that prove durable → fold into `design/brand/` (e.g. new title-card pattern) |

Treat these handoffs as small, deliberate diffs — not "do everything at once."

---

## Skills you should use, by mode

| Mode | Skill | When |
|---|---|---|
| Code | (none specific — engineering only) | All `src/` work |
| Design | `anthropic-skills:canvas-design` | Static art, posters, brand spec mockups |
| Design | `anthropic-skills:pptx` | Pitch decks, capabilities decks |
| Design | `anthropic-skills:docx` | Proposals, brand books, scoping |
| Design | `anthropic-skills:pdf` | Final deliverable PDFs (brand books, case studies) |
| Design | `anthropic-skills:web-artifacts-builder` | HTML mockups before code-session |
| Social | `anthropic-skills:canvas-design` | One-off post art |
| Social | `anthropic-skills:slack-gif-creator` | Animated teases, story loops |
| Social | `anthropic-skills:algorithmic-art` | Generative covers (use sparingly) |
| Any | `anthropic-skills:theme-factory` | Apply Onyx tokens to artifacts |

Pick the simplest skill that fits the deliverable. Don't over-engineer.

---

## Things to never do

- ❌ Commit anything from `/design/` or `/social/` to the public GitHub repo. The `.gitignore` enforces this — don't override with `git add -f`.
- ❌ Print the contents of `.git/config` (contains the embedded GitHub token).
- ❌ Push design files to the public site's `public/` folder unless they're meant to be public-facing assets.
- ❌ Invent new colors, type cuts, or motion tokens without first writing them into `design/brand/`.
- ❌ Tell the user "switch sessions for this" — this *is* the merged session. Just switch modes.
