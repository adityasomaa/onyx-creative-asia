"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  setChatArchivedAction,
  setChatClassificationAction,
} from "../../actions";
import type { WaChatClassification } from "@/lib/db/wa-chats";

/**
 * Top-right action cluster on a chat detail page.
 *
 * - "Ignore future" — for chats currently in the active inbox.
 *   Sets classification='manual_ignored' so subsequent inbound
 *   messages stay silent (no email, no auto-reply, doesn't show
 *   in active inbox). Operator can undo.
 *
 * - "Bring back to inbox" — for chats currently in personal/ignored.
 *   Sets classification='manual_business' so future messages re-enter
 *   the inbox.
 *
 * - Archive / Unarchive — operator-toggleable. Doesn't affect
 *   classification — purely a tidy-up for chats that are resolved.
 */
export default function ChatActions({
  chatId,
  classification,
  archived,
}: {
  chatId: string;
  classification: WaChatClassification;
  archived: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  const isInActiveInbox =
    classification === "business" ||
    classification === "pending" ||
    classification === "manual_business";

  function classify(next: WaChatClassification) {
    setErr(null);
    startTransition(async () => {
      const res = await setChatClassificationAction(chatId, next);
      if (!res.ok) {
        setErr(res.error ?? "Failed");
        return;
      }
      router.refresh();
    });
  }

  function toggleArchive() {
    setErr(null);
    startTransition(async () => {
      const res = await setChatArchivedAction(chatId, !archived);
      if (!res.ok) {
        setErr(res.error ?? "Failed");
        return;
      }
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
          title="Hide this chat from the inbox; future messages won't notify"
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
