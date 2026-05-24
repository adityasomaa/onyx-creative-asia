"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setOperatorSubjectAction } from "../../actions";

/**
 * Manual subject override. When the operator types a subject and saves,
 * subject_source flips to 'operator' — the LLM subject-refresh that
 * runs on every new inbound message will skip this row.
 *
 * Reset (empty save) flips subject_source back to 'auto'; the next
 * inbound message will trigger an LLM refresh and replace the subject.
 */
export default function SubjectEditor({
  submissionId,
  currentSubject,
  isOperatorSet,
}: {
  submissionId: string;
  currentSubject: string | null;
  isOperatorSet: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(currentSubject ?? "");
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  function save() {
    setErr(null);
    startTransition(async () => {
      const res = await setOperatorSubjectAction(submissionId, draft);
      if (!res.ok) return setErr(res.error ?? "Save failed");
      setEditing(false);
      router.refresh();
    });
  }

  function reset() {
    setErr(null);
    setDraft("");
    startTransition(async () => {
      const res = await setOperatorSubjectAction(submissionId, "");
      if (!res.ok) return setErr(res.error ?? "Reset failed");
      setEditing(false);
      router.refresh();
    });
  }

  return (
    <div className="border border-bone/15 px-4 py-3 flex items-start gap-3 flex-wrap">
      <span className="text-[10px] tracking-[0.22em] uppercase opacity-50 shrink-0 mt-1.5">
        Subject
      </span>
      {editing ? (
        <>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Describe what's being asked..."
            disabled={pending}
            className="flex-1 min-w-[260px] bg-bone/[0.04] border border-bone/20 px-2.5 py-1.5 text-sm focus:outline-none focus:border-bone/50 disabled:opacity-50"
            maxLength={200}
            autoFocus
          />
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="text-[10px] tracking-[0.18em] uppercase border border-bone/30 px-2.5 py-1 hover:bg-bone hover:text-ink disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setDraft(currentSubject ?? "");
              setErr(null);
            }}
            disabled={pending}
            className="text-[10px] tracking-[0.18em] uppercase opacity-65 hover:opacity-100 disabled:opacity-30"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <span className="flex-1 text-sm italic">
            {currentSubject || (
              <span className="opacity-45 not-italic">
                (no subject yet — LLM hasn&apos;t generated one)
              </span>
            )}
          </span>
          {isOperatorSet ? (
            <span className="text-[9px] tracking-[0.22em] uppercase border border-bone/25 px-1 py-0.5 opacity-65">
              Edited
            </span>
          ) : (
            <span className="text-[9px] tracking-[0.22em] uppercase opacity-45">
              Auto
            </span>
          )}
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-[10px] tracking-[0.18em] uppercase border border-bone/30 px-2.5 py-1 hover:bg-bone hover:text-ink"
          >
            Edit
          </button>
          {isOperatorSet && (
            <button
              type="button"
              onClick={reset}
              disabled={pending}
              className="text-[10px] tracking-[0.18em] uppercase opacity-65 hover:opacity-100"
              title="Reset to auto — LLM will refresh on next message"
            >
              Reset
            </button>
          )}
        </>
      )}
      {err && (
        <span className="basis-full text-[11px] text-red-300 italic">
          {err}
        </span>
      )}
    </div>
  );
}
