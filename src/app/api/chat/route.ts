import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, contextBlock } from "@/lib/assistant";
import { getWaDisplay } from "@/lib/wa-number";

/**
 * Site assistant: streams a plain-text reply from Claude. ANTHROPIC_API_KEY
 * is the Vercel team's shared env var and never reaches the client.
 *
 * Every limit here exists to keep strangers from spending the API budget:
 * same-origin only, capped message sizes and history, a per-instance rate
 * limit. The real guards sit outside the code: a Vercel Firewall rate limit
 * on /api/chat and the Claude Console spend limit.
 */

const MODEL = "claude-haiku-5-5";
const MAX_TURNS = 11;
const MAX_USER_CHARS = 600;
const MAX_ASSISTANT_CHARS = 1000;
const MAX_TOTAL_CHARS = 7000;
const MAX_BODY_BYTES = 16_000;
// Room for adaptive thinking and a short reply. With too small a budget the
// thinking can use all of it and the reply comes back empty.
const MAX_OUTPUT_TOKENS = 1000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 25;

const client = new Anthropic();

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS;
}

function parseMessages(body: unknown): Anthropic.MessageParam[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 40) return null;
  const msgs: Anthropic.MessageParam[] = [];
  let total = 0;
  for (const m of raw.slice(-MAX_TURNS)) {
    const role = (m as { role?: unknown })?.role;
    const content = (m as { content?: unknown })?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, role === "user" ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS);
    if (!text) continue;
    if (msgs.at(-1)?.role === role) return null; // must alternate
    total += text.length;
    msgs.push({ role, content: text });
  }
  while (msgs[0]?.role === "assistant") msgs.shift();
  if (msgs.at(-1)?.role !== "user" || total > MAX_TOTAL_CHARS) return null;
  return msgs;
}

const json = (status: number, error: string) => Response.json({ error }, { status });

function sameOrigin(req: Request) {
  // Browsers always send Origin on POST; scripts that omit it are rejected.
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json(403, "Forbidden");
  if (!req.headers.get("content-type")?.startsWith("application/json")) return json(415, "Unsupported media type");
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return json(413, "Payload too large");

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return json(429, "Too many requests");

  let messages: Anthropic.MessageParam[] | null;
  try {
    const raw = await req.text();
    messages = raw.length > MAX_BODY_BYTES ? null : parseMessages(JSON.parse(raw));
  } catch {
    messages = null;
  }
  if (!messages) return json(400, "Invalid request");

  const fallback = `Sorry, we couldn't answer that just now. Message us on WhatsApp (${getWaDisplay()}) or use https://onyxcreative.asia/enquire`;

  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      thinking: { type: "adaptive" },
      output_config: { effort: "low" },
      system: [
        { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
        { type: "text", text: contextBlock() },
      ],
      messages,
    });

    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        let sent = false;
        try {
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(event.delta.text));
              sent = true;
            }
          }
          const final = await stream.finalMessage();
          if (!sent) {
            console.error("[chat] no text in reply", final.stop_reason);
            controller.enqueue(encoder.encode(fallback));
          } else if (final.stop_reason === "max_tokens") {
            controller.enqueue(encoder.encode("…"));
          }
        } catch (err) {
          console.error("[chat] stream error", err instanceof Anthropic.APIError ? err.status : err);
          controller.enqueue(encoder.encode(sent ? `\n\n${fallback}` : fallback));
        } finally {
          controller.close();
        }
      },
      cancel() {
        stream.abort();
      },
    });

    return new Response(body, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[chat] request error", err instanceof Anthropic.APIError ? err.status : err);
    return json(500, "Something went wrong");
  }
}
