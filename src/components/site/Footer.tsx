"use client";

import Link from "next/link";
import { useState } from "react";
import { useL } from "@/lib/i18n";
import { FOOTER, NAV } from "@/lib/copy";
import { getWaDisplay, getWaLink } from "@/lib/wa-number";
import { cn } from "@/lib/cn";
import { Bracket } from "./SectionHeader";
import Clock from "./Clock";
import CutButton from "./CutButton";
import Headline from "./Headline";
import { Chevrons } from "./Wordmark";
import { sendLead } from "./leads";
import { openCookieSettings } from "./Cookies";

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/onyxcreative.asia" },
  { label: "TikTok", href: "https://www.tiktok.com/@onyxcreative.asia" },
  { label: "WhatsApp", href: "WA" },
];

const field =
  "cut h-12 w-full bg-paper px-3 font-tek text-[15px] uppercase text-fg placeholder:text-mute outline-none transition-shadow focus:shadow-[inset_0_0_0_1.5px_rgb(var(--accent))] [--cut:8px]";

function FooterForm() {
  const tl = useL();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Held before the await: React clears e.currentTarget once the handler yields.
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    if (!name || !email || !message) return;
    setState("sending");
    const ok = await sendLead({
      name,
      email,
      message,
      phone: String(fd.get("phone") || "").trim() || undefined,
      budget: String(fd.get("budget") || "") || null,
    });
    setState(ok ? "sent" : "error");
    if (ok) form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2.5">
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <input name="name" required autoComplete="name" placeholder={tl(FOOTER.name)} aria-label={tl(FOOTER.name)} className={field} />
        <input name="email" type="email" required autoComplete="email" placeholder={tl(FOOTER.email)} aria-label={tl(FOOTER.email)} className={field} />
        <input name="phone" autoComplete="tel" placeholder={tl(FOOTER.phone)} aria-label={tl(FOOTER.phone)} className={field} />
        <div className="relative">
          <select name="budget" defaultValue="" aria-label={tl(FOOTER.budget)} className={cn(field, "appearance-none pr-10 invalid:text-mute")} required={false}>
            <option value="" disabled>
              {tl(FOOTER.budget)}
            </option>
            {FOOTER.budgets.map((b) => (
              <option key={b.en} value={b.en}>
                {tl(b)}
              </option>
            ))}
          </select>
          <svg viewBox="0 0 12 7" className="pointer-events-none absolute right-4 top-1/2 h-2 w-3 -translate-y-1/2 text-fg2" aria-hidden>
            <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </div>
      </div>
      <textarea
        name="message"
        required
        rows={5}
        placeholder={tl(FOOTER.message)}
        aria-label={tl(FOOTER.message)}
        className={cn(field, "h-36 resize-y py-3 [--cut:0px]")}
      />
      <CutButton type="submit" label={state === "sending" ? FOOTER.sending : FOOTER.submit} size="md" disabled={state === "sending"} />
      <p aria-live="polite" className={cn("min-h-[1.2em] text-[12px] font-semibold uppercase", state === "error" ? "text-red-600" : "text-fg2")}>
        {state === "sent" ? tl(FOOTER.sent) : state === "error" ? tl(FOOTER.failed) : ""}
      </p>
    </form>
  );
}

export default function Footer() {
  const tl = useL();
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-snow text-fg">
      <div className="h-2 bg-accent" />

      {/* Contact block */}
      <section id="get-in-touch" className="scroll-mt-20 px-4 pb-12 pt-20 md:px-8 md:pt-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-between gap-10">
            <div>
              <Bracket v={FOOTER.kicker} />
              <Headline
                v={FOOTER.headline}
                className="mt-6 max-w-[16ch] text-[34px] leading-[1.15] tracking-[-0.03em] md:text-[44px] lg:text-[48px]"
              />
            </div>
            <p className="max-w-[460px] text-[12px] font-semibold uppercase leading-[1.25] tracking-[-0.02em] text-fg2">
              {tl(FOOTER.hint)}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <FooterForm />
            <p className="text-[11px] font-semibold uppercase leading-[1.35] tracking-[-0.01em] text-mute">
              {tl(FOOTER.consent)}{" "}
              <Link href="/terms-and-conditions" className="text-fg hover:text-fg2">
                {tl(FOOTER.terms)}
              </Link>{" "}
              {tl(FOOTER.and)}{" "}
              <Link href="/privacy-policy" className="text-fg hover:text-fg2">
                {tl(FOOTER.privacy)}
              </Link>
              .<br />
              {tl(FOOTER.noList)}
            </p>
          </div>
        </div>
      </section>

      {/* Directory */}
      <div className="mx-4 border-t border-rule md:mx-8" />
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 px-4 py-10 md:grid-cols-4 md:px-8">
        <div>
          <Bracket v={FOOTER.index} className="text-[12px]" />
          <ul className="mt-4 flex flex-col gap-2 border-l border-rule pl-3">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-[12px] font-semibold uppercase tracking-[-0.01em] hover:text-fg2">
                  {tl(n.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Bracket v={FOOTER.studio} className="text-[12px]" />
          <p className="mt-4 font-tek text-[22px] font-medium uppercase leading-none md:text-[24px]">{tl(FOOTER.place)}</p>
          <a href="mailto:hello@onyxcreative.asia" className="mt-4 block text-[12px] font-semibold uppercase hover:text-fg2">
            hello@onyxcreative.asia
          </a>
          <a href={getWaLink()} target="_blank" rel="noopener noreferrer" className="mt-2 block text-[12px] font-semibold uppercase hover:text-fg2">
            {getWaDisplay()}
          </a>
          <p className="mt-6 text-[11px] font-semibold uppercase text-mute">{tl(FOOTER.hours)}</p>
        </div>
        <div>
          <Bracket v={FOOTER.socials} className="text-[12px]" />
          <ul className="mt-4 flex flex-col gap-2 border-l border-rule pl-3">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href === "WA" ? getWaLink() : s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] font-semibold uppercase tracking-[-0.01em] hover:text-fg2"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-start md:items-center">
          <Bracket v={FOOTER.rightNow} className="text-[12px]" />
          <Clock className="mt-4 h-24 w-24" />
          <p className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Bali, UTC+8
          </p>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="mx-4 border-t border-rule md:mx-8" />
      <div className="overflow-hidden px-4 py-4 md:px-8">
        <p aria-hidden className="flex items-center justify-between font-tek font-semibold uppercase leading-[0.82] tracking-[-0.03em] text-rule text-[clamp(44px,11.4vw,170px)]">
          <span>Onyx Creative</span>
          <Chevrons className="h-[0.72em]" />
        </p>
      </div>

      {/* Bottom bar */}
      <div className="mx-4 border-t border-rule md:mx-8" />
      {/* Three columns, the last left empty: that corner belongs to the
          floating contact badge, which would otherwise sit on these links. */}
      <div className="flex flex-col gap-4 py-5 pl-4 pr-20 text-[11px] font-semibold uppercase tracking-[-0.01em] text-fg2 md:grid md:grid-cols-3 md:items-center md:px-8">
        <p>
          © {year} Onyx Creative Asia — {tl(FOOTER.rights)}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-fg md:justify-center">
          <Link href="/terms-and-conditions" className="hover:text-fg2">
            {tl(FOOTER.termsFull)}
          </Link>
          <Link href="/privacy-policy" className="hover:text-fg2">
            {tl(FOOTER.privacy)}
          </Link>
          <button type="button" onClick={openCookieSettings} className="uppercase hover:text-fg2">
            {tl(FOOTER.cookies)}
          </button>
        </div>
      </div>
      <div className="h-2 bg-accent" />
    </footer>
  );
}
