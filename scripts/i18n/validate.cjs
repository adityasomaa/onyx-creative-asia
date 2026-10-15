/**
 * Validate one language's translation parts.
 *   node scripts/i18n/validate.cjs <code>
 * Checks work/out/<code>/part{1..4}.json against work/catalog.part{1..4}.json:
 * valid JSON object, exactly the same keys, non-empty string values,
 * balanced * markers (and present when the English has them), brand
 * tokens kept. Exit code 0 = all good.
 */
const fs = require("node:fs");
const path = require("node:path");
const code = process.argv[2];
const dir = require("node:path").join(__dirname, "work");
const BRANDS = ["Onyx", "WhatsApp", "Instagram", "TikTok", "LinkedIn", "Google", "Meta", "WITA", "hello@onyxcreative.asia"];
let errors = 0;
let warnings = 0;
for (let i = 1; i <= 4; i++) {
  const cat = JSON.parse(fs.readFileSync(path.join(dir, `catalog.part${i}.json`), "utf8"));
  const file = path.join(dir, "out", code, `part${i}.json`);
  if (!fs.existsSync(file)) {
    console.log(`ERROR part${i}: missing ${file}`);
    errors++;
    continue;
  }
  let tx;
  try {
    tx = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    console.log(`ERROR part${i}: invalid JSON: ${e.message}`);
    errors++;
    continue;
  }
  const keys = new Set(cat.map((r) => r.key));
  for (const r of cat) {
    const v = tx[r.key];
    if (typeof v !== "string" || !v.trim()) {
      console.log(`ERROR part${i}: missing or empty: ${JSON.stringify(r.key.slice(0, 80))}`);
      errors++;
      continue;
    }
    const stars = (s) => s.split("*").length - 1;
    if (stars(v) % 2) {
      console.log(`ERROR part${i}: odd number of * in: ${JSON.stringify(v.slice(0, 80))}`);
      errors++;
    }
    if (stars(r.key) && !stars(v)) {
      console.log(`ERROR part${i}: English has *markers*, translation has none: ${JSON.stringify(r.key.slice(0, 60))}`);
      errors++;
    }
    for (const b of BRANDS) {
      if (r.key.includes(b) && !v.includes(b)) {
        console.log(`WARN part${i}: "${b}" not kept in: ${JSON.stringify(v.slice(0, 70))}`);
        warnings++;
      }
    }
  }
  for (const k of Object.keys(tx)) {
    if (!keys.has(k)) {
      console.log(`ERROR part${i}: extra key not in catalog: ${JSON.stringify(k.slice(0, 80))}`);
      errors++;
    }
  }
}
console.log(errors ? `${code}: ${errors} errors, ${warnings} warnings` : `${code}: OK (${warnings} warnings)`);
process.exit(errors ? 1 : 0);
