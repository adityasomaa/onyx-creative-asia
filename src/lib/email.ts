/**
 * Outbound email — Resend wrapper.
 *
 * Two functions used from /api/leads:
 *   - sendAutoReply()           → confirmation to the person who submitted
 *   - sendInternalNotification() → alert to hello@onyxcreative.asia
 *
 * Both accept an `inquiryType` so the subject line + body adapt to the
 * kind of inbound (project, career, partnership, general). Both no-op
 * (and log) when RESEND_API_KEY isn't set — useful in dev + preview.
 */

import { Resend } from "resend";
import { getWaDisplay, getWaLink } from "@/lib/wa-number";

const FROM_DEFAULT = "Onyx Creative Asia <hello@onyxcreative.asia>";
const INTERNAL_TO_DEFAULT = "hello@onyxcreative.asia";

export type InquiryType = "general" | "project" | "career" | "partnership";

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function fromAddress(): string {
  return process.env.RESEND_FROM ?? FROM_DEFAULT;
}

function internalRecipient(): string {
  return process.env.INTERNAL_NOTIFY_EMAIL ?? INTERNAL_TO_DEFAULT;
}

/* ============================================================
 * Per-type copy
 * ============================================================ */

/**
 * Per-type auto-reply copy.
 *
 * Every type's `intro` is structured the same way so the reader gets
 * one clear signal: their submission landed with the team, and a real
 * reply is on the way. The `sla` tightens that promise into a concrete
 * timeframe ("within 48 hours", "within 7 days", etc.).
 */
const AUTO_REPLY_COPY: Record<
  InquiryType,
  {
    subject: (n: string) => string;
    confirmation: string; // single-sentence "received by team" line
    intro: string;        // longer paragraph — context + tone
    sla: string;          // explicit response timeframe
  }
> = {
  general: {
    subject: (n) =>
      `Received: your message — Onyx will respond soon, ${n}.`,
    confirmation:
      "Your message has just landed with the Onyx team. Consider it received — a real reply is on the way.",
    intro:
      "Thanks for reaching out. We read every message ourselves, and we'll come back to you personally — not with an autoresponder follow-up.",
    sla: "Expect a reply within 48 hours (often sooner). If something's urgent, the WhatsApp tab we just opened is the fastest path.",
  },
  project: {
    subject: (n) =>
      `Received: your project brief — Onyx will respond soon, ${n}.`,
    confirmation:
      "Your brief has just landed with the Onyx team. Consider it received — we're reading it now.",
    intro:
      "Thanks for sharing it. We treat every brief seriously: same care whether it's $1k or $50k. If it's a fit, we'll come back with a quick scope and timeline. If it's not, we'll tell you straight.",
    sla: "Expect a reply within 48 hours. We work in Bali but write back from wherever the work is.",
  },
  career: {
    subject: (n) =>
      `Received: your application — Onyx will respond soon, ${n}.`,
    confirmation:
      "Your application has just landed with the Onyx team. Consider it received — every word, including the portfolio, gets a careful read.",
    intro:
      "Thanks for applying to Onyx Creative Asia. No black-box ATS, no algorithmic filter — applications are read by the people you'd actually work with.",
    sla: "Expect a reply within 7 days. If we want to move forward we'll send a short async exercise — no panel interviews, no whiteboards.",
  },
  partnership: {
    subject: (n) =>
      `Received: your proposal — Onyx will respond soon, ${n}.`,
    confirmation:
      "Your proposal has just landed with the Onyx team. Consider it received — we'll give it an honest read.",
    intro:
      "Thanks for reaching out about a partnership. We're selective about who we work alongside, so the answer is sometimes no — but it'll always be a real reply with the reasoning.",
    sla: "Expect a reply within 5 days. If there's a fit, we usually move to a short async exchange before a call.",
  },
};

const INTERNAL_SUBJECT: Record<InquiryType, string> = {
  general: "Question",
  project: "Brief",
  career: "Application",
  partnership: "Proposal",
};

/* ============================================================
 * Auto-reply
 * ============================================================ */

export type AutoReplyInput = {
  toName: string;
  toEmail: string;
  inquiryType: InquiryType;
  /** Free-form structured-data block rendered as a key/value table.
   *  Only the most useful 2–4 fields per type — keeps the email short. */
  metaRows: { label: string; value: string }[];
};

export async function sendAutoReply(
  input: AutoReplyInput
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const client = getClient();
  if (!client) {
    console.warn("[email] RESEND_API_KEY not set — skipping auto-reply.");
    return { ok: true };
  }

  const firstName = input.toName.split(/\s+/)[0] || input.toName;
  const copy = AUTO_REPLY_COPY[input.inquiryType];

  const subject = copy.subject(firstName);
  const text = buildAutoReplyText({ firstName, copy, metaRows: input.metaRows });
  const html = buildAutoReplyHtml({
    firstName,
    confirmation: copy.confirmation,
    intro: copy.intro,
    sla: copy.sla,
    metaRows: input.metaRows,
  });

  try {
    const res = await client.emails.send({
      from: fromAddress(),
      to: input.toEmail,
      subject,
      text,
      html,
      replyTo: internalRecipient(),
    });
    if (res.error) {
      console.error("[email] auto-reply failed:", res.error);
      return { ok: false, error: res.error.message };
    }
    return { ok: true, id: res.data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[email] auto-reply threw:", msg);
    return { ok: false, error: msg };
  }
}

/* ============================================================
 * Internal notification
 * ============================================================ */

export type InternalNotificationInput = {
  fromName: string;
  fromEmail: string;
  inquiryType: InquiryType;
  /** Tagline shown under the title, e.g. "$5k–$10k · Web Development, Brand & Design" */
  highlight?: string;
  /** Key/value table rows — same shape as auto-reply. */
  metaRows: { label: string; value: string }[];
  /** The main body (brief / proposal / cover letter / question). */
  body: string;
  /** When present, included as a "Open CV →" link in the email. Signed URL. */
  cvUrl?: string | null;
  /** Portfolio link (career) or website (partnership) — already validated. */
  externalLink?: { label: string; url: string } | null;
  submissionId?: string | null;
};

export async function sendInternalNotification(
  input: InternalNotificationInput
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const client = getClient();
  if (!client) {
    console.warn(
      "[email] RESEND_API_KEY not set — skipping internal notification."
    );
    return { ok: true };
  }

  const typeLabel = INTERNAL_SUBJECT[input.inquiryType];
  const highlight = input.highlight ? ` · ${input.highlight}` : "";
  const subject = `[Onyx · new ${typeLabel.toLowerCase()}] ${input.fromName}${highlight}`;

  const submissionUrl = input.submissionId
    ? `https://agents.onyxcreative.asia/submissions/${input.submissionId}`
    : "https://agents.onyxcreative.asia/submissions";

  const text = buildInternalText({
    typeLabel,
    fromName: input.fromName,
    fromEmail: input.fromEmail,
    metaRows: input.metaRows,
    body: input.body,
    cvUrl: input.cvUrl,
    externalLink: input.externalLink,
    submissionUrl,
  });

  const html = buildInternalHtml({
    typeLabel,
    fromName: input.fromName,
    fromEmail: input.fromEmail,
    metaRows: input.metaRows,
    body: input.body,
    cvUrl: input.cvUrl ?? null,
    externalLink: input.externalLink ?? null,
    submissionUrl,
  });

  try {
    const res = await client.emails.send({
      from: fromAddress(),
      to: internalRecipient(),
      subject,
      text,
      html,
      replyTo: input.fromEmail,
    });
    if (res.error) {
      console.error("[email] internal notification failed:", res.error);
      return { ok: false, error: res.error.message };
    }
    return { ok: true, id: res.data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[email] internal notification threw:", msg);
    return { ok: false, error: msg };
  }
}

/* ============================================================
 * Auto-reply templates
 * ============================================================ */

function buildAutoReplyText(p: {
  firstName: string;
  copy: { confirmation: string; intro: string; sla: string };
  metaRows: { label: string; value: string }[];
}): string {
  const rows = p.metaRows.length
    ? "\n\nWhat you sent through:\n" +
      p.metaRows.map((r) => `  · ${r.label}: ${r.value}`).join("\n")
    : "";
  return `Hi ${p.firstName},

${p.copy.confirmation}

${p.copy.intro}${rows}

${p.copy.sla}

If it's urgent, you can WhatsApp us anytime:
${getWaLink()}

Talk soon,
The Onyx Creative Asia team
Bali · onyxcreative.asia
`;
}

function buildAutoReplyHtml(p: {
  firstName: string;
  confirmation: string;
  intro: string;
  sla: string;
  metaRows: { label: string; value: string }[];
}): string {
  const rowsHtml = p.metaRows
    .map(
      (r) => `
    <tr>
      <td style="padding:16px 20px;border-bottom:1px solid rgba(244,241,236,0.1);">
        <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(244,241,236,0.55);">${escapeHtml(r.label)}</p>
        <p style="margin:0;font-size:14px;color:#F4F1EC;">${escapeHtml(r.value)}</p>
      </td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Onyx Creative Asia — received</title></head>
<body style="margin:0;padding:0;background:#0E0E0E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#F4F1EC;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0E0E0E;padding:48px 24px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="padding-bottom:28px;">
          ${logoSvg()}
        </td></tr>
        <tr><td>
          <p style="margin:0 0 12px 0;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(244,241,236,0.5);">RECEIVED</p>
          <h1 style="margin:0 0 16px 0;font-size:32px;font-weight:700;letter-spacing:-0.01em;line-height:1.1;color:#F4F1EC;">
            Hi,<br><span style="font-weight:300;font-style:italic;">${escapeHtml(p.firstName)}.</span>
          </h1>
          <!-- The single line that matters: confirmation of receipt -->
          <p style="margin:0 0 24px 0;padding:14px 16px;border-left:2px solid #34D399;font-size:15px;line-height:1.6;color:#F4F1EC;background:rgba(52,211,153,0.06);">
            ${escapeHtml(p.confirmation)}
          </p>
          <p style="margin:0 0 24px 0;font-size:15px;line-height:1.65;color:rgba(244,241,236,0.85);">${escapeHtml(p.intro)}</p>
          ${
            p.metaRows.length
              ? `<p style="margin:32px 0 8px 0;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(244,241,236,0.5);">What you sent through</p>
                 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid rgba(244,241,236,0.15);margin:0 0 32px 0;">${rowsHtml}</table>`
              : ""
          }
          <p style="margin:0 0 12px 0;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(244,241,236,0.5);">When to expect a reply</p>
          <p style="margin:0 0 28px 0;font-size:14px;line-height:1.6;color:rgba(244,241,236,0.85);">${escapeHtml(p.sla)}</p>
          <p style="margin:0 0 32px 0;font-size:13px;line-height:1.6;color:rgba(244,241,236,0.7);">
            Urgent? WhatsApp us anytime:
            <a href="${escapeHtml(getWaLink())}" style="color:#F4F1EC;text-decoration:underline;">${escapeHtml(getWaDisplay())}</a>
          </p>
          <p style="margin:32px 0 0 0;font-size:14px;color:#F4F1EC;">
            Talk soon,<br><span style="font-style:italic;font-weight:300;">The Onyx Creative Asia team</span>
          </p>
        </td></tr>
        <tr><td style="padding-top:48px;border-top:1px solid rgba(244,241,236,0.1);">
          <p style="margin:32px 0 0 0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(244,241,236,0.4);">Bali · onyxcreative.asia</p>
          <p style="margin:8px 0 0 0;font-size:10px;line-height:1.5;color:rgba(244,241,236,0.3);">
            This is an automated confirmation. A real human reply follows separately.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/* ============================================================
 * Internal-notification templates
 * ============================================================ */

function buildInternalText(p: {
  typeLabel: string;
  fromName: string;
  fromEmail: string;
  metaRows: { label: string; value: string }[];
  body: string;
  cvUrl?: string | null;
  externalLink?: { label: string; url: string } | null;
  submissionUrl: string;
}): string {
  const meta = p.metaRows.map((r) => `${r.label}: ${r.value}`).join("\n");
  const ext = p.externalLink
    ? `\n\n${p.externalLink.label}: ${p.externalLink.url}`
    : "";
  const cv = p.cvUrl ? `\n\nCV: ${p.cvUrl}` : "";
  return `New ${p.typeLabel.toLowerCase()} — ${p.fromName} <${p.fromEmail}>

${meta}${ext}${cv}

---
${p.body}

Open in dashboard:
${p.submissionUrl}
`;
}

function buildInternalHtml(p: {
  typeLabel: string;
  fromName: string;
  fromEmail: string;
  metaRows: { label: string; value: string }[];
  body: string;
  cvUrl: string | null;
  externalLink: { label: string; url: string } | null;
  submissionUrl: string;
}): string {
  const rowCells = p.metaRows
    .map(
      (r, i) => `
        <tr>
          <td style="padding:12px 16px;${
            i < p.metaRows.length - 1
              ? "border-bottom:1px solid rgba(244,241,236,0.1);"
              : ""
          }">
            <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(244,241,236,0.55);">${escapeHtml(r.label)}</p>
            <p style="margin:0;font-size:14px;color:#F4F1EC;">${escapeHtml(r.value)}</p>
          </td>
        </tr>`
    )
    .join("");

  const linkBlock = p.externalLink
    ? `<p style="margin:12px 0 0 0;font-size:13px;">
        <span style="color:rgba(244,241,236,0.55);text-transform:uppercase;letter-spacing:0.2em;font-size:10px;">${escapeHtml(p.externalLink.label)}: </span>
        <a href="${escapeHtml(p.externalLink.url)}" style="color:#F4F1EC;text-decoration:underline;">${escapeHtml(p.externalLink.url)}</a>
       </p>`
    : "";

  const cvBlock = p.cvUrl
    ? `<p style="margin:12px 0 0 0;">
        <a href="${escapeHtml(p.cvUrl)}" style="display:inline-block;border:1px solid rgba(244,241,236,0.4);padding:6px 12px;color:#F4F1EC;text-decoration:none;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;">Open CV →</a>
        <span style="margin-left:8px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(244,241,236,0.4);">signed link · 7 days</span>
       </p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>New ${escapeHtml(p.typeLabel.toLowerCase())}</title></head>
<body style="margin:0;padding:0;background:#0E0E0E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#F4F1EC;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0E0E0E;padding:32px 24px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:620px;" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="padding-bottom:24px;">
          ${logoSvg()}
        </td></tr>
        <tr><td>
          <p style="margin:0 0 8px 0;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(244,241,236,0.5);">INBOX · ${escapeHtml(p.typeLabel.toUpperCase())}</p>
          <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:600;letter-spacing:-0.01em;line-height:1.2;color:#F4F1EC;">
            New ${escapeHtml(p.typeLabel.toLowerCase())} from ${escapeHtml(p.fromName)}
          </h1>
          <p style="margin:0 0 24px 0;font-size:13px;color:rgba(244,241,236,0.65);">
            <a href="mailto:${escapeHtml(p.fromEmail)}" style="color:rgba(244,241,236,0.85);text-decoration:none;">${escapeHtml(p.fromEmail)}</a>
          </p>
          ${
            p.metaRows.length
              ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid rgba(244,241,236,0.15);margin:0 0 16px 0;">${rowCells}</table>`
              : ""
          }
          ${linkBlock}
          ${cvBlock}
          <div style="border:1px solid rgba(244,241,236,0.15);margin:24px 0;padding:14px 18px;">
            <p style="margin:0 0 8px 0;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(244,241,236,0.55);">Message</p>
            <p style="margin:0;font-size:14px;line-height:1.55;color:rgba(244,241,236,0.9);white-space:pre-wrap;">${escapeHtml(p.body)}</p>
          </div>
          <a href="${escapeHtml(p.submissionUrl)}" style="display:inline-block;background:#F4F1EC;color:#0E0E0E;padding:12px 20px;text-decoration:none;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;font-weight:600;">
            Open in dashboard →
          </a>
        </td></tr>
        <tr><td style="padding-top:32px;">
          <p style="margin:0;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(244,241,236,0.4);">
            Reply to this email and it'll go straight to the sender.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/* ============================================================
 * sendReply — operator-to-lead outbound email.
 *
 * Used from /api/submissions/[id]/reply when an operator types a
 * response in the dashboard's submission detail page. Plain-text body
 * + the operator's email signature (pulled from dashboard_profile).
 * Subject is "Re: <original subject>" to thread with the lead's email
 * client.
 * ============================================================ */

export type ReplyInput = {
  toName: string;
  toEmail: string;
  /** Subject line of the original submission — we prepend "Re:". */
  originalSubject: string | null;
  /** What the operator typed. Plain text, possibly multi-paragraph. */
  body: string;
  /** Email signature pulled from the operator profile. */
  signature?: string | null;
};

export async function sendReply(
  input: ReplyInput
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const client = getClient();
  if (!client) {
    console.warn("[email] RESEND_API_KEY not set — skipping reply.");
    return { ok: true };
  }

  const subjectBase =
    input.originalSubject?.trim() || "Your inquiry with Onyx Creative Asia";
  const subject = subjectBase.toLowerCase().startsWith("re:")
    ? subjectBase
    : `Re: ${subjectBase}`;

  const sig = input.signature?.trim() ?? "";
  const text = sig
    ? `${input.body.trim()}\n\n${sig}\n`
    : `${input.body.trim()}\n`;

  // Simple HTML wrap — visitor's email client renders cleanly without
  // the auto-reply's full branded shell. The reply should look like a
  // real human-written email, not a transactional blast.
  const html = `<!DOCTYPE html>
<html><body style="margin:0;padding:24px;background:#fff;color:#0E0E0E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;">
  <div style="max-width:600px;">
    ${input.body
      .trim()
      .split(/\n{2,}/)
      .map((p) => `<p style="margin:0 0 16px 0;">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
      .join("\n    ")}
    ${
      sig
        ? `<div style="margin-top:24px;padding-top:16px;border-top:1px solid rgba(14,14,14,0.08);color:rgba(14,14,14,0.65);white-space:pre-wrap;">${escapeHtml(sig)}</div>`
        : ""
    }
  </div>
</body></html>`;

  try {
    const res = await client.emails.send({
      from: fromAddress(),
      to: input.toEmail,
      subject,
      text,
      html,
      replyTo: internalRecipient(),
    });
    if (res.error) {
      console.error("[email] reply failed:", res.error);
      return { ok: false, error: res.error.message };
    }
    return { ok: true, id: res.data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[email] reply threw:", msg);
    return { ok: false, error: msg };
  }
}

/* ============================================================
 * Animated logo (inline SVG) used at the top of every email.
 *
 * SMIL animation: gentle bullet-pulse + outer echo ring expanding then
 * fading. Loops forever. Static fallback (when SMIL is stripped by
 * Gmail / Outlook) is the final visible state — logo still reads
 * complete. Inline-embedded so no external host or Resend attachment
 * is needed.
 * ============================================================ */

function logoSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 56" width="220" height="44" role="img" aria-label="Onyx Creative Asia" style="display:block;">
    <circle cx="14" cy="28" r="5" fill="#F4F1EC" fill-opacity="0.95">
      <animate attributeName="r" values="5;7;5" keyTimes="0;0.5;1" keySplines="0.42 0 0.58 1;0.42 0 0.58 1" calcMode="spline" dur="2.4s" repeatCount="indefinite"/>
      <animate attributeName="fill-opacity" values="0.95;1;0.95" keyTimes="0;0.5;1" dur="2.4s" repeatCount="indefinite"/>
    </circle>
    <circle cx="14" cy="28" r="5" fill="none" stroke="#F4F1EC" stroke-width="1" stroke-opacity="0">
      <animate attributeName="r" values="5;14" keyTimes="0;1" dur="2.4s" repeatCount="indefinite"/>
      <animate attributeName="stroke-opacity" values="0.35;0" keyTimes="0;1" dur="2.4s" repeatCount="indefinite"/>
    </circle>
    <text x="32" y="36" font-family="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="26" font-weight="600" letter-spacing="-0.4" fill="#F4F1EC">Onyx</text>
    <text x="106" y="36" font-family="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="26" font-weight="300" font-style="italic" fill="#F4F1EC">.</text>
    <rect x="124" y="14" width="1" height="28" fill="#F4F1EC" fill-opacity="0.25"/>
    <text x="138" y="33" font-family="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="11" font-weight="500" letter-spacing="3" fill="#F4F1EC" fill-opacity="0.65">CREATIVE ASIA</text>
  </svg>`;
}

/* ============================================================
 * helpers
 * ============================================================ */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
