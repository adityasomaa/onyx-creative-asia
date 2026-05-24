"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { sendChatReplyAction } from "../../actions";

/**
 * Compose + send a WhatsApp reply from the chat detail.
 *
 * Send goes through the same wa-safety gate as auto-replies (working
 * hours, daily quota, recipient cooldown, global interval). On success
 * the outbound is mirrored into wa_messages so it appears in the thread.
 *
 * Two-step confirm: type → "Send" button asks to confirm → actual send.
 * Mirrors the existing ReplyBox UX on /agents/submissions.
 */
export default function ChatReplyBox({
  chatId,
  target,
}: {
  chatId: string;
  target: string;
}) {
  const [draft, setDraft] = useState("");
  const [stage, setStage] = useState<"compose" | "confirm">("compose");
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function trySend() {
    setErr(null);
    const trimmed = draft.trim();
    if (!trimmed) {
      setErr("Message is empty.");
      return;
    }
    setStage("confirm");
  }

  function actuallySend() {
    setErr(null);
    startTransition(async () => {
      const res = await sendChatReplyAction(chatId, draft);
      if (!res.ok) {
        setErr(res.error ?? "Send failed");
        setStage("compose");
        return;
      }
      setDraft("");
      setStage("compose");
      router.refresh();
    });
  }

  return (
    <div className="border border-bone/15 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] tracking-[0.22em] uppercase opacity-65">
          Reply via WhatsApp
        </h3>
        <span className="text-[10px] tracking-[0.18em] uppercase opacity-45">
          to {target}
        </span>
      </div>
      <textarea
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          if (stage === "confirm") setStage("compose");
        }}
        rows={4}
        maxLength={4000}
        disabled={pending}
        placeholder="halo, terima kasih udah message kita..."
        className="w-full bg-bone/[0.04] border border-bone/20 px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:border-bone/45 disabled:opacity-50 resize-y"
      />
      <div className="flex items-center justify-between mt-2 gap-3 flex-wrap">
        <span className="text-[10px] tracking-[0.18em] uppercase opacity-45 tabular-nums">
          {draft.length}/4000
        </span>
        <div className="flex items-center gap-2">
          {stage === "compose" ? (
            <button
              type="button"
              onClick={trySend}
              disabled={pending || draft.trim().length === 0}
              className="text-[10px] tracking-[0.18em] uppercase border border-bone/30 px-3 py-1.5 hover:bg-bone hover:text-ink disabled:opacity-40"
            >
              Send →
            </button>
          ) : (
            <>
              <span className="text-[11px] italic opacity-65">
                Send now?
              </span>
              <button
                type="button"
                onClick={() => setStage("compose")}
                disabled={pending}
                className="text-[10px] tracking-[0.18em] uppercase opacity-65 hover:opacity-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={actuallySend}
                disabled={pending}
                className="text-[10px] tracking-[0.18em] uppercase border border-emerald-300/50 text-emerald-200 px-3 py-1.5 hover:bg-emerald-300/10 disabled:opacity-40"
              >
                {pending ? "Sending…" : "Confirm send"}
              </button>
            </>
          )}
        </div>
      </div>
      {err && (
        <div className="mt-2 text-[11px] text-red-300 italic">{err}</div>
      )}
    </div>
  );
}
