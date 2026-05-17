/**
 * LLM wrapper — provider-agnostic surface for the agents platform.
 *
 * Currently backed by Google Gemini (free tier via AI Studio). Every
 * other LLM call in the codebase goes through these two functions, so
 * we can swap to Claude / Mistral / OpenAI later by editing this file
 * only.
 *
 * Two exports:
 *   - generateText()      → plain text completion (for reply enhancement)
 *   - generateStructured() → JSON-mode generation against a JSON Schema
 *                            (for triage classification + extraction)
 *
 * Both return either { ok: true, ... } or { ok: false, error }, never
 * throw — caller decides how to react to LLM failures.
 *
 * Brand voice: every call carries the Onyx system instruction so the
 * output reads in our register (editorial, restrained, no exclamations,
 * bilingual-friendly).
 */

import { GoogleGenAI, Type } from "@google/genai";

const DEFAULT_MODEL = "gemini-2.5-flash";

function getClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
}

function getModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

/**
 * Brand-voice system instruction. Every LLM call inherits this so the
 * output reads as Onyx — not a generic "I'd be happy to help!" assistant.
 *
 * Kept short on purpose. The actual task prompt does the heavy lifting;
 * this just sets the register.
 */
const ONYX_SYSTEM_INSTRUCTION = `
You are an editorial assistant for Onyx Creative Asia — a Bali studio building
brand, performance marketing, AI systems, and web. Voice:
  · First-person plural ("we"), never "I".
  · No exclamation marks. No emojis.
  · English-first, with light Indonesian phrasing when natural ("kabari kita",
    "halo", "ya"). Don't translate, just texture.
  · Restrained, direct, editorial. Short sentences over long.
  · Confident but warm. Like a senior strategist writing a note, not a
    chatbot.
  · Never promise specific deliverables, deadlines, or prices unless the
    operator explicitly stated them.
`.trim();

/* ============================================================
 * generateText — free-form completion
 * ============================================================ */

export type GenerateTextInput = {
  /** The user-side prompt. Required. */
  prompt: string;
  /** Optional system instruction appended after the brand voice block. */
  systemAddon?: string;
  /** 0..1, default 0.4 — keep generated copy on-voice (low temp). */
  temperature?: number;
  /** Soft cap on output tokens. Default 800. */
  maxOutputTokens?: number;
};

export type GenerateTextResult =
  | { ok: true; text: string; model: string }
  | { ok: false; error: string; model: string };

export async function generateText(
  input: GenerateTextInput
): Promise<GenerateTextResult> {
  const model = getModel();
  const client = getClient();
  if (!client) {
    return {
      ok: false,
      error: "GEMINI_API_KEY not set — set it in Vercel env vars.",
      model,
    };
  }

  const systemInstruction = input.systemAddon
    ? `${ONYX_SYSTEM_INSTRUCTION}\n\n${input.systemAddon.trim()}`
    : ONYX_SYSTEM_INSTRUCTION;

  try {
    const res = await client.models.generateContent({
      model,
      contents: input.prompt,
      config: {
        systemInstruction,
        temperature: input.temperature ?? 0.4,
        maxOutputTokens: input.maxOutputTokens ?? 800,
      },
    });
    const text = res.text?.trim() ?? "";
    if (!text) {
      return {
        ok: false,
        error: "Empty response from Gemini.",
        model,
      };
    }
    return { ok: true, text, model };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[llm.generateText] threw:", msg);
    return { ok: false, error: msg, model };
  }
}

/* ============================================================
 * generateStructured — JSON-mode with schema
 * ============================================================ */

export type StructuredField =
  | { kind: "string"; description?: string; enum?: string[]; nullable?: boolean }
  | { kind: "number"; description?: string; nullable?: boolean }
  | { kind: "boolean"; description?: string; nullable?: boolean }
  | {
      kind: "array";
      itemType: "string" | "number";
      description?: string;
    };

export type StructuredSchema = Record<string, StructuredField>;

export type GenerateStructuredInput<S extends StructuredSchema> = {
  prompt: string;
  systemAddon?: string;
  /** Map of fieldName → field spec. Output JSON has these as keys. */
  schema: S;
  /** 0..1, default 0.1 — keep extraction deterministic. */
  temperature?: number;
  maxOutputTokens?: number;
};

export type GenerateStructuredResult<S extends StructuredSchema> =
  | {
      ok: true;
      data: { [K in keyof S]: unknown };
      raw: string;
      model: string;
    }
  | { ok: false; error: string; model: string };

/**
 * Generates a JSON object whose keys match the provided schema. Gemini's
 * JSON mode + responseSchema make the output reliably parseable.
 *
 * Field types map to Gemini's JSON Schema dialect via Type.* enums.
 */
export async function generateStructured<S extends StructuredSchema>(
  input: GenerateStructuredInput<S>
): Promise<GenerateStructuredResult<S>> {
  const model = getModel();
  const client = getClient();
  if (!client) {
    return {
      ok: false,
      error: "GEMINI_API_KEY not set — set it in Vercel env vars.",
      model,
    };
  }

  const systemInstruction = input.systemAddon
    ? `${ONYX_SYSTEM_INSTRUCTION}\n\n${input.systemAddon.trim()}`
    : ONYX_SYSTEM_INSTRUCTION;

  // Translate our schema into Gemini's responseSchema format
  const properties: Record<string, unknown> = {};
  const required: string[] = [];
  for (const [key, field] of Object.entries(input.schema)) {
    properties[key] = fieldToGeminiSchema(field);
    if (!("nullable" in field) || !field.nullable) {
      required.push(key);
    }
  }
  const responseSchema = {
    type: Type.OBJECT,
    properties,
    required,
  };

  try {
    const res = await client.models.generateContent({
      model,
      contents: input.prompt,
      config: {
        systemInstruction,
        temperature: input.temperature ?? 0.1,
        maxOutputTokens: input.maxOutputTokens ?? 800,
        responseMimeType: "application/json",
        responseSchema,
      },
    });
    const raw = res.text?.trim() ?? "";
    if (!raw) {
      return { ok: false, error: "Empty response from Gemini.", model };
    }
    let parsed: { [K in keyof S]: unknown };
    try {
      parsed = JSON.parse(raw) as { [K in keyof S]: unknown };
    } catch (parseErr) {
      const msg =
        parseErr instanceof Error ? parseErr.message : String(parseErr);
      return {
        ok: false,
        error: `Gemini returned non-JSON: ${msg} — raw: ${raw.slice(0, 200)}`,
        model,
      };
    }
    return { ok: true, data: parsed, raw, model };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[llm.generateStructured] threw:", msg);
    return { ok: false, error: msg, model };
  }
}

function fieldToGeminiSchema(field: StructuredField): Record<string, unknown> {
  if (field.kind === "string") {
    const out: Record<string, unknown> = { type: Type.STRING };
    if (field.description) out.description = field.description;
    if (field.enum) out.enum = field.enum;
    if (field.nullable) out.nullable = true;
    return out;
  }
  if (field.kind === "number") {
    const out: Record<string, unknown> = { type: Type.NUMBER };
    if (field.description) out.description = field.description;
    if (field.nullable) out.nullable = true;
    return out;
  }
  if (field.kind === "boolean") {
    const out: Record<string, unknown> = { type: Type.BOOLEAN };
    if (field.description) out.description = field.description;
    if (field.nullable) out.nullable = true;
    return out;
  }
  // array
  return {
    type: Type.ARRAY,
    description: field.description,
    items: {
      type: field.itemType === "number" ? Type.NUMBER : Type.STRING,
    },
  };
}

/** Re-exported for callers that want to inspect/override the brand prompt. */
export const ONYX_SYSTEM_PROMPT = ONYX_SYSTEM_INSTRUCTION;
