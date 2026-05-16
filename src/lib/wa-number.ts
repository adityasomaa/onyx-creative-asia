/**
 * Single source of truth for the studio's WhatsApp number.
 *
 * Two forms:
 *   - getWaNumber()  → raw digits with country code, no separators
 *                      e.g. "62895413372822". Used in wa.me links and
 *                      anywhere the WA web/protocol expects a phone.
 *   - getWaDisplay() → human-readable formatted version with country
 *                      code and dashes, e.g. "+62 895-4133-72822".
 *                      Used in copy that humans read.
 *
 * Both read from `NEXT_PUBLIC_*` env vars so they survive client-side
 * bundling. NEXT_PUBLIC_* values are baked at build time — to change
 * the number, set the env var in Vercel and trigger a redeploy.
 *
 * Defaults to the current operating number so the site doesn't break
 * if env vars aren't set (e.g. preview deploys without the var).
 *
 * Future number swap:
 *   1. Vercel env: set NEXT_PUBLIC_WA_NUMBER + NEXT_PUBLIC_WA_DISPLAY
 *      to the new number.
 *   2. Vercel env: set FONNTE_TOKEN to the new device's token.
 *   3. Redeploy.
 *   4. Fonnte dashboard: register the new device, scan WA QR, set the
 *      same webhook URL (with the same FONNTE_WEBHOOK_SECRET).
 *   5. (Optional) Flip WA_AUTO_REPLY_ENABLED=true once the new number
 *      is exclusively for business.
 *
 * See docs/AGENTS.md → "Switching the WhatsApp number" for the full
 * checklist.
 */

const DEFAULT_NUMBER = "62895413372822";
const DEFAULT_DISPLAY = "+62 895-4133-72822";

/** Raw digits (with country code, no +, no spaces). For wa.me links. */
export function getWaNumber(): string {
  const raw = process.env.NEXT_PUBLIC_WA_NUMBER;
  if (!raw) return DEFAULT_NUMBER;
  // Strip any non-digit defensively (in case operator pastes "+62 ..."
  // instead of pure digits).
  const cleaned = raw.replace(/\D/g, "");
  return cleaned || DEFAULT_NUMBER;
}

/** Human-readable formatted version. For email body + copy. */
export function getWaDisplay(): string {
  const raw = process.env.NEXT_PUBLIC_WA_DISPLAY;
  if (raw && raw.trim()) return raw.trim();
  // If the operator didn't bother to set the display form, derive a
  // reasonable one from the raw number: "+" + the digits.
  return `+${getWaNumber()}`;
}

/** Convenience: full https://wa.me/<digits> link. */
export function getWaLink(): string {
  return `https://wa.me/${getWaNumber()}`;
}

/** Convenience: wa.me link with pre-filled message text. */
export function getWaLinkWithText(text: string): string {
  return `${getWaLink()}?text=${encodeURIComponent(text)}`;
}
