"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Floating language switcher (bottom-left). EN is the default; picking
 * ID, CN, or JP translates the whole page. It drives the Google website
 * translate element via the `googtrans` cookie, so every string on the
 * page is translated without maintaining per-language copy.
 */

const LANGS = [
  { code: "en", label: "EN", name: "English" },
  { code: "id", label: "ID", name: "Bahasa Indonesia" },
  { code: "zh-CN", label: "CN", name: "中文" },
  { code: "ja", label: "JP", name: "日本語" },
] as const;

const EASE = [0.25, 1, 0.5, 1] as const;

function readCookieLang(): string {
  if (typeof document === "undefined") return "en";
  const m = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "en";
}

function apexDomain(): string {
  const parts = location.hostname.split(".");
  return parts.length > 1 ? "." + parts.slice(-2).join(".") : location.hostname;
}

function applyLang(code: string) {
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  const domain = apexDomain();
  // Always clear first so switching languages is clean.
  document.cookie = `googtrans=;path=/;${expire}`;
  document.cookie = `googtrans=;path=/;domain=${domain};${expire}`;
  if (code !== "en") {
    const val = `/en/${code}`;
    document.cookie = `googtrans=${val};path=/`;
    document.cookie = `googtrans=${val};path=/;domain=${domain}`;
  }
  location.reload();
}

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("en");

  useEffect(() => {
    setActive(readCookieLang());
  }, []);

  // Load the Google translate element once (hidden). It reads the
  // googtrans cookie on load and translates the page.
  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;
    (window as unknown as { googleTranslateElementInit?: () => void }).googleTranslateElementInit =
      () => {
        const g = (window as unknown as {
          google?: { translate?: { TranslateElement: new (o: unknown, el: string) => void } };
        }).google;
        if (g?.translate) {
          new g.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,id,zh-CN,ja",
              autoDisplay: false,
            },
            "google_translate_element",
          );
        }
      };
    const s = document.createElement("script");
    s.id = "google-translate-script";
    s.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(s);
  }, []);

  const current = LANGS.find((l) => l.code === active) ?? LANGS[0];

  return (
    <>
      <div id="google_translate_element" className="sr-only" aria-hidden />

      <div className="notranslate fixed bottom-5 left-5 z-[130]" translate="no">
        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="absolute bottom-12 left-0 min-w-[168px] overflow-hidden rounded-2xl border border-ink/10 bg-bone/90 p-1.5 shadow-[0_20px_50px_-20px_rgba(14,14,14,0.4)] backdrop-blur-xl"
            >
              {LANGS.map((l) => {
                const on = l.code === active;
                return (
                  <li key={l.code}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        if (!on) applyLang(l.code);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                        on ? "bg-ink text-bone" : "text-ink hover:bg-ink/[0.06]"
                      }`}
                    >
                      <span className="w-6 font-medium tabular-nums">
                        {l.label}
                      </span>
                      <span
                        className={on ? "text-bone/70" : "text-ink/55"}
                      >
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
    </>
  );
}
