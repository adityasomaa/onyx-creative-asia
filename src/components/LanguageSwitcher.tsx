"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { LOCALES, useLocale } from "@/lib/i18n";

/**
 * Floating language switcher (bottom-left). EN is the default; picking
 * ID, CN, or JP swaps the site copy using our own hand-written
 * dictionary (see lib/i18n-dict.ts). No page reload, no Google widget.
 */

const EASE = [0.25, 1, 0.5, 1] as const;

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div className="fixed bottom-5 left-5 z-[130]">
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="absolute bottom-12 left-0 min-w-[168px] overflow-hidden rounded-2xl border border-ink/10 bg-bone/90 p-1.5 shadow-[0_20px_50px_-20px_rgba(14,14,14,0.4)] backdrop-blur-xl"
          >
            {LOCALES.map((l) => {
              const on = l.code === locale;
              return (
                <li key={l.code}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      if (!on) setLocale(l.code);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                      on ? "bg-ink text-bone" : "text-ink hover:bg-ink/[0.06]"
                    }`}
                  >
                    <span className="w-6 font-medium tabular-nums">
                      {l.label}
                    </span>
                    <span className={on ? "text-bone/70" : "text-ink/55"}>
                      {l.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-bone/90 px-4 py-2.5 text-sm font-medium text-ink shadow-[0_10px_30px_-10px_rgba(14,14,14,0.4)] backdrop-blur-xl transition-transform duration-500 ease-out-expo hover:-translate-y-0.5"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
        {current.label}
        <span
          aria-hidden
          className={`text-[10px] transition-transform duration-300 ${open ? "" : "rotate-180"}`}
        >
          ▾
        </span>
      </button>
    </div>
  );
}
