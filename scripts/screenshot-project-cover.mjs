#!/usr/bin/env node
/**
 * Capture a portfolio cover screenshot from a live URL.
 *
 * Use this when adding (or refreshing) a project entry in src/lib/data.ts.
 * Outputs go to public/projects/<slug>.png — convert to .webp afterward
 * with ffmpeg and delete the .png.
 *
 * Install (one-time, not added to package.json so repo stays lean):
 *   npm install --no-save puppeteer@22
 *
 * Usage:
 *   node scripts/screenshot-project-cover.mjs <url> <out.png> [scrollPx] [waitMs]
 *
 * Examples:
 *   # Hero of a fast-loading site (no scroll needed)
 *   node scripts/screenshot-project-cover.mjs \
 *     https://greatbaliproperties.com \
 *     public/projects/great-bali-properties.png
 *
 *   # Site with a loader/animated hero — scroll past it after the loader
 *   # exits (≈4–7s), so the actual content frames the cover
 *   node scripts/screenshot-project-cover.mjs \
 *     https://thehairextensionsbali.com \
 *     public/projects/the-hair-extensions-bali.png \
 *     920 7000
 *
 * Convert to WebP afterward:
 *   ffmpeg -y -i public/projects/<slug>.png -c:v libwebp -quality 80 \
 *          public/projects/<slug>.webp && rm public/projects/<slug>.png
 *
 * Then update the matching entry in src/lib/data.ts:
 *   cover: "/projects/<slug>.webp"
 */

import puppeteer from "puppeteer";

const url = process.argv[2];
const out = process.argv[3];
const scrollPx = Number(process.argv[4] ?? 0);
const waitMs = Number(process.argv[5] ?? 6000);

if (!url || !out) {
  console.error(
    "Usage: node scripts/screenshot-project-cover.mjs <url> <out.png> [scrollPx] [waitMs]"
  );
  process.exit(1);
}

const browser = await puppeteer.launch({
  headless: "new",
  args: [
    "--autoplay-policy=no-user-gesture-required",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--mute-audio",
  ],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
console.log(`→ ${url}`);
await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
await new Promise((r) => setTimeout(r, waitMs));
if (scrollPx > 0) {
  await page.evaluate((y) => window.scrollTo(0, y), scrollPx);
  await new Promise((r) => setTimeout(r, 1500));
}
await page.screenshot({ path: out, type: "png" });
console.log(`✔ ${out}`);
await browser.close();
