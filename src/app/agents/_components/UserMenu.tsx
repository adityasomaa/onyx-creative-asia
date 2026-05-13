"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Props = {
  displayName: string;
  avatarUrl: string | null;
  /** Compact mode: avatar only, no name. Used in mobile drawer footer. */
  compact?: boolean;
};

/**
 * UserMenu — clickable avatar + display name that opens a dropdown
 * with Profile + Sign out. Replaces the bare "Sign out →" button in
 * the chrome top bar.
 */
export default function UserMenu({ displayName, avatarUrl, compact }: Props) {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const initial = (displayName.trim()[0] || "O").toUpperCase();

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  async function signOut() {
    setSigningOut(true);
    try {
      await fetch("/api/auth", { method: "DELETE" });
    } catch {
      /* still redirect; middleware will redirect to /login */
    }
    window.location.href = "/login";
  }

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-2 hover:opacity-100 opacity-90 transition-opacity"
      >
        <Avatar url={avatarUrl} initial={initial} />
        {!compact && (
          <span className="hidden md:inline-block text-[11px] tracking-[0.18em] uppercase max-w-[140px] truncate">
            {displayName}
          </span>
        )}
        {!compact && (
          <svg
            viewBox="0 0 10 6"
            className="hidden md:block w-2 h-1.5 opacity-50"
            aria-hidden
          >
            <path d="M0 0 L5 5 L10 0" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 z-30 w-56 border border-bone/15 bg-ink shadow-[0_8px_30px_-8px_rgba(0,0,0,0.6)] divide-y divide-bone/10"
        >
          {/* Header — name + auth note */}
          <div className="px-4 py-3 flex items-center gap-3">
            <Avatar url={avatarUrl} initial={initial} large />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-[10px] tracking-[0.18em] uppercase opacity-50">
                Console session
              </p>
            </div>
          </div>

          {/* Links */}
          <ul>
            <li>
              <Link
                href="/agents/profile"
                onClick={() => setOpen(false)}
                role="menuitem"
                className="block px-4 py-2.5 text-[11px] tracking-[0.22em] uppercase hover:bg-bone/5 transition-colors"
              >
                Profile settings
              </Link>
            </li>
          </ul>

          {/* Sign out */}
          <div>
            <button
              type="button"
              role="menuitem"
              onClick={signOut}
              disabled={signingOut}
              className="w-full text-left px-4 py-2.5 text-[11px] tracking-[0.22em] uppercase hover:bg-bone/5 transition-colors disabled:opacity-50"
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Avatar({
  url,
  initial,
  large,
}: {
  url: string | null;
  initial: string;
  large?: boolean;
}) {
  const cls = large ? "w-10 h-10" : "w-7 h-7";
  return (
    <span
      className={`${cls} rounded-full overflow-hidden border border-bone/25 bg-bone/5 flex items-center justify-center shrink-0`}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="w-full h-full object-cover" />
      ) : (
        <span
          className={`${large ? "text-base" : "text-[11px]"} font-medium tracking-tight opacity-85`}
        >
          {initial}
        </span>
      )}
    </span>
  );
}
