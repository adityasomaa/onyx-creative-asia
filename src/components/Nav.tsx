"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useIntroState } from "@/lib/intro";
import { SERVICES } from "@/lib/data";
import Button from "@/components/ui/Button";
import { useT, T } from "@/lib/i18n";

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
    children: SERVICES.map((s) => ({
      href: `/services/${s.id}`,
      label: s.title,
    })),
  },
  { href: "/works", label: "Works" },
  { href: "/insights", label: "Insights" },
  { href: "/enquire", label: "Contact" },
];

const EASE = [0.76, 0, 0.24, 1] as const;

// Pages whose hero uses a dark background — nav should render in dark mode
// (bone text on transparent) until the user scrolls past the fold.
// /enquire is a full-bleed ink canvas that never scrolls, so it stays here
// for the whole page: ink-on-ink made the header invisible.
const DARK_HERO_PATHS = new Set(["/", "/enquire"]);

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
  // Header is treated as "on a light surface" only when it's scrolled and the
  // mobile menu is closed. Opening the mega menu deliberately does NOT flip
  // it, so hovering Services only reveals the panel and the header stays
  // exactly as it was. When the mobile menu is open the full-screen overlay
  // behind the header is dark ink, so the header goes transparent with a
  // white logo and a white X — never a white bar.
  const onLightSurface = scrolled && !open;
  const dark = (DARK_HERO_PATHS.has(pathname) && !onLightSurface) || open;

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
            aria-label={t("Onyx Creative Asia, home")}
            className="group flex items-center"
          >
            {/* CA monogram. Both colour variants are stacked and
                cross-faded by opacity so the logo flips instantly with the
                dark/light nav state, no src swap flash. Both files are
                written at one shared 850x512 box so the fade cannot shift
                the mark. Box width follows that 1.66:1 ratio. */}
            <span className="relative block h-6 w-10 md:h-7 md:w-[46px] transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]">
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
            <span
              onMouseEnter={closeMegaWithDelay}
              className="hidden md:inline-flex"
            >
              <Button
                href="/enquire"
                tone={dark ? "light" : "dark"}
                className="px-5 py-2.5"
              >
                {t("Start a project")}
              </Button>
            </span>
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
            A floating, rounded glass panel centred under the header. It is
            deliberately NOT full width and does NOT flip the header to its
            light state, so opening it only reveals the panel. Each service
            row lights up by changing its own background on hover. */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              key="mega-services"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: EASE }}
              onMouseEnter={cancelCloseMega}
              onMouseLeave={closeMegaWithDelay}
              className="pointer-events-none absolute top-full left-0 right-0 mt-3 hidden justify-center px-6 md:flex"
            >
              {/* Centering is done by the flex wrapper above; the panel
                  itself carries no transform so framer-motion's animated
                  translateY can't clobber horizontal centering. */}
              <div className="pointer-events-auto w-[min(58rem,100%)] overflow-hidden rounded-3xl border border-white/15 bg-ink/85 text-bone shadow-[0_30px_90px_-32px_rgba(0,0,0,0.75)] ring-1 ring-inset ring-white/5 backdrop-blur-2xl backdrop-saturate-150">
                <div className="p-5 lg:p-6">
                <div className="mb-4 flex items-center justify-between gap-4 px-1">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-bone/50">
                    {t("Services")}
                  </p>
                  <Link
                    href="/services"
                    className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-bone/70 transition-colors hover:text-bone"
                  >
                    {t("See all")}
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-3">
                  {SERVICES.map((s) => (
                    <Link
                      key={s.id}
                      href={`/services/${s.id}`}
                      className="group flex flex-col rounded-2xl p-4 ring-1 ring-transparent transition-colors duration-300 hover:bg-bone/[0.08] hover:ring-white/10"
                    >
                      <p className="text-[10px] uppercase tracking-[0.25em] tabular-nums text-bone/40">
                        {s.number}
                      </p>
                      <h3 className="mt-2 text-base font-medium leading-tight tracking-tight">
                        <T>{s.title}</T>
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-bone/55">
                        <T>{s.short}</T>
                      </p>
                    </Link>
                  ))}
                </div>
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
                    {/* A parent with children (Services): the label itself is
                        always a plain link to the overview page, and a separate
                        round +/× toggle on the right opens the sub-menu. That
                        splits the two intents cleanly, no more guess-the-second-
                        tap. Leaf links navigate directly. */}
                    {hasChildren ? (
                      <div className="flex items-center justify-between">
                        <Link
                          href={link.href}
                          className="py-3 text-4xl font-medium tracking-tight"
                        >
                          {t(link.label)}
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setMobileExpanded(expanded ? null : link.href)
                          }
                          aria-expanded={expanded}
                          aria-label={
                            expanded ? "Collapse services" : "Expand services"
                          }
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-bone/25 text-bone transition-colors duration-300 hover:bg-bone/10"
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "text-2xl leading-none transition-transform duration-500 ease-out-expo",
                              expanded ? "rotate-45" : "rotate-0"
                            )}
                          >
                            +
                          </span>
                        </button>
                      </div>
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
                          className="mt-1 flex flex-col overflow-hidden border-t border-bone/10"
                        >
                          {link.children!.map((child) => {
                            const svc = SERVICES.find(
                              (s) => `/services/${s.id}` === child.href
                            );
                            return (
                              <li
                                key={child.href}
                                className="border-b border-bone/10"
                              >
                                <Link
                                  href={child.href}
                                  className="group flex items-baseline gap-3 py-3 transition-colors"
                                >
                                  <span className="shrink-0 pt-0.5 text-[11px] tabular-nums tracking-[0.2em] text-bone/35">
                                    {svc?.number ?? "•"}
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block text-lg font-medium leading-tight tracking-tight text-bone/90 transition-colors group-hover:text-bone">
                                      <T>{child.label}</T>
                                    </span>
                                    {svc?.short && (
                                      <span className="mt-0.5 block text-sm leading-snug text-bone/45">
                                        <T>{svc.short}</T>
                                      </span>
                                    )}
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
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
