/**
 * Posts an enquiry to /api/leads as a "project" inquiry, the same
 * endpoint the previous site used, so submissions still land in the
 * /agents dashboard and trigger the existing auto-reply and notification.
 * The API has no phone or timing column, so those ride in the message.
 */
export async function sendLead(input: {
  name: string;
  email: string;
  message: string;
  phone?: string;
  budget?: string | null;
  services?: string[];
  start?: string | null;
}): Promise<boolean> {
  const extra = [
    input.phone ? `WhatsApp: ${input.phone}` : null,
    input.start ? `Start: ${input.start}` : null,
  ].filter(Boolean);
  const message = extra.length ? `${input.message}\n\n${extra.join("\n")}` : input.message;
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inquiryType: "project",
        name: input.name,
        email: input.email,
        message,
        budget: input.budget ?? null,
        services: input.services ?? [],
        company: null,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
