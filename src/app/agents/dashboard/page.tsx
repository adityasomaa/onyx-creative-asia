import Link from "next/link";
import { getDashboardSummary } from "@/lib/db/dashboard";
import {
  PROJECT_STAGES,
  PROJECT_STAGE_LABEL,
} from "@/lib/db/projects";
import { CLIENT_STATUS_LABEL } from "@/lib/db/clients";
import { SUBMISSION_STATUSES } from "@/lib/db/submissions";
import type { ClientStatus } from "@/lib/db/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardSummary();

  const totalProjects =
    data.projects.incoming +
    data.projects.inProgress +
    data.projects.done +
    data.projects.inactive;

  const totalSubmissions = SUBMISSION_STATUSES.reduce(
    (sum, s) => sum + (data.submissions[s] ?? 0),
    0
  );

  const totalClients = (Object.keys(data.clients) as ClientStatus[]).reduce(
    (sum, s) => sum + (data.clients[s] ?? 0),
    0
  );

  return (
    <div className="px-6 md:px-10 py-12 md:py-16 space-y-16">
      <section>
        <p className="text-[11px] tracking-[0.3em] uppercase opacity-55 mb-5">
          [ STUDIO.OPS · LIVE ]
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.9]">
          Dashboard
          <br />
          <span className="font-light italic">— the pulse of the studio.</span>
        </h1>
      </section>

      <section>
        <SectionHead label="PROJECTS" tail={`${totalProjects} total`} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-bone/10 border border-bone/15">
          <Card
            kicker="INCOMING"
            value={data.projects.incoming}
            footnote="intake + scoping"
            href="/agents/dashboard#incoming"
          />
          <Card
            kicker="IN PROGRESS"
            value={data.projects.inProgress}
            footnote="in flight + review"
            accent
          />
          <Card kicker="DONE" value={data.projects.done} footnote="shipped" />
          <Card
            kicker="INACTIVE"
            value={data.projects.inactive}
            footnote="paused / stale"
            muted
          />
        </div>
      </section>

      <section>
        <SectionHead label="PROJECTS · BY STAGE" />
        <BarChart
          rows={PROJECT_STAGES.map((stage) => ({
            label: PROJECT_STAGE_LABEL[stage],
            value: data.projectStages[stage] ?? 0,
          }))}
        />
      </section>

      <section>
        <SectionHead
          label="SUBMISSIONS"
          tail={
            <>
              {totalSubmissions} total ·{" "}
              <Link href="/agents/submissions" className="underline">
                open log →
              </Link>
            </>
          }
        />
        <BarChart
          rows={SUBMISSION_STATUSES.map((s) => ({
            label: data.submissionLabels[s],
            value: data.submissions[s] ?? 0,
          }))}
        />
      </section>

      <section>
        <SectionHead label="CLIENTS" tail={`${totalClients} on books`} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-bone/10 border border-bone/15">
          {(Object.keys(data.clients) as ClientStatus[]).map((s) => (
            <Card
              key={s}
              kicker={CLIENT_STATUS_LABEL[s].toUpperCase()}
              value={data.clients[s]}
              footnote={s}
              accent={s === "active"}
              muted={s === "closed"}
            />
          ))}
        </div>
      </section>

      <p className="text-[10px] tracking-[0.2em] uppercase opacity-40 pt-8 border-t border-bone/10">
        Generated · {new Date(data.generatedAt).toUTCString()}
      </p>
    </div>
  );
}

function SectionHead({
  label,
  tail,
}: {
  label: string;
  tail?: React.ReactNode;
}) {
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

function Card({
  kicker,
  value,
  footnote,
  accent,
  muted,
  href,
}: {
  kicker: string;
  value: number;
  footnote?: string;
  accent?: boolean;
  muted?: boolean;
  href?: string;
}) {
  const inner = (
    <div
      className={`bg-ink p-6 md:p-8 ${
        muted ? "opacity-60" : ""
      } ${accent ? "ring-1 ring-emerald-400/40" : ""}`}
    >
      <p className="text-[10px] tracking-[0.25em] uppercase opacity-70 mb-3">
        {kicker}
      </p>
      <p className="text-5xl md:text-6xl font-bold tracking-tight tabular-nums leading-none">
        {value}
      </p>
      {footnote && (
        <p className="mt-2 text-[11px] tracking-[0.18em] uppercase opacity-55 italic">
          {footnote}
        </p>
      )}
    </div>
  );
  return href ? (
    <Link href={href} className="block hover:bg-bone/5 transition-colors">
      {inner}
    </Link>
  ) : (
    inner
  );
}

function BarChart({
  rows,
}: {
  rows: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="border border-bone/15 divide-y divide-bone/10">
      {rows.map((r) => {
        const pct = Math.round((r.value / max) * 100);
        return (
          <li
            key={r.label}
            className="grid grid-cols-12 gap-4 items-center px-5 py-4"
          >
            <span className="col-span-4 md:col-span-3 text-[11px] tracking-[0.18em] uppercase opacity-75">
              {r.label}
            </span>
            <div className="col-span-6 md:col-span-7 relative h-2 bg-bone/10 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-bone"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="col-span-2 md:col-span-2 text-right tabular-nums text-sm">
              {r.value}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
