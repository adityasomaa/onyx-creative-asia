/**
 * Enquiries go to /api/leads, the same endpoint the previous site used,
 * so submissions still land in the /agents dashboard and trigger the
 * existing auto-reply and notification. The API has no phone or timing
 * column, so those ride in the message text (see `withExtras`).
 */

export type LeadPayload = Record<string, unknown> & {
  inquiryType: "project" | "partnership" | "career" | "general";
  name: string;
  email: string;
};

/** Appends "WhatsApp: …" / "Start: …" lines to a free-text field. */
export function withExtras(text: string, extras: { phone?: string | null; start?: string | null }): string {
  const lines = [extras.phone ? `WhatsApp: ${extras.phone}` : null, extras.start ? `Start: ${extras.start}` : null].filter(Boolean);
  return lines.length ? `${text}\n\n${lines.join("\n")}` : text;
}

export async function postLead(payload: LeadPayload): Promise<boolean> {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** The footer's short form: always a "project" enquiry. */
export function sendLead(input: {
  name: string;
  email: string;
  message: string;
  phone?: string;
  budget?: string | null;
  services?: string[];
  start?: string | null;
}): Promise<boolean> {
  return postLead({
    inquiryType: "project",
    name: input.name,
    email: input.email,
    message: withExtras(input.message, { phone: input.phone, start: input.start }),
    budget: input.budget ?? null,
    services: input.services ?? [],
    company: null,
  });
}
