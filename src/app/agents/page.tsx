import Link from "next/link";
import { AGENTS, ACTIVE_PROJECTS, ACTIVITY, findAgent } from "@/lib/agents";

const TIME_FMT = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  day: "2-digit",
  month: "short",
});

export default function AgentsDashboard() {
  return (
    <div className="px-6 md:px-10 py-12 md:py-16 space-y-20 md:space-y-28">
      {/* HERO */}
      <section>
        <p className="text-[11px] tracking-[0.3em] uppercase opacity-55 mb-5">
          [ ROSTER.SYS · 04 / 04 ]
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.9]">
          The automation
          <br />
          <span className="font-light italic">layer of the studio.</span>
        </h1>
        <p className="mt-8 text-base md:text-lg opacity-75 max-w-xl leading-relaxed">
          Four agents act as the studio's first line of work — routing
          briefs, scoping projects, making the assets, and keeping the
          client informed. Manually invoked from Claude Code today.
          Autonomous tomorrow.
        </p>
      </section>

      {/* ROSTER */}
      <section>
        <SectionHead label="ROSTER" tail={`${AGENTS.length} agents`} />
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-px bg-bone/10 border border-bone/15">
          {AGENTS.map((a) => (
            <li key={a.slug} className="bg-ink">
              <Link
                href={`/agents/${a.slug}`}
                className="block p-7 md:p-9 group hover:bg-bone/5 transition-colors"
              >
                <div className="flex items-baseline justify-between mb-6">
                  <span className="text-4xl font-bold tracking-tight">
                    {a.number}
                  </span>
                  <StatusPill status={a.status} />
                </div>
                <div className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                  {a.name}
                </div>
                <p className="mt-2 text-sm italic font-light opacity-75 leading-relaxed">
                  {a.role}
                </p>
                {a.currentTask && (
                  <p className="mt-4 text-[11px] tracking-[0.2em] uppercase opacity-70 border-l border-emerald-400 pl-3">
                    Currently · {a.currentTask}
                  </p>
                )}
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {a.tools.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] tracking-wider uppercase opacity-60 border border-bone/25 rounded px-1.5 py-0.5"
                    >
                      {t}
                    </span>
                  ))}
                  {a.tools.length > 4 && (
                    <span className="text-[10px] tracking-wider uppercase opacity-50">
                      + {a.tools.length - 4}
                    </span>
                  )}
                </div>
                <p className="mt-6 text-[11px] tracking-[0.2em] uppercase opacity-50 flex items-center gap-2">
                  Open detail
                  <span
                    aria-hidden
                    className="transition-transform duration-500 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* FLOW */}
      <section>
        <SectionHead label="FLOW" tail="brief → ship" />
        <FlowDiagram />
      </section>

      {/* ACTIVE WORK */}
      <section>
        <SectionHead label="ACTIVE WORK" tail={`${ACTIVE_PROJECTS.length} in flight`} />
        <ul className="border-t border-bone/15">
          {ACTIVE_PROJECTS.map((p, i) => {
            const owner = findAgent(p.ownerSlug);
            return (
              <li
                key={p.id}
                className="border-b border-bone/15 py-6 md:py-7 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-start"
              >
                <span className="md:col-span-1 text-xs tabular-nums opacity-50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="md:col-span-5">
                  <p className="text-lg md:text-xl font-medium tracking-tight leading-tight">
                    {p.title}
                  </p>
                  <p className="text-[11px] tracking-[0.18em] uppercase opacity-60 mt-1">
                    {p.client}
                  </p>
                </div>
                <div className="md:col-span-3 text-sm">
                  <p className="text-[11px] tracking-[0.18em] uppercase opacity-55 mb-1">
                    Owner
                  </p>
                  <Link
                    href={`/agents/${p.ownerSlug}`}
                    className="hover:opacity-70 transition-opacity"
                  >
                    {owner?.name ?? p.ownerSlug}
                  </Link>
                </div>
                <div className="md:col-span-3 text-sm">
                  <p className="text-[11px] tracking-[0.18em] uppercase opacity-55 mb-1">
                    Status
                  </p>
                  <p>{p.status}</p>
                  {p.nextMilestone && (
                    <p className="text-[11px] opacity-60 mt-1 italic">
                      {p.nextMilestone}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ACTIVITY */}
      <section>
        <SectionHead label="RECENT ACTIVITY" tail={`last ${ACTIVITY.length}`} />
        <ul className="border-t border-bone/15">
          {ACTIVITY.map((e) => {
            const agent = findAgent(e.agentSlug);
            return (
              <li
                key={e.id}
                className="border-b border-bone/15 py-4 grid grid-cols-12 gap-4 items-baseline"
              >
                <span className="col-span-3 md:col-span-2 text-[11px] tracking-[0.15em] uppercase opacity-60 tabular-nums">
                  {TIME_FMT.format(new Date(e.at))}
                </span>
                <span className="col-span-3 md:col-span-2 text-[11px] tracking-[0.18em] uppercase">
                  <Link
                    href={`/agents/${e.agentSlug}`}
                    className="hover:opacity-70 transition-opacity"
                  >
                    {agent?.name ?? e.agentSlug}
                  </Link>
                </span>
                <span className="col-span-12 md:col-span-8 text-sm md:text-base leading-relaxed">
                  {e.description}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function SectionHead({ label, tail }: { label: string; tail?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-6 md:mb-8">
      <p className="text-[11px] tracking-[0.3em] uppercase opacity-65">
        // {label}
      </p>
      {tail && (
        <p className="text-[11px] tracking-[0.2em] uppercase opacity-50">
          {tail}
        </p>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: "idle" | "working" | "blocked" }) {
  const color =
    status === "working"
      ? "bg-emerald-400"
      : status === "blocked"
        ? "bg-red-400"
        : "bg-bone/40";
  return (
    <span className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase opacity-75">
      <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
      {status}
    </span>
  );
}

/**
 * Flow diagram — inline SVG, brand-styled.
 * Visualises how an inbound brief moves through the agent system.
 */
function FlowDiagram() {
  return (
    <div className="border border-bone/15 p-6 md:p-10 bg-bone/[0.03]">
      <svg
        viewBox="0 0 1200 480"
        className="w-full h-auto"
        role="img"
        aria-label="Agent flow: inbound → director → strategist + account manager → maker → ship"
      >
        {/* node helper inline */}
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#F4F1EC" opacity="0.8" />
          </marker>
        </defs>

        {/* INBOUND */}
        <FlowNode x={20} y={195} w={180} h={90} number="00" label="INBOUND" sub="email · wa · form" muted />

        {/* DIRECTOR */}
        <FlowNode x={260} y={195} w={180} h={90} number="01" label="DIRECTOR" sub="route + tag" />

        {/* STRATEGIST (top) */}
        <FlowNode x={500} y={75} w={180} h={90} number="02" label="STRATEGIST" sub="scope + plan" />

        {/* ACCOUNT MANAGER (bottom) */}
        <FlowNode x={500} y={315} w={180} h={90} number="04" label="ACCOUNT MGR" sub="comms + ops" />

        {/* MAKER */}
        <FlowNode x={740} y={195} w={180} h={90} number="03" label="MAKER" sub="design · code · motion" />

        {/* SHIP */}
        <FlowNode x={980} y={195} w={180} h={90} number="✓" label="SHIP" sub="github · drive · live" muted />

        {/* edges */}
        <FlowEdge from={{ x: 200, y: 240 }} to={{ x: 260, y: 240 }} />
        <FlowEdge from={{ x: 440, y: 220 }} to={{ x: 500, y: 130 }} />
        <FlowEdge from={{ x: 440, y: 260 }} to={{ x: 500, y: 360 }} />
        <FlowEdge from={{ x: 680, y: 130 }} to={{ x: 740, y: 220 }} />
        <FlowEdge from={{ x: 680, y: 360 }} to={{ x: 740, y: 260 }} />
        <FlowEdge from={{ x: 920, y: 240 }} to={{ x: 980, y: 240 }} />

        {/* loop-back from Account Mgr to Director */}
        <path
          d="M 590 405 Q 590 460 350 460 Q 290 460 290 320 Q 290 295 290 285"
          fill="none"
          stroke="#F4F1EC"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          markerEnd="url(#arrow)"
        />
        <text x={400} y={455} fill="#F4F1EC" fillOpacity="0.55" fontSize="11" letterSpacing="2">
          STATUS LOOP · WEEKLY
        </text>
      </svg>

      <p className="mt-6 text-xs md:text-sm opacity-65 italic leading-relaxed max-w-2xl">
        Director triages every brief and assigns ownership. Strategist
        scopes; Account Manager opens the relationship. Maker carries
        production. Status loops back to the Director weekly for the
        client report.
      </p>
    </div>
  );
}

function FlowNode({
  x, y, w, h, number, label, sub, muted,
}: {
  x: number; y: number; w: number; h: number;
  number: string; label: string; sub: string; muted?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={muted ? "transparent" : "#F4F1EC"}
        fillOpacity={muted ? 0 : 0.06}
        stroke="#F4F1EC"
        strokeOpacity={muted ? 0.4 : 0.85}
        strokeWidth="1.5"
        rx="4"
      />
      <text x={x + 14} y={y + 24} fill="#F4F1EC" fillOpacity="0.55" fontSize="11" letterSpacing="2">
        [ {number} ]
      </text>
      <text x={x + 14} y={y + 55} fill="#F4F1EC" fontSize="20" fontWeight="700" letterSpacing="-0.5">
        {label}
      </text>
      <text
        x={x + 14}
        y={y + 76}
        fill="#F4F1EC"
        fillOpacity="0.7"
        fontSize="12"
        fontStyle="italic"
      >
        {sub}
      </text>
    </g>
  );
}

function FlowEdge({
  from,
  to,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
}) {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke="#F4F1EC"
      strokeOpacity="0.7"
      strokeWidth="1.5"
      markerEnd="url(#arrow)"
    />
  );
}
