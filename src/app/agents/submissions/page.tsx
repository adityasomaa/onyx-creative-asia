import Link from "next/link";
import PageHeader from "../_components/PageHeader";
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
    <>
      <PageHeader
        kicker="INBOX"
        title="Submissions"
        count={`${submissions.length}`}
        actions={
          <span className="text-[10px] tracking-[0.18em] uppercase opacity-50">
            Filter: {status === "all" ? "All" : SUBMISSION_STATUS_LABEL[status]}
          </span>
        }
      />

      {/* FILTER BAR */}
      <div className="border-b border-bone/10 px-6 md:px-10 py-3 flex flex-wrap gap-1 text-[10px] tracking-[0.18em] uppercase">
        {STATUS_FILTERS.map((s) => {
          const active = s === status;
          const href =
            s === "all"
              ? "/agents/submissions"
              : `/agents/submissions?status=${s}`;
          const label = s === "all" ? "All" : SUBMISSION_STATUS_LABEL[s];
          return (
            <Link
              key={s}
              href={href}
              className={`px-2.5 py-1 border transition-colors ${
                active
                  ? "border-bone bg-bone text-ink"
                  : "border-bone/25 hover:border-bone/50 opacity-75"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <div className="px-6 md:px-10 py-6">
        {submissions.length === 0 ? (
          <div className="border border-bone/15 px-4 py-8 text-sm italic opacity-55 text-center">
            No submissions match this filter.
          </div>
        ) : (
          <div className="border border-bone/15 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bone/15 bg-bone/[0.02]">
                  <Th>#</Th>
                  <Th>Received</Th>
                  <Th>Source</Th>
                  <Th>From</Th>
                  <Th>Subject</Th>
                  <Th>Budget</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s, i) => (
                  <tr
                    key={s.id}
                    className="border-b border-bone/10 last:border-b-0 hover:bg-bone/[0.03] transition-colors group"
                  >
                    <Td className="opacity-50 tabular-nums">
                      {String(i + 1).padStart(3, "0")}
                    </Td>
                    <Td className="text-[11px] tracking-[0.12em] uppercase opacity-65 tabular-nums whitespace-nowrap">
                      {DATE_FMT.format(new Date(s.received_at))}
                    </Td>
                    <Td>
                      <span className="text-[10px] tracking-[0.18em] uppercase border border-bone/25 px-1.5 py-0.5">
                        {SUBMISSION_SOURCE_LABEL[s.source]}
                      </span>
                    </Td>
                    <Td>
                      <span className="font-medium">
                        {s.from_name ?? "Anonymous"}
                      </span>
                      {s.from_email && (
                        <span className="block text-[11px] opacity-55">
                          {s.from_email}
                        </span>
                      )}
                    </Td>
                    <Td className="max-w-md">
                      <Link
                        href={`/agents/submissions/${s.id}`}
                        className="hover:opacity-70 transition-opacity line-clamp-1"
                      >
                        {s.subject ?? s.body_md?.slice(0, 70) ?? "(no subject)"}
                      </Link>
                    </Td>
                    <Td className="text-[11px] tracking-[0.12em] uppercase opacity-75 whitespace-nowrap">
                      {s.budget_band ?? "—"}
                    </Td>
                    <Td>
                      <StatusBadge status={s.status} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2.5 text-left text-[10px] tracking-[0.18em] uppercase font-normal opacity-60 whitespace-nowrap">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const color =
    status === "new"
      ? "border-emerald-400/70 text-emerald-300"
      : status === "qualified"
        ? "border-amber-300/70 text-amber-200"
        : status === "replied"
          ? "border-bone/60"
          : status === "archived" || status === "spam"
            ? "border-bone/15 opacity-50"
            : "border-bone/40";
  return (
    <span
      className={`inline-block border rounded-sm px-1.5 py-0.5 text-[10px] tracking-[0.18em] uppercase ${color}`}
    >
      {SUBMISSION_STATUS_LABEL[status]}
    </span>
  );
}
