import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/agents-auth";
import {
  getProfile,
  updateProfile,
  REPLY_TONES,
  type ReplyTone,
} from "@/lib/db/profile";

export const runtime = "nodejs";

async function assertSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

export async function GET() {
  const session = await assertSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const profile = await getProfile();
  return NextResponse.json({ ok: true, profile });
}

export async function PATCH(req: Request) {
  const session = await assertSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    display_name?: unknown;
    avatar_url?: unknown;
    email_signature?: unknown;
    reply_tone?: unknown;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};

  if (typeof body.display_name === "string") {
    const v = body.display_name.trim();
    update.display_name = v.length > 80 ? v.slice(0, 80) : v;
  } else if (body.display_name === null) {
    update.display_name = null;
  }

  if (typeof body.avatar_url === "string") {
    const v = body.avatar_url.trim();
    update.avatar_url = v || null;
  } else if (body.avatar_url === null) {
    update.avatar_url = null;
  }

  if (typeof body.email_signature === "string") {
    update.email_signature = body.email_signature.slice(0, 1000);
  } else if (body.email_signature === null) {
    update.email_signature = null;
  }

  if (typeof body.reply_tone === "string") {
    if (!(REPLY_TONES as string[]).includes(body.reply_tone)) {
      return NextResponse.json(
        { ok: false, error: `Unknown reply tone: ${body.reply_tone}` },
        { status: 400 }
      );
    }
    update.reply_tone = body.reply_tone as ReplyTone;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { ok: false, error: "Nothing to update." },
      { status: 400 }
    );
  }

  const result = await updateProfile(update);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true, profile: result.profile });
}
