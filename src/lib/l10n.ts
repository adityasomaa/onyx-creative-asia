import { DICT } from "./i18n-dict";

/**
 * Locale primitives with no React in them, so data modules and server
 * routes can use them. (Anything exported from a "use client" file turns
 * into a client reference when a server component imports it, and calling
 * it throws. The React side lives in i18n.tsx and re-exports these.)
 */

export type Locale = "en" | "id" | "zh" | "ja";

export const LOCALES: ReadonlyArray<{ code: Locale; label: string; name: string }> = [
  { code: "en", label: "EN", name: "English" },
  { code: "id", label: "ID", name: "Bahasa Indonesia" },
  { code: "zh", label: "CN", name: "中文" },
  { code: "ja", label: "JP", name: "日本語" },
];

export function isLocale(v: unknown): v is Locale {
  return v === "en" || v === "id" || v === "zh" || v === "ja";
}

/** Look up a dictionary key for the active locale, falling back to English. */
export function translate(source: string, locale: Locale): string {
  if (locale === "en") return source;
  const table = DICT[locale];
  return (table && table[source]) || source;
}

/**
 * Inline localised copy. Content written for the rebuilt marketing site
 * carries all four languages beside each other instead of being keyed by
 * its English in the dictionary: keeping the translation next to the
 * source is what stops the two drifting apart when the English changes.
 */
export type L = { en: string; id: string; zh: string; ja: string };

/** Build an L in argument order: English, Indonesian, Chinese, Japanese. */
export function l(en: string, id: string, zh: string, ja: string): L {
  return { en, id, zh, ja };
}

export function pick(v: L | string, locale: Locale): string {
  return typeof v === "string" ? translate(v, locale) : v[locale] || v.en;
}
