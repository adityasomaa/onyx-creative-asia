"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

/**
 * Compact top bar — SaaS-style. Brand on the left, primary nav center,
 * session info + logout on the right. Suppressed entirely on /login so
 * the sign-in page reads as a focused single-purpose screen.
 *
 * Internal paths are used in hrefs because:
 *   - On the subdomain (agents.onyxcreative.asia), next.config rewrites
 *     /, /dashboard, /submissions, etc. → /agents/* internal routes
 *   - On localhost, you hit /agents/* directly
 * Either way, /agents/<path> resolves correctly.
 */

const NAV: { label: string; href: string; match: RegExp }[] = [
  { label: "Roster", href: "/agents", match: /^\/agents(\/(director|strategist|maker|account-manager))?$/ },
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

export default function AgentsChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const isLogin =
    pathname === "/login" || pathname === "/agents/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-bone/15 bg-ink/95 backdrop-blur px-4 md:px-6 h-12 flex items-center justify-between gap-6">
        <Link href="/agents" className="flex items-center gap-2.5 group shrink-0">
          <span className="inline-block w-5 h-5 bg-bone text-ink rounded-sm flex items-center justify-center text-[10px] font-bold tracking-tight">
            O
          </span>
          <span className="flex items-baseline gap-1.5 leading-none">
            <span className="text-sm font-medium tracking-tight">Onyx</span>
            <span className="text-[10px] italic opacity-60">Agents</span>
          </span>
        </Link>

        <nav className="flex items-center gap-0.5 text-[11px] tracking-[0.15em] uppercase">
          {NAV.map((item) => {
            const active = item.match.test(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 py-1 transition-colors ${
                  active
                    ? "bg-bone text-ink"
                    : "opacity-65 hover:opacity-100 hover:bg-bone/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 text-[10px] tracking-[0.18em] uppercase opacity-65 shrink-0">
          <span className="hidden md:inline-flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Live
          </span>
          <LogoutButton />
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-bone/10 mt-12 px-6 md:px-10 py-4 flex flex-col md:flex-row gap-2 md:gap-6 justify-between text-[10px] tracking-[0.18em] uppercase opacity-40">
        <span>© MMXXVI · Onyx Creative Asia</span>
        <span>Internal · cookie-gated · no-index</span>
      </footer>
    </>
  );
}
