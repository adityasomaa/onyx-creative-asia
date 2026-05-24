"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  archiveSubmissionAction,
  setSubmissionClassificationAction,
} from "../../actions";
import type { Classification } from "@/lib/db/submissions";

/**
 * Top-right cluster on a submission detail.
 *
 * - "Ignore future" — for submissions in the active inbox.
 *   Flips classification to 'manual_ignored' so subsequent inbound
 *   from this contact stays silent.
 * - "Bring back to inbox" — for personal/ignored.
 *   Flips classification to 'manual_business' so future messages
 *   re-enter the inbox.
 * - Archive / Unarchive — operator-toggleable. Doesn't affect
 *   classification — visibility-only.
 */
export default function SubmissionActions({
  submissionId,
  classification,
  status,
}: {
  submissionId: string;
  classification: Classification;
  status: string;
}) {
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const isInActiveInbox =
    classification === "business" ||
    classification === "pending" ||
    classification === "manual_business";
  const archived = status === "archived";

  function classify(next: Classification) {
    setErr(null);
    startTransition(async () => {
      const res = await setSubmissionClassificationAction(submissionId, next);
      if (!res.ok) return setErr(res.error ?? "Failed");
      router.refresh();
    });
  }

  function toggleArchive() {
    setErr(null);
    startTransition(async () => {
      const res = await archiveSubmissionAction(submissionId, !archived);
      if (!res.ok) return setErr(res.error ?? "Failed");
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {isInActiveInbox && (
        <button
          type="button"
          onClick={() => classify("manual_ignored")}
          disabled={pending}
          className="text-[10px] tracking-[0.18em] uppercase border border-bone/30 px-2.5 py-1 hover:bg-bone hover:text-ink disabled:opacity-50"
          title="Hide from inbox; future messages won't notify"
        >
          {pending ? "…" : "Ignore future"}
        </button>
      )}
      {!isInActiveInbox && (
        <button
          type="button"
          onClick={() => classify("manual_business")}
          disabled={pending}
          className="text-[10px] tracking-[0.18em] uppercase border border-emerald-300/50 text-emerald-200 px-2.5 py-1 hover:bg-emerald-300/10 disabled:opacity-50"
          title="Promote back to the active inbox"
        >
          {pending ? "…" : "Bring back to inbox"}
        </button>
      )}
      <button
        type="button"
        onClick={toggleArchive}
        disabled={pending}
        className="text-[10px] tracking-[0.18em] uppercase border border-bone/30 px-2.5 py-1 hover:bg-bone hover:text-ink disabled:opacity-50"
      >
        {pending ? "…" : archived ? "Unarchive" : "Archive"}
      </button>
      {err && (
        <span className="text-[10px] tracking-[0.18em] uppercase text-red-300">
          {err}
        </span>
      )}
    </div>
  );
}
