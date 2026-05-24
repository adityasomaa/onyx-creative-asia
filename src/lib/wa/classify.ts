/**
 * Personal-vs-business classifier for inbound WhatsApp messages.
 *
 * Called by the WA inbound webhook on the FIRST message of a fresh chat
 * (no prior wa_chat row for this phone/group). Gemini decides whether the
 * chat looks like a business inquiry the studio should care about, or a
 * personal/family/friend conversation that should stay out of the inbox.
 *
 * Group chats default to 'business' without calling the LLM — communities,
 * client groups, vendor groups are all business-relevant. Operator can
 * manually demote a group to 'manual_ignored' later.
 *
 * If the classifier fails or the API key isn't set, we return 'pending'
 * — the chat shows up in the inbox (safer default), and the operator
 * can decide what to do.
 */
import { generateStructured } from "@/lib/llm";

export type ChatClassification =
  | "pending"
  | "business"
  | "personal";

export type ClassifyInput = {
  message: string;
  pushname: string | null;
  fromPhone: string;
  isGroup: boolean;
};

export type ClassifyResult = {
  classification: ChatClassification;
  reason: string;
  model: string | null;
};

/**
 * Bali studio context the LLM uses to ground its judgement.
 *
 * Scope is narrow on purpose: only inquiries the studio could actually
 * take on as a project belong in the inbox. Anything else — including
 * social chit-chat, life updates from acquaintances, religious group
 * broadcasts, vendor pitches, recruiters, job-offers FROM other
 * companies, family/friend conversation — should classify as 'personal'.
 *
 * If the classification is wrong, the operator can flip it from the
 * chat detail page with one click (Bring back / Ignore future).
 */
const STUDIO_CONTEXT = `
Onyx Creative Asia is a Bali-based creative + digital marketing studio.
The inbox should contain ONLY messages where the sender is asking us to
do work, or could plausibly become a paying project.

IN-SCOPE (classify as "business"):
  - Website design, web development, landing page, e-commerce build
  - Branding, logo, brand identity, brand guidelines
  - Social media management, content creation, IG/TikTok strategy
  - Paid advertising (Meta Ads, Google Ads, TikTok Ads)
  - SEO, analytics, reporting
  - Video, photography, editorial content
  - AI automation, chatbot, workflow automation
  - Studio's sub-brand "Sigap" (budget tier for UMKM)
  - Pricing / quote / availability / meeting requests for the above
  - Existing-client follow-ups about ongoing projects

OUT-OF-SCOPE (classify as "personal"):
  - Family, friend, romantic, or general social conversation
  - Religious greetings / spiritual broadcasts not tied to work
  - Generic group chatter ("good morning all", forwarded jokes/memes)
  - Vendor pitches FROM other agencies / freelancers selling to us
  - Job offers / recruiters trying to hire us
  - Sales spam, MLM, crypto, gambling, prize-scam messages
  - Banking OTPs, courier notifications, verification codes
  - Life updates from acquaintances unrelated to work
  - Voice-note-only or sticker-only messages with no business hint
  - Conversations about non-digital things (offline events, plans, etc.)

Casual Indonesian phrasing is normal in business messages — "halo kak",
"permisi", "saya mau tanya soal website" still classifies as business.
The distinguishing signal is the topic, not the tone.
`.trim();

export async function classifyWhatsAppChat(
  input: ClassifyInput
): Promise<ClassifyResult> {
  // Groups: skip the LLM, default to business.
  if (input.isGroup) {
    return {
      classification: "business",
      reason: "group chats default to business (operator can demote)",
      model: null,
    };
  }

  const prompt = `${STUDIO_CONTEXT}

A new WhatsApp chat just opened. Decide whether this should land in the
studio's business inbox or be auto-filed as personal.

Sender pushname: ${input.pushname ?? "(unknown)"}
Sender phone:    ${input.fromPhone}
First message:
"""
${input.message.slice(0, 2000)}
"""

Return:
  - classification: "business" or "personal"
  - reason: one short sentence (< 20 words) explaining the call

Bias toward "business" when uncertain — false positives are cheaper than
missing a real lead. Only mark "personal" when the message clearly has no
business hook.`;

  const res = await generateStructured({
    prompt,
    schema: {
      classification: {
        kind: "string",
        description: "One of: business, personal",
        enum: ["business", "personal"],
      },
      reason: {
        kind: "string",
        description: "Short justification, under 20 words",
      },
    },
    temperature: 0.1,
    maxOutputTokens: 200,
  });

  if (!res.ok) {
    console.warn("[wa/classify] LLM failed, defaulting to pending:", res.error);
    return {
      classification: "pending",
      reason: `classifier unavailable: ${res.error.slice(0, 120)}`,
      model: res.model,
    };
  }

  const rawClass = String(res.data.classification ?? "").toLowerCase();
  const classification: ChatClassification =
    rawClass === "personal" ? "personal" : "business";
  const reason = String(res.data.reason ?? "").trim().slice(0, 240);

  return {
    classification,
    reason: reason || "(no reason given)",
    model: res.model,
  };
}
