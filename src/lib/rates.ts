import { CURRENCIES, FALLBACK_RATES, type CurrencyCode, type Rates } from "@/lib/currency";

/**
 * Today's rupiah rates for the Asian currencies, fetched on the server
 * and cached for a day, so visitors never call a third party. Two mirrors
 * of the same free dataset, then the bundled snapshot. Any currency the
 * response lacks keeps its snapshot value.
 */
const SOURCES = [
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/idr.min.json",
  "https://latest.currency-api.pages.dev/v1/currencies/idr.min.json",
];

export async function getRates(): Promise<Rates> {
  for (const url of SOURCES) {
    try {
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (!res.ok) continue;
      const json = (await res.json()) as { date?: string; idr?: Record<string, number> };
      if (!json.idr) continue;
      const perIdr = { ...FALLBACK_RATES.perIdr };
      for (const code of CURRENCIES) {
        const v = json.idr[code.toLowerCase()];
        if (typeof v === "number" && v > 0) perIdr[code as CurrencyCode] = v;
      }
      return { date: json.date ?? FALLBACK_RATES.date, perIdr };
    } catch {
      /* next source */
    }
  }
  return FALLBACK_RATES;
}
