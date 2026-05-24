/**
 * Auto-summary subject for a WhatsApp chat.
 *
 * Refreshed on every new inbound message (fire-and-forget from the
 * webhook). The subject is what the operator scans in the inbox list —
 * it should describe the WORK being asked for, not who is asking.
 *
 * Format rules:
 *   - 6–12 words, present-continuous or imperative phrasing
 *   - NO sender name, NO phone, NO "client", NO "user"
 *   - Action-oriented: "asking to update website hero copy", "sharing
 *     logo brief and brand colors", "requesting Instagram content plan"
 *   - English (matches the rest of the dashboard); short Indonesian
 *     phrases ok only when more natural
 *   - When messages cover multiple topics, pick the most actionable one
 *
 * If Gemini fails, we fall back to a truncated first-line of the latest
 * message so the inbox always has *something* to scan.
 */

import { generateStructured } from "@/lib/llm";

export type SubjectRefreshInput = {
  /** Most recent inbound message body. */
  latestMessage: string;
  /** Optional: previous N messages from the chat (oldest → newest).
   *  Gives the LLM thread context so the subject reflects the broader
   *  ask, not just the latest fragment. */
  recentMessages?: string[];
  /** Optional: the existing subject — passed so the LLM can prefer
   *  refining over rewriting when the new message just continues the
   *  same topic. */
  previousSubject?: string | null;
};

export type SubjectRefreshResult = {
  subject: string;
  model: string | null;
};

const MAX_CONTEXT_CHARS = 4000;

function buildContextBlock(
  recent: string[] | undefined,
  latest: string
): string {
  const lines: string[] = [];
  for (const m of recent ?? []) {
    lines.push(`- ${m.replace(/\s+/g, " ").trim()}`);
  }
  lines.push(`- ${latest.replace(/\s+/g, " ").trim()}  ← latest`);
  let block = lines.join("\n");
  if (block.length > MAX_CONTEXT_CHARS) {
    block = block.slice(-MAX_CONTEXT_CHARS); // keep the tail (most recent)
  }
  return block;
}

/** Last-resort fallback when the LLM is unavailable. */
function fallbackSubject(latest: string): string {
  const firstLine = latest.split(/\r?\n/)[0].trim();
  if (!firstLine) return "new whatsapp message";
  const truncated = firstLine.length > 70 ? firstLine.slice(0, 67) + "..." : firstLine;
  return truncated.toLowerCase();
}

export async function refreshChatSubject(
  input: SubjectRefreshInput
): Promise<SubjectRefreshResult> {
  const context = buildContextBlock(input.recentMessages, input.latestMessage);

  const prompt = `You are titling an entry in a WhatsApp inbox. The
operator scans these subjects to decide what to work on next.

Conversation so far (oldest first; "← latest" marks the newest message):
${context}

${
  input.previousSubject
    ? `Existing subject: "${input.previousSubject}"\n\nIf the new message is the same topic, REFINE the existing subject minimally. If it's a topic shift, write a new one.\n`
    : ""
}

Write a single action-oriented subject describing what the SENDER is
asking for or sharing. Rules:
  - 6 to 12 words
  - No sender name, no phone number, no "client", no "user", no quotes
  - Present-continuous or imperative voice
  - English; short Indonesian phrases OK only when more natural
  - Lowercase except proper nouns
  - Describe the work, not the conversation ("asking to update website
    hero copy" — not "messaged about website")

Examples:
  "asking to update homepage hero copy and CTA button"
  "sharing logo brief for new coffee brand"
  "requesting price for instagram management"
  "following up on website launch timeline"
  "sending revisions for landing page draft"
  "discussing pricing for sigap budget tier package"

Return JSON: { subject: "..." }`;

  const res = await generateStructured({
    prompt,
    schema: {
      subject: {
        kind: "string",
        description: "Action-oriented subject, 6-12 words, no sender name",
      },
    },
    temperature: 0.3,
    maxOutputTokens: 120,
  });

  if (!res.ok) {
    console.warn(
      "[wa/subject] LLM failed, falling back to truncated message:",
      res.error
    );
    return {
      subject: fallbackSubject(input.latestMessage),
      model: res.model,
    };
  }

  const raw = String(res.data.subject ?? "").trim();
  if (!raw) {
    return {
      subject: fallbackSubject(input.latestMessage),
      model: res.model,
    };
  }
  // Normalise: strip leading/trailing quotes, collapse whitespace, cap.
  const cleaned = raw
    .replace(/^["'`\s]+|["'`\s]+$/g, "")
    .replace(/\s+/g, " ")
    .slice(0, 140);
  return { subject: cleaned || fallbackSubject(input.latestMessage), model: res.model };
}
