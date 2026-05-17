import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/agents-auth";
import { getServerSupabase } from "@/lib/supabase";
import { getProfile } from "@/lib/db/profile";
import { enhanceReply } from "@/lib/reply-enhance";

export const runtime = "nodejs";

/**
 * POST /api/submissions/[id]/enhance-reply
 *
 * Body: { draft: string, channel: "email" | "whatsapp" }
 *
 * Returns: { ok: true, enhanced: string, original: string, model: string }
 *
 * The operator types a quick draft in the ReplyBox, clicks "Enhance",
 * and this route asks the LLM to polish it using the operator's saved
 * reply_tone preference plus the original submission body as context.
 *
 * Never sends anything — pure copy-polishing. Operator confirms the
 * polished version before the actual send goes through
 * /api/submissions/[id]/reply.
 */

async function assertSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await assertSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  }

  let body: { draft?: unknown; channel?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const draft = typeof body.draft === "string" ? body.draft.trim() : "";
  const channel =
    body.channel === "email" || body.channel === "whatsapp"
      ? body.channel
      : null;

  if (!draft) {
    return NextResponse.json(
      { ok: false, error: "Draft is empty — nothing to enhance." },
      { status: 400 }
    );
  }
  if (!channel) {
    return NextResponse.json(
      { ok: false, error: "Pick a channel (email or whatsapp) before enhancing." },
      { status: 400 }
    );
  }
  if (draft.length > 5000) {
    return NextResponse.json(
      { ok: false, error: "Draft too long (max 5000 chars)." },
      { status: 400 }
    );
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "DB unavailable" }, { status: 500 });
  }

  // Pull the original submission for LLM context + the operator's tone
  const [{ data: row }, profile] = await Promise.all([
    supabase
      .from("submissions")
      .select("subject, body_md, from_name")
      .eq("id", id)
      .maybeSingle(),
    getProfile(),
  ]);

  const result = await enhanceReply({
    draft,
    tone: profile.reply_tone,
    channel,
    recipientFirstName:
      (row?.from_name as string | undefined)?.split(/\s+/)[0] ?? null,
    originalSubject: (row?.subject as string | undefined) ?? null,
    originalSubmissionBody: (row?.body_md as string | undefined) ?? null,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    enhanced: result.enhanced,
    original: result.original,
    model: result.model,
  });
}
