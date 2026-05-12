"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import AnimatedLogo from "@/components/AnimatedLogo";

/**
 * Compact top bar — SaaS-style. Brand on the left, primary nav center,
 * session info + logout on the right. Suppressed entirely on /login so
 * the sign-in page reads as a focused single-purpose screen.
 *
 * Mobile layout: brand + logout stay pinned to the edges; the nav in
 * the middle scrolls horizontally without showing a scrollbar. That
 * way the whole page never overflows the viewport, and every nav item
 * is reachable even on narrow phones.
 */

const NAV: { label: string; href: string; match: RegExp }[] = [
  {
    label: "Roster",
    href: "/agents",
    match: /^\/agents(\/(director|strategist|maker|account-manager))?$/,
  },
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
      <header className="sticky top-0 z-50 border-b border-bone/15 bg-ink/95 backdrop-blur h-12 flex items-stretch overflow-hidden">
        {/* Brand — fixed left edge */}
        <Link
          href="/agents"
          className="flex items-center gap-2.5 group shrink-0 text-bone pl-4 pr-3 md:pl-6 md:pr-4"
          aria-label="Onyx Agents — internal console"
        >
          <AnimatedLogo
            variant="mark"
            className="w-6 h-6"
            ariaLabel="Onyx"
          />
          <span className="flex items-baseline gap-1.5 leading-none">
            <span className="text-sm font-medium tracking-tight">Onyx</span>
            <span className="text-[10px] italic opacity-60">Agents</span>
          </span>
        </Link>

        {/* Nav — scrolls horizontally on narrow viewports */}
        <nav
          aria-label="Primary"
          className="flex-1 flex items-center gap-0.5 text-[11px] tracking-[0.15em] uppercase overflow-x-auto agents-nav-scroll min-w-0"
        >
          {NAV.map((item) => {
            const active = item.match.test(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
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

        {/* Right side — fixed right edge */}
        <div className="flex items-center gap-3 md:gap-4 text-[10px] tracking-[0.18em] uppercase opacity-65 shrink-0 pr-4 md:pr-6 pl-2">
          <span className="hidden md:inline-flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Live
          </span>
          <LogoutButton />
        </div>
      </header>

      <main className="min-w-0">{children}</main>

      <footer className="border-t border-bone/10 mt-12 px-6 md:px-10 py-4 flex flex-col md:flex-row gap-2 md:gap-6 justify-between text-[10px] tracking-[0.18em] uppercase opacity-40">
        <span>© MMXXVI · Onyx Creative Asia</span>
        <span>Internal · cookie-gated · no-index</span>
      </footer>

      {/* Hide scrollbar on the nav. global so styled-jsx scoping doesn't fight it. */}
      <style jsx global>{`
        .agents-nav-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }
        .agents-nav-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
