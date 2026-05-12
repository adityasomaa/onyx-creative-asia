import Link from "next/link";
import { notFound } from "next/navigation";
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
    <div className="px-6 md:px-10 py-12 md:py-16 max-w-4xl space-y-12 md:space-y-16">
      <p className="text-[11px] tracking-[0.3em] uppercase opacity-55 flex items-center gap-3 flex-wrap">
        <Link
          href="/agents/submissions"
          className="hover:opacity-100 transition-opacity"
        >
          ← Submissions
        </Link>
        <span aria-hidden>·</span>
        <span>ID {submission.id.slice(0, 8)}</span>
      </p>

      <section>
        <div className="flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase opacity-75 mb-6">
          <span className="border border-bone/35 px-2 py-0.5 rounded-sm">
            {SUBMISSION_SOURCE_LABEL[submission.source]}
          </span>
          <span className="border border-bone/35 px-2 py-0.5 rounded-sm">
            {SUBMISSION_STATUS_LABEL[submission.status]}
          </span>
          <span className="opacity-60">
            {DATE_FMT.format(new Date(submission.received_at))}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]">
          {submission.subject ?? "(no subject)"}
        </h1>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <Meta label="From">
            <p className="font-medium">
              {submission.from_name ?? "Anonymous"}
            </p>
            {submission.from_email && (
              <a
                href={`mailto:${submission.from_email}`}
                className="block opacity-70 hover:opacity-100"
              >
                {submission.from_email}
              </a>
            )}
            {submission.from_phone && (
              <p className="opacity-70">{submission.from_phone}</p>
            )}
          </Meta>
          <Meta label="Budget">
            <p>{submission.budget_band ?? "—"}</p>
          </Meta>
          <Meta label="Interest">
            <ul className="flex flex-wrap gap-1.5">
              {submission.interest.length > 0 ? (
                submission.interest.map((t) => (
                  <li
                    key={t}
                    className="text-[10px] tracking-wider uppercase border border-bone/30 rounded px-2 py-0.5"
                  >
                    {t}
                  </li>
                ))
              ) : (
                <li className="opacity-60 italic">—</li>
              )}
            </ul>
          </Meta>
        </div>
      </section>

      <section>
        <p className="text-[11px] tracking-[0.3em] uppercase opacity-65 mb-4">
          // BODY
        </p>
        <div className="border-l-2 border-bone/30 pl-6 py-2 text-base md:text-lg leading-[1.7] whitespace-pre-wrap opacity-90">
          {submission.body_md ?? "(no body)"}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 border-y border-bone/15 py-8">
        <div>
          <p className="text-[11px] tracking-[0.25em] uppercase opacity-55 mb-3">
            Linked client
          </p>
          {submission.client ? (
            <Link
              href={`/agents/onboarding/${submission.client.slug}`}
              className="text-base md:text-lg hover:opacity-70 transition-opacity"
            >
              → {submission.client.name}
            </Link>
          ) : (
            <p className="opacity-60 italic">— not linked</p>
          )}
        </div>
        <div>
          <p className="text-[11px] tracking-[0.25em] uppercase opacity-55 mb-3">
            Linked project
          </p>
          {submission.project ? (
            <p className="text-base md:text-lg">
              {submission.project.title}
              <span className="opacity-60 ml-2 text-sm italic">
                · {submission.project.stage}
              </span>
            </p>
          ) : (
            <p className="opacity-60 italic">— not linked</p>
          )}
        </div>
      </section>

      <section>
        <p className="text-[11px] tracking-[0.3em] uppercase opacity-65 mb-4">
          // FILES · {files.length}
        </p>
        {files.length === 0 ? (
          <p className="text-sm opacity-60 italic">
            No attachments. Email/WhatsApp attachments will land here once
            the ingest workers ship in Phase 2.
          </p>
        ) : (
          <ul className="space-y-2">
            {files.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between py-2 border-b border-bone/10 text-sm"
              >
                <span>{f.name}</span>
                <span className="text-[11px] tracking-[0.15em] uppercase opacity-60">
                  {f.mime_type ?? "—"} · {f.size_bytes ?? 0}b
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {submission.triaged_at && (
        <section className="text-[11px] tracking-[0.2em] uppercase opacity-50">
          TRIAGED · {DATE_FMT.format(new Date(submission.triaged_at))}
          {submission.triaged_by && ` · by ${submission.triaged_by}`}
        </section>
      )}
    </div>
  );
}

function Meta({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] tracking-[0.25em] uppercase opacity-55 mb-2">
        {label}
      </p>
      {children}
    </div>
  );
}
