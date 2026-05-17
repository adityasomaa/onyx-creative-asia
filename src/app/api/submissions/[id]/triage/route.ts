import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/agents-auth";
import { getServerSupabase } from "@/lib/supabase";
import { triageSubmission } from "@/lib/triage";

export const runtime = "nodejs";

/**
 * POST /api/submissions/[id]/triage
 *
 * Manual re-triage button on the submission detail page. Fetches the
 * current row, hands it to the triage worker, and returns the updated
 * triage output for the UI to render without a full reload.
 *
 * Auth: same cookie-session check as the other internal endpoints.
 */

async function assertSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

export async function POST(
  _req: Request,
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

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "DB unavailable" }, { status: 500 });
  }

  const { data: row, error } = await supabase
    .from("submissions")
    .select(
      "id, source, inquiry_type, from_name, from_email, subject, body_md, budget_band, interest"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !row) {
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Submission not found" },
      { status: 404 }
    );
  }

  const result = await triageSubmission({
    id: row.id as string,
    source: row.source as string,
    inquiry_type: row.inquiry_type as string,
    from_name: (row.from_name as string | null) ?? null,
    from_email: (row.from_email as string | null) ?? null,
    subject: (row.subject as string | null) ?? null,
    body_md: (row.body_md as string | null) ?? null,
    budget_band: (row.budget_band as string | null) ?? null,
    interest: (row.interest as string[] | null) ?? [],
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    triage: result.triage,
    model: result.model,
    projectId: result.projectId,
  });
}
