import Link from "next/link";
import PageHeader from "../_components/PageHeader";
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
    <>
      <PageHeader
        kicker="OPS"
        title="Dashboard"
        actions={
          <span className="text-[10px] tracking-[0.18em] uppercase opacity-50">
            Live · {new Date(data.generatedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </span>
        }
      />

      <div className="px-6 md:px-10 py-6 md:py-8 space-y-10">
        {/* PROJECTS — cards */}
        <section>
          <SectionHead label="Projects" tail={`${totalProjects} total`} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-bone/10 border border-bone/15">
            <Card
              kicker="Incoming"
              value={data.projects.incoming}
              footnote="intake + scoping"
              href="/agents/submissions?status=new"
            />
            <Card
              kicker="In progress"
              value={data.projects.inProgress}
              footnote="in flight + review"
              accent
            />
            <Card kicker="Done" value={data.projects.done} footnote="shipped" />
            <Card
              kicker="Inactive"
              value={data.projects.inactive}
              footnote="paused / stale"
              muted
            />
          </div>
        </section>

        {/* TWO-COLUMN: project stages + submission statuses */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <SectionHead label="Projects by stage" />
            <BarChart
              rows={PROJECT_STAGES.map((stage) => ({
                label: PROJECT_STAGE_LABEL[stage],
                value: data.projectStages[stage] ?? 0,
              }))}
            />
          </div>
          <div>
            <SectionHead
              label="Submissions by status"
              tail={
                <Link href="/agents/submissions" className="underline">
                  open log →
                </Link>
              }
            />
            <BarChart
              rows={SUBMISSION_STATUSES.map((s) => ({
                label: data.submissionLabels[s],
                value: data.submissions[s] ?? 0,
              }))}
            />
          </div>
        </section>

        {/* CLIENTS */}
        <section>
          <SectionHead label="Clients" tail={`${totalClients} on books`} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-bone/10 border border-bone/15">
            {(Object.keys(data.clients) as ClientStatus[]).map((s) => (
              <Card
                key={s}
                kicker={CLIENT_STATUS_LABEL[s]}
                value={data.clients[s]}
                footnote={s}
                accent={s === "active"}
                muted={s === "closed"}
              />
            ))}
          </div>
        </section>

        <p className="text-[10px] tracking-[0.18em] uppercase opacity-40 pt-2">
          Generated · {new Date(data.generatedAt).toUTCString()}
        </p>
      </div>
    </>
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
    <div className="flex items-baseline justify-between mb-3">
      <p className="text-[10px] tracking-[0.22em] uppercase opacity-65">
        {label}
      </p>
      {tail && (
        <p className="text-[10px] tracking-[0.18em] uppercase opacity-50">
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
      className={`bg-ink p-5 ${muted ? "opacity-60" : ""} ${
        accent ? "ring-1 ring-emerald-400/30" : ""
      }`}
    >
      <p className="text-[10px] tracking-[0.22em] uppercase opacity-65 mb-3">
        {kicker}
      </p>
      <p className="text-4xl md:text-5xl font-medium tracking-tight tabular-nums leading-none">
        {value}
      </p>
      {footnote && (
        <p className="mt-2 text-[10px] tracking-[0.15em] uppercase opacity-50">
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

function BarChart({ rows }: { rows: { label: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="border border-bone/15 divide-y divide-bone/10">
      {rows.map((r) => {
        const pct = Math.round((r.value / max) * 100);
        return (
          <li
            key={r.label}
            className="grid grid-cols-12 gap-3 items-center px-4 py-2.5"
          >
            <span className="col-span-4 md:col-span-3 text-[11px] tracking-[0.15em] uppercase opacity-75">
              {r.label}
            </span>
            <div className="col-span-6 md:col-span-7 relative h-1.5 bg-bone/10 overflow-hidden">
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
