import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/agents-auth";

/**
 * Middleware gating the /agents dashboard.
 *
 * Routing:
 *   - On `agents.onyxcreative.asia` (the subdomain): require a valid
 *     signed session cookie. Unauthenticated requests redirect to the
 *     branded login page at /login.
 *   - On the main domain: hitting /agents/* directly is blocked (404).
 *
 * The login page itself and the /api/auth endpoint must be reachable
 * without a session, so they're explicitly allowed through.
 *
 * Middleware runs BEFORE next.config.ts rewrites, so URLs here are the
 * original visitor-facing paths (e.g. `/`, `/director`, `/login`), not
 * the rewritten paths (`/agents`, `/agents/director`, `/agents/login`).
 */

const AGENTS_HOST = "agents.onyxcreative.asia";
const LOCAL_HOST_PREFIX = "localhost:";

function isAgentsHostHeader(host: string): boolean {
  if (host === AGENTS_HOST) return true;
  // Allow localhost for dev (next.config rewrite doesn't fire there, so
  // visitors hit /agents/* directly — we still gate it below).
  return false;
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") || "";
  const isAgentsHost = isAgentsHostHeader(host);
  const isLocal = host.startsWith(LOCAL_HOST_PREFIX);
  const isAgentsPath = url.pathname.startsWith("/agents");

  // Block main-domain direct access to /agents/*.
  if (isAgentsPath && !isAgentsHost && !isLocal) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // The login page + auth API are public. On the subdomain they live at
  // /login + /api/auth (rewritten to /agents/...). Locally they live at
  // /agents/login + /agents/api/auth directly.
  const isLoginPath =
    url.pathname === "/login" || url.pathname === "/agents/login";
  const isAuthApi =
    url.pathname === "/api/auth" || url.pathname === "/agents/api/auth";

  if (isLoginPath || isAuthApi) {
    return NextResponse.next();
  }

  // Auth gate.
  const needsAuth = isAgentsHost || (isAgentsPath && isLocal);
  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  if (!session) {
    // Redirect to login on the same host. We preserve the original path so
    // we can bounce the user back after they sign in.
    const loginUrl = new URL("/login", req.url);
    // Don't send them back to internal /agents/* paths from a local dev
    // session — those won't exist on the subdomain after login.
    const safeNext =
      isLocal && isAgentsPath
        ? url.pathname.replace(/^\/agents/, "") || "/"
        : url.pathname;
    if (safeNext && safeNext !== "/login") {
      loginUrl.searchParams.set("next", safeNext);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next.js internals + the OG/icon endpoints.
  matcher: ["/((?!_next/|favicon|icon$|apple-icon$|opengraph-image$).*)"],
};
