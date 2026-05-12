import Link from "next/link";
import PageHeader from "./_components/PageHeader";
import {
  listAgents,
  listActiveProjects,
  listRecentActivity,
  type DashboardActivity,
} from "@/lib/db/agents";
import type { Agent } from "@/lib/agents";

const TIME_FMT = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  day: "2-digit",
  month: "short",
});

export const dynamic = "force-dynamic";

export default async function AgentsDashboard() {
  const [agents, activeProjects, activity] = await Promise.all([
    listAgents(),
    listActiveProjects(),
    listRecentActivity(8),
  ]);

  return (
    <>
      <PageHeader
        kicker="ROSTER"
        title="Agents"
        count={`${agents.length} active`}
        actions={
          <Link
            href="/agents/flow"
            className="px-3 py-1.5 border border-bone/30 hover:border-bone/60 transition-colors"
          >
            View flow →
          </Link>
        }
      />

      <div className="px-6 md:px-10 py-6 md:py-8 space-y-10">
        {/* ROSTER GRID */}
        <section>
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-bone/10 border border-bone/15">
            {agents.map((a) => (
              <li key={a.slug} className="bg-ink">
                <Link
                  href={`/agents/${a.slug}`}
                  className="block p-5 group hover:bg-bone/5 transition-colors h-full"
                >
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-2xl font-bold tracking-tight tabular-nums">
                      {a.number}
                    </span>
                    <StatusPill status={a.status} />
                  </div>
                  <div className="text-lg font-medium tracking-tight leading-tight">
                    {a.name}
                  </div>
                  <p className="mt-1 text-xs opacity-70 leading-snug line-clamp-2">
                    {a.role}
                  </p>
                  {a.currentTask && (
                    <p className="mt-3 text-[10px] tracking-[0.18em] uppercase opacity-75 border-l border-emerald-400 pl-2">
                      {a.currentTask}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-1">
                    {a.tools.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[9px] tracking-wider uppercase opacity-55 border border-bone/20 rounded px-1.5 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                    {a.tools.length > 3 && (
                      <span className="text-[9px] tracking-wider uppercase opacity-40">
                        +{a.tools.length - 3}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ACTIVE WORK */}
        <section>
          <SectionHead label="Active work" tail={`${activeProjects.length} in flight`} />
          {activeProjects.length === 0 ? (
            <EmptyRow label="No active projects." />
          ) : (
            <DataTable
              cols={["#", "Project", "Client", "Owner", "Status"]}
              rows={activeProjects.map((p, i) => {
                const owner = agents.find((a) => a.slug === p.ownerSlug);
                return [
                  <span key="i" className="text-[11px] tabular-nums opacity-50">
                    {String(i + 1).padStart(2, "0")}
                  </span>,
                  <span key="t" className="font-medium">{p.title}</span>,
                  <span key="c" className="opacity-75">{p.client}</span>,
                  <Link
                    key="o"
                    href={`/agents/${p.ownerSlug}`}
                    className="hover:opacity-70 transition-opacity"
                  >
                    {owner?.name ?? p.ownerSlug}
                  </Link>,
                  <span key="s" className="text-xs">
                    {p.status}
                    {p.nextMilestone && (
                      <span className="ml-2 opacity-50 italic">
                        · {p.nextMilestone}
                      </span>
                    )}
                  </span>,
                ];
              })}
            />
          )}
        </section>

        {/* ACTIVITY */}
        <section>
          <SectionHead label="Recent activity" tail={`last ${activity.length}`} />
          {activity.length === 0 ? (
            <EmptyRow label="No recent runs." />
          ) : (
            <ul className="border border-bone/15 divide-y divide-bone/10">
              {activity.map((e: DashboardActivity) => {
                const agent = agents.find((a: Agent) => a.slug === e.agentSlug);
                return (
                  <li
                    key={e.id}
                    className="px-4 py-3 grid grid-cols-12 gap-3 items-center text-sm"
                  >
                    <span className="col-span-3 md:col-span-2 text-[10px] tracking-[0.15em] uppercase opacity-55 tabular-nums">
                      {TIME_FMT.format(new Date(e.at))}
                    </span>
                    <Link
                      href={`/agents/${e.agentSlug}`}
                      className="col-span-3 md:col-span-2 text-[10px] tracking-[0.18em] uppercase hover:opacity-70 transition-opacity"
                    >
                      {agent?.name ?? e.agentSlug}
                    </Link>
                    <span className="col-span-12 md:col-span-8 opacity-90 leading-snug">
                      {e.description}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

/* ---------- shared bits ---------- */

function SectionHead({ label, tail }: { label: string; tail?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-3">
      <p className="text-[10px] tracking-[0.22em] uppercase opacity-65">
        {label}
      </p>
      {tail && (
        <p className="text-[10px] tracking-[0.18em] uppercase opacity-40">
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
    <span className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase opacity-70">
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${color}`} />
      {status}
    </span>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div className="border border-bone/15 px-4 py-6 text-sm italic opacity-55">
      {label}
    </div>
  );
}

function DataTable({
  cols,
  rows,
}: {
  cols: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="border border-bone/15 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-bone/15 bg-bone/[0.02]">
            {cols.map((c) => (
              <th
                key={c}
                className="px-4 py-2.5 text-left text-[10px] tracking-[0.18em] uppercase font-normal opacity-60"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className="border-b border-bone/10 last:border-b-0 hover:bg-bone/[0.03] transition-colors"
            >
              {r.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-middle">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
