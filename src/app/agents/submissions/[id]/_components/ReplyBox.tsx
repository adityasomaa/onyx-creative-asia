"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Channel = "email" | "whatsapp";

/**
 * ReplyBox — operator-side reply composer on the submission detail page.
 *
 * Flow:
 *   1. Type a quick draft
 *   2. Pick channel (email / whatsapp)
 *   3. (Optional) Click "Enhance with Gemini" → LLM polishes per the
 *      operator's saved reply_tone. A diff panel shows before/after;
 *      operator can Accept, Edit again, or Discard.
 *   4. Click "Review & send" → inline confirm panel
 *   5. Click "Send now" → POST to /api/submissions/[id]/reply
 *
 * On send success the submission status flips to "replied" and the
 * page refreshes so the operator sees the updated state. Enhancement
 * never sends — pure copy-polishing layer.
 */
export default function ReplyBox({
  submissionId,
  fromName,
  fromEmail,
  fromPhone,
  status,
}: {
  submissionId: string;
  fromName: string | null;
  fromEmail: string | null;
  fromPhone: string | null;
  status: string;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState<Channel | null>(
    fromEmail ? "email" : fromPhone ? "whatsapp" : null
  );
  const [phase, setPhase] = useState<
    "compose" | "enhancing" | "review-enhanced" | "confirm" | "sending"
  >("compose");
  const [error, setError] = useState<string | null>(null);
  const [sentAt, setSentAt] = useState<number | null>(null);

  // Enhancement state
  const [enhanced, setEnhanced] = useState<string | null>(null);
  const [enhancementModel, setEnhancementModel] = useState<string | null>(null);
  const [originalDraft, setOriginalDraft] = useState<string | null>(null);

  const canEmail = !!fromEmail;
  const canWhatsApp = !!fromPhone;
  const canSend = !!channel && body.trim().length > 0;
  const canEnhance =
    !!channel && body.trim().length > 0 && phase === "compose";

  function startConfirm() {
    setError(null);
    if (!channel) return setError("Pick a channel.");
    if (!body.trim()) return setError("Type a reply.");
    setPhase("confirm");
  }

  async function enhance() {
    if (!channel || !body.trim()) return;
    setPhase("enhancing");
    setError(null);
    try {
      const res = await fetch(
        `/api/submissions/${submissionId}/enhance-reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ draft: body.trim(), channel }),
        }
      );
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        enhanced?: string;
        original?: string;
        model?: string;
      };
      if (!res.ok || data.ok === false || !data.enhanced) {
        setError(data.error ?? "Enhancement failed.");
        setPhase("compose");
        return;
      }
      setOriginalDraft(data.original ?? body.trim());
      setEnhanced(data.enhanced);
      setEnhancementModel(data.model ?? null);
      setPhase("review-enhanced");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
      setPhase("compose");
    }
  }

  function acceptEnhancement() {
    if (enhanced) setBody(enhanced);
    setEnhanced(null);
    setOriginalDraft(null);
    setPhase("compose");
  }

  function discardEnhancement() {
    if (originalDraft) setBody(originalDraft);
    setEnhanced(null);
    setOriginalDraft(null);
    setPhase("compose");
  }

  async function send() {
    if (!channel) return;
    setPhase("sending");
    setError(null);
    try {
      const res = await fetch(`/api/submissions/${submissionId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, body: body.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || data.ok === false) {
        setError(data.error ?? "Send failed.");
        setPhase("compose");
        return;
      }
      setSentAt(Date.now());
      setBody("");
      setPhase("compose");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
      setPhase("compose");
    }
  }

  const alreadyReplied = status === "replied";

  return (
    <section>
      <SectionHead
        label="Reply"
        tail={
          alreadyReplied ? "Already replied — send a follow-up?" : undefined
        }
      />

      {sentAt && (
        <p className="text-[11px] tracking-[0.18em] uppercase text-emerald-300 mb-3">
          Sent ·{" "}
          {new Date(sentAt).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}

      {/* TEXTAREA */}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        disabled={phase === "sending" || phase === "review-enhanced"}
        rows={6}
        placeholder={`Hi ${fromName?.split(" ")[0] ?? "there"},\n\nThanks for reaching out. …`}
        className="block w-full bg-bone/[0.02] border border-bone/15 focus:border-bone/40 outline-none px-4 py-3 text-sm leading-relaxed text-bone placeholder:text-bone/30 transition-colors resize-y disabled:opacity-60"
        maxLength={5000}
      />
      <div className="mt-1 text-[10px] tracking-[0.18em] uppercase opacity-40 flex justify-between">
        <span>{body.length} / 5000</span>
        <span className="italic opacity-70 normal-case tracking-normal">
          Email signature auto-appended (Profile → Email signature)
        </span>
      </div>

      {/* CHANNEL CHIPS */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] tracking-[0.18em] uppercase">
        <span className="opacity-50 mr-1">Send via</span>
        <ChannelChip
          channel="email"
          active={channel === "email"}
          available={canEmail}
          onClick={() => setChannel("email")}
          subtitle={canEmail ? fromEmail ?? "" : "no email on submission"}
        />
        <ChannelChip
          channel="whatsapp"
          active={channel === "whatsapp"}
          available={canWhatsApp}
          onClick={() => setChannel("whatsapp")}
          subtitle={canWhatsApp ? fromPhone ?? "" : "no number on submission"}
        />
      </div>

      {/* REVIEW ENHANCEMENT PANEL */}
      {phase === "review-enhanced" && enhanced && originalDraft && (
        <div className="mt-4 border border-bone/30 bg-bone/[0.03]">
          <div className="px-4 py-2 border-b border-bone/15 flex items-baseline justify-between">
            <p className="text-[10px] tracking-[0.22em] uppercase opacity-65">
              Enhanced draft
            </p>
            {enhancementModel && (
              <p className="text-[9px] tracking-[0.18em] uppercase opacity-45 italic normal-case">
                via {enhancementModel}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-bone/10">
            <div className="px-4 py-3">
              <p className="text-[9px] tracking-[0.22em] uppercase opacity-45 mb-2">
                Your draft
              </p>
              <p className="text-xs leading-relaxed whitespace-pre-wrap opacity-65">
                {originalDraft}
              </p>
            </div>
            <div className="px-4 py-3 bg-bone/[0.02]">
              <p className="text-[9px] tracking-[0.22em] uppercase text-emerald-300 mb-2">
                Polished
              </p>
              <p className="text-xs leading-relaxed whitespace-pre-wrap opacity-95">
                {enhanced}
              </p>
            </div>
          </div>
          <div className="px-4 py-3 border-t border-bone/15 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={acceptEnhancement}
              className="bg-bone text-ink px-4 py-2 text-[11px] tracking-[0.22em] uppercase hover:opacity-90"
            >
              Use polished
            </button>
            <button
              type="button"
              onClick={discardEnhancement}
              className="px-3 py-2 text-[11px] tracking-[0.22em] uppercase opacity-70 hover:opacity-100"
            >
              Keep my draft
            </button>
            <button
              type="button"
              onClick={() => {
                if (enhanced) setBody(enhanced);
                setEnhanced(null);
                setOriginalDraft(null);
                setPhase("compose");
                void enhance();
              }}
              className="ml-auto text-[10px] tracking-[0.22em] uppercase opacity-55 hover:opacity-100"
            >
              ↻ Try again
            </button>
          </div>
        </div>
      )}

      {/* CONFIRM PANEL (send) */}
      {phase === "confirm" && (
        <div className="mt-4 border border-bone/30 px-4 py-3 bg-bone/[0.03]">
          <p className="text-[10px] tracking-[0.22em] uppercase opacity-65 mb-2">
            Confirm
          </p>
          <p className="text-sm leading-relaxed mb-3">
            Send this reply via{" "}
            <strong>{channel === "email" ? "Email" : "WhatsApp"}</strong> to{" "}
            <strong>{fromName ?? "the sender"}</strong>?
            <span className="block text-[11px] opacity-65 italic mt-1">
              {channel === "email" ? fromEmail : fromPhone}
            </span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void send()}
              disabled={phase !== "confirm"}
              className="bg-bone text-ink px-4 py-2 text-[11px] tracking-[0.22em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Send now
            </button>
            <button
              type="button"
              onClick={() => setPhase("compose")}
              className="px-3 py-2 text-[11px] tracking-[0.22em] uppercase opacity-70 hover:opacity-100 transition-opacity"
            >
              Edit message
            </button>
          </div>
        </div>
      )}

      {/* SENDING STATE */}
      {phase === "sending" && (
        <p className="mt-4 text-[11px] tracking-[0.18em] uppercase opacity-70 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Sending via {channel === "email" ? "Email" : "WhatsApp"}…
        </p>
      )}

      {/* ENHANCING STATE */}
      {phase === "enhancing" && (
        <p className="mt-4 text-[11px] tracking-[0.18em] uppercase opacity-70 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Polishing draft via Gemini…
        </p>
      )}

      {/* ERROR */}
      {error && (
        <p className="mt-3 text-xs text-red-300 border-l-2 border-red-400 pl-3">
          {error}
        </p>
      )}

      {/* COMPOSE-PHASE SUBMIT + ENHANCE */}
      {phase === "compose" && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={startConfirm}
            disabled={!canSend}
            className="bg-bone text-ink px-4 py-2 text-[11px] tracking-[0.22em] uppercase disabled:opacity-40 transition-opacity"
          >
            Review &amp; send →
          </button>
          <button
            type="button"
            onClick={() => void enhance()}
            disabled={!canEnhance}
            className="border border-bone/40 px-4 py-2 text-[11px] tracking-[0.22em] uppercase hover:bg-bone/5 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
            title="Polish your draft with Gemini using your saved reply tone"
          >
            ✨ Enhance with Gemini
          </button>
          {!canSend && (
            <span className="text-[10px] tracking-[0.18em] uppercase opacity-45">
              {channel ? "Type a reply first" : "Pick a channel"}
            </span>
          )}
        </div>
      )}
    </section>
  );
}

function ChannelChip({
  channel,
  active,
  available,
  onClick,
  subtitle,
}: {
  channel: Channel;
  active: boolean;
  available: boolean;
  onClick: () => void;
  subtitle: string;
}) {
  const label = channel === "email" ? "Email" : "WhatsApp";
  return (
    <button
      type="button"
      onClick={available ? onClick : undefined}
      disabled={!available}
      className={`flex items-center gap-2 border px-3 py-1.5 transition-colors ${
        active
          ? "border-bone bg-bone text-ink"
          : available
            ? "border-bone/30 hover:border-bone/60 opacity-85"
            : "border-bone/15 opacity-40 cursor-not-allowed"
      }`}
    >
      <span>{label}</span>
      {subtitle && (
        <span
          className={`text-[9px] tracking-[0.12em] normal-case ${active ? "opacity-65" : "opacity-50"}`}
        >
          {subtitle}
        </span>
      )}
    </button>
  );
}

function SectionHead({ label, tail }: { label: string; tail?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-3">
      <p className="text-[10px] tracking-[0.22em] uppercase opacity-65">
        {label}
      </p>
      {tail && (
        <p className="text-[10px] tracking-[0.18em] uppercase opacity-40">
          {tail}
        </p>
      )}
    </div>
  );
}
