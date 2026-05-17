"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TriagePayload = {
  summary?: string;
  priority?: string;
  disciplines?: string[];
  budget_hint?: string | null;
  urgency_signals?: string | null;
  model?: string;
  ranAt?: string;
};

/**
 * TriageCard — shows the LLM's read on a submission with a "Re-triage"
 * button to re-run if it got it wrong (or to refresh after editing the
 * body manually in the DB).
 *
 * Pulls the most-recent triage data from the props (passed from the
 * server-rendered detail page). After a re-triage, refreshes the page
 * so the parent re-fetches.
 */
export default function TriageCard({
  submissionId,
  initialSummary,
  initialPriority,
  initialModel,
  initialPayload,
}: {
  submissionId: string;
  initialSummary: string | null;
  initialPriority: string | null;
  initialModel: string | null;
  initialPayload: TriagePayload | null;
}) {
  const router = useRouter();
  const [summary, setSummary] = useState(initialSummary);
  const [priority, setPriority] = useState(initialPriority);
  const [model, setModel] = useState(initialModel);
  const [payload, setPayload] = useState<TriagePayload | null>(initialPayload);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function reTriage() {
    setRunning(true);
    setError(null);
    try {
      const res = await fetch(`/api/submissions/${submissionId}/triage`, {
        method: "POST",
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        model?: string;
        triage?: TriagePayload & { inquiry_type?: string };
      };
      if (!res.ok || data.ok === false || !data.triage) {
        setError(data.error ?? "Re-triage failed.");
        return;
      }
      setSummary(data.triage.summary ?? null);
      setPriority(data.triage.priority ?? null);
      setModel(data.model ?? null);
      setPayload({
        ...data.triage,
        model: data.model,
        ranAt: new Date().toISOString(),
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setRunning(false);
    }
  }

  const hasTriage = !!summary || !!priority;

  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-[10px] tracking-[0.22em] uppercase opacity-65">
          AI Triage
        </p>
        <button
          type="button"
          onClick={() => void reTriage()}
          disabled={running}
          className="text-[10px] tracking-[0.22em] uppercase opacity-70 hover:opacity-100 disabled:opacity-40 transition-opacity"
          title="Re-run the LLM triage on this submission"
        >
          {running ? "Running…" : hasTriage ? "↻ Re-triage" : "✨ Run triage"}
        </button>
      </div>

      {!hasTriage && !running && (
        <p className="text-xs italic opacity-55 border border-bone/15 px-4 py-3">
          Not triaged yet. Click <strong>Run triage</strong> to have Gemini
          summarise this submission and assign a priority.
        </p>
      )}

      {hasTriage && (
        <div className="border border-bone/15 divide-y divide-bone/10">
          {summary && (
            <div className="px-4 py-3">
              <p className="text-[9px] tracking-[0.22em] uppercase opacity-50 mb-1">
                Summary
              </p>
              <p className="text-sm leading-relaxed">{summary}</p>
            </div>
          )}
          <div className="px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
            {priority && (
              <Field
                label="Priority"
                value={
                  <PriorityChip priority={priority} />
                }
              />
            )}
            {payload?.disciplines && payload.disciplines.length > 0 && (
              <Field
                label="Disciplines"
                value={
                  <span className="font-mono opacity-90">
                    {payload.disciplines.join(", ")}
                  </span>
                }
              />
            )}
            {payload?.budget_hint && (
              <Field
                label="Budget hint"
                value={
                  <span className="font-medium">{payload.budget_hint}</span>
                }
              />
            )}
            {payload?.urgency_signals && (
              <Field
                label="Urgency"
                value={
                  <span className="italic">{payload.urgency_signals}</span>
                }
              />
            )}
          </div>
          {model && (
            <div className="px-4 py-2 text-[9px] tracking-[0.22em] uppercase opacity-40 italic flex justify-between">
              <span>via {model}</span>
              {payload?.ranAt && (
                <span>
                  {new Date(payload.ranAt).toLocaleString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-3 text-xs text-red-300 border-l-2 border-red-400 pl-3">
          {error}
        </p>
      )}
    </section>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[9px] tracking-[0.22em] uppercase opacity-50 mb-1">
        {label}
      </p>
      {value}
    </div>
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
      className={`inline-block border rounded-sm px-1.5 py-0.5 text-[10px] tracking-[0.18em] uppercase ${color}`}
    >
      {priority}
    </span>
  );
}
