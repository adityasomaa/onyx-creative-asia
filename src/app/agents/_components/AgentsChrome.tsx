"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AnimatedLogo from "@/components/AnimatedLogo";
import UserMenu from "./UserMenu";

/**
 * Compact top bar — SaaS-style. On md+ the full nav row is shown.
 * On mobile only a hamburger icon is visible; tapping it opens a
 * full-screen drawer with the same nav items + a logout footer.
 *
 * Suppressed entirely on /login so the sign-in page reads as a focused
 * single-purpose screen.
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
  displayName,
  avatarUrl,
}: {
  children: React.ReactNode;
  displayName: string;
  avatarUrl: string | null;
}) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);

  const isLogin =
    pathname === "/login" || pathname === "/agents/login";

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

        {/* Desktop nav — visible md+ */}
        <nav
          aria-label="Primary"
          className="hidden md:flex flex-1 items-center gap-0.5 text-[11px] tracking-[0.15em] uppercase min-w-0"
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

        {/* Spacer on mobile so the right-edge controls sit flush right */}
        <div className="md:hidden flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-3 md:gap-4 text-[10px] tracking-[0.18em] uppercase shrink-0 pr-4 md:pr-6 pl-2">
          <span className="hidden md:inline-flex items-center gap-1.5 opacity-65">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Live
          </span>
          <div className="hidden md:block">
            <UserMenu displayName={displayName} avatarUrl={avatarUrl} />
          </div>
          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="agents-mobile-drawer"
            className="md:hidden h-8 w-8 flex flex-col items-center justify-center gap-[5px] opacity-90 hover:opacity-100"
          >
            <span
              className={`block h-px w-5 bg-bone transition-transform duration-300 ${
                open ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-5 bg-bone transition-transform duration-300 ${
                open ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile drawer — full-screen overlay below the header */}
      <MobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        pathname={pathname}
        displayName={displayName}
        avatarUrl={avatarUrl}
      />

      <main className="min-w-0">{children}</main>

      <footer className="border-t border-bone/10 mt-12 px-6 md:px-10 py-4 flex flex-col md:flex-row gap-2 md:gap-6 justify-between text-[10px] tracking-[0.18em] uppercase opacity-40">
        <span>© MMXXVI · Onyx Creative Asia</span>
        <span>Internal · cookie-gated · no-index</span>
      </footer>
    </>
  );
}

/* ============================================================
 * MobileDrawer — full-screen menu opened from the hamburger
 * ============================================================ */

function MobileDrawer({
  open,
  onClose,
  pathname,
  displayName,
  avatarUrl,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  displayName: string;
  avatarUrl: string | null;
}) {
  return (
    <div
      id="agents-mobile-drawer"
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      className={`md:hidden fixed inset-x-0 top-12 bottom-0 z-40 bg-ink transition-opacity duration-300 ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`h-full flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          open ? "translate-y-0" : "-translate-y-2"
        }`}
      >
        {/* Live pill at top */}
        <div className="px-6 pt-5 pb-3 flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase opacity-70">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Session · Live
        </div>

        {/* Nav items as a big readable list */}
        <nav
          aria-label="Primary"
          className="px-6 mt-2 divide-y divide-bone/10 border-y border-bone/10"
        >
          {NAV.map((item, i) => {
            const active = item.match.test(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-baseline justify-between py-5 group transition-colors ${
                  active ? "" : "hover:opacity-100"
                }`}
              >
                <span className="flex items-baseline gap-4">
                  <span className="text-[10px] tabular-nums opacity-40 tracking-[0.2em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-xl font-medium tracking-tight ${
                      active ? "text-bone" : "text-bone/80"
                    }`}
                  >
                    {item.label}
                  </span>
                </span>
                {active ? (
                  <span className="text-[10px] tracking-[0.22em] uppercase text-emerald-300">
                    Active
                  </span>
                ) : (
                  <span
                    aria-hidden
                    className="text-base opacity-40 group-hover:opacity-90 transition-all group-hover:translate-x-1"
                  >
                    →
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile link (mobile-only — UserMenu doesn't fit nicely here) */}
        <div className="px-6 pt-5 border-t border-bone/10 mt-2">
          <Link
            href="/agents/profile"
            onClick={onClose}
            className="flex items-center justify-between py-3 text-sm tracking-tight"
          >
            <span className="flex items-center gap-3">
              <Avatar url={avatarUrl} initial={(displayName.trim()[0] || "O").toUpperCase()} />
              <span className="flex flex-col leading-tight">
                <span className="font-medium">{displayName}</span>
                <span className="text-[10px] tracking-[0.22em] uppercase opacity-50 mt-0.5">
                  Profile settings
                </span>
              </span>
            </span>
            <span aria-hidden className="opacity-50">→</span>
          </Link>
        </div>

        {/* Footer area with logout */}
        <div className="mt-auto px-6 py-6 border-t border-bone/10 flex items-center justify-between">
          <p className="text-[10px] tracking-[0.22em] uppercase opacity-40">
            Internal console · v0.3
          </p>
          <MobileSignOut />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Tiny avatar + sign-out helpers used inside the mobile drawer.
 * ============================================================ */

function Avatar({ url, initial }: { url: string | null; initial: string }) {
  return (
    <span className="w-9 h-9 rounded-full overflow-hidden border border-bone/25 bg-bone/5 flex items-center justify-center shrink-0">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className="text-sm font-medium tracking-tight opacity-85">
          {initial}
        </span>
      )}
    </span>
  );
}

function MobileSignOut() {
  const [pending, setPending] = useState(false);
  async function logout() {
    setPending(true);
    try {
      await fetch("/api/auth", { method: "DELETE" });
    } catch {
      /* still navigate */
    }
    window.location.href = "/login";
  }
  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      className="text-[10px] tracking-[0.22em] uppercase opacity-70 hover:opacity-100 transition-opacity disabled:opacity-40"
    >
      {pending ? "Signing out…" : "Sign out →"}
    </button>
  );
}
