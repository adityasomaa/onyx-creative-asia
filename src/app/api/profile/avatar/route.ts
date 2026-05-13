import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/agents-auth";
import { getServerSupabase } from "@/lib/supabase";
import { updateProfile } from "@/lib/db/profile";

export const runtime = "nodejs";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2 MB
const BUCKET = "dashboard-avatars";

const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/svg+xml"];

async function assertSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

/**
 * POST /api/profile/avatar
 *
 * Body: JSON { name, type, dataBase64 } — same shape as the career CV
 * upload so the client code is consistent.
 *
 * Uploads to public storage bucket 'dashboard-avatars', then PATCHes
 * the profile row with the new public URL. Returns the URL so the
 * caller can show it immediately without refetching.
 */
export async function POST(req: Request) {
  const session = await assertSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { name?: unknown; type?: unknown; dataBase64?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const fileName =
    typeof body.name === "string" && body.name.trim() ? body.name : "avatar";
  const mime = typeof body.type === "string" ? body.type : "image/png";
  const b64 = typeof body.dataBase64 === "string" ? body.dataBase64 : "";

  if (!ACCEPTED.includes(mime)) {
    return NextResponse.json(
      { ok: false, error: `Unsupported file type: ${mime}` },
      { status: 400 }
    );
  }
  if (!b64) {
    return NextResponse.json({ ok: false, error: "Missing file data." }, { status: 400 });
  }

  const buffer = Buffer.from(b64, "base64");
  if (buffer.byteLength > MAX_AVATAR_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Avatar must be ≤ 2 MB." },
      { status: 400 }
    );
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "DB not configured." },
      { status: 500 }
    );
  }

  // Deterministic path so re-uploads overwrite the previous file
  // (no stale junk left in the bucket).
  const ext = fileName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "png";
  const path = `primary/avatar.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: mime,
      upsert: true,
      cacheControl: "60",
    });

  if (uploadErr) {
    console.error("[profile/avatar] upload error", uploadErr);
    return NextResponse.json(
      { ok: false, error: uploadErr.message },
      { status: 500 }
    );
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = pub.publicUrl;

  // Cache-buster on the URL so a new upload doesn't get the old image
  // back from the browser cache.
  const finalUrl = `${publicUrl}?v=${Date.now()}`;

  const result = await updateProfile({ avatar_url: finalUrl });
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, profile: result.profile, url: finalUrl });
}

/**
 * DELETE /api/profile/avatar
 *
 * Removes the avatar from storage + clears the URL on the profile.
 */
export async function DELETE() {
  const session = await assertSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "DB not configured." },
      { status: 500 }
    );
  }

  // List the primary/ folder and delete whatever's there. We could
  // store the exact filename in the profile and target it directly,
  // but listing handles the case where extension changed across uploads.
  const { data: existing } = await supabase.storage.from(BUCKET).list("primary");
  if (existing && existing.length > 0) {
    await supabase.storage
      .from(BUCKET)
      .remove(existing.map((f) => `primary/${f.name}`));
  }

  const result = await updateProfile({ avatar_url: null });
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true, profile: result.profile });
}
