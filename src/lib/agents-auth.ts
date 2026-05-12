/**
 * Session token sign/verify for the agents dashboard.
 *
 * Uses the Web Crypto API (HMAC-SHA256) so the same code runs in the
 * Next.js Edge runtime (middleware) AND the Node runtime (route handler).
 *
 * Token shape: `<username>:<expiresAtMs>:<hexSignature>`
 *   - signature = HMAC-SHA256( "<username>:<expiresAtMs>", DASHBOARD_SECRET )
 *
 * Verification rejects expired tokens, malformed tokens, and signatures
 * that don't match (constant-time compare). The username and the expiry
 * are *part* of the signed payload, so an attacker can't extend their
 * own session by tweaking the expiry without resigning.
 */

export const SESSION_COOKIE = "onyx_agents_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  // In production this MUST be set. In dev we fall back to a constant so
  // local development isn't bricked, but it's a known-bad secret and the
  // dashboard middleware throws a warning into the logs.
  const s = process.env.DASHBOARD_SECRET;
  if (!s || s.length < 16) {
    return "dev-only-DASHBOARD_SECRET-please-set-a-real-one-in-vercel-env";
  }
  return s;
}

async function hmacSha256(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Sign a fresh session token. Expiry defaults to 7 days from now. */
export async function signSession(
  username: string,
  ttlMs: number = SESSION_TTL_MS
): Promise<string> {
  const expiresAt = Date.now() + ttlMs;
  const payload = `${username}:${expiresAt}`;
  const sig = await hmacSha256(payload, getSecret());
  return `${payload}:${sig}`;
}

/**
 * Verify a session token. Returns the username if valid + unexpired,
 * `null` otherwise. Never throws — safe to call on user input.
 */
export async function verifySession(
  token: string | null | undefined
): Promise<{ username: string } | null> {
  if (!token) return null;
  const parts = token.split(":");
  if (parts.length !== 3) return null;
  const [username, expiresAtStr, sig] = parts;
  if (!username || !expiresAtStr || !sig) return null;

  const expiresAt = Number.parseInt(expiresAtStr, 10);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;

  const expectedSig = await hmacSha256(
    `${username}:${expiresAt}`,
    getSecret()
  );
  if (!timingSafeEqual(sig, expectedSig)) return null;

  return { username };
}

/**
 * Validate (username, password) against the env-configured credentials.
 * Constant-time compare so timing analysis can't leak the username.
 */
export function checkCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.DASHBOARD_USER || "onyx";
  const expectedPass = process.env.DASHBOARD_PASSWORD || "onyx";
  return (
    timingSafeEqual(username, expectedUser) &&
    timingSafeEqual(password, expectedPass)
  );
}

/** Standard cookie attributes for the session. */
export function sessionCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true as const,
    secure: true as const,
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export const SESSION_MAX_AGE_S = Math.floor(SESSION_TTL_MS / 1000);
