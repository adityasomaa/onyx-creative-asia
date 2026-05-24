/**
 * Authenticated encryption for project-context credentials.
 *
 * Server-only. Used by /agents/chats to encrypt the `secrets` blob
 * (credentials JSON) before it lands in Supabase, and to decrypt
 * on-demand when the operator clicks "reveal" in the UI.
 *
 *   AES-256-GCM
 *   key:    SHA-256(CHAT_CONTEXT_SECRET) — env var must be set
 *   iv:     random 12 bytes per encryption
 *   tag:    16 bytes from GCM (stored separately for clarity)
 *
 * All outputs are base64 strings so they store cleanly in text columns
 * without extra escaping.
 *
 * If CHAT_CONTEXT_SECRET is rotated, existing encrypted rows become
 * un-decryptable (acceptable for an MVP — the operator can re-enter
 * credentials). For a more durable model, key versioning would go here.
 */

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_BYTES = 32; // AES-256
const IV_BYTES = 12; // GCM standard nonce length
const TAG_BYTES = 16; // GCM auth tag length

export class VaultConfigError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "VaultConfigError";
  }
}

function getKey(): Buffer {
  const raw = process.env.CHAT_CONTEXT_SECRET;
  if (!raw || raw.trim().length < 16) {
    throw new VaultConfigError(
      "CHAT_CONTEXT_SECRET env var is not set (or shorter than 16 chars). " +
        "Generate with: openssl rand -hex 32"
    );
  }
  // Derive a 32-byte key deterministically. We don't use a stretching
  // KDF (PBKDF2/scrypt) because the env var is itself meant to be a
  // high-entropy random string (32+ bytes hex), not a low-entropy
  // password — see CHAT_CONTEXT_SECRET docs in .env.example.
  return createHash("sha256").update(raw).digest().subarray(0, KEY_BYTES);
}

export type EncryptedBlob = {
  ciphertext: string; // base64
  iv: string; // base64 (12 bytes)
  tag: string; // base64 (16 bytes)
};

/**
 * Encrypts arbitrary UTF-8 plaintext (typically JSON.stringify(...)
 * of the credentials array). Returns three base64 strings ready to
 * store in the wa_chat_context.secrets_* columns.
 */
export function encryptVault(plaintext: string): EncryptedBlob {
  const key = getKey();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  if (tag.length !== TAG_BYTES) {
    throw new Error(`unexpected auth tag length: ${tag.length}`);
  }
  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  };
}

/**
 * Reverses encryptVault. Throws if the env key changed, the row is
 * tampered with, or any of the three components is missing/corrupt.
 */
export function decryptVault(blob: EncryptedBlob): string {
  const key = getKey();
  const iv = Buffer.from(blob.iv, "base64");
  const tag = Buffer.from(blob.tag, "base64");
  const ciphertext = Buffer.from(blob.ciphertext, "base64");
  if (iv.length !== IV_BYTES) {
    throw new Error(`bad iv length: ${iv.length} (expected ${IV_BYTES})`);
  }
  if (tag.length !== TAG_BYTES) {
    throw new Error(`bad tag length: ${tag.length} (expected ${TAG_BYTES})`);
  }
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return plaintext.toString("utf8");
}

/**
 * Convenience wrapper for JSON payloads — the typical use case. Returns
 * null if `data` is empty (caller stores NULLs in all three secrets_*
 * columns to mean "no credentials yet").
 */
export function encryptJSON<T>(data: T | null | undefined): EncryptedBlob | null {
  if (data == null) return null;
  // Skip encryption when there's literally nothing to store.
  if (Array.isArray(data) && data.length === 0) return null;
  if (typeof data === "object" && Object.keys(data as object).length === 0)
    return null;
  return encryptVault(JSON.stringify(data));
}

export function decryptJSON<T>(blob: EncryptedBlob | null): T | null {
  if (!blob) return null;
  if (!blob.ciphertext || !blob.iv || !blob.tag) return null;
  const plaintext = decryptVault(blob);
  try {
    return JSON.parse(plaintext) as T;
  } catch (err) {
    console.error("[crypto-vault] decryptJSON: bad JSON after decrypt:", err);
    return null;
  }
}

/**
 * Quick sanity-check used at app boot / in /agents/profile so the
 * operator gets a clear "key not configured" message instead of cryptic
 * Supabase errors when they try to save credentials.
 */
export function vaultIsConfigured(): { ok: true } | { ok: false; reason: string } {
  try {
    getKey();
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: err instanceof Error ? err.message : String(err),
    };
  }
}
