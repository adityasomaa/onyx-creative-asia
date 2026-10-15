"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  isBase,
  isLocale,
  localeInfo,
  pick,
  translate,
  type Dict,
  type L,
  type Locale,
} from "./l10n";
import { loadDict } from "./locales";

import { DEFAULT_CURRENCY, FALLBACK_RATES, isCurrency, type CurrencyCode, type Rates } from "./currency";

export { LOCALES, l, localeInfo, pick, translate, type L, type Locale } from "./l10n";

/**
 * Manual i18n for Onyx Creative Asia.
 *
 * The public site reads in every language of Asia. English (source),
 * Bahasa Indonesia, Chinese and Japanese are written inline beside the
 * copy; the rest are per-language dictionaries keyed by the English,
 * fetched only when picked (see l10n.ts and locales/). Right-to-left
 * languages keep the page layout and set their text right-to-left
 * (html[data-dir="rtl"], globals.css).
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
  /** The active extra language's dictionary (null for the base four). */
  dict: Dict | null;
}>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  dict: null,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Locale and its dictionary change together, so an extra language never
  // renders one frame in English between the click and the download.
  const [state, setState] = useState<{ locale: Locale; dict: Dict | null }>({ locale: DEFAULT_LOCALE, dict: null });
  const ticket = useRef(0);
  const apply = useCallback(async (next: Locale) => {
    const mine = ++ticket.current;
    const dict = isBase(next) ? null : await loadDict(next);
    if (mine === ticket.current) setState({ locale: next, dict });
  }, []);
  const { locale, dict } = state;

  // Hydrate from storage after first mount so SSR + first client paint
  // both render English (no hydration mismatch), then switch.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCALE_KEY);
      if (isLocale(stored)) void apply(stored);
    } catch {
      /* storage unavailable, ignore */
    }
  }, [apply]);

  const setLocale = useCallback((next: Locale) => {
    void apply(next);
    try {
      localStorage.setItem(LOCALE_KEY, next);
      document.cookie = `${LOCALE_KEY}=${next};path=/;max-age=31536000;samesite=lax`;
    } catch {
      /* ignore */
    }
  }, [apply]);

  // Keep <html lang> in step, so screen readers and the browser's own
  // translate prompt know which language the page is actually in.
  useEffect(() => {
    const info = localeInfo(locale);
    document.documentElement.lang = info.tag;
    document.documentElement.dataset.dir = info.rtl ? "rtl" : "ltr";
    document.documentElement.dataset.script = info.complex ? "complex" : "simple";
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, dict }), [locale, setLocale, dict]);

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
  const { locale, dict } = useLocale();
  return useCallback((s: string) => translate(s, locale, dict), [locale, dict]);
}

/**
 * Inline translated text. `<T>Hello</T>` renders the active-locale copy.
 * Children must be a plain string (the dictionary key).
 */
export function T({ children }: { children: string }) {
  const { locale, dict } = useLocale();
  return <>{translate(children, locale, dict)}</>;
}

/** `const tl = useL(); tl(copy)` — accepts an L or a dictionary key. */
export function useL() {
  const { locale, dict } = useLocale();
  return useCallback((v: L | string) => pick(v, locale, dict), [locale, dict]);
}

/** Inline form of useL, usable inside server components. */
export function Tx({ v }: { v: L | string }) {
  const { locale, dict } = useLocale();
  return <>{pick(v, locale, dict)}</>;
}

/* ============================================================
 * Currency: which Asian currency the visitor reads amounts in (the budget
 * slider), with the day's rupiah rates from the server. Independent of
 * language; chosen in the nav's language menu or beside the slider, and
 * remembered per browser.
 * ============================================================ */

const CURRENCY_KEY = "onyx_currency";

const CurrencyContext = createContext<{
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  rates: Rates;
}>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
  rates: FALLBACK_RATES,
});

export function CurrencyProvider({ rates, children }: { rates: Rates; children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CURRENCY_KEY)?.toUpperCase();
      if (isCurrency(stored)) setCurrencyState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const setCurrency = useCallback((next: CurrencyCode) => {
    setCurrencyState(next);
    try {
      localStorage.setItem(CURRENCY_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ currency, setCurrency, rates }), [currency, setCurrency, rates]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
