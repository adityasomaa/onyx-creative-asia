/**
 * Reply enhancement — polish operator-typed draft per their saved tone.
 *
 * The operator types a quick draft in the ReplyBox, clicks "Enhance",
 * the API calls this with the draft + their reply_tone preference +
 * the original submission for context. The LLM returns a refined
 * version that the operator can accept, edit, or discard before
 * actually sending.
 *
 * Crucially: the LLM never sends anything itself. This is just a
 * copy-polishing layer. The operator stays in the loop for every
 * outgoing message.
 */

import { generateText } from "@/lib/llm";
import type { ReplyTone } from "@/lib/db/profile";

const TONE_GUIDANCE: Record<ReplyTone, string> = {
  restrained:
    "Editorial, minimal, no exclamations. Short sentences. The brand default — write like you're not in a rush.",
  friendly:
    "Warm and conversational. Acknowledge the person, use their name once if available, easy hello. Still no exclamations.",
  formal:
    "Business correspondence. Polite, structured into short paragraphs. No slang. Use the recipient's full name in opening.",
  playful:
    "Lighter register. A tiny bit of warmth or humor in one phrase if natural. Don't force it. Still no exclamations or emojis.",
};

export type EnhanceReplyInput = {
  /** The operator's quick draft, in whatever shape they typed it. */
  draft: string;
  /** Tone preference from operator profile. Drives the polish style. */
  tone: ReplyTone;
  /** What channel this is going to — adjusts brevity expectations. */
  channel: "email" | "whatsapp";
  /** First name of recipient (e.g. "Maya"). For personalisation hints. */
  recipientFirstName?: string | null;
  /** Body of the original submission so the LLM has context for the reply. */
  originalSubmissionBody?: string | null;
  /** Subject of the original submission, if any. */
  originalSubject?: string | null;
};

export type EnhanceReplyResult =
  | {
      ok: true;
      enhanced: string;
      model: string;
      original: string;
    }
  | { ok: false; error: string };

export async function enhanceReply(
  input: EnhanceReplyInput
): Promise<EnhanceReplyResult> {
  const tone = TONE_GUIDANCE[input.tone] ?? TONE_GUIDANCE.restrained;
  const channelGuidance =
    input.channel === "whatsapp"
      ? `This goes to WhatsApp. Keep it under 90 words. No subject line, no formal sign-off — chat register.

CRITICAL WhatsApp casing rule: write the ENTIRE message in lowercase. No capital letters anywhere — not at sentence starts, not for names ("maya" not "Maya"), not for brand names ("onyx" not "Onyx"), not for places ("jakarta" not "Jakarta"). This matches the operator's personal typing style on WhatsApp. The only exception is acronyms the operator already typed in caps in their draft (AI, KPI, etc) — preserve those as-is. Standard punctuation stays (commas, periods, question marks).`
      : "This goes to email. Two to four short paragraphs. No subject line (the API sets that). Don't add a signature — the operator's profile signature is appended automatically.";

  const recipientLine = input.recipientFirstName
    ? `Recipient first name: ${input.recipientFirstName}`
    : "Recipient name unknown.";

  const contextBlock = input.originalSubmissionBody
    ? `Original inbound (for context — DON'T quote it back verbatim, just respond appropriately):
"""
${input.originalSubject ? `Subject: ${input.originalSubject}\n\n` : ""}${input.originalSubmissionBody.trim()}
"""`
    : "(no original submission body available — work from the draft alone)";

  const prompt = `Polish this draft reply so it reads in our brand voice.

${contextBlock}

${recipientLine}

Operator's draft:
"""
${input.draft.trim()}
"""

Tone direction: ${tone}

Channel: ${channelGuidance}

Constraints:
- Preserve every concrete commitment the operator made (dates, prices, scopes). Don't add new ones.
- Don't invent details. If the draft is vague, keep it vague — just clean the phrasing.
- Output the polished reply only. No preamble like "Here's the polished version:". No surrounding quotes.
`;

  const res = await generateText({
    prompt,
    temperature: 0.4,
    // Gemini 2.5 Flash uses internal "thinking" tokens before the visible
    // output, so the cap has to cover both. 600 was getting truncated mid-
    // sentence on normal replies; 1200 leaves headroom while still bounded
    // (channel guidance keeps the actual reply under 90 words / few paras).
    maxOutputTokens: 1200,
  });
  if (!res.ok) {
    return { ok: false, error: res.error };
  }
  return {
    ok: true,
    enhanced: res.text,
    model: res.model,
    original: input.draft,
  };
}
