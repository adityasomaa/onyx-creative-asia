/**
 * Fonnte — WhatsApp gateway client.
 *
 * Fonnte (https://fonnte.com) is an Indonesian WA Business API gateway
 * that lets us send messages programmatically using a device token. We
 * use it for:
 *   - Outbound replies from the submission detail page
 *   - Inbound webhook ingestion (Phase 2b — Fonnte POSTs incoming
 *     messages to a Vercel route, we save as a new submission row)
 *
 * Auth model: a single token in `FONNTE_TOKEN`. Anyone with that token
 * can send messages on the linked WA number's behalf. Never expose it
 * client-side; only call sendWhatsApp() from server routes.
 *
 * Docs: https://docs.fonnte.com/
 */

const FONNTE_SEND_URL = "https://api.fonnte.com/send";

export type FonnteSendInput = {
  /** Target phone number. Indonesian numbers: include 62 country code
   *  WITHOUT a leading + (e.g. "62895413372822"). Fonnte normalises a
   *  few formats but the canonical form avoids ambiguity. */
  target: string;
  /** Message body. Plain text. Newlines become real line breaks in WA. */
  message: string;
  /** Optional country code override (defaults to 62 / Indonesia). */
  countryCode?: string;
};

export type FonnteSendResult =
  | { ok: true; id: string | null; raw: Record<string, unknown> }
  | { ok: false; error: string };

/**
 * Send a WhatsApp message. Returns ok=true on success, ok=false with
 * an error string otherwise. Never throws.
 *
 * Mock mode: if FONNTE_TOKEN isn't set, the call is logged and counted
 * as a successful no-op, so dev + preview deploys don't actually send.
 */
export async function sendWhatsApp(
  input: FonnteSendInput
): Promise<FonnteSendResult> {
  const token = process.env.FONNTE_TOKEN;
  if (!token) {
    console.warn(
      "[fonnte] FONNTE_TOKEN not set — would have sent to",
      input.target,
      "→",
      input.message.slice(0, 80)
    );
    return { ok: true, id: null, raw: { mocked: true } };
  }

  const target = normaliseTarget(input.target, input.countryCode);
  if (!target) {
    return { ok: false, error: "No valid phone number to send to." };
  }

  // Fonnte uses application/x-www-form-urlencoded
  const body = new URLSearchParams();
  body.set("target", target);
  body.set("message", input.message);

  try {
    const res = await fetch(FONNTE_SEND_URL, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    let payload: Record<string, unknown> = {};
    try {
      payload = (await res.json()) as Record<string, unknown>;
    } catch {
      // Fonnte sometimes returns non-JSON on errors — surface status text
      return {
        ok: false,
        error: `Fonnte ${res.status}: ${res.statusText}`,
      };
    }

    // Fonnte's success response: { "detail": "success! message in queue", "id": ["..."], ... }
    // Failure responses can be { "status": false, "reason": "..." } or similar.
    const status = payload.status;
    if (status === false || (typeof status === "string" && status === "false")) {
      const reason =
        typeof payload.reason === "string"
          ? payload.reason
          : typeof payload.detail === "string"
            ? payload.detail
            : "Fonnte rejected the request.";
      return { ok: false, error: reason };
    }
    if (!res.ok) {
      return {
        ok: false,
        error: `Fonnte ${res.status}: ${JSON.stringify(payload).slice(0, 200)}`,
      };
    }

    const id =
      typeof payload.id === "string"
        ? payload.id
        : Array.isArray(payload.id) && typeof payload.id[0] === "string"
          ? (payload.id[0] as string)
          : null;

    return { ok: true, id, raw: payload };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[fonnte] send threw:", msg);
    return { ok: false, error: msg };
  }
}

/* ============================================================
 * Helpers
 * ============================================================ */

/**
 * Normalise a phone number to a digit-only string with a country code
 * prefix. Strips +, -, spaces, parentheses. If the input starts with 0
 * (Indonesian local format like "0895..."), we replace the leading 0
 * with the country code (62 by default).
 *
 * Returns null if the result has fewer than 8 digits — too short to
 * be a real number.
 */
export function normaliseTarget(
  raw: string,
  countryCode = "62"
): string | null {
  if (!raw) return null;
  let digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  if (digits.startsWith("0")) {
    digits = countryCode + digits.slice(1);
  }
  if (digits.length < 8) return null;
  return digits;
}
