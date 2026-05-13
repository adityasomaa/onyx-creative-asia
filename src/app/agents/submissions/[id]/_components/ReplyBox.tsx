"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Channel = "email" | "whatsapp";

/**
 * ReplyBox — operator-side reply composer on the submission detail page.
 *
 * Mode: type plain reply, pick channel (email / whatsapp), confirm,
 * send. On success the submission status flips to "replied" and the
 * page refreshes so the operator sees the updated state.
 *
 * Available channels are determined by what the submission has:
 *   - email  → enabled if from_email is set
 *   - whatsapp → enabled if from_phone is set
 *
 * Confirmation step is a small inline panel (not a modal) — the
 * operator sees exactly what they're about to send + where, can
 * cancel or commit.
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
  const [phase, setPhase] = useState<"compose" | "confirm" | "sending">(
    "compose"
  );
  const [error, setError] = useState<string | null>(null);
  const [sentAt, setSentAt] = useState<number | null>(null);

  const canEmail = !!fromEmail;
  const canWhatsApp = !!fromPhone;
  const canSend = !!channel && body.trim().length > 0;

  function startConfirm() {
    setError(null);
    if (!channel) return setError("Pick a channel.");
    if (!body.trim()) return setError("Type a reply.");
    setPhase("confirm");
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

  // Already replied — show condensed compose for follow-up
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
          Sent · {new Date(sentAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
        </p>
      )}

      {/* TEXTAREA */}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        disabled={phase !== "compose"}
        rows={6}
        placeholder={`Hi ${fromName?.split(" ")[0] ?? "there"},\n\nThanks for reaching out. …`}
        className="block w-full bg-bone/[0.02] border border-bone/15 focus:border-bone/40 outline-none px-4 py-3 text-sm leading-relaxed text-bone placeholder:text-bone/30 transition-colors resize-y disabled:opacity-60"
        maxLength={5000}
      />
      <div className="mt-1 text-[10px] tracking-[0.18em] uppercase opacity-40 flex justify-between">
        <span>
          {body.length} / 5000
        </span>
        <span className="italic opacity-70 normal-case tracking-normal">
          Your email signature gets appended automatically (Profile →
          Email signature)
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

      {/* CONFIRM PANEL */}
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

      {/* ERROR */}
      {error && (
        <p className="mt-3 text-xs text-red-300 border-l-2 border-red-400 pl-3">
          {error}
        </p>
      )}

      {/* COMPOSE-PHASE SUBMIT */}
      {phase === "compose" && (
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={startConfirm}
            disabled={!canSend}
            className="bg-bone text-ink px-4 py-2 text-[11px] tracking-[0.22em] uppercase disabled:opacity-40 transition-opacity"
          >
            Review &amp; send →
          </button>
          {!canSend && (
            <span className="text-[10px] tracking-[0.18em] uppercase opacity-45">
              {channel ? "Type a reply to send" : "Pick a channel"}
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
