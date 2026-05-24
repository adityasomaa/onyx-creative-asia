import Link from "next/link";
import PageHeader from "../_components/PageHeader";
import {
  INBOX_TABS,
  INBOX_TAB_LABEL,
  INQUIRY_TYPES,
  INQUIRY_TYPE_LABEL,
  SUBMISSION_SOURCE_LABEL,
  SUBMISSION_STATUS_LABEL,
  listSubmissions,
  type InboxTab,
  type SubmissionWithRefsFull,
} from "@/lib/db/submissions";
import type { InquiryType, SubmissionStatus } from "@/lib/db/types";

export const dynamic = "force-dynamic";

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function relativeAgo(iso: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const diffS = Math.floor((Date.now() - then) / 1000);
  if (diffS < 60) return `${diffS}s ago`;
  if (diffS < 3600) return `${Math.floor(diffS / 60)}m ago`;
  if (diffS < 86_400) return `${Math.floor(diffS / 3600)}h ago`;
  if (diffS < 86_400 * 7) return `${Math.floor(diffS / 86_400)}d ago`;
  return DATE_FMT.format(new Date(iso));
}

const TYPE_FILTERS: (InquiryType | "all")[] = ["all", ...INQUIRY_TYPES];

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; type?: string }>;
}) {
  const sp = await searchParams;
  const rawTab = sp.tab ?? "inbox";
  const tab: InboxTab = (INBOX_TABS as string[]).includes(rawTab)
    ? (rawTab as InboxTab)
    : "inbox";
  const rawType = sp.type ?? "all";
  const type = (TYPE_FILTERS as string[]).includes(rawType)
    ? (rawType as InquiryType | "all")
    : "all";

  const submissions = await listSubmissions({ tab, type, limit: 200 });
  const unreadCount = submissions.filter((s) => s.status === "new").length;

  function buildHref(opts: {
    nextTab?: InboxTab;
    nextType?: InquiryType | "all";
  }) {
    const finalTab = opts.nextTab ?? tab;
    const finalType = opts.nextType ?? type;
    const params: string[] = [];
    if (finalTab !== "inbox") params.push(`tab=${finalTab}`);
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
            {INBOX_TAB_LABEL[tab]}
            {tab === "inbox" && unreadCount > 0 && (
              <>
                {" "}
                ·{" "}
                <span className="text-emerald-300">
                  {unreadCount} unread
                </span>
              </>
            )}
          </span>
        }
      />

      {/* TAB FILTER */}
      <div className="border-b border-bone/10 px-6 md:px-10 py-3 flex flex-wrap items-center gap-2 text-[10px] tracking-[0.18em] uppercase">
        <span className="opacity-50 mr-2">View</span>
        {INBOX_TABS.map((t) => {
          const active = t === tab;
          return (
            <Link
              key={t}
              href={buildHref({ nextTab: t })}
              className={`px-2.5 py-1 border transition-colors ${
                active
                  ? "border-bone bg-bone text-ink"
                  : "border-bone/25 hover:border-bone/50 opacity-75"
              }`}
            >
              {INBOX_TAB_LABEL[t]}
            </Link>
          );
        })}
      </div>

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

      {/* LIST */}
      <div className="px-6 md:px-10 py-6">
        {submissions.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          <ul className="border border-bone/15 divide-y divide-bone/10">
            {submissions.map((s) => (
              <SubmissionRow key={s.id} submission={s} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function SubmissionRow({ submission }: { submission: SubmissionWithRefsFull }) {
  const unread = submission.status === "new";
  const name =
    submission.display_name ??
    submission.from_name ??
    submission.wa_identifier ??
    "Anonymous";
  const subject =
    submission.subject ??
    submission.last_message_preview ??
    submission.body_md?.slice(0, 100) ??
    "(no subject)";

  return (
    <li>
      <Link
        href={`/agents/submissions/${submission.id}`}
        className={`flex items-start gap-4 px-4 py-4 transition-colors hover:bg-bone/[0.03] ${
          unread ? "bg-emerald-400/[0.025]" : ""
        }`}
      >
        {/* Unread dot */}
        <span
          className={`mt-2 inline-block w-2 h-2 rounded-full shrink-0 ${
            unread ? "bg-emerald-300" : "bg-bone/15"
          }`}
          aria-label={unread ? "Unread" : "Read"}
        />

        {/* Main column */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-0.5 flex-wrap">
            <span
              className={`text-sm ${unread ? "font-medium" : "opacity-90"} truncate`}
            >
              {name}
            </span>
            <SourceChip source={submission.source} />
            {submission.wa_kind === "group" && (
              <span className="text-[9px] tracking-[0.22em] uppercase border border-bone/25 px-1 py-0.5 opacity-65">
                Group
              </span>
            )}
            <TypeChip type={submission.inquiry_type} />
            <PriorityChip priority={submission.priority} />
            <ClassificationChip classification={submission.classification} />
            <StatusBadge status={submission.status} />
          </div>

          {/* Subject — LLM-generated action phrase OR operator-set */}
          <p
            className={`text-sm leading-snug ${
              unread ? "text-bone" : "text-bone/75"
            } line-clamp-2`}
          >
            {subject}
          </p>

          {/* Last preview as faded sub-line (only if different from subject) */}
          {submission.last_message_preview &&
            submission.subject &&
            submission.last_message_preview !== submission.subject && (
              <p className="text-[11px] italic opacity-45 mt-0.5 line-clamp-1">
                {submission.last_message_direction === "out" && "↳ "}
                {submission.last_message_preview}
              </p>
            )}
        </div>

        {/* Meta column */}
        <div className="text-right shrink-0 flex flex-col items-end gap-1">
          <span className="text-[10px] tracking-[0.14em] uppercase tabular-nums opacity-70 whitespace-nowrap">
            {relativeAgo(submission.last_event_at ?? submission.received_at)}
          </span>
          <span className="text-[9px] tracking-[0.18em] uppercase opacity-45">
            {submission.message_count} msg
            {submission.budget_band && ` · ${submission.budget_band}`}
          </span>
        </div>
      </Link>
    </li>
  );
}

/* ============================================================
 * Chips
 * ============================================================ */

function SourceChip({
  source,
}: {
  source: SubmissionWithRefsFull["source"];
}) {
  return (
    <span className="text-[9px] tracking-[0.22em] uppercase border border-bone/25 px-1 py-0.5 opacity-70">
      {SUBMISSION_SOURCE_LABEL[source]}
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
      className={`text-[9px] tracking-[0.22em] uppercase border px-1 py-0.5 ${color}`}
    >
      {INQUIRY_TYPE_LABEL[type]}
    </span>
  );
}

function PriorityChip({ priority }: { priority: string | null }) {
  if (!priority) return null;
  const color =
    priority === "urgent"
      ? "border-red-400/70 text-red-300"
      : priority === "low"
        ? "border-bone/25 opacity-55"
        : "border-bone/45";
  return (
    <span
      className={`text-[9px] tracking-[0.22em] uppercase border px-1 py-0.5 ${color}`}
    >
      {priority}
    </span>
  );
}

function ClassificationChip({
  classification,
}: {
  classification: SubmissionWithRefsFull["classification"];
}) {
  if (classification === "business" || classification === "manual_business")
    return null;
  if (classification === "pending") {
    return (
      <span className="text-[9px] tracking-[0.22em] uppercase border border-amber-300/40 text-amber-200/80 px-1 py-0.5">
        Pending
      </span>
    );
  }
  if (classification === "personal" || classification === "manual_ignored") {
    return (
      <span className="text-[9px] tracking-[0.22em] uppercase border border-bone/20 opacity-50 px-1 py-0.5">
        {classification === "manual_ignored" ? "Ignored" : "Personal"}
      </span>
    );
  }
  return null;
}

function StatusBadge({ status }: { status: SubmissionStatus }) {
  if (status === "new") return null; // already shown by the green dot + bg tint
  const color =
    status === "read"
      ? "border-bone/30 opacity-65"
      : status === "replied"
        ? "border-emerald-300/60 text-emerald-200"
        : status === "archived" || status === "spam"
          ? "border-bone/15 opacity-40"
          : "border-bone/40";
  return (
    <span
      className={`text-[9px] tracking-[0.22em] uppercase border px-1 py-0.5 ${color}`}
    >
      {SUBMISSION_STATUS_LABEL[status]}
    </span>
  );
}

function EmptyState({ tab }: { tab: InboxTab }) {
  let copy = "Nothing in your inbox. New submissions will land here.";
  if (tab === "personal") {
    copy = "Nothing filed as personal yet.";
  } else if (tab === "archived") {
    copy = "No archived submissions.";
  } else if (tab === "all") {
    copy = "No submissions yet.";
  }
  return (
    <div className="border border-bone/15 px-4 py-12 text-sm italic opacity-55 text-center">
      {copy}
    </div>
  );
}
