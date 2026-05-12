import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "../../_components/PageHeader";
import {
  getSubmissionById,
  listFilesForSubmission,
  SUBMISSION_SOURCE_LABEL,
  SUBMISSION_STATUS_LABEL,
} from "@/lib/db/submissions";

export const dynamic = "force-dynamic";

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function SubmissionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const submission = await getSubmissionById(id);
  if (!submission) notFound();

  const files = await listFilesForSubmission(id);

  return (
    <>
      <PageHeader
        kicker={submission.id.slice(0, 8).toUpperCase()}
        title={submission.subject ?? "(no subject)"}
        breadcrumb={[
          { href: "/agents/submissions", label: "Submissions" },
          {
            href: `/agents/submissions/${submission.id}`,
            label: submission.id.slice(0, 8),
          },
        ]}
      />

      <div className="px-6 md:px-10 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl">
        {/* MAIN COLUMN */}
        <div className="md:col-span-2 space-y-6">
          {/* META BAR */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] tracking-[0.18em] uppercase opacity-75">
            <span className="border border-bone/30 px-2 py-1">
              {SUBMISSION_SOURCE_LABEL[submission.source]}
            </span>
            <span className="border border-bone/30 px-2 py-1">
              {SUBMISSION_STATUS_LABEL[submission.status]}
            </span>
            <span className="opacity-60 ml-1">
              {DATE_FMT.format(new Date(submission.received_at))}
            </span>
          </div>

          {/* BODY */}
          <section>
            <SectionHead label="Body" />
            <div className="border border-bone/15 px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap opacity-90">
              {submission.body_md ?? "(no body)"}
            </div>
          </section>

          {/* FILES */}
          <section>
            <SectionHead
              label="Attachments"
              tail={`${files.length}`}
            />
            {files.length === 0 ? (
              <p className="text-sm opacity-55 italic border border-bone/15 px-4 py-3">
                No attachments. Email + WhatsApp attachments will land
                here once Phase 2 ingest workers ship.
              </p>
            ) : (
              <ul className="border border-bone/15 divide-y divide-bone/10">
                {files.map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center justify-between px-4 py-2.5 text-sm"
                  >
                    <span>{f.name}</span>
                    <span className="text-[10px] tracking-[0.15em] uppercase opacity-55">
                      {f.mime_type ?? "—"} · {f.size_bytes ?? 0}b
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* PROPERTIES SIDE */}
        <aside className="space-y-4 md:sticky md:top-6 md:self-start">
          <PropertyPanel label="From">
            <p className="text-sm font-medium">
              {submission.from_name ?? "Anonymous"}
            </p>
            {submission.from_email && (
              <a
                href={`mailto:${submission.from_email}`}
                className="block text-xs opacity-70 hover:opacity-100 transition-opacity"
              >
                {submission.from_email}
              </a>
            )}
            {submission.from_phone && (
              <p className="text-xs opacity-70">{submission.from_phone}</p>
            )}
          </PropertyPanel>

          <PropertyPanel label="Budget">
            <p className="text-sm">{submission.budget_band ?? "—"}</p>
          </PropertyPanel>

          <PropertyPanel label="Interest">
            {submission.interest.length > 0 ? (
              <ul className="flex flex-wrap gap-1">
                {submission.interest.map((t) => (
                  <li
                    key={t}
                    className="text-[10px] tracking-wider uppercase border border-bone/25 rounded px-1.5 py-0.5"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs italic opacity-55">—</p>
            )}
          </PropertyPanel>

          <PropertyPanel label="Linked client">
            {submission.client ? (
              <Link
                href={`/agents/onboarding/${submission.client.slug}`}
                className="text-sm hover:opacity-70 transition-opacity"
              >
                → {submission.client.name}
              </Link>
            ) : (
              <p className="text-xs italic opacity-55">— not linked</p>
            )}
          </PropertyPanel>

          <PropertyPanel label="Linked project">
            {submission.project ? (
              <div>
                <p className="text-sm">{submission.project.title}</p>
                <p className="text-[10px] tracking-[0.15em] uppercase opacity-50 mt-1">
                  {submission.project.stage}
                </p>
              </div>
            ) : (
              <p className="text-xs italic opacity-55">— not linked</p>
            )}
          </PropertyPanel>

          {submission.triaged_at && (
            <PropertyPanel label="Triaged">
              <p className="text-xs opacity-75">
                {DATE_FMT.format(new Date(submission.triaged_at))}
              </p>
              {submission.triaged_by && (
                <p className="text-[10px] tracking-[0.15em] uppercase opacity-50 mt-1">
                  by {submission.triaged_by}
                </p>
              )}
            </PropertyPanel>
          )}
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

function PropertyPanel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-bone/15 p-4">
      <p className="text-[10px] tracking-[0.22em] uppercase opacity-55 mb-2">
        {label}
      </p>
      {children}
    </div>
  );
}
