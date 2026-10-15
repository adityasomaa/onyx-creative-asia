/**
 * Merge validated translations into the site.
 *   node scripts/i18n/merge.cjs [codes...]
 * For each code (default: every folder under out/) runs validate.cjs;
 * if it passes, writes <repo>/src/lib/locales/<code>.json from the four
 * parts, keys in catalog order. Prints a line per code.
 */
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const dir = path.join(__dirname, "work");
const repo = path.resolve(__dirname, "..", "..");
let codes = process.argv.slice(2);
if (!codes.length) codes = fs.readdirSync(path.join(dir, "out")).filter((d) => fs.statSync(path.join(dir, "out", d)).isDirectory());
const order = [1, 2, 3, 4].flatMap((i) => JSON.parse(fs.readFileSync(path.join(dir, `catalog.part${i}.json`), "utf8")).map((r) => r.key));
for (const code of codes) {
  try {
    execFileSync(process.execPath, [path.join(__dirname, "validate.cjs"), code], { stdio: "pipe" });
  } catch (e) {
    const out = String(e.stdout || "").trim().split("\n");
    console.log(`${code}: SKIPPED, ${out[out.length - 1]}`);
    continue;
  }
  const merged = {};
  for (let i = 1; i <= 4; i++) Object.assign(merged, JSON.parse(fs.readFileSync(path.join(dir, "out", code, `part${i}.json`), "utf8")));
  const ordered = {};
  for (const k of order) if (merged[k]) ordered[k] = merged[k];
  const file = path.join(repo, "src", "lib", "locales", `${code}.json`);
  fs.writeFileSync(file, JSON.stringify(ordered, null, 1) + "\n");
  console.log(`${code}: merged ${Object.keys(ordered).length} strings (${Math.round(fs.statSync(file).size / 1024)} KB)`);
}
