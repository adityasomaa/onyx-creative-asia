import Link from "next/link";
import PageHeader from "../_components/PageHeader";
import FlowCanvas from "../_components/FlowCanvas";
import { listFlows, TRIGGER_LABEL } from "@/lib/db/flows";
import { FLOW_GRAPHS, getFlowGraph } from "@/lib/flow-graphs";

export const dynamic = "force-dynamic";

export default async function FlowPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const sp = await searchParams;

  const flows = await listFlows();

  // If DB is empty (no migrations run yet), fall back to the hardcoded
  // flow-graphs registry so the canvas still demos.
  const flowList =
    flows.length > 0
      ? flows
      : Object.values(FLOW_GRAPHS).map((g) => ({
          id: g.slug,
          slug: g.slug,
          name: g.name,
          description: g.description,
          trigger_kind:
            g.slug === "inbound-triage"
              ? "submission.new"
              : g.slug === "weekly-status"
                ? "cron.weekly"
                : "cron.weekly",
          enabled: false,
          last_run_at: null as string | null,
        }));

  const activeSlug = sp.slug ?? flowList[0]?.slug ?? "inbound-triage";
  const active = flowList.find((f) => f.slug === activeSlug) ?? flowList[0];
  const activeGraph = active ? getFlowGraph(active.slug) : null;

  return (
    <>
      <PageHeader
        kicker="GRAPH"
        title="Flows"
        count={`${flowList.length}`}
        actions={
          active && (
            <span
              className={`inline-block border rounded-sm px-2 py-1 text-[10px] tracking-[0.18em] uppercase ${
                active.enabled
                  ? "border-emerald-400/70 text-emerald-300"
                  : "border-bone/25 opacity-65"
              }`}
            >
              {active.enabled ? "Enabled" : "Disabled"}
            </span>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] min-h-[calc(100vh-200px)]">
        {/* SIDEBAR: flow list */}
        <aside className="border-b lg:border-b-0 lg:border-r border-bone/10 bg-bone/[0.015]">
          <div className="px-4 py-3 border-b border-bone/10">
            <p className="text-[10px] tracking-[0.22em] uppercase opacity-55">
              Registry
            </p>
          </div>
          <ul className="divide-y divide-bone/10">
            {flowList.map((f) => {
              const isActive = f.slug === active?.slug;
              return (
                <li key={f.id}>
                  <Link
                    href={`/agents/flow?slug=${f.slug}`}
                    className={`block px-4 py-3 transition-colors ${
                      isActive ? "bg-bone/[0.04]" : "hover:bg-bone/[0.025]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium tracking-tight">
                        {f.name}
                      </p>
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full ${
                          f.enabled ? "bg-emerald-400" : "bg-bone/30"
                        }`}
                      />
                    </div>
                    <p className="text-[10px] tracking-[0.15em] uppercase opacity-50 mb-1.5 font-mono">
                      {f.slug}
                    </p>
                    <p className="text-[10px] tracking-[0.15em] uppercase opacity-55">
                      {TRIGGER_LABEL[f.trigger_kind] ?? f.trigger_kind}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="px-4 py-3 border-t border-bone/10 mt-auto">
            <p className="text-[10px] tracking-[0.18em] uppercase opacity-40 leading-relaxed">
              Read-only in Phase 1. Editing arrives in Phase 3 — code-only
              for now (edit src/lib/flow-graphs.ts).
            </p>
          </div>
        </aside>

        {/* CANVAS */}
        <main className="min-w-0">
          {active && activeGraph ? (
            <>
              {/* trigger bar above canvas */}
              <div className="border-b border-bone/10 px-6 py-3 flex flex-wrap items-center gap-3 text-[11px]">
                <span className="text-[10px] tracking-[0.22em] uppercase opacity-55">
                  Trigger
                </span>
                <code className="font-mono opacity-90">
                  {active.trigger_kind}
                </code>
                <span className="opacity-50 italic">
                  · {TRIGGER_LABEL[active.trigger_kind] ?? active.trigger_kind}
                </span>
                <span className="ml-auto opacity-50 text-[10px] tracking-[0.15em] uppercase">
                  {activeGraph.nodes.length} nodes · {activeGraph.edges.length} edges
                </span>
              </div>

              {/* description */}
              {active.description && (
                <div className="px-6 py-3 border-b border-bone/10 text-sm opacity-80 italic max-w-3xl">
                  {active.description}
                </div>
              )}

              {/* CANVAS — the n8n-style flow */}
              <div className="p-3 md:p-4">
                <FlowCanvas graph={activeGraph} />
              </div>

              {/* node-kind legend */}
              <div className="px-6 py-3 border-t border-bone/10 flex flex-wrap gap-3 text-[10px] tracking-[0.18em] uppercase opacity-70">
                <Legend color="#FBBF24" label="Trigger" />
                <Legend color="#F4F1EC" label="Agent" />
                <Legend color="#60A5FA" label="Action" />
                <Legend color="#A78BFA" label="Branch" />
                <Legend color="#34D399" label="Output" />
              </div>
            </>
          ) : (
            <div className="p-10 text-sm italic opacity-55">
              No flow selected or graph definition missing for{" "}
              <code>{active?.slug ?? "—"}</code>. Add one in{" "}
              <code>src/lib/flow-graphs.ts</code>.
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block w-2.5 h-2.5 rounded-sm"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
