"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { LOCALES, localeInfo, useCurrency, useL, useLocale } from "@/lib/i18n";
import { LOCALE_TAG } from "@/lib/l10n";
import { CURRENCIES, currencyName } from "@/lib/currency";
import { BUDGET, UI } from "@/lib/copy";
import { cn } from "@/lib/cn";
import Roll from "./Roll";

/**
 * Language and currency picker: "EN · IDR", opening a panel with two tabs,
 * every language of Asia and every Asian currency, each with a search
 * field. Used in the nav and on the /enquire canvas. The nav controls it
 * (opening the palette or the menu closes it); left uncontrolled, it
 * closes itself on an outside click or Escape.
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
  const [tab, setTab] = useState<"lang" | "cur">("lang");
  const [q, setQ] = useState("");
  const set = (v: boolean) => {
    if (controlled === undefined) setOwn(v);
    onOpenChange?.(v);
  };
  const ref = useRef<HTMLDivElement>(null);

  // Each opening starts on the language list with an empty search.
  useEffect(() => {
    if (open) {
      setTab("lang");
      setQ("");
    }
  }, [open]);

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

  const current = localeInfo(locale);
  const tag = LOCALE_TAG[locale];
  const needle = q.trim().toLowerCase();
  const langs = useMemo(
    () => LOCALES.filter((x) => !needle || [x.name, x.english, x.code, x.label].some((s) => s.toLowerCase().includes(needle))),
    [needle],
  );
  const curs = useMemo(
    () => CURRENCIES.filter((c) => !needle || c.toLowerCase().includes(needle) || currencyName(c, tag).toLowerCase().includes(needle) || currencyName(c, "en").toLowerCase().includes(needle)),
    [needle, tag],
  );

  const tabBtn = (id: "lang" | "cur", label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={tab === id}
      onClick={() => {
        setTab(id);
        setQ("");
      }}
      className={cn(
        "flex-1 border-b-2 px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.04em] transition-colors",
        tab === id ? "border-accent text-white" : "border-transparent text-white/40 hover:text-white/70",
      )}
    >
      {label}
    </button>
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={tl(UI.language)}
        aria-expanded={open}
        onClick={() => set(!open)}
        className="group flex h-8 items-center gap-1 font-tek text-[14px] font-medium uppercase text-white/85 hover:text-white md:text-[15px]"
      >
        {/* The narrowest phones show the language alone; the currency is one tap away in the panel. */}
        <Roll text={current.label} />
        <Roll text={` · ${currency}`} className="max-[379px]:hidden" />
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
            className="absolute right-0 top-[50px] z-10 w-[min(300px,calc(100vw-24px))] overflow-hidden bg-night shadow-[0_20px_40px_-20px_rgba(0,0,0,.6)]"
          >
            <div role="tablist" className="flex border-b border-white/10">
              {tabBtn("lang", tl(UI.language))}
              {tabBtn("cur", tl(BUDGET.currency))}
            </div>
            <div className="p-3">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={tl(UI.search)}
                aria-label={tl(UI.search)}
                className="w-full bg-white/[0.07] px-3 py-2 text-[16px] text-white outline-none placeholder:text-white/35 focus:shadow-[inset_0_0_0_1.5px_rgb(var(--accent-s))] focus-visible:!outline-none md:text-[13px]"
              />
            </div>
            {/* Long lists scroll inside the panel (Lenis keeps off). */}
            <ul data-lenis-prevent className="max-h-[min(340px,52svh)] overflow-y-auto overscroll-contain">
              {tab === "lang"
                ? langs.map((loc) => (
                    <li key={loc.code}>
                      <button
                        type="button"
                        data-locale={loc.code}
                        onClick={() => {
                          setLocale(loc.code);
                          set(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between gap-3 border-t border-white/10 px-4 py-2.5 text-left transition-colors hover:bg-white/5",
                          loc.code === locale ? "text-accent" : "text-white/85",
                        )}
                      >
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate text-[14px]" lang={loc.tag} dir={"rtl" in loc && loc.rtl ? "rtl" : undefined}>
                            {loc.name}
                          </span>
                          {loc.name !== loc.english && <span className="truncate text-[11px] text-white/40">{loc.english}</span>}
                        </span>
                        <span className="shrink-0 font-tek text-[12px]">{loc.label}</span>
                      </button>
                    </li>
                  ))
                : curs.map((c) => (
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
                        <span className="truncate">{currencyName(c, tag)}</span>
                        <span className="shrink-0 font-tek text-[12px]">{c}</span>
                      </button>
                    </li>
                  ))}
              {(tab === "lang" ? langs : curs).length === 0 && <li className="border-t border-white/10 px-4 py-3 text-[12px] text-white/40">{tl(UI.noMatch)}</li>}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
