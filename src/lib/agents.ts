/**
 * The Onyx automation roster.
 *
 * Each agent is a defined role with a persona, tools, and handoffs. The
 * dashboard at agents.onyxcreative.asia visualises this data. In Fase 2
 * (per docs/AGENTS.md), this same shape will be hydrated from
 * .claude/agents/<slug>.md frontmatter so the source of truth lives next
 * to the agent definitions Claude Code reads.
 */

export type AgentStatus = "idle" | "working" | "blocked";

export type Agent = {
  slug: string;
  /** Display name. */
  name: string;
  /** One-line job description (shown on the card). */
  role: string;
  /** Number badge — convention: 01 director, 02 strategist, … */
  number: string;
  /** Persona-defining single sentence (shown on detail). */
  manifesto: string;
  /** What this agent replaces in a traditional agency org chart. */
  replaces: string;
  /** Tools the agent is allowed to use (Claude Code tools + MCPs). */
  tools: string[];
  /** Which agents this one routes work to / receives from. */
  handsOffTo: string[];
  /** Long-form charter — multiple paragraphs. */
  charter: string[];
  /** Current status — driven by the orchestrator in production. */
  status: AgentStatus;
  /** Current task summary, when status === "working". */
  currentTask?: string;
};

export const AGENTS: Agent[] = [
  {
    slug: "director",
    name: "Director",
    role: "Routes inbound briefs · decomposes work · keeps the project ledger",
    number: "01",
    manifesto:
      "First contact for every brief. Reads the room, decides who picks it up, and never lets a project drop between disciplines.",
    replaces: "Founder · Project Manager · Account Director",
    tools: ["TodoWrite", "Read", "Write", "WebSearch", "WebFetch", "Task (sub-agents)"],
    handsOffTo: ["strategist", "maker", "account-manager"],
    charter: [
      "Every inbound brief — whether it arrives via WhatsApp, email, or the contact form — lands here first. The Director reads the brief in full, classifies it by discipline mix, urgency, and fit, then routes it to the right specialist.",
      "Maintains `_planner/active.md` as the single source of truth for in-flight projects. Tags each project with current owner, status, and next handoff.",
      "Refuses out-of-fit work directly. A brief that needs five disciplines in two weeks doesn't get a discount — it gets a friendly no, with a referral when possible.",
    ],
    status: "idle",
  },
  {
    slug: "strategist",
    name: "Strategist",
    role: "Scopes briefs · writes proposals · plans timelines",
    number: "02",
    manifesto:
      "Translates a vague brief into a one-page scope and an honest timeline. Won't quote without naming the constraint.",
    replaces: "Senior Strategist · Producer",
    tools: ["Read", "Write", "Edit", "WebSearch", "Glob", "Grep"],
    handsOffTo: ["maker", "account-manager"],
    charter: [
      "Receives the routed brief from the Director. Reads /design/clients/_template/ for scope conventions and any past projects in the same vertical.",
      "Produces three artifacts per brief: `scope.md` (one page, no more), `timeline.md` (mermaid gantt), and `quote.md` (numbered phases with cost band in USD).",
      "Pushes back on briefs that won't fit the timeline before they reach the maker. Better a hard conversation now than a missed deadline later.",
    ],
    status: "idle",
  },
  {
    slug: "maker",
    name: "Maker",
    role: "Designs · builds · ships — combined craft role",
    number: "03",
    manifesto:
      "The studio's hand. Designs in Figma/Stitch, codes in Next.js, renders motion in Remotion, and treats every export as final.",
    replaces: "Designer · Developer · Motion Designer",
    tools: [
      "Read", "Write", "Edit", "Bash", "Glob", "Grep",
      "render.py · Remotion · Stitch MCP · GitHub MCP",
    ],
    handsOffTo: ["account-manager"],
    charter: [
      "Picks up scoped work from the Strategist. Reads the brand spec at design/brand/ before any pixel is drawn or any line of code is written.",
      "Ships in the same Black Box visual language across surfaces — web, social, motion. The discipline boundary between design and dev is internal; the client never feels the seam.",
      "Auto-pushes commits to the production repo on completion. No staging environment that goes stale.",
    ],
    status: "idle",
  },
  // Note: removed the previous "working" status + currentTask demo on the
  // Maker. All four agents start idle; real status will come from the
  // runtime once Phase 4 (autonomous runs) ships.
  {
    slug: "account-manager",
    name: "Account Manager",
    role: "Client comms · status updates · invoicing · follow-ups",
    number: "04",
    manifesto:
      "The voice the client hears between the kickoff and the launch. Writes like the brand — same restraint, same care.",
    replaces: "Account Manager · Customer Success",
    tools: ["Gmail MCP", "Drive MCP", "Read", "Write", "Edit"],
    handsOffTo: ["director"],
    charter: [
      "Drafts confirmation emails when a new project is approved, weekly status updates while it's in flight, and the final handoff doc when it ships.",
      "Monitors inbound replies for tone — flags anything that sounds like a concern to the Director, not the Maker (so production keeps focus).",
      "Owns the invoicing rhythm. 50% on signature, 50% on ship, no exceptions for projects under $5k.",
    ],
    status: "idle",
  },
];

export function findAgent(slug: string): Agent | undefined {
  return AGENTS.find((a) => a.slug === slug);
}

/* ---------- transactional fallbacks — empty by default ----------
 *
 * These constants only fire when src/lib/db/agents.ts can't talk to
 * Supabase (preview deploys without env vars, dev without .env.local).
 * Once the DB is reachable, the real `projects` + `agent_runs` tables
 * are the source of truth and these are never read.
 *
 * Kept as empty arrays so the dashboard renders consistent
 * "No active projects" / "No recent runs" empty states either way —
 * no more demo rows showing up in production.
 */

export type ActiveProject = {
  id: string;
  title: string;
  client: string;
  ownerSlug: string;
  status: string;
  startedAt: string;
  nextMilestone?: string;
};

export const ACTIVE_PROJECTS: ActiveProject[] = [];

export type ActivityEvent = {
  id: string;
  at: string; // ISO
  agentSlug: string;
  description: string;
};

export const ACTIVITY: ActivityEvent[] = [];
