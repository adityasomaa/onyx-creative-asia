/**
 * Translate only what changed (see README.md in this folder).
 *
 *   node scripts/i18n/extract.cjs              refresh work/catalog.json first
 *   node scripts/i18n/delta.cjs list           work/delta.json: every catalog
 *                                              string some dictionary lacks
 *   ...translate work/delta.json into work/out-delta/<code>.json
 *      (one JSON object per language: { "<key>": "<translation>" })
 *   node scripts/i18n/delta.cjs check [codes]  checks the files, writes nothing
 *   node scripts/i18n/delta.cjs merge [codes]  checks each file, then rewrites
 *                                              src/lib/locales/<code>.json in
 *                                              catalog order: kept translations
 *                                              + the new ones, strings the site
 *                                              no longer uses dropped
 */
const fs = require("node:fs");
const path = require("node:path");
const WORK = path.join(__dirname, "work");
const LOCALES = path.resolve(__dirname, "..", "..", "src", "lib", "locales");
const catalog = JSON.parse(fs.readFileSync(path.join(WORK, "catalog.json"), "utf8"));
const codes = fs.readdirSync(LOCALES).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
const read = (code) => JSON.parse(fs.readFileSync(path.join(LOCALES, `${code}.json`), "utf8"));
const [cmd, ...only] = process.argv.slice(2);

if (cmd === "list") {
  const missing = new Map();
  for (const code of codes) {
    const dict = read(code);
    for (const r of catalog) if (!dict[r.en] && !missing.has(r.en)) missing.set(r.en, { key: r.en, ctx: r.src, ...(r.ja ? { ja: r.ja } : {}) });
  }
  const list = [...missing.values()];
  fs.writeFileSync(path.join(WORK, "delta.json"), JSON.stringify(list, null, 1));
  console.log(`${list.length} strings to translate (${list.reduce((n, r) => n + r.key.split(/\s+/).length, 0)} words) → work/delta.json`);
} else if (cmd === "merge" || cmd === "check") {
  const delta = JSON.parse(fs.readFileSync(path.join(WORK, "delta.json"), "utf8"));
  for (const code of only.length ? only : codes) {
    const file = path.join(WORK, "out-delta", `${code}.json`);
    if (!fs.existsSync(file)) {
      console.log(`${code}: no work/out-delta/${code}.json, skipped`);
      continue;
    }
    let tx;
    try {
      tx = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (e) {
      console.log(`${code}: invalid JSON, skipped (${e.message})`);
      continue;
    }
    const stars = (s) => s.split("*").length - 1;
    const bad = delta.filter((r) => typeof tx[r.key] !== "string" || !tx[r.key].trim() || stars(tx[r.key]) % 2 || (stars(r.key) && !stars(tx[r.key])));
    if (bad.length) {
      console.log(`${code}: ${bad.length} missing or malformed, skipped (first: ${JSON.stringify(bad[0].key.slice(0, 60))})`);
      continue;
    }
    if (cmd === "check") {
      console.log(`${code}: OK`);
      continue;
    }
    const old = read(code);
    const next = {};
    for (const r of catalog) {
      const v = tx[r.en] ?? old[r.en];
      if (v) next[r.en] = v;
    }
    fs.writeFileSync(path.join(LOCALES, `${code}.json`), JSON.stringify(next, null, 1) + "\n");
    console.log(`${code}: ${Object.keys(next).length}/${catalog.length} strings`);
  }
} else {
  console.log("usage: delta.cjs list | merge [codes...]");
}
