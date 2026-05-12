import Link from "next/link";
import {
  bboxOf,
  GRID,
  NODE_H,
  NODE_W,
  type FlowEdge,
  type FlowGraph,
  type FlowNode,
} from "@/lib/flow-graphs";

/**
 * n8n-style SVG canvas. Renders one flow graph at a time:
 *   - Grid dot background
 *   - Rounded-rect nodes with a colored glyph chip on the left
 *   - Bezier curve edges between nodes with arrowheads
 *   - Optional mid-edge labels (for branch decisions)
 *
 * Server component — pure SVG, no client JS. Phase 3 swaps this for a
 * React Flow editor; the graph data structure is intentionally similar.
 */
export default function FlowCanvas({ graph }: { graph: FlowGraph }) {
  const bbox = bboxOf(graph);
  const nodeById = Object.fromEntries(graph.nodes.map((n) => [n.id, n]));

  return (
    <div className="border border-bone/15 bg-[#0A0A0A] overflow-hidden">
      <svg
        viewBox={`${bbox.x} ${bbox.y} ${bbox.w} ${bbox.h}`}
        className="w-full h-auto block"
        style={{ minHeight: 400 }}
        role="img"
        aria-label={`Flow graph: ${graph.name}`}
      >
        <defs>
          {/* dot grid pattern */}
          <pattern
            id={`dots-${graph.slug}`}
            x={0}
            y={0}
            width={GRID}
            height={GRID}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={1} cy={1} r={0.7} fill="#F4F1EC" fillOpacity={0.08} />
          </pattern>

          {/* arrowhead */}
          <marker
            id={`arrow-${graph.slug}`}
            viewBox="0 0 10 10"
            refX={9}
            refY={5}
            markerWidth={6}
            markerHeight={6}
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#F4F1EC" fillOpacity={0.7} />
          </marker>
        </defs>

        {/* background dot grid */}
        <rect
          x={bbox.x}
          y={bbox.y}
          width={bbox.w}
          height={bbox.h}
          fill={`url(#dots-${graph.slug})`}
        />

        {/* edges first so nodes sit on top */}
        {graph.edges.map((e) => (
          <EdgePath
            key={`${e.from}-${e.to}`}
            edge={e}
            from={nodeById[e.from]}
            to={nodeById[e.to]}
            markerId={`arrow-${graph.slug}`}
          />
        ))}

        {/* nodes */}
        {graph.nodes.map((n) => (
          <Node key={n.id} node={n} />
        ))}
      </svg>
    </div>
  );
}

/* ============================================================
 * NODE
 * ============================================================ */

const NODE_PALETTE: Record<FlowNode["kind"], { chip: string; text: string }> = {
  trigger: { chip: "#FBBF24", text: "#0A0A0A" }, // amber
  agent: { chip: "#F4F1EC", text: "#0A0A0A" }, // bone
  action: { chip: "#60A5FA", text: "#0A0A0A" }, // sky
  branch: { chip: "#A78BFA", text: "#0A0A0A" }, // violet
  output: { chip: "#34D399", text: "#0A0A0A" }, // emerald
};

const KIND_LABEL: Record<FlowNode["kind"], string> = {
  trigger: "TRIGGER",
  agent: "AGENT",
  action: "ACTION",
  branch: "BRANCH",
  output: "OUTPUT",
};

function Node({ node }: { node: FlowNode }) {
  const palette = NODE_PALETTE[node.kind];
  const chipW = 56;
  const isLinked = node.kind === "agent" && node.agentSlug;
  const inner = (
    <g>
      {/* outer rounded card */}
      <rect
        x={node.x}
        y={node.y}
        width={NODE_W}
        height={NODE_H}
        rx={8}
        ry={8}
        fill="#0E0E0E"
        stroke="#F4F1EC"
        strokeOpacity={0.2}
        strokeWidth={1}
      />

      {/* colored chip on left */}
      <rect
        x={node.x}
        y={node.y}
        width={chipW}
        height={NODE_H}
        rx={8}
        ry={8}
        fill={palette.chip}
      />
      {/* hide the right side of the chip's rounded corner by overpainting */}
      <rect
        x={node.x + chipW - 8}
        y={node.y}
        width={8}
        height={NODE_H}
        fill={palette.chip}
      />

      {/* glyph in chip */}
      <text
        x={node.x + chipW / 2}
        y={node.y + NODE_H / 2 + 6}
        fill={palette.text}
        fontSize={18}
        fontWeight={700}
        textAnchor="middle"
        fontFamily="ui-monospace, SFMono-Regular, monospace"
      >
        {node.glyph ?? "·"}
      </text>

      {/* kind ribbon (tiny tag inside the card, top-right) */}
      <text
        x={node.x + NODE_W - 12}
        y={node.y + 16}
        fill="#F4F1EC"
        fillOpacity={0.45}
        fontSize={8}
        textAnchor="end"
        letterSpacing={1.6}
        fontFamily="ui-monospace, SFMono-Regular, monospace"
      >
        {KIND_LABEL[node.kind]}
      </text>

      {/* title */}
      <text
        x={node.x + chipW + 12}
        y={node.y + 32}
        fill="#F4F1EC"
        fontSize={13}
        fontWeight={600}
      >
        {truncate(node.title, 22)}
      </text>

      {/* subtitle */}
      {node.subtitle && (
        <text
          x={node.x + chipW + 12}
          y={node.y + 50}
          fill="#F4F1EC"
          fillOpacity={0.6}
          fontSize={11}
          fontStyle="italic"
        >
          {truncate(node.subtitle, 26)}
        </text>
      )}

      {/* connection dots — left (input) + right (output) */}
      <circle
        cx={node.x}
        cy={node.y + NODE_H / 2}
        r={4}
        fill="#0E0E0E"
        stroke="#F4F1EC"
        strokeOpacity={0.5}
        strokeWidth={1.5}
      />
      <circle
        cx={node.x + NODE_W}
        cy={node.y + NODE_H / 2}
        r={4}
        fill="#0E0E0E"
        stroke="#F4F1EC"
        strokeOpacity={0.5}
        strokeWidth={1.5}
      />
    </g>
  );

  if (isLinked) {
    return (
      <Link href={`/agents/${node.agentSlug}`}>
        <g className="hover:opacity-90 transition-opacity cursor-pointer">
          {inner}
        </g>
      </Link>
    );
  }
  return inner;
}

/* ============================================================
 * EDGE
 * ============================================================ */

function EdgePath({
  edge,
  from,
  to,
  markerId,
}: {
  edge: FlowEdge;
  from: FlowNode | undefined;
  to: FlowNode | undefined;
  markerId: string;
}) {
  if (!from || !to) return null;

  // start at the right-middle of `from`, end at the left-middle of `to`
  const x1 = from.x + NODE_W;
  const y1 = from.y + NODE_H / 2;
  const x2 = to.x;
  const y2 = to.y + NODE_H / 2;

  // bezier control points — pull horizontally for a smooth S-curve
  const dx = Math.max(60, Math.abs(x2 - x1) / 2);
  const c1x = x1 + dx;
  const c1y = y1;
  const c2x = x2 - dx;
  const c2y = y2;

  const path = `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;

  // midpoint for label placement (on the bezier — approximate by averaging)
  const midX = (x1 + c1x + c2x + x2) / 4;
  const midY = (y1 + c1y + c2y + y2) / 4;

  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke="#F4F1EC"
        strokeOpacity={0.45}
        strokeWidth={1.5}
        markerEnd={`url(#${markerId})`}
      />
      {edge.label && (
        <g>
          {/* label background pill */}
          <rect
            x={midX - edge.label.length * 3.5 - 8}
            y={midY - 11}
            width={edge.label.length * 7 + 16}
            height={20}
            rx={10}
            ry={10}
            fill="#0E0E0E"
            stroke="#F4F1EC"
            strokeOpacity={0.25}
            strokeWidth={1}
          />
          <text
            x={midX}
            y={midY + 3}
            fill="#F4F1EC"
            fillOpacity={0.85}
            fontSize={10}
            textAnchor="middle"
            letterSpacing={1.2}
            fontFamily="ui-monospace, SFMono-Regular, monospace"
          >
            {edge.label.toUpperCase()}
          </text>
        </g>
      )}
    </g>
  );
}

/* ============================================================
 * helpers
 * ============================================================ */

function truncate(s: string, n: number) {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + "…";
}
