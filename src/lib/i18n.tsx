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

/**
 * Currency preference for Onyx Creative Asia.
 *
 * The public site is English-only. This provider holds a single
 * preference: which currency to show prices in (IDR or USD). The
 * header toggle flips it; the choice persists in localStorage.
 *
 * NOTE: this module used to host a Bahasa Indonesia translation layer.
 * That feature was removed. `useT` and `<T>` are kept as identity
 * pass-throughs so the many `t(...)` / `<T>...</T>` call sites across
 * the app keep compiling and simply render their English source. New
 * code should not add `t()` wrappers.
 */

export type Currency = "idr" | "usd";

const DEFAULT_CURRENCY: Currency = "idr";
const STORAGE_KEY = "onyx_currency";

const CurrencyContext = createContext<{
  currency: Currency;
  setCurrency: (c: Currency) => void;
}>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);

  // Hydrate from localStorage after first mount so SSR + first client
  // paint match (no hydration mismatch).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "idr" || stored === "usd") setCurrencyState(stored);
    } catch {
      /* localStorage unavailable (private mode etc.), ignore */
    }
  }, []);

  const setCurrency = useCallback((next: Currency) => {
    setCurrencyState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
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

/**
 * Identity translator, kept for backward compatibility with existing
 * `const t = useT()` call sites. Always returns the source string.
 */
export function useT() {
  return (s: string) => s;
}

/**
 * Identity inline-text component, kept so existing `<T>...</T>` wraps in
 * server components keep working. Renders its children unchanged.
 */
export function T({ children }: { children: string }) {
  return <>{children}</>;
}
