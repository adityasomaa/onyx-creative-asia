"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useL, T } from "@/lib/i18n";
import { NAV, UI } from "@/lib/copy";
import { PROJECTS } from "@/lib/data";
import { getWaDisplay } from "@/lib/wa-number";
import { cn } from "@/lib/cn";
import { useAccent } from "./Accent";
import LangMenu from "./LangMenu";
import Palette from "./Palette";
import Roll from "./Roll";
import Wordmark from "./Wordmark";
import { useBaliTime } from "./useBaliTime";

const LATEST = PROJECTS.find((p) => p.slug === "swarma-villas") ?? PROJECTS[0];
const HINT_KEY = "onyx_palette_hint";

function Burger({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3 w-8" aria-hidden>
      <span
        className={cn(
          "absolute left-0 top-0 h-[2px] w-6 bg-white transition-transform duration-300",
          open && "left-1 top-[5px] w-6 rotate-45",
        )}
      />
      <span
        className={cn(
          "absolute right-0 top-[9px] h-[2px] w-5 bg-white transition-transform duration-300",
          open && "right-1 top-[5px] w-6 -rotate-45",
        )}
      />
    </span>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const tl = useL();
  const { accent } = useAccent();
  const time = useBaliTime();

  const [menu, setMenu] = useState(false);
  const [palette, setPalette] = useState(false);
  const [hint, setHint] = useState(false);
  const [lang, setLang] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLButtonElement>(null);
  const [need, setNeed] = useState(0);

  // The bar is never narrower than its own row (logo + controls), whatever
  // the locale or currency label: measured, so the width still animates.
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const measure = () => {
      const cs = getComputedStyle(el);
      const [a, b] = Array.from(el.children) as HTMLElement[];
      const w = (n: HTMLElement) => n.getBoundingClientRect().width;
      setNeed(Math.ceil(w(a) + w(b) + parseFloat(cs.columnGap) + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    Array.from(el.children).forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, []);

  // Wide (aligned with the home hero's intro column) only at the very top of home.
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const wide = pathname === "/" && !scrolled;

  // Close everything on navigation.
  useEffect(() => {
    setMenu(false);
    setPalette(false);
    setLang(false);
  }, [pathname]);

  // Outside click and Escape close the open panel.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenu(false);
        setPalette(false);
        setLang(false);
        setHint(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        setPalette(false);
        setLang(false);
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // First visit only: open the palette once with a pointer to the dot,
  // as the reference does. Any scroll or click dismisses it.
  useEffect(() => {
    let seen = true;
    try {
      seen = !!localStorage.getItem(HINT_KEY);
      if (!seen) localStorage.setItem(HINT_KEY, "1");
    } catch {
      /* ignore */
    }
    if (seen) return;
    const delay = document.documentElement.dataset.intro === "play" ? 3600 : 1400;
    const t = setTimeout(() => {
      setPalette(true);
      setHint(true);
    }, delay);
    const dismiss = () => {
      setHint(false);
      setPalette((p) => (p ? false : p));
    };
    const onScroll = () => window.scrollY > 120 && dismiss();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href));

  return (
    <header ref={ref} className="fixed left-0 top-0 z-[200] w-full md:w-auto">
      <div
        className={cn(
          "relative bg-night text-white transition-[width] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]",
          "w-full",
          menu
            ? "md:w-[min(max(576px,var(--nav-need,460px)),100vw)]"
            : wide
              ? "md:w-[max(40vw,440px,var(--nav-need,460px))]"
              : "md:w-[max(390px,var(--nav-need,460px))]",
        )}
        style={need ? ({ "--nav-need": `${need}px` } as React.CSSProperties) : undefined}
      >
        <div ref={row} className="flex h-[70px] items-center justify-between gap-3 px-4 md:gap-4 md:px-8">
          <Link href="/" aria-label={tl(UI.home)} className="shrink-0 text-white">
            {/* Under 360px (old SE, folded phones) the mark stands alone. */}
            <Wordmark className="text-[17px] max-[359px]:[&>span:last-child]:hidden md:text-[21px]" />
          </Link>

          <div className="flex shrink-0 items-center gap-3 md:gap-6">
            <button
              ref={dot}
              type="button"
              aria-label={tl(UI.accentToggle)}
              aria-expanded={palette}
              onClick={() => {
                setPalette((p) => !p);
                setHint(false);
                setLang(false);
                setMenu(false);
              }}
              className="grid h-8 w-8 place-items-center"
            >
              <span className="h-6 w-6 rounded-full ring-2 ring-white transition-transform duration-300 hover:scale-110" style={{ background: accent }} />
            </button>

            <LangMenu
              open={lang}
              onOpenChange={(v) => {
                setLang(v);
                if (v) setPalette(false);
              }}
            />

            <button
              type="button"
              aria-label={tl(menu ? UI.closeMenu : UI.openMenu)}
              aria-expanded={menu}
              onClick={() => {
                setMenu((m) => !m);
                setPalette(false);
                setLang(false);
              }}
              className="grid h-8 w-8 place-items-center"
            >
              <Burger open={menu} />
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {menu && (
            <motion.nav
              aria-label="Main"
              key="menu"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
              className="overflow-hidden"
            >
              <div className="flex max-h-[calc(100svh-70px)] flex-col overflow-y-auto no-scrollbar">
                <ul className="px-5 md:px-8">
                  {NAV.map((item, i) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.12 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      className="border-b border-white/10"
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMenu(false)}
                        className="group flex h-14 items-center justify-between"
                        aria-current={isActive(item.href) ? "page" : undefined}
                      >
                        <span className={cn("font-tek text-[18px] font-medium uppercase", isActive(item.href) ? "text-accent" : "text-white")}>
                          <Roll text={tl(item.label)} />
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-[-0.01em] text-white/45 transition-colors group-hover:text-accent">
                          {tl(item.meta)}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <Link href={`/projects/${LATEST.slug}`} className="group mt-8 flex gap-4 border-y border-white/10 px-5 py-5 md:px-8">
                  <span className="relative h-[75px] w-[120px] shrink-0 self-center overflow-hidden bg-white/5">
                    <Image src={LATEST.cover} alt="" fill sizes="120px" className="object-cover grayscale transition-transform duration-700 group-hover:scale-105" />
                  </span>
                  <span className="flex min-w-0 flex-col justify-between">
                    <span>
                      <span className="block text-[11px] font-semibold uppercase tracking-[-0.01em] text-accent">{tl(UI.latestProject)}</span>
                      <span className="mt-2 block font-tek text-[22px] font-medium uppercase leading-none md:text-[24px]">
                        {LATEST.client}
                      </span>
                    </span>
                    <span className="text-[12px] uppercase leading-[1.2] text-mute">
                      <T>{LATEST.blurb ?? LATEST.title}</T>
                    </span>
                  </span>
                </Link>

                <div className="flex items-end justify-between gap-4 px-5 py-5 text-[12px] uppercase text-faint md:px-8">
                  <div className="flex flex-col gap-2">
                    <a href="mailto:hello@onyxcreative.asia" className="hover:text-white">hello@onyxcreative.asia</a>
                    <span>{getWaDisplay()}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-[11px] text-mute">
                    <span className="flex items-center gap-1.5">
                      Bali, ID <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    </span>
                    <span>
                      {tl(UI.ourTime)} {time?.label ?? "--:--"} (WITA)
                    </span>
                  </div>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      <Palette open={palette} hint={hint} anchor={dot} container={ref} onClose={() => setPalette(false)} />
    </header>
  );
}
