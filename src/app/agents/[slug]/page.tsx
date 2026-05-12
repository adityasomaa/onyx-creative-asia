import Link from "next/link";
import { notFound } from "next/navigation";
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
  year: "numeric",
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
    <div className="px-6 md:px-10 py-12 md:py-16 max-w-5xl space-y-16 md:space-y-20">
      <p className="text-[11px] tracking-[0.3em] uppercase opacity-55 flex items-center gap-3 flex-wrap">
        <Link href="/agents" className="hover:opacity-100 transition-opacity">
          ← Roster
        </Link>
        <span aria-hidden>·</span>
        <span>Agent {agent.number}</span>
      </p>

      <section>
        <div className="flex items-baseline gap-6 mb-6">
          <span className="text-6xl md:text-8xl font-bold tracking-tight">
            {agent.number}
          </span>
          <span className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase opacity-75">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                agent.status === "working"
                  ? "bg-emerald-400"
                  : agent.status === "blocked"
                    ? "bg-red-400"
                    : "bg-bone/40"
              }`}
            />
            {agent.status}
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.9]">
          {agent.name}
        </h1>
        <p className="mt-6 text-xl md:text-2xl font-light italic opacity-85 leading-snug max-w-3xl">
          {agent.manifesto}
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-bone/15 py-10">
        <div>
          <p className="text-[11px] tracking-[0.25em] uppercase opacity-55 mb-3">
            Replaces
          </p>
          <p className="text-base md:text-lg">{agent.replaces}</p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.25em] uppercase opacity-55 mb-3">
            Hands off to
          </p>
          <ul className="space-y-1">
            {handsOffAgents.length > 0 ? (
              handsOffAgents.map((h) => (
                <li key={h.slug}>
                  <Link
                    href={`/agents/${h.slug}`}
                    className="hover:opacity-70 transition-opacity"
                  >
                    → {h.name}
                  </Link>
                </li>
              ))
            ) : (
              <li className="opacity-60 italic">— terminal node</li>
            )}
          </ul>
        </div>
      </section>

      <section>
        <p className="text-[11px] tracking-[0.3em] uppercase opacity-65 mb-6">
          // CHARTER
        </p>
        <div className="space-y-5 max-w-3xl">
          {agent.charter.map((para, i) => (
            <p
              key={i}
              className="text-base md:text-lg leading-[1.7] opacity-90"
            >
              {para}
            </p>
          ))}
        </div>
      </section>

      <section>
        <p className="text-[11px] tracking-[0.3em] uppercase opacity-65 mb-6">
          // TOOLS · {agent.tools.length}
        </p>
        <ul className="flex flex-wrap gap-2">
          {agent.tools.map((t) => (
            <li
              key={t}
              className="text-xs tracking-wider border border-bone/30 rounded px-3 py-1.5 opacity-85"
            >
              {t}
            </li>
          ))}
        </ul>
      </section>

      {owned.length > 0 && (
        <section>
          <p className="text-[11px] tracking-[0.3em] uppercase opacity-65 mb-6">
            // CURRENT OWNERSHIP · {owned.length}
          </p>
          <ul className="border-t border-bone/15">
            {owned.map((p, i) => (
              <li
                key={p.id}
                className="border-b border-bone/15 py-5 grid grid-cols-12 gap-4 items-baseline"
              >
                <span className="col-span-1 text-xs opacity-50 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="col-span-11 md:col-span-7">
                  <p className="text-lg font-medium leading-tight">{p.title}</p>
                  <p className="text-[11px] tracking-[0.18em] uppercase opacity-60 mt-1">
                    {p.client}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-4 text-sm">
                  <p>{p.status}</p>
                  {p.nextMilestone && (
                    <p className="text-[11px] opacity-60 mt-1 italic">
                      {p.nextMilestone}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {myActivity.length > 0 && (
        <section>
          <p className="text-[11px] tracking-[0.3em] uppercase opacity-65 mb-6">
            // ACTIVITY
          </p>
          <ul className="border-t border-bone/15">
            {myActivity.map((e) => (
              <li
                key={e.id}
                className="border-b border-bone/15 py-4 grid grid-cols-12 gap-4 items-baseline"
              >
                <span className="col-span-12 md:col-span-3 text-[11px] tracking-[0.18em] uppercase opacity-60 tabular-nums">
                  {TIME_FMT.format(new Date(e.at))}
                </span>
                <span className="col-span-12 md:col-span-9 text-sm md:text-base leading-relaxed">
                  {e.description}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
