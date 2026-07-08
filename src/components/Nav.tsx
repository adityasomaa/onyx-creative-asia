"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useIntroState } from "@/lib/intro";
import { SERVICES } from "@/lib/data";
import { useT } from "@/lib/i18n";

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
    // children[] is consumed by:
    //   - the mobile menu (rendered inline indented under Services)
    //   - the active-state detector (parent "Services" stays underlined
    //     when current route is a detail page)
    // The desktop mega panel reads from SERVICES directly so each card
    // has the full payload (number, short tagline, capabilities preview)
    // without us having to duplicate it here.
    children: [
      { href: "/services/web-development", label: "Web & Software Development" },
      { href: "/services/paid-media", label: "Ads Management" },
      { href: "/services/social-media", label: "Social Media Management" },
      { href: "/services/ai-systems", label: "AI Automation" },
    ],
  },
  { href: "/works", label: "Works" },
  { href: "/pricing", label: "Pricing" },
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
  const t = useT();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Desktop mega-menu open state, lifted to Nav so the panel can render
  // outside any single NavItem and span the full header width.
  const [megaOpen, setMegaOpen] = useState(false);
  // Mobile: which parent's sub-menu is expanded (only Services has one).
  // First tap on Services expands this; a second tap navigates to /services.
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  // On first load the intro loader is covering the page, so the header waits
  // until it has counted up and started lifting. Returning visitors (and
  // every client-side nav after) get the quick delay.
  const navDelay = introState === true ? 2.4 : 0.1;
  // Header is treated as "on a light surface" whenever it's scrolled, the
  // mobile menu is open, OR the mega menu is open — in all three cases we
  // paint it bone with ink text so the panel reads cleanly.
  const onLightSurface = scrolled || open || megaOpen;
  const dark = DARK_HERO_PATHS.has(pathname) && !onLightSurface;

  // Hover-coordination for the mega menu.
  // We open immediately on mouseenter of the Services trigger, and close on
  // a tiny delay so the cursor can travel from the trigger to the panel
  // (which lives below the header) without the menu collapsing mid-motion.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openMega = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setMegaOpen(true);
  };
  const closeMegaWithDelay = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 140);
  };
  const cancelCloseMega = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMegaOpen(false);
    setMobileExpanded(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) setMobileExpanded(null);
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={
          introState === null ? { y: -40, opacity: 0 } : { y: 0, opacity: 1 }
        }
        transition={{ duration: 1, ease: EASE, delay: navDelay }}
        onMouseLeave={closeMegaWithDelay}
        className={cn(
          "fixed top-0 left-0 right-0 z-[120] transition-colors duration-500",
          onLightSurface
            ? "bg-bone/95 backdrop-blur-md border-b border-hairline text-ink"
            : dark
              ? "bg-transparent text-bone"
              : "bg-transparent text-ink"
        )}
      >
        <div className="container-x flex h-16 md:h-20 items-center justify-between">
          <Link
            href="/"
            aria-label="Onyx Creative Asia, home"
            className="group flex items-center"
          >
            {/* ONYX Creative wordmark. Both color variants are stacked
                and cross-faded by opacity so the logo flips instantly
                with the dark/light nav state, no src swap flash.
                Aspect ratio ~2:1 (trimmed master in design/brand). */}
            <span className="relative block h-6 md:h-7 w-[48px] md:w-[56px] transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]">
              <Image
                src="/onyx-logo-black.png"
                alt="Onyx Creative Asia"
                fill
                priority
                sizes="56px"
                className={cn(
                  "object-contain object-left transition-opacity duration-500",
                  dark ? "opacity-0" : "opacity-100"
                )}
              />
              <Image
                src="/onyx-logo-white.png"
                alt=""
                aria-hidden
                fill
                priority
                sizes="56px"
                className={cn(
                  "object-contain object-left transition-opacity duration-500",
                  dark ? "opacity-100" : "opacity-0"
                )}
              />
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {/* Slice off the trailing Contact entry (it renders as the
                "Start a project" pill on the right). Home now sits in
                the inline nav as the first item — restored per request
                so the active-state underline can rest on / when the
                user is on the homepage. */}
            {NAV_LINKS.slice(0, -1).map((link) => {
              const hasMega = !!link.children && link.children.length > 0;
              const active =
                pathname === link.href ||
                link.children?.some(
                  (c) =>
                    pathname === c.href || pathname.startsWith(c.href + "/")
                ) === true;
              return (
                <div
                  key={link.href}
                  onMouseEnter={hasMega ? openMega : closeMegaWithDelay}
                  onFocus={hasMega ? openMega : undefined}
                >
                  <NavItem
                    href={link.href}
                    label={t(link.label)}
                    active={active}
                    dark={dark}
                    hasMega={hasMega}
                    megaOpen={hasMega && megaOpen}
                  />
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/contact"
              onMouseEnter={closeMegaWithDelay}
              className={cn(
                "hidden md:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-[transform,background-color,color] duration-500 ease-out-expo hover:scale-[1.03]",
                dark ? "bg-bone text-ink" : "bg-ink text-bone"
              )}
            >
              {t("Start a project")}
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

        {/* ─────────────────── DESKTOP MEGA MENU ───────────────────
            Lives inside the header, absolute-positioned to span full width
            below the inner container. Hovering it keeps the panel open;
            leaving the header (or hovering a non-Services nav item) closes
            it with a small delay. */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              key="mega-services"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE }}
              onMouseEnter={cancelCloseMega}
              onMouseLeave={closeMegaWithDelay}
              className="hidden md:block absolute top-full left-0 right-0 bg-bone text-ink border-b border-hairline shadow-[0_24px_60px_-20px_rgba(14,14,14,0.18)]"
            >
              <div className="container-x py-10 lg:py-12">
                {/* Heading row */}
                <div className="flex items-end justify-between flex-wrap gap-y-4 pb-8 border-b border-hairline">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] opacity-55 mb-2">
                      Capabilities
                    </p>
                    <h2 className="text-2xl md:text-3xl font-medium tracking-tight leading-tight">
                      Four disciplines,
                      <span className="font-light italic"> one studio.</span>
                    </h2>
                  </div>
                  <Link
                    href="/services"
                    className="text-xs uppercase tracking-[0.22em] opacity-70 hover:opacity-100 inline-flex items-center gap-2 group transition-opacity"
                  >
                    All on one page
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </div>

                {/* Service cards — 4 columns on lg, 2 on md, 1 on sm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-6 pt-8">
                  {SERVICES.map((s) => (
                    <Link
                      key={s.id}
                      href={`/services/${s.id}`}
                      className="group relative block py-2 pl-5"
                    >
                      {/* Hairline left-edge accent on hover.
                          Sits in the 20px gutter created by pl-5 above, so
                          it never overlaps the text — even on the leftmost
                          column where there's no preceding card gap. */}
                      <span
                        aria-hidden
                        className="absolute left-0 top-2 bottom-2 w-px bg-ink/70 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500 ease-out-expo"
                      />
                      <p className="text-[10px] uppercase tracking-[0.25em] opacity-50 tabular-nums">
                        {s.number} / 04
                      </p>
                      <h3 className="mt-2 text-xl font-medium tracking-tight leading-tight">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-sm italic text-ink/65 leading-relaxed">
                        {s.short}
                      </p>
                      <ul className="mt-4 space-y-1.5">
                        {s.capabilities.slice(0, 4).map((c) => (
                          <li
                            key={c}
                            className="text-xs text-ink/55 leading-snug flex items-baseline gap-2"
                          >
                            <span className="opacity-50">·</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] opacity-70 group-hover:opacity-100 transition-opacity">
                        Read
                        <span
                          aria-hidden
                          className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ─────────────────── MOBILE OVERLAY ─────────────────── */}
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
            <nav className="container-x flex flex-col gap-2 pt-12 overflow-y-auto pb-8">
              {NAV_LINKS.map((link, i) => {
                const hasChildren =
                  !!link.children && link.children.length > 0;
                const expanded = mobileExpanded === link.href;
                return (
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
                    {/* A parent with children (Services) is a two-step tap:
                        first tap expands the sub-menu (button, no nav),
                        a second tap on the now-open parent navigates to the
                        overview page (link). Leaf links navigate directly. */}
                    {hasChildren ? (
                      expanded ? (
                        <Link
                          href={link.href}
                          className="flex items-center justify-between py-3 text-4xl font-medium tracking-tight"
                        >
                          {t(link.label)}
                          <span aria-hidden className="text-xl opacity-60">
                            ▴
                          </span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setMobileExpanded(link.href)}
                          aria-expanded={false}
                          className="flex w-full items-center justify-between py-3 text-4xl font-medium tracking-tight text-left"
                        >
                          {t(link.label)}
                          <span aria-hidden className="text-xl opacity-60">
                            ▾
                          </span>
                        </button>
                      )
                    ) : (
                      <Link
                        href={link.href}
                        className="block py-3 text-4xl font-medium tracking-tight"
                      >
                        {t(link.label)}
                      </Link>
                    )}

                    <AnimatePresence initial={false}>
                      {hasChildren && expanded && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: EASE }}
                          className="overflow-hidden pl-1 pb-2 flex flex-col gap-1 border-l border-bone/20 ml-1"
                        >
                          {link.children!.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className="block py-1.5 pl-4 text-base font-light tracking-tight text-bone/70 hover:text-bone transition-colors"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
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
  hasMega,
  megaOpen,
}: {
  href: string;
  label: string;
  active: boolean;
  dark: boolean;
  hasMega: boolean;
  megaOpen: boolean;
}) {
  return (
    <Link
      href={href}
      aria-haspopup={hasMega ? "true" : undefined}
      aria-expanded={hasMega ? megaOpen : undefined}
      className={cn(
        "group relative text-sm tracking-tight transition-colors",
        dark ? "text-bone/80 hover:text-bone" : "text-ink/80 hover:text-ink"
      )}
    >
      <span className="relative inline-flex items-center gap-1">
        {label}
        {hasMega && (
          <span
            aria-hidden
            className={cn(
              "text-[8px] leading-none transition-transform duration-300 ease-out-expo",
              megaOpen ? "rotate-180" : "rotate-0"
            )}
          >
            ▾
          </span>
        )}
        <span
          className={cn(
            "absolute -bottom-1 left-0 h-px transition-all duration-500 ease-out-expo",
            dark ? "bg-bone" : "bg-ink",
            active || megaOpen ? "w-full" : "w-0 group-hover:w-full"
          )}
        />
      </span>
    </Link>
  );
}
