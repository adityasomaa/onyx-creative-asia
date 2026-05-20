"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useIntroState } from "@/lib/intro";

type NavLink = {
  href: string;
  label: string;
  children?: ReadonlyArray<{ href: string; label: string }>;
};

const NAV_LINKS: ReadonlyArray<NavLink> = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  {
    href: "/services",
    label: "Services",
    // Each child links to its own /services/<slug> detail page.
    // The parent /services route stays as the four-disciplines overview.
    children: [
      { href: "/services/web-development", label: "Web Development" },
      { href: "/services/paid-media", label: "Paid Media" },
      { href: "/services/social-media", label: "Social Media" },
      { href: "/services/ai-systems", label: "AI Systems" },
    ],
  },
  { href: "/works", label: "Works" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

const EASE = [0.76, 0, 0.24, 1] as const;

// Pages whose hero uses a dark background — nav should render in dark mode
// (bone text on transparent) until the user scrolls past the fold.
const DARK_HERO_PATHS = new Set(["/"]);

export default function Nav() {
  const pathname = usePathname();
  const introState = useIntroState();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // When intro loader is showing this session, delay until it exits.
  // Otherwise (returning visitor), animate right away.
  const navDelay = introState === true ? 2.4 : 0.1;
  const dark = DARK_HERO_PATHS.has(pathname) && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={introState === null ? { y: -40, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: navDelay }}
        className={cn(
          "fixed top-0 left-0 right-0 z-[120] transition-colors duration-500",
          scrolled || open
            ? "bg-bone/85 backdrop-blur-md border-b border-hairline text-ink"
            : dark
            ? "bg-transparent text-bone"
            : "bg-transparent text-ink"
        )}
      >
        <div className="container-x flex h-16 md:h-20 items-center justify-between">
          <Link
            href="/"
            aria-label="Onyx Creative Asia — home"
            className="flex items-center gap-2 group"
          >
            <span
              className={cn(
                "block h-2 w-2 rounded-full transition-[transform,background-color] duration-500 group-hover:scale-150",
                dark ? "bg-bone" : "bg-ink"
              )}
            />
            <span className="text-sm md:text-base font-medium tracking-tight">
              Onyx<span className="font-light italic">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.slice(1, -1).map((link) => (
              <NavItem
                key={link.href}
                href={link.href}
                label={link.label}
                active={
                  pathname === link.href ||
                  link.children?.some(
                    (c) =>
                      pathname === c.href || pathname.startsWith(c.href + "/")
                  ) === true
                }
                dark={dark}
                items={link.children}
              />
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className={cn(
                "hidden md:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-[transform,background-color,color] duration-500 ease-out-expo hover:scale-[1.03]",
                dark ? "bg-bone text-ink" : "bg-ink text-bone"
              )}
            >
              Start a project
              <span aria-hidden>→</span>
            </Link>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="md:hidden flex flex-col justify-center items-end gap-[5px] h-10 w-10"
            >
              <span
                className={cn(
                  "block h-px transition-all duration-500 ease-out-expo",
                  dark ? "bg-bone" : "bg-ink",
                  open ? "w-6 translate-y-[3px] rotate-45" : "w-6"
                )}
              />
              <span
                className={cn(
                  "block h-px transition-all duration-500 ease-out-expo",
                  dark ? "bg-bone" : "bg-ink",
                  open ? "w-6 -translate-y-[3px] -rotate-45" : "w-4"
                )}
              />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="fixed inset-0 z-[110] bg-ink text-bone flex flex-col pt-20 md:hidden"
          >
            <nav className="container-x flex flex-col gap-2 pt-12">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.7,
                    ease: EASE,
                    delay: 0.2 + i * 0.07,
                  }}
                >
                  <Link
                    href={link.href}
                    className="block py-3 text-4xl font-medium tracking-tight"
                  >
                    {link.label}
                  </Link>
                  {/* Sub-items rendered inline under the parent — no
                      accordion toggle, just a tighter indented list so the
                      overview link + each detail page are all one tap away. */}
                  {link.children && link.children.length > 0 && (
                    <ul className="pl-1 pb-2 flex flex-col gap-1 border-l border-bone/20 ml-1">
                      {link.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block py-1.5 pl-4 text-base font-light tracking-tight text-bone/70 hover:text-bone transition-colors"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto container-x pb-10 text-xs uppercase tracking-[0.2em] opacity-60">
              hello@onyxcreative.asia
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({
  href,
  label,
  active,
  dark,
  items,
}: {
  href: string;
  label: string;
  active: boolean;
  dark: boolean;
  items?: ReadonlyArray<{ href: string; label: string }>;
}) {
  const [open, setOpen] = useState(false);

  // Small delay before closing so the mouse can travel from the trigger to
  // the panel without the dropdown collapsing mid-motion.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const trigger = (
    <Link
      href={href}
      className={cn(
        "group relative text-sm tracking-tight transition-colors",
        dark ? "text-bone/80 hover:text-bone" : "text-ink/80 hover:text-ink"
      )}
    >
      <span className="relative inline-flex items-center gap-1">
        {label}
        {items && items.length > 0 && (
          <span
            aria-hidden
            className={cn(
              "text-[8px] leading-none transition-transform duration-300 ease-out-expo",
              open ? "rotate-180" : "rotate-0"
            )}
          >
            ▾
          </span>
        )}
        <span
          className={cn(
            "absolute -bottom-1 left-0 h-px transition-all duration-500 ease-out-expo",
            dark ? "bg-bone" : "bg-ink",
            active ? "w-full" : "w-0 group-hover:w-full"
          )}
        />
      </span>
    </Link>
  );

  if (!items || items.length === 0) return trigger;

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      {trigger}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="absolute left-1/2 top-full -translate-x-1/2 pt-3"
            // Keep the panel inside the hover-bridge so the gap between the
            // trigger and the panel doesn't fire onMouseLeave.
          >
            <div
              className={cn(
                "min-w-[220px] border bg-bone text-ink shadow-[0_8px_30px_rgba(14,14,14,0.08)]",
                "border-hairline rounded-sm overflow-hidden"
              )}
            >
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-5 py-3 text-sm tracking-tight border-b border-hairline last:border-b-0 hover:bg-ink/[0.04] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
