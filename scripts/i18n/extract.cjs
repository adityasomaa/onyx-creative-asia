/**
 * Step 1 of the translation pipeline (see README.md in this folder).
 *
 * Collects every translatable English string on the marketing site, all
 * L objects ({en,id,zh,ja}) reachable from the copy modules plus the
 * English keys of the case-study dictionary, and writes:
 *   work/catalog.json             everything, with id/zh/ja beside it
 *   work/catalog.part{1..4}.json  four parts of similar length, for the
 *                                 translators: [{ key, ctx, ja? }]
 *
 *   node scripts/i18n/extract.cjs        (from the repo root)
 */
const path = require("node:path");
const fs = require("node:fs");
const REPO = path.resolve(__dirname, "..", "..");
const WORK = path.join(__dirname, "work");
const jiti = require(path.join(REPO, "node_modules", "jiti"))(__filename, {
  alias: { "@": path.join(REPO, "src") },
  interopDefault: true,
  esmResolve: true,
});

const out = new Map();
const isL = (v) => v && typeof v === "object" && !Array.isArray(v) && typeof v.en === "string" && "id" in v && "zh" in v && "ja" in v && Object.keys(v).length === 4;
const add = (rec, src) => rec.en && rec.en.trim() && !out.has(rec.en) && out.set(rec.en, { en: rec.en, id: rec.id || "", zh: rec.zh || "", ja: rec.ja || "", src });
function walk(v, src, seen = new Set()) {
  if (!v || typeof v !== "object" || seen.has(v)) return;
  seen.add(v);
  if (isL(v)) return add(v, src);
  for (const k of Object.keys(v)) walk(v[k], src, seen);
}

for (const [name, file] of Object.entries({ copy: "src/lib/copy.ts", services: "src/lib/services.ts", notes: "src/lib/notes.ts" })) {
  for (const [k, v] of Object.entries(jiti(path.join(REPO, file)))) walk(v, `${name}.${k}`);
}
const { DICT } = jiti(path.join(REPO, "src/lib/i18n-dict.ts"));
for (const en of Object.keys(DICT.id || {})) add({ en, id: DICT.id[en], zh: DICT.zh?.[en] || "", ja: DICT.ja?.[en] || "" }, "dict");
const { PROJECTS, TESTIMONIALS } = jiti(path.join(REPO, "src/lib/data.ts"));
const s = (x) => typeof x === "string" && add({ en: x }, "data");
for (const p of PROJECTS) {
  [p.title, p.blurb, p.category, p.description, p.longDescription, p.location, p.urlLabel].forEach(s);
  (p.scope || []).forEach(s);
  (p.tags || []).forEach(s);
  if (p.study) {
    s(p.study.overview);
    ["needed", "did", "changed"].forEach((k) => (p.study[k] || []).forEach(s));
  }
}
for (const t of TESTIMONIALS) [t.quote, t.role].forEach(s);

const all = [...out.values()];
fs.mkdirSync(WORK, { recursive: true });
fs.writeFileSync(path.join(WORK, "catalog.json"), JSON.stringify(all, null, 1));

const words = (x) => x.split(/\s+/).length;
const total = all.reduce((n, r) => n + words(r.en), 0);
const parts = [[], [], [], []];
let acc = 0;
for (const r of all) {
  parts[Math.min(3, Math.floor((acc / total) * 4))].push({ key: r.en, ctx: r.src, ...(r.ja ? { ja: r.ja } : {}) });
  acc += words(r.en);
}
parts.forEach((p, i) => fs.writeFileSync(path.join(WORK, `catalog.part${i + 1}.json`), JSON.stringify(p, null, 1)));
console.log(`${all.length} strings, ${total} words → work/catalog.part1..4.json`);
