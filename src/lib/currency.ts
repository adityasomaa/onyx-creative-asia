/**
 * Currencies of Asia for the budget slider and the nav's currency menu.
 * Rates are "how much of each currency one rupiah buys"; the live set is
 * fetched daily on the server (lib/rates.ts) and this snapshot is the
 * fallback when that fetch fails. Names come from Intl.DisplayNames in
 * the visitor's language, so the list itself is just codes.
 */

export const CURRENCIES = [
  // Southeast Asia
  "IDR",
  "SGD",
  "MYR",
  "THB",
  "PHP",
  "VND",
  "BND",
  "KHR",
  "LAK",
  "MMK",
  // East Asia
  "CNY",
  "HKD",
  "MOP",
  "TWD",
  "JPY",
  "KRW",
  "MNT",
  // South Asia
  "INR",
  "PKR",
  "BDT",
  "LKR",
  "NPR",
  "BTN",
  "MVR",
  "AFN",
  // Central Asia
  "KZT",
  "UZS",
  "KGS",
  "TJS",
  "TMT",
  // West Asia
  "AED",
  "SAR",
  "QAR",
  "KWD",
  "BHD",
  "OMR",
  "ILS",
  "JOD",
  "LBP",
  "SYP",
  "IQD",
  "IRR",
  "YER",
  "TRY",
  "AMD",
  "AZN",
  "GEL",
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number];

export const DEFAULT_CURRENCY: CurrencyCode = "IDR";

export function isCurrency(v: unknown): v is CurrencyCode {
  return typeof v === "string" && (CURRENCIES as readonly string[]).includes(v);
}

export type Rates = { date: string; perIdr: Record<CurrencyCode, number> };

/** Snapshot of 2026-10-13 (fawazahmed0/currency-api). */
export const FALLBACK_RATES: Rates = {
  date: "2026-10-13",
  perIdr: {
    IDR: 1.0, SGD: 7.14404e-05, MYR: 0.000227985, THB: 0.00187275, PHP: 0.00350487, VND: 1.44551, BND: 7.14404e-05, KHR: 0.226922, LAK: 1.24608, MMK: 0.117158,
    CNY: 0.000373522, HKD: 0.000437785, MOP: 0.000450918, TWD: 0.00179247, JPY: 0.00883094, KRW: 0.0750443, MNT: 0.20068,
    INR: 0.0053126, PKR: 0.0154713, BDT: 0.00688842, LKR: 0.0184615, NPR: 0.00850415, BTN: 0.0053126, MVR: 0.000862436, AFN: 0.00362646,
    KZT: 0.0250917, UZS: 0.663768, KGS: 0.00487989, TJS: 0.000515143, TMT: 0.00019525,
    AED: 0.00020487, SAR: 0.000209193, QAR: 0.000203057, KWD: 1.73788e-05, BHD: 2.09751e-05, OMR: 2.14788e-05, ILS: 0.000171905, JOD: 3.95515e-05, LBP: 5.02769, SYP: 0.725247, IQD: 0.0842764, IRR: 99.2582, YER: 0.0131703, TRY: 0.00275404, AMD: 0.0202026, AZN: 9.48347e-05, GEL: 0.000144595,
  },
};

/** Currency name in the given locale, e.g. "Singapore Dollar" / "Dolar Singapura". */
export function currencyName(code: CurrencyCode, locale: string): string {
  try {
    return new Intl.DisplayNames([locale], { type: "currency" }).of(code) ?? code;
  } catch {
    return code;
  }
}

/** An IDR amount shown in `code`, rounded sensibly for the size of the number. */
export function formatMoney(idr: number, code: CurrencyCode, rates: Rates, locale: string): string {
  const v = idr * (rates.perIdr[code] ?? 0);
  const step = v >= 1e6 ? 1e5 : v >= 1e4 ? 100 : v >= 100 ? 10 : 1;
  const rounded = Math.round(v / step) * step;
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency: code, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(rounded);
  } catch {
    return `${code} ${Math.round(rounded).toLocaleString()}`;
  }
}
