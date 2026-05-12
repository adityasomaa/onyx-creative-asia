import Link from "next/link";
import {
  listSubmissions,
  SUBMISSION_STATUSES,
  SUBMISSION_STATUS_LABEL,
  SUBMISSION_SOURCE_LABEL,
} from "@/lib/db/submissions";
import type { SubmissionStatus } from "@/lib/db/types";

export const dynamic = "force-dynamic";

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const STATUS_FILTERS: (SubmissionStatus | "all")[] = [
  "all",
  ...SUBMISSION_STATUSES,
];

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const raw = sp.status ?? "all";
  const status = (STATUS_FILTERS as string[]).includes(raw)
    ? (raw as SubmissionStatus | "all")
    : "all";

  const submissions = await listSubmissions({ status, limit: 200 });

  return (
    <div className="px-6 md:px-10 py-12 md:py-16 space-y-12">
      <section>
        <p className="text-[11px] tracking-[0.3em] uppercase opacity-55 mb-5">
          [ INBOUND.LOG · {submissions.length} ]
        </p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.9]">
          Submissions
          <br />
          <span className="font-light italic">— every brief, every channel.</span>
        </h1>
        <p className="mt-8 text-base md:text-lg opacity-75 max-w-xl leading-relaxed">
          Everything that lands in the studio inbox — form, email, WhatsApp —
          pooled here for the Director to triage. Phase 1 reads from the
          submissions table; live ingest follows in Phase 2.
        </p>
      </section>

      <nav className="border-y border-bone/15 py-4 flex flex-wrap gap-3 text-[11px] tracking-[0.18em] uppercase">
        {STATUS_FILTERS.map((s) => {
          const active = s === status;
          const href = s === "all" ? "/agents/submissions" : `/agents/submissions?status=${s}`;
          const label = s === "all" ? "All" : SUBMISSION_STATUS_LABEL[s];
          return (
            <Link
              key={s}
              href={href}
              className={`px-3 py-1.5 border transition-colors ${
                active
                  ? "border-bone bg-bone text-ink"
                  : "border-bone/30 hover:border-bone/60"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {submissions.length === 0 ? (
        <p className="text-sm opacity-60 italic">
          No submissions match this filter.
        </p>
      ) : (
        <ul className="border-t border-bone/15">
          {submissions.map((s, i) => (
            <li key={s.id} className="border-b border-bone/15">
              <Link
                href={`/agents/submissions/${s.id}`}
                className="block py-5 md:py-6 grid grid-cols-12 gap-3 md:gap-6 items-baseline hover:bg-bone/5 transition-colors px-2 -mx-2"
              >
                <span className="col-span-1 text-[11px] tabular-nums opacity-50">
                  {String(i + 1).padStart(3, "0")}
                </span>
                <span className="col-span-3 md:col-span-2 text-[11px] tracking-[0.18em] uppercase opacity-60 tabular-nums">
                  {DATE_FMT.format(new Date(s.received_at))}
                </span>
                <span className="col-span-2 md:col-span-1 text-[10px] tracking-[0.2em] uppercase opacity-70">
                  {SUBMISSION_SOURCE_LABEL[s.source]}
                </span>
                <div className="col-span-12 md:col-span-5 order-last md:order-none">
                  <p className="text-base md:text-lg font-medium tracking-tight leading-tight">
                    {s.subject ?? s.body_md?.slice(0, 80) ?? "(no subject)"}
                  </p>
                  <p className="text-[11px] tracking-[0.15em] uppercase opacity-60 mt-1">
                    {s.from_name ?? "Anonymous"}
                    {s.from_email && ` · ${s.from_email}`}
                  </p>
                </div>
                <div className="col-span-6 md:col-span-2 text-[11px] tracking-[0.15em] uppercase opacity-70">
                  {s.budget_band ?? "—"}
                </div>
                <div className="col-span-6 md:col-span-1 text-[10px] tracking-[0.2em] uppercase">
                  <StatusBadge status={s.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const color =
    status === "new"
      ? "border-emerald-400 text-emerald-300"
      : status === "qualified"
        ? "border-amber-300 text-amber-200"
        : status === "replied"
          ? "border-bone/60"
          : status === "archived" || status === "spam"
            ? "border-bone/20 opacity-50"
            : "border-bone/40";
  return (
    <span className={`inline-block border rounded-sm px-2 py-0.5 ${color}`}>
      {SUBMISSION_STATUS_LABEL[status]}
    </span>
  );
}
