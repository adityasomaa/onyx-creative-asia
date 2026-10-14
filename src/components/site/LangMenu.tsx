"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { LOCALES, useCurrency, useL, useLocale } from "@/lib/i18n";
import { LOCALE_TAG } from "@/lib/l10n";
import { CURRENCIES, currencyName } from "@/lib/currency";
import { BUDGET, UI } from "@/lib/copy";
import { cn } from "@/lib/cn";
import Roll from "./Roll";

/**
 * Language and currency picker: "EN · IDR", opening a panel with the four
 * languages and every Asian currency. Used in the nav and on the /enquire
 * canvas. The nav controls it (opening the palette or the menu closes it);
 * left uncontrolled, it closes itself on an outside click or Escape.
 */
export default function LangMenu({
  open: controlled,
  onOpenChange,
  className,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}) {
  const tl = useL();
  const { locale, setLocale } = useLocale();
  const { currency, setCurrency } = useCurrency();
  const [own, setOwn] = useState(false);
  const open = controlled ?? own;
  const set = (v: boolean) => {
    if (controlled === undefined) setOwn(v);
    onOpenChange?.(v);
  };
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (controlled !== undefined || !own) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOwn(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOwn(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [controlled, own]);

  const current = LOCALES.find((x) => x.code === locale) ?? LOCALES[0];

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={tl(UI.language)}
        aria-expanded={open}
        onClick={() => set(!open)}
        className="group flex h-8 items-center gap-1 font-tek text-[14px] font-medium uppercase text-white/85 hover:text-white md:text-[15px]"
      >
        <Roll text={`${current.label} · ${currency}`} />
        <svg viewBox="0 0 10 6" className={cn("h-1.5 w-2.5 transition-transform", open && "rotate-180")} aria-hidden>
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-[50px] z-10 w-[min(272px,calc(100vw-40px))] overflow-hidden bg-night shadow-[0_20px_40px_-20px_rgba(0,0,0,.6)]"
          >
            <p className="px-4 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.04em] text-white/40">{tl(UI.language)}</p>
            <ul>
              {LOCALES.map((loc) => (
                <li key={loc.code}>
                  <button
                    type="button"
                    onClick={() => {
                      setLocale(loc.code);
                      set(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between border-t border-white/10 px-4 py-3 text-left text-[13px] transition-colors hover:bg-white/5",
                      loc.code === locale ? "text-accent" : "text-white/80",
                    )}
                    lang={loc.code}
                  >
                    <span>{loc.name}</span>
                    <span className="font-tek text-[12px]">{loc.label}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="border-t border-white/10 px-4 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.04em] text-white/40">{tl(BUDGET.currency)}</p>
            {/* All of Asia is a long list: it scrolls inside the panel (Lenis keeps off). */}
            <ul data-lenis-prevent className="max-h-[260px] overflow-y-auto overscroll-contain">
              {CURRENCIES.map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrency(c);
                      set(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 border-t border-white/10 px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-white/5",
                      c === currency ? "text-accent" : "text-white/80",
                    )}
                  >
                    <span className="truncate">{currencyName(c, LOCALE_TAG[locale])}</span>
                    <span className="font-tek text-[12px]">{c}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
