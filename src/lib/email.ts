/**
 * Outbound email — Resend wrapper.
 *
 * Two functions:
 *   - sendAutoReply()         → goes to the person who just submitted
 *   - sendInternalNotification() → goes to hello@onyxcreative.asia
 *
 * Both no-op (and log) when RESEND_API_KEY isn't set, so dev + preview
 * deploys without the key still work.
 *
 * Domain setup: `onyxcreative.asia` must be verified in Resend → Domains
 * (DKIM + SPF + DMARC). Until verified, Resend falls back to their
 * `onboarding@resend.dev` sender, which works for testing but lands in
 * spam for real recipients.
 */

import { Resend } from "resend";

const FROM_DEFAULT = "Onyx Creative Asia <hello@onyxcreative.asia>";
const INTERNAL_TO_DEFAULT = "hello@onyxcreative.asia";

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

export type AutoReplyInput = {
  toName: string;
  toEmail: string;
  services: string[];
  budget?: string | null;
  message: string;
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
  const servicesText =
    input.services.length > 0 ? input.services.join(", ") : "—";

  const subject = `Got your brief, ${firstName} — we'll be in touch soon.`;

  const text = `Hi ${firstName},

Thanks for reaching out to Onyx Creative Asia. We got your brief and we're reading it now.

Here's what you sent through:
  · Services: ${servicesText}
  · Budget: ${input.budget ?? "—"}

We reply to every brief personally — usually within 24 hours, sometimes sooner. If it's a fit, we'll come back with a quick scope and timeline. If it's not, we'll tell you straight and try to point you somewhere useful.

In the meantime, you can WhatsApp us if it's urgent: https://wa.me/62895413372822

Talk soon,
Onyx Creative Asia
Bali · onyxcreative.asia
`;

  const html = autoReplyHtml({
    firstName,
    servicesText,
    budget: input.budget ?? "—",
    message: input.message,
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

export type InternalNotificationInput = {
  fromName: string;
  fromEmail: string;
  services: string[];
  budget?: string | null;
  message: string;
  source?: string | null;
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

  const servicesText =
    input.services.length > 0 ? input.services.join(", ") : "—";

  // Subject line is parseable at a glance in inbox view.
  const subject = `[Onyx · new brief] ${input.fromName} · ${input.budget ?? "no budget"} · ${servicesText}`;

  const submissionUrl = input.submissionId
    ? `https://agents.onyxcreative.asia/submissions/${input.submissionId}`
    : "https://agents.onyxcreative.asia/submissions";

  const text = `New submission — ${input.source ?? "form"}

From: ${input.fromName} <${input.fromEmail}>
Services: ${servicesText}
Budget: ${input.budget ?? "—"}

Message:
${input.message}

Open in dashboard:
${submissionUrl}
`;

  const html = internalNotificationHtml({
    fromName: input.fromName,
    fromEmail: input.fromEmail,
    servicesText,
    budget: input.budget ?? "—",
    message: input.message,
    source: input.source ?? "form",
    submissionUrl,
  });

  try {
    const res = await client.emails.send({
      from: fromAddress(),
      to: internalRecipient(),
      subject,
      text,
      html,
      replyTo: input.fromEmail, // so "Reply" goes straight to the lead
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
 * HTML templates — kept inline so this lib has no deps beyond
 * resend. Onyx brand colors: ink #0E0E0E, bone #F4F1EC.
 * ============================================================ */

function autoReplyHtml(p: {
  firstName: string;
  servicesText: string;
  budget: string;
  message: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Got your brief</title>
</head>
<body style="margin:0;padding:0;background:#0E0E0E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#F4F1EC;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0E0E0E;padding:48px 24px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-bottom:32px;">
              <span style="display:inline-block;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(244,241,236,0.55);">[ ONYX · CONFIRMATION ]</span>
            </td>
          </tr>
          <tr>
            <td>
              <h1 style="margin:0 0 24px 0;font-size:32px;font-weight:700;letter-spacing:-0.01em;line-height:1.1;color:#F4F1EC;">
                Got your brief,<br>
                <span style="font-weight:300;font-style:italic;">${escapeHtml(p.firstName)}.</span>
              </h1>
              <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:rgba(244,241,236,0.85);">
                Thanks for reaching out. We're reading it now. We reply to every brief personally — usually within 24 hours, sometimes sooner.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid rgba(244,241,236,0.15);margin:32px 0;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(244,241,236,0.1);">
                    <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(244,241,236,0.55);">Services</p>
                    <p style="margin:0;font-size:14px;color:#F4F1EC;">${escapeHtml(p.servicesText)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(244,241,236,0.55);">Budget</p>
                    <p style="margin:0;font-size:14px;color:#F4F1EC;">${escapeHtml(p.budget)}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:rgba(244,241,236,0.75);">
                If it's a fit, we'll come back with a quick scope + timeline. If it's not, we'll tell you straight and try to point you somewhere useful.
              </p>

              <p style="margin:0 0 32px 0;font-size:14px;line-height:1.6;color:rgba(244,241,236,0.75);">
                Urgent? WhatsApp us:
                <a href="https://wa.me/62895413372822" style="color:#F4F1EC;text-decoration:underline;">+62 895-4133-72822</a>
              </p>

              <p style="margin:32px 0 0 0;font-size:14px;color:#F4F1EC;">
                Talk soon,<br>
                <span style="font-style:italic;font-weight:300;">Onyx Creative Asia</span>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top:48px;border-top:1px solid rgba(244,241,236,0.1);margin-top:48px;">
              <p style="margin:32px 0 0 0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(244,241,236,0.4);">
                Bali · onyxcreative.asia
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function internalNotificationHtml(p: {
  fromName: string;
  fromEmail: string;
  servicesText: string;
  budget: string;
  message: string;
  source: string;
  submissionUrl: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>New submission</title>
</head>
<body style="margin:0;padding:0;background:#0E0E0E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#F4F1EC;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0E0E0E;padding:32px 24px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:600px;" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-bottom:20px;">
              <span style="display:inline-block;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(244,241,236,0.55);">[ ONYX · INBOX · ${escapeHtml(p.source.toUpperCase())} ]</span>
            </td>
          </tr>
          <tr>
            <td>
              <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:600;letter-spacing:-0.01em;line-height:1.2;color:#F4F1EC;">
                New brief from ${escapeHtml(p.fromName)}
              </h1>
              <p style="margin:0 0 24px 0;font-size:13px;color:rgba(244,241,236,0.65);">
                <a href="mailto:${escapeHtml(p.fromEmail)}" style="color:rgba(244,241,236,0.85);text-decoration:none;">${escapeHtml(p.fromEmail)}</a>
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid rgba(244,241,236,0.15);margin:0 0 24px 0;">
                <tr>
                  <td width="50%" style="padding:12px 16px;border-right:1px solid rgba(244,241,236,0.1);border-bottom:1px solid rgba(244,241,236,0.1);">
                    <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(244,241,236,0.55);">Services</p>
                    <p style="margin:0;font-size:14px;color:#F4F1EC;">${escapeHtml(p.servicesText)}</p>
                  </td>
                  <td width="50%" style="padding:12px 16px;border-bottom:1px solid rgba(244,241,236,0.1);">
                    <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(244,241,236,0.55);">Budget</p>
                    <p style="margin:0;font-size:14px;color:#F4F1EC;">${escapeHtml(p.budget)}</p>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:12px 16px;">
                    <p style="margin:0 0 8px 0;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(244,241,236,0.55);">Message</p>
                    <p style="margin:0;font-size:14px;line-height:1.55;color:rgba(244,241,236,0.9);white-space:pre-wrap;">${escapeHtml(p.message)}</p>
                  </td>
                </tr>
              </table>

              <a href="${escapeHtml(p.submissionUrl)}" style="display:inline-block;background:#F4F1EC;color:#0E0E0E;padding:12px 20px;text-decoration:none;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;font-weight:600;">
                Open in dashboard →
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding-top:32px;">
              <p style="margin:0;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(244,241,236,0.4);">
                Reply to this email and it'll go straight to the sender.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
