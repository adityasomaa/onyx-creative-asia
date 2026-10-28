# Translations: the 40 extra languages

English, Bahasa Indonesia, Chinese and Japanese are written inline in the copy (`l(en, id, zh, ja)`). Every other language is a dictionary keyed by the English source, `src/lib/locales/<code>.json`, loaded only when a visitor picks it. A string a dictionary lacks shows in English, so new copy never breaks a page; it just waits for translation.

## When English copy changes

1. `node scripts/i18n/extract.cjs` writes `scripts/i18n/work/catalog.part1..4.json` (work/ is gitignored).
2. Translate each part for each language into `scripts/i18n/work/out/<code>/part1..4.json`, following the brief below. (One translator or agent per few languages; the brief is written for that.)
3. `node scripts/i18n/validate.cjs <code>` until it prints OK.
4. `node scripts/i18n/merge.cjs` writes every validated language into `src/lib/locales/`.

For a small change, translate only the difference instead: after step 1, `node scripts/i18n/delta.cjs list` writes `work/delta.json` (the strings some dictionary lacks); translate it into `work/out-delta/<code>.json` (one JSON object per language), check with `delta.cjs check <code>`, and `delta.cjs merge` adds the new strings to every dictionary and drops the ones the site no longer uses.

The language list (codes, native names, right-to-left and complex-script flags) is `LOCALES` in `src/lib/l10n.ts`; loaders are in `src/lib/locales/index.ts`.

---

# Translating onyxcreative.asia

You are translating the marketing website of **Onyx Creative Asia**, a small digital business development studio in Bali, Indonesia (websites and software, branding, ads, social media, growth analytics). Readers are business owners across Asia.

## Input

`work/catalog.part1.json` … `work/catalog.part4.json`. Each is an array of entries:

- `key` — the English source string. Translate this.
- `ctx` — where it is used (e.g. `copy.NAV` = navigation label, `copy.ENQUIRE` = enquiry form UI, `copy.PROCESS` = process timeline, `services.SERVICES` = service descriptions, `notes.NOTES` = blog article text, `dict` = case-study text). Use it to choose the right register and length.
- `ja` — the existing Japanese translation, when there is one. Only a hint for meaning; never copy it.

## Output

For language `<code>`, write four files: `work/out/<code>/part1.json` … `work/out/<code>/part4.json`.

Each file is ONE JSON object: `{ "<key exactly as given>": "<translation>", ... }`. Every key from the matching catalog part must be present, with the key copied **byte for byte** (same punctuation, spaces, dashes, quotes, arrows). No extra keys. Valid JSON: escape `"` as `\"` and newlines as `\n`.

Then run `node scripts/i18n/validate.cjs <code>` from the repo root and fix every ERROR until it prints `OK`.

## Voice

Plain, specific, a little dry. Confident, never salesy. Write it the way a native speaker who runs a small studio would say it to a client, not word-for-word. Formal-polite "you" where the language has one for business (e.g. Anda, 您 is not needed — 你 is fine for zh-TW too, but Korean uses 합니다/해요 polite, Japanese です/ます). Keep short UI labels (buttons, tabs, menu items, form placeholders) short.

## Rules

1. `*word*` marks words that are drawn as highlighted blocks. Keep the markers around the equivalent word(s) in your language. Markers must stay balanced (an even number of `*`). If the English has markers, your translation must have markers too.
2. Do not translate: Onyx, Onyx Creative, Onyx Creative Asia, client and business names (Tammia, Astungkare Spa, My Day Gili, Jalak Cargo Logistics, Radcruiters, Bhagawan Property, Great Bali Villas, The Hair Extensions Bali…), product/platform names (WhatsApp, Instagram, TikTok, LinkedIn, Meta, Google, Google Analytics, Next.js, Supabase, Shopify…), email addresses, URLs, currency codes (IDR, SGD), time zones (WITA, UTC+8), and numbers.
3. Keep symbols and structure: `→`, `·`, `—`, `/`, `+`, `%`, line breaks (`\n`), list punctuation. Numbers and dates keep their digits (you may localise the word for "week", "day", "month").
4. Place names: use the standard name in your language for Bali, Indonesia, Asia, etc.
5. Right-to-left languages: just write the text naturally; do not add direction marks.
6. Do not leave English in the translation except for the names in rule 2. Do not add explanations, notes or alternatives.

Hard limits: only create files under `work/out/<your codes>/`. Do not edit anything else. Done = all four parts for each of your languages exist and `validate.cjs` prints OK for each.
