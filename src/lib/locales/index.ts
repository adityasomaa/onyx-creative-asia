import type { Dict, Locale } from "../l10n";

/**
 * One dictionary per extra language (English source → translation),
 * generated from the site's copy and translated per language. Each is its
 * own chunk: only the language a visitor picks is ever downloaded.
 * Regenerate with the catalog script when the English changes; a string a
 * dictionary lacks shows in English until then.
 */
const LOADERS: Partial<Record<Locale, () => Promise<{ default: Dict }>>> = {
  "zh-TW": () => import("./zh-TW.json"),
  ko: () => import("./ko.json"),
  mn: () => import("./mn.json"),
  ms: () => import("./ms.json"),
  th: () => import("./th.json"),
  vi: () => import("./vi.json"),
  fil: () => import("./fil.json"),
  km: () => import("./km.json"),
  lo: () => import("./lo.json"),
  my: () => import("./my.json"),
  tet: () => import("./tet.json"),
  hi: () => import("./hi.json"),
  bn: () => import("./bn.json"),
  ur: () => import("./ur.json"),
  pa: () => import("./pa.json"),
  mr: () => import("./mr.json"),
  gu: () => import("./gu.json"),
  ta: () => import("./ta.json"),
  te: () => import("./te.json"),
  kn: () => import("./kn.json"),
  ml: () => import("./ml.json"),
  si: () => import("./si.json"),
  ne: () => import("./ne.json"),
  dz: () => import("./dz.json"),
  dv: () => import("./dv.json"),
  kk: () => import("./kk.json"),
  uz: () => import("./uz.json"),
  ky: () => import("./ky.json"),
  tg: () => import("./tg.json"),
  tk: () => import("./tk.json"),
  ru: () => import("./ru.json"),
  ar: () => import("./ar.json"),
  fa: () => import("./fa.json"),
  ps: () => import("./ps.json"),
  ckb: () => import("./ckb.json"),
  tr: () => import("./tr.json"),
  he: () => import("./he.json"),
  az: () => import("./az.json"),
  hy: () => import("./hy.json"),
  ka: () => import("./ka.json"),
};

const cache = new Map<string, Dict>();

export async function loadDict(code: Locale): Promise<Dict | null> {
  const hit = cache.get(code);
  if (hit) return hit;
  const load = LOADERS[code];
  if (!load) return null;
  try {
    const dict = (await load()).default;
    cache.set(code, dict);
    return dict;
  } catch {
    return null;
  }
}
