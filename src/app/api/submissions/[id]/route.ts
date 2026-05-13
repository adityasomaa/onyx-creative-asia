import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/agents-auth";
import { getServerSupabase } from "@/lib/supabase";
import type { InquiryType, SubmissionStatus } from "@/lib/db/types";

export const runtime = "nodejs";

/**
 * PATCH /api/submissions/[id]
 *
 * Used by the dashboard Action column to:
 *   - archive a submission        → { status: "archived" }
 *   - move to a different type    → { inquiryType: "career" }
 *   - mark as replied (later)     → { status: "replied" }
 *
 * Auth: requires a valid agents-dashboard session cookie. This endpoint
 * is INTERNAL — it lives at /agents/api in production via the same
 * subdomain rewrites as the rest of the dashboard. We gate it with the
 * session cookie so it can't be hit anonymously even if someone
 * discovers the path.
 */

// Only the three active statuses are writable. Legacy values
// (triaged/qualified/spam) were normalized out by migration 0006
// and aren't accepted here anymore.
const VALID_STATUS: SubmissionStatus[] = ["new", "replied", "archived"];

// 'unknown' is intentionally excluded — operators can only move a row
// into one of the four real types.
const VALID_TYPES: InquiryType[] = [
  "general",
  "project",
  "career",
  "partnership",
];

async function assertSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  return session;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await assertSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  }

  let body: { status?: unknown; inquiryType?: unknown };
  try {
    body = (await req.json()) as { status?: unknown; inquiryType?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};

  if (typeof body.status === "string") {
    if (!(VALID_STATUS as string[]).includes(body.status)) {
      return NextResponse.json(
        { ok: false, error: `Unknown status: ${body.status}` },
        { status: 400 }
      );
    }
    update.status = body.status;
    // Track triage timestamp + actor whenever the status leaves "new".
    if (body.status !== "new") {
      update.triaged_at = new Date().toISOString();
      update.triaged_by = session.username;
    }
  }

  if (typeof body.inquiryType === "string") {
    if (!(VALID_TYPES as string[]).includes(body.inquiryType)) {
      return NextResponse.json(
        { ok: false, error: `Unknown inquiry type: ${body.inquiryType}` },
        { status: 400 }
      );
    }
    update.inquiry_type = body.inquiryType;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { ok: false, error: "Nothing to update." },
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

  const { error } = await supabase
    .from("submissions")
    .update(update)
    .eq("id", id);

  if (error) {
    console.error("[submissions/patch] update error", error);
    return NextResponse.json(
      { ok: false, error: "Could not update." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
