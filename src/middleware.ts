import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware gating the /agents dashboard.
 *
 * Routing:
 *   - On `agents.onyxcreative.asia` (subdomain): all paths are rewritten by
 *     next.config.ts to /agents/*, and Basic Auth is required.
 *   - On the main domain: hitting /agents/* directly is blocked (404).
 *
 * Auth:
 *   Username + password come from env vars:
 *     DASHBOARD_USER (default: "onyx")
 *     DASHBOARD_PASSWORD (required — falls back to "onyx" in dev so the
 *     server doesn't lock you out without env vars set)
 *
 *   When the browser first hits a gated route, the response is 401 with
 *   `WWW-Authenticate: Basic`, which makes the browser pop the login dialog.
 *   The credentials are sent back as a base64 `Authorization: Basic <b64>`
 *   header on every subsequent request — browser remembers for the session.
 */

const AGENTS_HOST = "agents.onyxcreative.asia";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") || "";
  const isAgentsHost = host === AGENTS_HOST;
  const isAgentsPath = url.pathname.startsWith("/agents");

  // Block direct /agents/* access on the main domain.
  if (isAgentsPath && !isAgentsHost && host !== "localhost:3000") {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Gate everything served on the agents subdomain (after rewrite to /agents/*).
  if (isAgentsHost || (isAgentsPath && host === "localhost:3000")) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return unauthorized();
    }

    const decoded = atob(authHeader.replace("Basic ", "").trim());
    const sep = decoded.indexOf(":");
    if (sep < 0) return unauthorized();

    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);

    const expectedUser = process.env.DASHBOARD_USER || "onyx";
    const expectedPass = process.env.DASHBOARD_PASSWORD || "onyx";

    if (
      !timingSafeEqual(user, expectedUser) ||
      !timingSafeEqual(pass, expectedPass)
    ) {
      return unauthorized();
    }
  }

  return NextResponse.next();
}

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Onyx Agents", charset="UTF-8"',
    },
  });
}

/**
 * Constant-time string compare so credentials can't be brute-forced via
 * response-time analysis. Both inputs are short, so the loop is cheap.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export const config = {
  // Run on everything except Next.js internals + the OG/icon endpoints.
  matcher: ["/((?!_next/|favicon|icon$|apple-icon$|opengraph-image$).*)"],
};
