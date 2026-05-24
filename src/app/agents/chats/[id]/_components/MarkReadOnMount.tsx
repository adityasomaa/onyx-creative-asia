"use client";

import { useEffect, useRef } from "react";
import { markChatReadAction } from "../../actions";

/**
 * Flips the chat to read on first paint of the detail page.
 * No-op if it's already read. Effectively "open = mark as seen".
 *
 * Runs once via ref guard so re-renders don't re-fire the server action.
 */
export default function MarkReadOnMount({
  chatId,
  alreadyRead,
}: {
  chatId: string;
  alreadyRead: boolean;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (alreadyRead || fired.current) return;
    fired.current = true;
    markChatReadAction(chatId, true).catch((err) => {
      console.warn("[chats/mark-read] failed:", err);
    });
  }, [chatId, alreadyRead]);

  return null;
}
