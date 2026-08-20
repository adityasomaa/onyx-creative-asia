import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/agents-auth";

/**
 * Middleware gating the /agents dashboard.
 *
 * It used to key off the host: a valid session was required on
 * agents.onyxcreative.asia, and /agents/* on the main domain was 404'd
 * outright. That subdomain has been detached, so keying on it would have
 * left the dashboard unreachable everywhere: dead on the subdomain, 404
 * on the apex.
 *
 * Now the path is what matters. Everything under /agents requires a
 * valid signed session wherever it is served, which is the same
 * protection the subdomain had, minus the host.
 *
 * The login page and the auth endpoint have to be reachable without a
 * session, so they are allowed through explicitly.
 */

const LOGIN_PATH = "/agents/login";
const AUTH_API_PATH = "/agents/api/auth";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  if (!url.pathname.startsWith("/agents")) return NextResponse.next();
  if (url.pathname === LOGIN_PATH || url.pathname === AUTH_API_PATH) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (session) return NextResponse.next();

  // Keep where they were headed so login can bounce them back.
  const loginUrl = new URL(LOGIN_PATH, req.url);
  if (url.pathname && url.pathname !== LOGIN_PATH) {
    loginUrl.searchParams.set("next", url.pathname);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Only the dashboard needs gating now, so the matcher no longer has to
  // run over the whole marketing site to decide it has nothing to do.
  matcher: ["/agents/:path*"],
};
