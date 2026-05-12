"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

/**
 * Header + footer for the agents dashboard. Suppressed on /login so the
 * sign-in screen reads as a focused single-purpose page.
 */
export default function AgentsChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin =
    pathname === "/login" || pathname === "/agents/login";

  if (isLogin) {
    // Login page is full-bleed — its own page.tsx handles layout/branding.
    return <>{children}</>;
  }

  return (
    <>
      <header className="border-b border-bone/15 px-6 md:px-10 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight">ONYX</span>
            <span className="text-[10px] italic font-light opacity-70">
              Agents
            </span>
          </div>
          <span className="text-[10px] tracking-[0.25em] opacity-50 ml-2 hidden md:inline">
            // INTERNAL CONSOLE · v0.1
          </span>
        </Link>
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
