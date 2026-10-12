"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useL } from "@/lib/i18n";
import { CONTACT, FOOTER, UI } from "@/lib/copy";
import { SERVICES } from "@/lib/services";
import { getWaDisplay, getWaLink } from "@/lib/wa-number";
import { cn } from "@/lib/cn";
import Headline from "@/components/site/Headline";
import CutButton from "@/components/site/CutButton";
import { sendLead } from "@/components/site/leads";

const input =
  "w-full bg-white/[0.07] px-3 py-3 font-tek text-[15px] uppercase text-white placeholder:text-white/35 outline-none transition-shadow focus:shadow-[inset_0_0_0_1.5px_rgb(var(--accent))]";

function Row({ n, q, hint, children }: { n: string; q: string; hint: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 border-t border-white/10 px-4 py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:px-8">
      <div>
        <p className="flex items-baseline gap-2 font-tek text-[20px] font-medium uppercase">
          <span className="text-white/45">{n}</span>
          {q}
        </p>
        <p className="mt-2 max-w-[320px] text-[11px] font-semibold uppercase leading-[1.3] text-white/45">{hint}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Select({ name, options, required }: { name: string; options: { value: string; label: string }[]; required?: boolean }) {
  return (
    <div className="relative max-w-[340px]">
      <select name={name} required={required} defaultValue={options[0]?.value} className={cn(input, "appearance-none pr-10")}>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-coal">
            {o.label}
          </option>
        ))}
      </select>
      <svg viewBox="0 0 12 7" className="pointer-events-none absolute right-4 top-1/2 h-2 w-3 -translate-y-1/2 text-white/60" aria-hidden>
        <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </div>
  );
}

export default function ContactPage() {
  const tl = useL();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Held before the await: React clears e.currentTarget once the handler yields.
    const form = e.currentTarget;
    const fd = new FormData(form);
    const service = String(fd.get("service") || "");
    setState("sending");
    const ok = await sendLead({
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      message: String(fd.get("message") || "").trim(),
      budget: String(fd.get("budget") || "") || null,
      services: service ? [service] : [],
      start: String(fd.get("start") || "") || null,
    });
    setState(ok ? "sent" : "error");
    if (ok) form.reset();
  }

  return (
    <>
      <section className="px-4 pb-16 pt-[100px] md:px-8 md:pt-[120px]">
        <div className="flex flex-col justify-between gap-2 text-[11px] font-semibold uppercase text-fg2 md:flex-row">
          <span>
            <span className="text-faint">[</span> {tl(CONTACT.question)} <span className="text-faint">]</span>
          </span>
          <span>{tl(CONTACT.place)}</span>
        </div>
        <Headline as="h1" v={CONTACT.headline} className="mt-10 max-w-[18ch] text-[38px] leading-[1.08] tracking-[-0.03em] text-fg md:text-[64px]" />
        <div className="mt-12 grid grid-cols-1 gap-10 border-b border-rule pb-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)]">
          <p className="max-w-[460px] text-[12px] font-semibold uppercase leading-[1.3] text-fg2">{tl(CONTACT.lede)}</p>
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              [CONTACT.replyTime, CONTACT.replyTimeValue],
              [CONTACT.hours, CONTACT.hoursValue],
              [CONTACT.readBy, CONTACT.readByValue],
            ].map(([k, v]) => (
              <div key={k.en}>
                <dt className="text-[10px] font-semibold uppercase text-mute">{tl(k)}</dt>
                <dd className="mt-2 text-[14px] font-medium tracking-[-0.03em] text-fg">{tl(v)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <form onSubmit={onSubmit} className="bg-coal text-white">
        <p className="px-4 py-5 text-[11px] font-semibold uppercase text-white/60 md:px-8">
          [ {tl(CONTACT.formTag)} ]
        </p>
        <Row n="01" q={tl(CONTACT.q1)} hint={tl(CONTACT.q1Hint)}>
          <Select name="service" options={SERVICES.map((s) => ({ value: s.title.en, label: tl(s.title) }))} />
        </Row>
        <Row n="02" q={tl(CONTACT.q2)} hint={tl(CONTACT.q2Hint)}>
          <Select name="budget" options={FOOTER.budgets.map((b) => ({ value: b.en, label: tl(b) }))} />
        </Row>
        <Row n="03" q={tl(CONTACT.q3)} hint={tl(CONTACT.q3Hint)}>
          <Select name="start" options={CONTACT.starts.map((s) => ({ value: s.en, label: tl(s) }))} />
        </Row>
        <Row n="04" q={tl(CONTACT.q4)} hint={tl(CONTACT.q4Hint)}>
          <input name="name" required autoComplete="name" placeholder={tl(FOOTER.name)} aria-label={tl(CONTACT.q4)} className={input} />
        </Row>
        <Row n="05" q={tl(CONTACT.q5)} hint={tl(CONTACT.q5Hint)}>
          <input name="email" type="email" required autoComplete="email" placeholder={tl(FOOTER.email)} aria-label={tl(CONTACT.q5)} className={input} />
        </Row>
        <Row n="06" q={tl(CONTACT.q6)} hint={tl(CONTACT.q6Hint)}>
          <textarea name="message" required rows={5} placeholder={tl(CONTACT.q6Placeholder)} aria-label={tl(CONTACT.q6)} className={cn(input, "resize-y normal-case")} />
        </Row>
        <div className="flex flex-col gap-6 border-t border-white/10 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="w-full max-w-[340px]">
            <CutButton type="submit" label={state === "sending" ? FOOTER.sending : FOOTER.submit} size="md" disabled={state === "sending"} />
          </div>
          <p className="max-w-[300px] text-[11px] font-semibold uppercase leading-[1.3] text-white/60 md:text-right">{tl(CONTACT.submitNote)}</p>
        </div>
        <p aria-live="polite" className={cn("px-4 pb-6 text-[12px] font-semibold uppercase md:px-8", state === "error" ? "text-red-400" : "text-accent")}>
          {state === "sent" ? tl(FOOTER.sent) : state === "error" ? tl(FOOTER.failed) : ""}
        </p>
        <p className="px-4 pb-8 text-[11px] font-semibold uppercase text-white/45 md:px-8">
          {tl(FOOTER.consent)}{" "}
          <Link href="/terms-and-conditions" className="text-white">
            {tl(FOOTER.terms)}
          </Link>{" "}
          {tl(FOOTER.and)}{" "}
          <Link href="/privacy-policy" className="text-white">
            {tl(FOOTER.privacy)}
          </Link>
          . {tl(FOOTER.noList)}
        </p>
      </form>

      <section className="grid grid-cols-1 gap-8 px-4 py-14 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
        <div>
          <p className="text-[10px] font-semibold uppercase text-mute">{tl(CONTACT.byEmail)}</p>
          <a href="mailto:hello@onyxcreative.asia" className="mt-3 block border-l border-rule pl-3 font-tek text-[18px] font-medium uppercase text-fg hover:text-fg2">
            hello@onyxcreative.asia
          </a>
          <p className="mt-2 pl-3 text-[10px] font-semibold uppercase text-mute">{tl(CONTACT.emailNote)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase text-mute">{tl(CONTACT.byVisit)}</p>
          <p className="mt-3 border-l border-rule pl-3 font-tek text-[18px] font-medium uppercase text-fg">{tl(CONTACT.visitValue)}</p>
          <p className="mt-2 pl-3 text-[10px] font-semibold uppercase text-mute">{tl(CONTACT.visitNote)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase text-mute">{tl(CONTACT.byChat)}</p>
          <a href={getWaLink()} target="_blank" rel="noopener noreferrer" className="mt-3 block border-l border-rule pl-3 font-tek text-[18px] font-medium uppercase text-fg hover:text-fg2">
            {getWaDisplay()}
          </a>
          <p className="mt-2 pl-3 text-[10px] font-semibold uppercase text-mute">{tl(CONTACT.chatNote)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase text-mute">{tl(CONTACT.byWatch)}</p>
          <ul className="mt-3 flex flex-col gap-1.5 border-l border-rule pl-3 text-[11px] font-semibold uppercase text-fg">
            <li>
              <a href="https://www.instagram.com/onyxcreative.asia" target="_blank" rel="noopener noreferrer" className="hover:text-fg2">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://www.tiktok.com/@onyxcreative.asia" target="_blank" rel="noopener noreferrer" className="hover:text-fg2">
                TikTok
              </a>
            </li>
            <li>
              <Link href="/projects" className="hover:text-fg2">
                {tl(UI.allProjects)}
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
