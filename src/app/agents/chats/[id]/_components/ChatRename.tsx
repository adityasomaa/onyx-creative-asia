"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { renameChatAction } from "../../actions";

/**
 * Inline display-name editor.
 *
 * When the operator types a name and saves, the server action sets
 * display_name_source='operator' so the webhook stops overwriting on
 * each new inbound event.
 *
 * "Reset to auto" sends an empty string — server action flips the
 * source back to 'auto' (next webhook re-derives the name from the phone).
 */
export default function ChatRename({
  chatId,
  currentName,
  isOperatorSet,
  phoneFallback,
}: {
  chatId: string;
  currentName: string;
  isOperatorSet: boolean;
  phoneFallback: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(currentName);
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  function save() {
    setErr(null);
    startTransition(async () => {
      const res = await renameChatAction(chatId, draft);
      if (!res.ok) {
        setErr(res.error ?? "Save failed");
        return;
      }
      setEditing(false);
      router.refresh();
    });
  }

  function reset() {
    setErr(null);
    setDraft("");
    startTransition(async () => {
      const res = await renameChatAction(chatId, "");
      if (!res.ok) {
        setErr(res.error ?? "Reset failed");
        return;
      }
      setEditing(false);
      router.refresh();
    });
  }

  return (
    <div className="border border-bone/15 px-4 py-3 flex items-center gap-3 flex-wrap">
      <span className="text-[10px] tracking-[0.22em] uppercase opacity-50 shrink-0">
        Display name
      </span>
      {editing ? (
        <>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={phoneFallback}
            disabled={pending}
            className="flex-1 min-w-[200px] bg-bone/[0.04] border border-bone/20 px-2.5 py-1.5 text-sm focus:outline-none focus:border-bone/50 disabled:opacity-50"
            maxLength={120}
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
              setDraft(currentName);
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
          <span className="flex-1 text-sm">
            {currentName || (
              <span className="italic opacity-55">{phoneFallback}</span>
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
              title="Reset to auto (will use phone number on next message)"
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
