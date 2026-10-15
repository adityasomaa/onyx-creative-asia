import { DICT } from "./i18n-dict";

/**
 * Locale primitives with no React in them, so data modules and server
 * routes can use them. (Anything exported from a "use client" file turns
 * into a client reference when a server component imports it, and calling
 * it throws. The React side lives in i18n.tsx and re-exports these.)
 *
 * Two kinds of language:
 *   base   en, id, zh, ja: written by hand, carried inline beside the
 *          English in every L (and in i18n-dict for the case studies)
 *   extra  the rest of Asia: one dictionary per language, keyed by the
 *          English source, in src/lib/locales/<code>.json, loaded only
 *          when someone picks it (see locales/index.ts)
 * Anything a dictionary lacks falls back to English, never to a blank.
 */

export type BaseLocale = "en" | "id" | "zh" | "ja";

export type LocaleInfo = {
  code: string;
  /** Short tag in the nav button, e.g. "EN · IDR". */
  label: string;
  /** The language's own name for itself. */
  name: string;
  /** English name, for searching the menu. */
  english: string;
  /** BCP 47 tag for Intl formatting and <html lang>. */
  tag: string;
  rtl?: boolean;
  /**
   * A script that shapes across letters or stacks marks (Arabic, the Indic
   * and Southeast Asian scripts, Tibetan, Thaana): no negative tracking,
   * no all-caps tricks, and room above and below each line.
   */
  complex?: boolean;
};

export const LOCALES = [
  { code: "en", label: "EN", name: "English", english: "English", tag: "en" },
  { code: "id", label: "ID", name: "Bahasa Indonesia", english: "Indonesian", tag: "id-ID" },
  { code: "zh", label: "CN", name: "简体中文", english: "Chinese (Simplified)", tag: "zh-CN" },
  { code: "ja", label: "JP", name: "日本語", english: "Japanese", tag: "ja-JP" },
  // East Asia
  { code: "zh-TW", label: "TW", name: "繁體中文", english: "Chinese (Traditional)", tag: "zh-TW" },
  { code: "ko", label: "KO", name: "한국어", english: "Korean", tag: "ko-KR" },
  { code: "mn", label: "MN", name: "Монгол", english: "Mongolian", tag: "mn-MN" },
  // Southeast Asia
  { code: "ms", label: "MS", name: "Bahasa Melayu", english: "Malay", tag: "ms-MY" },
  { code: "th", label: "TH", name: "ไทย", english: "Thai", tag: "th-TH", complex: true },
  { code: "vi", label: "VI", name: "Tiếng Việt", english: "Vietnamese", tag: "vi-VN" },
  { code: "fil", label: "FIL", name: "Filipino", english: "Filipino", tag: "fil-PH" },
  { code: "km", label: "KM", name: "ខ្មែរ", english: "Khmer", tag: "km-KH", complex: true },
  { code: "lo", label: "LO", name: "ລາວ", english: "Lao", tag: "lo-LA", complex: true },
  { code: "my", label: "MM", name: "မြန်မာ", english: "Burmese", tag: "my-MM", complex: true },
  { code: "tet", label: "TET", name: "Tetun", english: "Tetum", tag: "tet-TL" },
  // South Asia
  { code: "hi", label: "HI", name: "हिन्दी", english: "Hindi", tag: "hi-IN", complex: true },
  { code: "bn", label: "BN", name: "বাংলা", english: "Bengali", tag: "bn-BD", complex: true },
  { code: "ur", label: "UR", name: "اردو", english: "Urdu", tag: "ur-PK", rtl: true, complex: true },
  { code: "pa", label: "PA", name: "ਪੰਜਾਬੀ", english: "Punjabi", tag: "pa-IN", complex: true },
  { code: "mr", label: "MR", name: "मराठी", english: "Marathi", tag: "mr-IN", complex: true },
  { code: "gu", label: "GU", name: "ગુજરાતી", english: "Gujarati", tag: "gu-IN", complex: true },
  { code: "ta", label: "TA", name: "தமிழ்", english: "Tamil", tag: "ta-IN", complex: true },
  { code: "te", label: "TE", name: "తెలుగు", english: "Telugu", tag: "te-IN", complex: true },
  { code: "kn", label: "KN", name: "ಕನ್ನಡ", english: "Kannada", tag: "kn-IN", complex: true },
  { code: "ml", label: "ML", name: "മലയാളം", english: "Malayalam", tag: "ml-IN", complex: true },
  { code: "si", label: "SI", name: "සිංහල", english: "Sinhala", tag: "si-LK", complex: true },
  { code: "ne", label: "NE", name: "नेपाली", english: "Nepali", tag: "ne-NP", complex: true },
  { code: "dz", label: "DZ", name: "རྫོང་ཁ", english: "Dzongkha", tag: "dz-BT", complex: true },
  { code: "dv", label: "DV", name: "ދިވެހި", english: "Dhivehi", tag: "dv-MV", rtl: true, complex: true },
  // Central Asia
  { code: "kk", label: "KK", name: "Қазақ тілі", english: "Kazakh", tag: "kk-KZ" },
  { code: "uz", label: "UZ", name: "Oʻzbekcha", english: "Uzbek", tag: "uz-UZ" },
  { code: "ky", label: "KY", name: "Кыргызча", english: "Kyrgyz", tag: "ky-KG" },
  { code: "tg", label: "TG", name: "Тоҷикӣ", english: "Tajik", tag: "tg-TJ" },
  { code: "tk", label: "TK", name: "Türkmençe", english: "Turkmen", tag: "tk-TM" },
  { code: "ru", label: "RU", name: "Русский", english: "Russian", tag: "ru-RU" },
  // West Asia
  { code: "ar", label: "AR", name: "العربية", english: "Arabic", tag: "ar", rtl: true, complex: true },
  { code: "fa", label: "FA", name: "فارسی", english: "Persian", tag: "fa-IR", rtl: true, complex: true },
  { code: "ps", label: "PS", name: "پښتو", english: "Pashto", tag: "ps-AF", rtl: true, complex: true },
  { code: "ckb", label: "KU", name: "کوردی", english: "Kurdish (Sorani)", tag: "ckb-IQ", rtl: true, complex: true },
  { code: "tr", label: "TR", name: "Türkçe", english: "Turkish", tag: "tr-TR" },
  { code: "he", label: "HE", name: "עברית", english: "Hebrew", tag: "he-IL", rtl: true, complex: true },
  { code: "az", label: "AZ", name: "Azərbaycanca", english: "Azerbaijani", tag: "az-AZ" },
  { code: "hy", label: "HY", name: "Հայերեն", english: "Armenian", tag: "hy-AM" },
  { code: "ka", label: "KA", name: "ქართული", english: "Georgian", tag: "ka-GE" },
] as const satisfies readonly LocaleInfo[];

export type Locale = (typeof LOCALES)[number]["code"];

const BY_CODE = new Map<string, LocaleInfo>(LOCALES.map((x) => [x.code, x]));

export function localeInfo(code: Locale): LocaleInfo {
  return BY_CODE.get(code) ?? LOCALES[0];
}

/** BCP 47 tag per locale, for Intl formatting. */
export const LOCALE_TAG = Object.fromEntries(LOCALES.map((x) => [x.code, x.tag])) as Record<Locale, string>;

export function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && BY_CODE.has(v);
}

export function isBase(locale: Locale): locale is BaseLocale {
  return locale === "en" || locale === "id" || locale === "zh" || locale === "ja";
}

/** An extra language's dictionary: English source → translation. */
export type Dict = Record<string, string>;

/** Look up a dictionary key for the active locale, falling back to English. */
export function translate(source: string, locale: Locale, dict?: Dict | null): string {
  if (locale === "en") return source;
  if (isBase(locale)) return DICT[locale]?.[source] || source;
  return dict?.[source] || source;
}

/**
 * Inline localised copy. Content written for the rebuilt marketing site
 * carries the four base languages beside each other instead of being keyed
 * by its English in the dictionary: keeping the translation next to the
 * source is what stops the two drifting apart when the English changes.
 * The extra languages are keyed by that English (`v.en`).
 */
export type L = { en: string; id: string; zh: string; ja: string };

/** Build an L in argument order: English, Indonesian, Chinese, Japanese. */
export function l(en: string, id: string, zh: string, ja: string): L {
  return { en, id, zh, ja };
}

export function pick(v: L | string, locale: Locale, dict?: Dict | null): string {
  if (typeof v === "string") return translate(v, locale, dict);
  if (isBase(locale)) return v[locale] || v.en;
  return dict?.[v.en] || v.en;
}
