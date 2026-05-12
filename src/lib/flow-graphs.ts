/**
 * Hardcoded n8n-style node graphs for the seeded flows.
 *
 * Phase 1: the `flows.graph_json` column is empty, so we render flows from
 * this file instead. Each flow declares a list of nodes (positioned in
 * a virtual coordinate space) and edges (Bezier connections).
 *
 * Phase 3 will swap this for real graphs persisted in `graph_json`, edited
 * via a React Flow canvas. The shape here is intentionally close to React
 * Flow's so the migration is mostly a renderer swap, not a data swap.
 */

export type FlowNodeKind =
  | "trigger" // first node, special accent
  | "agent"   // a roster agent (director, strategist, maker, account-manager)
  | "action"  // a tool call (send email, write file, call API)
  | "branch"  // a decision point (yes/no, route by tag)
  | "output"; // terminal node (ship / done)

export type FlowNode = {
  id: string;
  kind: FlowNodeKind;
  title: string;
  subtitle?: string;
  /** Icon glyph displayed on the left chip. ASCII / unicode only. */
  glyph?: string;
  /** Optional agent slug — used to link the node to the agent detail page. */
  agentSlug?: string;
  /** Position in the virtual canvas (pixels). Top-left of the node. */
  x: number;
  y: number;
};

export type FlowEdge = {
  from: string;
  to: string;
  /** Optional label rendered mid-edge (for branch decisions). */
  label?: string;
};

export type FlowGraph = {
  slug: string;
  name: string;
  description: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
};

/* ============================================================
 * Geometry constants — exported so the renderer can match.
 * ============================================================ */

export const NODE_W = 220;
export const NODE_H = 76;
export const GRID = 16;

/* ============================================================
 * 1. INBOUND TRIAGE
 *    submission.new → Director → branch:
 *      qualified → Strategist (scope) → Account Manager (reply)
 *      quick     → Account Manager (reply)
 *      spam      → archive
 * ============================================================ */

const INBOUND_TRIAGE: FlowGraph = {
  slug: "inbound-triage",
  name: "Inbound Triage",
  description:
    "Routes every new submission. Director classifies, then hands off to Strategist (if scope needed) or straight to Account Manager (if quick reply).",
  nodes: [
    {
      id: "trigger",
      kind: "trigger",
      title: "Submission received",
      subtitle: "form · email · whatsapp",
      glyph: "⚡",
      x: 40,
      y: 200,
    },
    {
      id: "director",
      kind: "agent",
      title: "Director",
      subtitle: "classify · tag · route",
      glyph: "01",
      agentSlug: "director",
      x: 320,
      y: 200,
    },
    {
      id: "branch",
      kind: "branch",
      title: "Classify",
      subtitle: "by budget · scope · urgency",
      glyph: "?",
      x: 600,
      y: 200,
    },
    {
      id: "strategist",
      kind: "agent",
      title: "Strategist",
      subtitle: "scope · timeline · quote",
      glyph: "02",
      agentSlug: "strategist",
      x: 880,
      y: 60,
    },
    {
      id: "account-manager-1",
      kind: "agent",
      title: "Account Manager",
      subtitle: "draft reply email",
      glyph: "04",
      agentSlug: "account-manager",
      x: 880,
      y: 200,
    },
    {
      id: "archive",
      kind: "action",
      title: "Archive",
      subtitle: "mark as spam / out-of-fit",
      glyph: "✕",
      x: 880,
      y: 340,
    },
    {
      id: "account-manager-2",
      kind: "agent",
      title: "Account Manager",
      subtitle: "send proposal",
      glyph: "04",
      agentSlug: "account-manager",
      x: 1160,
      y: 60,
    },
    {
      id: "send-1",
      kind: "action",
      title: "Send email",
      subtitle: "via Gmail MCP",
      glyph: "✉",
      x: 1160,
      y: 200,
    },
    {
      id: "done",
      kind: "output",
      title: "Logged",
      subtitle: "submissions.status updated",
      glyph: "✓",
      x: 1440,
      y: 200,
    },
  ],
  edges: [
    { from: "trigger", to: "director" },
    { from: "director", to: "branch" },
    { from: "branch", to: "strategist", label: "scoping" },
    { from: "branch", to: "account-manager-1", label: "quick" },
    { from: "branch", to: "archive", label: "spam" },
    { from: "strategist", to: "account-manager-2" },
    { from: "account-manager-1", to: "send-1" },
    { from: "account-manager-2", to: "done" },
    { from: "send-1", to: "done" },
    { from: "archive", to: "done" },
  ],
};

/* ============================================================
 * 2. WEEKLY CLIENT STATUS
 *    cron Monday 9am → loop active projects → Account Manager drafts → Send
 * ============================================================ */

const WEEKLY_STATUS: FlowGraph = {
  slug: "weekly-status",
  name: "Weekly Client Status",
  description:
    "Every Monday morning, generates a status update for each active project and emails the client via the Account Manager.",
  nodes: [
    {
      id: "trigger",
      kind: "trigger",
      title: "Monday · 09:00 WITA",
      subtitle: "cron schedule",
      glyph: "⏱",
      x: 40,
      y: 180,
    },
    {
      id: "loop",
      kind: "action",
      title: "Fetch active projects",
      subtitle: "projects.stage in (in_progress, review)",
      glyph: "⇄",
      x: 320,
      y: 180,
    },
    {
      id: "account-manager",
      kind: "agent",
      title: "Account Manager",
      subtitle: "draft status email per project",
      glyph: "04",
      agentSlug: "account-manager",
      x: 620,
      y: 180,
    },
    {
      id: "send",
      kind: "action",
      title: "Send email",
      subtitle: "via Gmail MCP",
      glyph: "✉",
      x: 920,
      y: 180,
    },
    {
      id: "log",
      kind: "action",
      title: "Log run",
      subtitle: "agent_runs.insert",
      glyph: "📝",
      x: 1200,
      y: 180,
    },
    {
      id: "done",
      kind: "output",
      title: "Done",
      subtitle: "next: Monday + 7d",
      glyph: "✓",
      x: 1480,
      y: 180,
    },
  ],
  edges: [
    { from: "trigger", to: "loop" },
    { from: "loop", to: "account-manager" },
    { from: "account-manager", to: "send" },
    { from: "send", to: "log" },
    { from: "log", to: "done" },
  ],
};

/* ============================================================
 * 3. SOCIAL CONTENT CYCLE
 *    cron weekly → Maker drafts 4 posts → Render → Drive sync → Notify
 * ============================================================ */

const SOCIAL_CYCLE: FlowGraph = {
  slug: "social-cycle",
  name: "Social Content Cycle",
  description:
    "Weekly: Maker drafts 4 posts from brand voice + project brief, renders them, syncs to Drive, and notifies the approver.",
  nodes: [
    {
      id: "trigger",
      kind: "trigger",
      title: "Sunday · 18:00 WITA",
      subtitle: "weekly cron",
      glyph: "⏱",
      x: 40,
      y: 200,
    },
    {
      id: "maker-draft",
      kind: "agent",
      title: "Maker",
      subtitle: "draft 4 captions + visual brief",
      glyph: "03",
      agentSlug: "maker",
      x: 320,
      y: 200,
    },
    {
      id: "render",
      kind: "action",
      title: "render.py",
      subtitle: "carousels + stories",
      glyph: "▶",
      x: 620,
      y: 120,
    },
    {
      id: "remotion",
      kind: "action",
      title: "Remotion",
      subtitle: "animated reels",
      glyph: "▶",
      x: 620,
      y: 280,
    },
    {
      id: "drive",
      kind: "action",
      title: "Drive sync",
      subtitle: "rclone push to Onyx folder",
      glyph: "☁",
      x: 920,
      y: 200,
    },
    {
      id: "notify",
      kind: "action",
      title: "Notify approver",
      subtitle: "WhatsApp · review link",
      glyph: "✉",
      x: 1200,
      y: 200,
    },
    {
      id: "done",
      kind: "output",
      title: "Awaiting approval",
      subtitle: "blocks until ✓ from human",
      glyph: "⏸",
      x: 1480,
      y: 200,
    },
  ],
  edges: [
    { from: "trigger", to: "maker-draft" },
    { from: "maker-draft", to: "render" },
    { from: "maker-draft", to: "remotion" },
    { from: "render", to: "drive" },
    { from: "remotion", to: "drive" },
    { from: "drive", to: "notify" },
    { from: "notify", to: "done" },
  ],
};

export const FLOW_GRAPHS: Record<string, FlowGraph> = {
  "inbound-triage": INBOUND_TRIAGE,
  "weekly-status": WEEKLY_STATUS,
  "social-cycle": SOCIAL_CYCLE,
};

export function getFlowGraph(slug: string): FlowGraph | null {
  return FLOW_GRAPHS[slug] ?? null;
}

/* ============================================================
 * Bounding box helper — used by the canvas to set viewBox.
 * ============================================================ */

export function bboxOf(graph: FlowGraph) {
  const padding = 80;
  const xs = graph.nodes.map((n) => n.x);
  const ys = graph.nodes.map((n) => n.y);
  const minX = Math.min(...xs) - padding;
  const minY = Math.min(...ys) - padding;
  const maxX = Math.max(...xs) + NODE_W + padding;
  const maxY = Math.max(...ys) + NODE_H + padding;
  return {
    x: minX,
    y: minY,
    w: maxX - minX,
    h: maxY - minY,
  };
}
