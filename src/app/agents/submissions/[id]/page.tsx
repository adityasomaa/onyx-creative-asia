import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "../../_components/PageHeader";
import ContextEditor from "./_components/ContextEditor";
import MarkReadOnMount from "./_components/MarkReadOnMount";
import ReplyBox from "./_components/ReplyBox";
import SubjectEditor from "./_components/SubjectEditor";
import SubmissionActions from "./_components/SubmissionActions";
import SubmissionRename from "./_components/SubmissionRename";
import {
  getSubmissionById,
  getSubmissionContext,
  listFilesForSubmission,
  listMessagesForSubmission,
  SUBMISSION_SOURCE_LABEL,
  SUBMISSION_STATUS_LABEL,
  INQUIRY_TYPE_LABEL,
} from "@/lib/db/submissions";
import { vaultIsConfigured } from "@/lib/crypto-vault";
import type { InquiryType, SubmissionStatus } from "@/lib/db/types";

export const dynamic = "force-dynamic";

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const TIME_FMT = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export default async function SubmissionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const submission = await getSubmissionById(id);
  if (!submission) notFound();

  const [messages, context, files] = await Promise.all([
    listMessagesForSubmission(id),
    getSubmissionContext(id),
    listFilesForSubmission(id),
  ]);

  const vaultStatus = vaultIsConfigured();

  const displayName =
    submission.display_name ??
    submission.from_name ??
    submission.wa_identifier ??
    "Anonymous";

  const isWaContact =
    submission.source === "whatsapp" && submission.wa_kind === "contact";
  const isWaGroup =
    submission.source === "whatsapp" && submission.wa_kind === "group";

  return (
    <>
      <MarkReadOnMount
        submissionId={id}
        isUnread={submission.status === "new"}
      />

      <PageHeader
        kicker="SUBMISSION"
        title={displayName}
        breadcrumb={[
          { href: "/agents/submissions", label: "Submissions" },
        ]}
        actions={
          <SubmissionActions
            submissionId={id}
            classification={submission.classification}
            status={submission.status}
          />
        }
      />

      {/* META STRIP */}
      <div className="border-b border-bone/10 px-6 md:px-10 py-3 flex flex-wrap items-baseline gap-x-6 gap-y-1.5 text-[11px]">
        <MetaItem label="Source">
          <span className="font-medium">
            {SUBMISSION_SOURCE_LABEL[submission.source]}
          </span>
          {isWaGroup && (
            <span className="ml-1.5 text-[9px] tracking-[0.22em] uppercase border border-bone/25 px-1 py-0.5 opacity-65">
              Group
            </span>
          )}
        </MetaItem>
        <MetaItem label="Type">
          <TypeChip type={submission.inquiry_type} />
        </MetaItem>
        <MetaItem label="Status">
          <StatusBadge status={submission.status} />
        </MetaItem>
        {submission.priority && (
          <MetaItem label="Priority">
            <PriorityChip priority={submission.priority} />
          </MetaItem>
        )}
        {submission.budget_band && (
          <MetaItem label="Budget">
            <span className="font-medium">{submission.budget_band}</span>
          </MetaItem>
        )}
        {submission.from_email && (
          <MetaItem label="Email">
            <a
              href={`mailto:${submission.from_email}`}
              className="font-mono tabular-nums hover:underline"
            >
              {submission.from_email}
            </a>
          </MetaItem>
        )}
        {submission.from_phone && (
          <MetaItem label="Phone">
            <span className="font-mono tabular-nums">
              {submission.from_phone}
            </span>
          </MetaItem>
        )}
        {submission.wa_pushname && (
          <MetaItem label="WA profile">
            <span className="opacity-80">{submission.wa_pushname}</span>
          </MetaItem>
        )}
        {submission.wa_group_name && (
          <MetaItem label="Group name">
            <span className="opacity-80">{submission.wa_group_name}</span>
          </MetaItem>
        )}
        <MetaItem label="First seen">
          {DATE_FMT.format(new Date(submission.received_at))}
        </MetaItem>
        <MetaItem label="Messages">
          <span className="tabular-nums">{submission.message_count}</span>
        </MetaItem>
      </div>

      {/* Classification reason from Gemini, if present */}
      {submission.classification_reason && (
        <div className="px-6 md:px-10 py-2 border-b border-bone/10 text-[11px] opacity-55 italic">
          Classified as <strong>{submission.classification}</strong>:{" "}
          {submission.classification_reason}
        </div>
      )}

      {/* Triage summary, if present */}
      {submission.triage_summary && (
        <div className="px-6 md:px-10 py-2 border-b border-bone/10 text-[11px]">
          <span className="opacity-50 mr-2 tracking-[0.18em] uppercase text-[10px]">
            Triage
          </span>
          <span className="italic">{submission.triage_summary}</span>
        </div>
      )}

      {/* ─────────── Two-column body ─────────── */}
      <div className="px-6 md:px-10 py-6 grid gap-8 lg:grid-cols-[1fr_440px]">
        {/* LEFT — display name + subject + thread + reply */}
        <section className="min-w-0 flex flex-col gap-4">
          <SubmissionRename
            submissionId={id}
            currentName={submission.display_name ?? ""}
            isOperatorSet={submission.display_name_source === "operator"}
            fallback={
              submission.from_name ?? submission.wa_identifier ?? "Anonymous"
            }
          />

          <SubjectEditor
            submissionId={id}
            currentSubject={submission.subject}
            isOperatorSet={submission.subject_source === "operator"}
          />

          {/* Files (career CVs, attachments) */}
          {files.length > 0 && (
            <div className="border border-bone/15 px-4 py-3">
              <h3 className="text-[10px] tracking-[0.22em] uppercase opacity-50 mb-2">
                Attachments
              </h3>
              <ul className="space-y-1">
                {files.map((f) => (
                  <li key={f.id} className="text-sm">
                    <span className="opacity-65 mr-2">
                      [{(f.kind ?? "file").toUpperCase()}]
                    </span>
                    {f.name}
                    {f.size_bytes && (
                      <span className="text-[10px] opacity-50 ml-2">
                        ({Math.round(f.size_bytes / 1024)} KB)
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Thread */}
          <div>
            <h2 className="text-[10px] tracking-[0.22em] uppercase opacity-50 mb-3">
              Thread
            </h2>
            {messages.length === 0 ? (
              <div className="border border-bone/15 px-4 py-8 text-sm italic opacity-55 text-center">
                No messages yet.
              </div>
            ) : (
              <ol className="space-y-2.5">
                {messages.map((m) => {
                  const inbound = m.direction === "in";
                  return (
                    <li
                      key={m.id}
                      className={`flex ${inbound ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[80%] border px-3.5 py-2.5 text-sm leading-relaxed ${
                          inbound
                            ? "border-bone/20 bg-bone/[0.04] rounded-tr-md rounded-br-md rounded-bl-md"
                            : "border-emerald-300/30 bg-emerald-300/[0.05] rounded-tl-md rounded-bl-md rounded-br-md"
                        }`}
                      >
                        <div className="text-[10px] tracking-[0.18em] uppercase opacity-50 mb-1 flex items-center gap-2">
                          <span>
                            {inbound
                              ? m.from_name ??
                                m.from_pushname ??
                                m.from_phone ??
                                "Sender"
                              : m.from_name ?? "Onyx"}
                          </span>
                          <span className="opacity-50">·</span>
                          <span className="tabular-nums">
                            {TIME_FMT.format(new Date(m.sent_at))}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap break-words">
                          {m.body_md}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          {/* Reply (WA contact only for now) */}
          {isWaContact && submission.wa_identifier && (
            <ReplyBox submissionId={id} target={submission.wa_identifier} />
          )}
          {isWaGroup && (
            <p className="text-[12px] italic opacity-55 border border-bone/15 px-4 py-3">
              Replies to groups aren&apos;t supported yet — respond in
              WhatsApp directly.
            </p>
          )}
          {submission.source !== "whatsapp" && submission.from_email && (
            <p className="text-[12px] italic opacity-55 border border-bone/15 px-4 py-3">
              Reply to {submission.from_email} via your email client. In-app
              email composer is on the roadmap.
            </p>
          )}
        </section>

        {/* RIGHT — project context vault */}
        <aside className="min-w-0">
          <h2 className="text-[10px] tracking-[0.22em] uppercase opacity-50 mb-3">
            Project context
          </h2>
          {!vaultStatus.ok && (
            <div className="mb-3 border border-amber-300/40 bg-amber-300/[0.06] px-3 py-2 text-[11px] text-amber-200">
              Vault key not configured. Credentials can&apos;t be saved.{" "}
              <Link
                href="/agents/profile"
                className="underline hover:opacity-80"
              >
                Set CHAT_CONTEXT_SECRET
              </Link>
              .
            </div>
          )}
          {context.credentials_undecryptable && (
            <div className="mb-3 border border-red-400/50 bg-red-400/[0.06] px-3 py-2 text-[11px] text-red-200">
              Stored credentials can&apos;t be decrypted (vault key changed
              or row tampered). Re-enter them below.
            </div>
          )}
          <ContextEditor submissionId={id} initial={context} />
        </aside>
      </div>
    </>
  );
}

/* ============================================================
 * Small UI bits
 * ============================================================ */

function MetaItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span>
      <span className="opacity-50 mr-1.5 tracking-[0.18em] uppercase text-[10px]">
        {label}
      </span>
      {children}
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

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const color =
    status === "new"
      ? "border-emerald-300/70 text-emerald-200"
      : status === "read"
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

function PriorityChip({ priority }: { priority: string }) {
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
