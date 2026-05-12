"use client";

import { useState } from "react";
import type { InquiryType } from "../inquiry-types";

export type SubmitStatus = "idle" | "submitting" | "sent";

export type SubmitPayload = Record<string, unknown> & {
  inquiryType: InquiryType;
};

/**
 * Shared submit logic for every sub-form:
 *   - manages idle / submitting / sent transitions
 *   - opens WhatsApp pre-filled (for sub-forms that want it)
 *   - POSTs the typed payload to /api/leads
 *   - bubbles errors back to the caller
 *
 * Each sub-form decides whether to open the WhatsApp tab. Career +
 * partnership skip it (those visitors usually don't want a WA chat
 * immediately); general + project still open it for fast follow-up.
 */
export function useInquirySubmit() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setStatus("idle");
    setError(null);
  }

  async function submit(payload: SubmitPayload, opts?: { whatsappText?: string }) {
    setStatus("submitting");
    setError(null);

    if (opts?.whatsappText && typeof window !== "undefined") {
      const waNumber = "62895413372822";
      window.open(
        `https://wa.me/${waNumber}?text=${encodeURIComponent(opts.whatsappText)}`,
        "_blank",
        "noopener,noreferrer"
      );
    }

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let body: { ok?: boolean; error?: string } = {};
      try {
        body = await res.json();
      } catch {
        // ignore non-json
      }

      if (!res.ok || body.ok === false) {
        setStatus("idle");
        setError(
          body.error ??
            "Couldn't deliver this just now. Mind trying again, or write to hello@onyxcreative.asia?"
        );
        return false;
      }

      setStatus("sent");
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error.";
      console.error("[contact] submit failed:", msg);
      setStatus("idle");
      setError(
        "Couldn't reach the server. Check your connection and try again — or write to hello@onyxcreative.asia."
      );
      return false;
    }
  }

  return {
    status,
    submitting: status === "submitting",
    sent: status === "sent",
    error,
    setError,
    submit,
    reset,
  };
}
