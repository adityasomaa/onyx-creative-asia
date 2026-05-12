"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

/**
 * Header + footer for the agents dashboard. Suppressed on /login so the
 * sign-in screen reads as a focused single-purpose page.
 *
 * Note on hrefs: this app is served from agents.onyxcreative.asia, where
 * next.config rewrites `/`, `/submissions`, etc. to the `/agents/*`
 * internal routes. The nav links here use the *internal* paths so they
 * work both locally (localhost:3000/agents/...) and on the subdomain.
 */

const NAV: { label: string; href: string; match: RegExp }[] = [
  { label: "Roster", href: "/agents", match: /^\/agents(\/[^/]+)?$/ },
  {
    label: "Submissions",
    href: "/agents/submissions",
    match: /^\/agents\/submissions/,
  },
  {
    label: "Dashboard",
    href: "/agents/dashboard",
    match: /^\/agents\/dashboard/,
  },
  { label: "Flow", href: "/agents/flow", match: /^\/agents\/flow/ },
];

const AGENT_DETAIL_RE = /^\/agents\/(director|strategist|maker|account-manager)$/;

export default function AgentsChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin =
    pathname === "/login" || pathname === "/agents/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <>
      <header className="border-b border-bone/15 px-6 md:px-10 py-5 flex items-center justify-between gap-6 flex-wrap">
        <Link href="/agents" className="flex items-center gap-3 group">
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight">ONYX</span>
            <span className="text-[10px] italic font-light opacity-70">
              Agents
            </span>
          </div>
          <span className="text-[10px] tracking-[0.25em] opacity-50 ml-2 hidden md:inline">
            // INTERNAL CONSOLE · v0.2
          </span>
        </Link>

        <nav className="flex items-center gap-1 md:gap-2 text-[11px] tracking-[0.2em] uppercase">
          {NAV.map((item) => {
            const active =
              item.href === "/agents"
                ? pathname === "/agents" ||
                  AGENT_DETAIL_RE.test(pathname ?? "")
                : item.match.test(pathname ?? "");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 py-1.5 border transition-colors ${
                  active
                    ? "border-bone bg-bone text-ink"
                    : "border-transparent hover:border-bone/40 opacity-75 hover:opacity-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-5 text-[11px] tracking-[0.2em] uppercase opacity-65">
          <span className="hidden md:inline-flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            SESSION · LIVE
          </span>
          <LogoutButton />
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-bone/15 mt-20 px-6 md:px-10 py-8 flex flex-col md:flex-row gap-3 md:gap-8 justify-between text-[11px] tracking-[0.2em] uppercase opacity-55">
        <span>© MMXXVI · ONYX CREATIVE ASIA · BALI</span>
        <span>
          NOT FOR PUBLIC INDEXING · COOKIE-SESSION GATED
        </span>
      </footer>
    </>
  );
}
