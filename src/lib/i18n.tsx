"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  isLocale,
  pick,
  translate,
  type L,
  type Locale,
} from "./l10n";

export { LOCALES, l, pick, translate, type L, type Locale } from "./l10n";

/**
 * Manual i18n for Onyx Creative Asia.
 *
 * The public site ships four languages: English (source), Bahasa
 * Indonesia, Chinese, and Japanese. Translations are hand-written and
 * live in `i18n-dict.ts`, keyed by the exact English source string. This
 * replaces the old Google website-translate widget, so the copy reads
 * casual-but-formal in every language instead of machine-translated.
 *
 * Usage stays the same as before:
 *   - `const t = useT(); t("Some text")` inside client components
 *   - `<T>Some text</T>` inline (works inside server components too, since
 *     T is itself a client component)
 * Any string missing from the dictionary falls back to its English
 * source, so partial coverage degrades gracefully (never a blank).
 */

const DEFAULT_LOCALE: Locale = "en";
const LOCALE_KEY = "onyx_locale";

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
}>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Hydrate from storage after first mount so SSR + first client paint
  // both render English (no hydration mismatch), then switch.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCALE_KEY);
      if (isLocale(stored)) setLocaleState(stored);
    } catch {
      /* storage unavailable, ignore */
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_KEY, next);
      document.cookie = `${LOCALE_KEY}=${next};path=/;max-age=31536000;samesite=lax`;
    } catch {
      /* ignore */
    }
  }, []);

  // Keep <html lang> in step, so screen readers and the browser's own
  // translate prompt know which language the page is actually in.
  useEffect(() => {
    document.documentElement.lang =
      locale === "zh" ? "zh-CN" : locale === "ja" ? "ja" : locale;
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

/**
 * Translator hook for client components: `const t = useT(); t("Hello")`.
 */
export function useT() {
  const { locale } = useLocale();
  return useCallback((s: string) => translate(s, locale), [locale]);
}

/**
 * Inline translated text. `<T>Hello</T>` renders the active-locale copy.
 * Children must be a plain string (the dictionary key).
 */
export function T({ children }: { children: string }) {
  const { locale } = useLocale();
  return <>{translate(children, locale)}</>;
}

/** `const tl = useL(); tl(copy)` — accepts an L or a dictionary key. */
export function useL() {
  const { locale } = useLocale();
  return useCallback((v: L | string) => pick(v, locale), [locale]);
}

/** Inline form of useL, usable inside server components. */
export function Tx({ v }: { v: L | string }) {
  const { locale } = useLocale();
  return <>{pick(v, locale)}</>;
}

/* ============================================================
 * Currency preference (IDR / USD) — independent of language, kept from
 * the previous i18n module so pricing call sites keep working.
 * ============================================================ */

export type Currency = "idr" | "usd";

const DEFAULT_CURRENCY: Currency = "idr";
const CURRENCY_KEY = "onyx_currency";

const CurrencyContext = createContext<{
  currency: Currency;
  setCurrency: (c: Currency) => void;
}>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CURRENCY_KEY);
      if (stored === "idr" || stored === "usd") setCurrencyState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const setCurrency = useCallback((next: Currency) => {
    setCurrencyState(next);
    try {
      localStorage.setItem(CURRENCY_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ currency, setCurrency }),
    [currency, setCurrency],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
