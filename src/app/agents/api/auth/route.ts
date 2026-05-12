import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_S,
  checkCredentials,
  sessionCookieOptions,
  signSession,
} from "@/lib/agents-auth";

export const runtime = "nodejs";

/**
 * POST /api/auth (mounted at agents.onyxcreative.asia/api/auth via the
 * subdomain rewrite — actual file path is /agents/api/auth).
 *
 * Body: { username, password }
 * On success: sets the signed session cookie and returns 200.
 * On failure: 401 with a generic message (no leak of which field was wrong).
 */
export async function POST(req: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 }
    );
  }

  if (!checkCredentials(username, password)) {
    // Generic message — don't reveal which field was wrong.
    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401 }
    );
  }

  const token = await signSession(username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(SESSION_MAX_AGE_S));
  return res;
}

/**
 * DELETE /api/auth — log out. Clears the cookie unconditionally.
 */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(0), maxAge: 0 });
  return res;
}
