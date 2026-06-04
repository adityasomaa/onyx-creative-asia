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
 * Minimal in-house i18n for Onyx Creative Asia.
 *
 * The public site is canonically English. This provider layers a
 * Bahasa Indonesia overlay on top of a small set of high-visibility
 * strings — nav, the pricing toggle copy, contact tab kickers, the
 * footer CTA — so an Indonesian visitor can switch the chrome to ID
 * without us needing a full content-translation pipeline.
 *
 * Strings not in the dictionary fall back to their key (which is the
 * English source), so the toggle never breaks the page — it just
 * changes the parts we've translated.
 *
 * Persistence: the chosen language is stored in localStorage AND the
 * <html lang> attribute is updated so the browser knows what it's
 * rendering. The attribute change also lets Chrome/Edge/Safari offer
 * their built-in translate prompt as a fallback for un-dictionaried
 * pages.
 */

export type Lang = "en" | "id";

const DEFAULT_LANG: Lang = "en";
const STORAGE_KEY = "onyx_lang";

// Dictionary. KEY is the English source string. EN value can be omitted
// (we fall back to the key). ID value is the translation.
//
// To translate a new string: add `t("Source string")` in the component,
// then add an entry here with the ID translation. If you don't add an
// entry, the toggle simply has no effect on that string.
const DICT: Record<string, { id: string }> = {
  // Nav labels
  Home: { id: "Beranda" },
  About: { id: "Tentang" },
  Services: { id: "Layanan" },
  Works: { id: "Karya" },
  Pricing: { id: "Harga" },
  Insights: { id: "Wawasan" },
  Contact: { id: "Kontak" },
  "Start a project": { id: "Mulai proyek" },

  // Service tier labels + cadence + savings strip
  Monthly: { id: "Bulanan" },
  Yearly: { id: "Tahunan" },
  Startup: { id: "Startup" },
  Growth: { id: "Growth" },
  Enterprise: { id: "Enterprise" },
  "save 30–46%": { id: "hemat 30–46%" },
  "/mo": { id: "/bln" },
  "/yr": { id: "/thn" },
  "(Billing cadence)": { id: "(Siklus penagihan)" },
  "(Bundle savings)": { id: "(Hemat dengan bundle)" },
  "(The fine print)": { id: "(Catatan kecil)" },
  "(Pricing)": { id: "(Harga)" },
  "(Capabilities)": { id: "(Kapabilitas)" },
  "(Next step)": { id: "(Langkah berikutnya)" },
  "(Get in touch)": { id: "(Hubungi kami)" },
  "off vs à la carte": { id: "hemat vs ambil terpisah" },

  // Pricing-page copy
  "Pick monthly for flexibility, or yearly to save 30–46% with an upfront commitment.":
    {
      id: "Pilih bulanan untuk fleksibilitas, atau tahunan untuk hemat 30–46% dengan komitmen di muka.",
    },
  "Every retainer is published. Pick the tier, pick the cadence, sign, start. No tier-pricing email tag, no “contact us for a quote” on the small ones.":
    {
      id: "Semua harga retainer kami transparan. Pilih tier, pilih siklus, tanda tangan, mulai. Tidak ada tukar-menukar email soal harga, tidak ada “contact us for a quote” untuk yang kecil.",
    },

  // Service-detail Pricing widget
  "Three tiers.": { id: "Tiga tier." },
  "Pick yours.": { id: "Pilih milikmu." },
  "Transparent monthly retainer. Switch to yearly upfront to save 30–46%. No lock-in on monthly, refund pro-rata on yearly.":
    {
      id: "Retainer bulanan transparan. Ganti ke tahunan di muka untuk hemat 30–46%. Tidak ada lock-in di bulanan, refund pro-rata di tahunan.",
    },
  "See all pricing": { id: "Lihat semua harga" },

  // Closing CTA on /pricing
  "Ready to": { id: "Siap untuk" },
  "build together?": { id: "membangun bersama?" },
  "Brief us in 30 minutes — we’ll send back a scoped tier recommendation within 24 hours. No commitment to start.":
    {
      id: "Beri kami brief 30 menit — kami balas dengan rekomendasi tier dalam 24 jam. Tidak perlu komitmen di awal.",
    },
  "Start a brief": { id: "Mulai brief" },

  // Common headers / chrome
  "(Capabilities) — what we do": { id: "(Kapabilitas) — yang kami kerjakan" },
};

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (s: string) => string;
}>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (s) => s,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Hydrate from localStorage on first client mount. Doing this in an
  // effect (rather than initializing useState from localStorage) keeps
  // the server-rendered HTML matching the client-rendered first paint,
  // avoiding the hydration-mismatch warning.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "id") {
        setLangState(stored);
        document.documentElement.lang = stored;
      }
    } catch {
      /* localStorage might be unavailable (private mode etc.) — ignore */
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (src: string) => {
      if (lang === "en") return src;
      return DICT[src]?.id ?? src;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** Convenience hook for just the translator function. */
export function useT() {
  return useContext(LangContext).t;
}
