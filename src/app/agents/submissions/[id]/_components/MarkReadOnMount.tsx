"use client";

import { useEffect, useRef } from "react";
import { markSubmissionOpenedAction } from "../../actions";

/**
 * On the first paint of the detail page, flip status 'new' → 'read'.
 * No-op if already past 'new'. Guarded against re-fires by a ref.
 */
export default function MarkReadOnMount({
  submissionId,
  isUnread,
}: {
  submissionId: string;
  isUnread: boolean;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (!isUnread || fired.current) return;
    fired.current = true;
    markSubmissionOpenedAction(submissionId).catch((err) => {
      console.warn("[submission/mark-opened] failed:", err);
    });
  }, [submissionId, isUnread]);
  return null;
}
