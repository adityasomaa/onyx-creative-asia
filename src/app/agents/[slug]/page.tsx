import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "../_components/PageHeader";
import {
  listAgents,
  getAgentBySlug,
  listActiveProjects,
  listRecentActivity,
} from "@/lib/db/agents";

const TIME_FMT = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  day: "2-digit",
  month: "short",
});

export const dynamic = "force-dynamic";

export default async function AgentDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [agent, allAgents, activeProjects, recentActivity] = await Promise.all([
    getAgentBySlug(slug),
    listAgents(),
    listActiveProjects(),
    listRecentActivity(40),
  ]);

  if (!agent) notFound();

  const owned = activeProjects.filter((p) => p.ownerSlug === slug);
  const myActivity = recentActivity.filter((e) => e.agentSlug === slug);
  const handsOffAgents = agent.handsOffTo
    .map((h) => allAgents.find((a) => a.slug === h))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <>
      <PageHeader
        kicker={agent.number}
        title={agent.name}
        breadcrumb={[
          { href: "/agents", label: "Roster" },
          { href: `/agents/${agent.slug}`, label: agent.name },
        ]}
        actions={<StatusPill status={agent.status} />}
      />

      <div className="px-6 md:px-10 py-6 md:py-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl">
        {/* MAIN COLUMN */}
        <div className="md:col-span-2 space-y-8">
          {/* MANIFESTO */}
          <section>
            <SectionHead label="Manifesto" />
            <p className="text-base md:text-lg font-light italic opacity-90 leading-snug">
              {agent.manifesto}
            </p>
          </section>

          {/* CHARTER */}
          <section>
            <SectionHead label="Charter" />
            <div className="border border-bone/15 divide-y divide-bone/10">
              {agent.charter.map((para, i) => (
                <p
                  key={i}
                  className="px-4 py-3 text-sm leading-relaxed opacity-90"
                >
                  {para}
                </p>
              ))}
            </div>
          </section>

          {/* OWNED PROJECTS */}
          <section>
            <SectionHead
              label="Current ownership"
              tail={`${owned.length}`}
            />
            {owned.length === 0 ? (
              <EmptyRow label="No projects in flight." />
            ) : (
              <ul className="border border-bone/15 divide-y divide-bone/10">
                {owned.map((p) => (
                  <li
                    key={p.id}
                    className="px-4 py-3 grid grid-cols-12 gap-3 items-center text-sm"
                  >
                    <span className="col-span-12 md:col-span-6 font-medium">
                      {p.title}
                    </span>
                    <span className="col-span-6 md:col-span-3 text-[11px] tracking-[0.15em] uppercase opacity-60">
                      {p.client}
                    </span>
                    <span className="col-span-6 md:col-span-3 text-xs opacity-75">
                      {p.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ACTIVITY */}
          {myActivity.length > 0 && (
            <section>
              <SectionHead label="Activity" tail={`${myActivity.length}`} />
              <ul className="border border-bone/15 divide-y divide-bone/10">
                {myActivity.map((e) => (
                  <li
                    key={e.id}
                    className="px-4 py-3 grid grid-cols-12 gap-3 items-center text-sm"
                  >
                    <span className="col-span-3 text-[10px] tracking-[0.15em] uppercase opacity-55 tabular-nums">
                      {TIME_FMT.format(new Date(e.at))}
                    </span>
                    <span className="col-span-9 opacity-90 leading-snug">
                      {e.description}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* SIDE COLUMN */}
        <aside className="space-y-6 md:sticky md:top-6 md:self-start">
          <SidePanel label="Replaces">
            <p className="text-sm opacity-90">{agent.replaces}</p>
          </SidePanel>

          <SidePanel label="Hands off to">
            {handsOffAgents.length > 0 ? (
              <ul className="space-y-1.5">
                {handsOffAgents.map((h) => (
                  <li key={h.slug}>
                    <Link
                      href={`/agents/${h.slug}`}
                      className="text-sm hover:opacity-70 transition-opacity flex items-center gap-2"
                    >
                      <span className="opacity-40">→</span> {h.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs italic opacity-55">— terminal node</p>
            )}
          </SidePanel>

          <SidePanel label={`Tools · ${agent.tools.length}`}>
            <ul className="flex flex-wrap gap-1.5">
              {agent.tools.map((t) => (
                <li
                  key={t}
                  className="text-[10px] tracking-wider border border-bone/25 rounded px-2 py-0.5 opacity-85"
                >
                  {t}
                </li>
              ))}
            </ul>
          </SidePanel>
        </aside>
      </div>
    </>
  );
}

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
    <span className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase opacity-75 border border-bone/30 px-2 py-1">
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${color}`} />
      {status}
    </span>
  );
}

function SidePanel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-bone/15 p-4">
      <p className="text-[10px] tracking-[0.22em] uppercase opacity-55 mb-2.5">
        {label}
      </p>
      {children}
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div className="border border-bone/15 px-4 py-5 text-sm italic opacity-55">
      {label}
    </div>
  );
}
