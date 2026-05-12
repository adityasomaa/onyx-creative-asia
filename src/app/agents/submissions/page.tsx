import Link from "next/link";
import PageHeader from "../_components/PageHeader";
import {
  listSubmissions,
  SUBMISSION_STATUSES,
  SUBMISSION_STATUS_LABEL,
  SUBMISSION_SOURCE_LABEL,
  INQUIRY_TYPES,
  INQUIRY_TYPE_LABEL,
} from "@/lib/db/submissions";
import type { InquiryType, SubmissionStatus } from "@/lib/db/types";

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

const TYPE_FILTERS: (InquiryType | "all")[] = ["all", ...INQUIRY_TYPES];

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}) {
  const sp = await searchParams;
  const rawStatus = sp.status ?? "all";
  const rawType = sp.type ?? "all";
  const status = (STATUS_FILTERS as string[]).includes(rawStatus)
    ? (rawStatus as SubmissionStatus | "all")
    : "all";
  const type = (TYPE_FILTERS as string[]).includes(rawType)
    ? (rawType as InquiryType | "all")
    : "all";

  const submissions = await listSubmissions({ status, type, limit: 200 });

  function buildHref(opts: {
    nextStatus?: SubmissionStatus | "all";
    nextType?: InquiryType | "all";
  }) {
    const finalStatus = opts.nextStatus ?? status;
    const finalType = opts.nextType ?? type;
    const params: string[] = [];
    if (finalStatus !== "all") params.push(`status=${finalStatus}`);
    if (finalType !== "all") params.push(`type=${finalType}`);
    return `/agents/submissions${params.length ? `?${params.join("&")}` : ""}`;
  }

  return (
    <>
      <PageHeader
        kicker="INBOX"
        title="Submissions"
        count={`${submissions.length}`}
        actions={
          <span className="text-[10px] tracking-[0.18em] uppercase opacity-50">
            {type === "all" ? "All types" : INQUIRY_TYPE_LABEL[type]} ·{" "}
            {status === "all" ? "All status" : SUBMISSION_STATUS_LABEL[status]}
          </span>
        }
      />

      {/* TYPE FILTER */}
      <div className="border-b border-bone/10 px-6 md:px-10 py-3 flex flex-wrap items-center gap-2 text-[10px] tracking-[0.18em] uppercase">
        <span className="opacity-50 mr-2">Type</span>
        {TYPE_FILTERS.map((t) => {
          const active = t === type;
          const label = t === "all" ? "All" : INQUIRY_TYPE_LABEL[t];
          return (
            <Link
              key={t}
              href={buildHref({ nextType: t })}
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

      {/* STATUS FILTER */}
      <div className="border-b border-bone/10 px-6 md:px-10 py-3 flex flex-wrap items-center gap-2 text-[10px] tracking-[0.18em] uppercase">
        <span className="opacity-50 mr-2">Status</span>
        {STATUS_FILTERS.map((s) => {
          const active = s === status;
          const label = s === "all" ? "All" : SUBMISSION_STATUS_LABEL[s];
          return (
            <Link
              key={s}
              href={buildHref({ nextStatus: s })}
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
            No submissions match these filters.
          </div>
        ) : (
          <div className="border border-bone/15 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-bone/15 bg-bone/[0.02]">
                  <Th>#</Th>
                  <Th>Received</Th>
                  <Th>Type</Th>
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
                      <TypeChip type={s.inquiry_type} />
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

function TypeChip({ type }: { type: InquiryType }) {
  const color =
    type === "project"
      ? "border-sky-300/70 text-sky-200"
      : type === "career"
        ? "border-violet-300/70 text-violet-200"
        : type === "partnership"
          ? "border-amber-300/70 text-amber-200"
          : type === "general"
            ? "border-emerald-300/60 text-emerald-200"
            : "border-bone/25 opacity-60";
  return (
    <span
      className={`inline-block border rounded-sm px-1.5 py-0.5 text-[10px] tracking-[0.18em] uppercase ${color}`}
    >
      {INQUIRY_TYPE_LABEL[type]}
    </span>
  );
}
