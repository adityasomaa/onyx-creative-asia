"use client";

import Link from "next/link";
import { useL } from "@/lib/i18n";
import { PRICING } from "@/lib/copy";
import { cn } from "@/lib/cn";
import SectionHeader from "@/components/site/SectionHeader";
import CutButton from "@/components/site/CutButton";
import Reveal from "@/components/site/Reveal";

function Tick({ ok, dark }: { ok: boolean; dark?: boolean }) {
  if (!ok) return <span className="w-4" />;
  return (
    <svg viewBox="0 0 16 12" className={cn("h-3 w-4", dark ? "text-accent" : "text-fg2")} aria-hidden>
      <path d="M1 6.5l4.5 4L15 1" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export default function Pricing() {
  const tl = useL();
  const [a, b] = PRICING.plans;
  return (
    <section id="pricing" className="relative z-10 scroll-mt-16 bg-white pt-24 md:pt-40">
      <SectionHeader
        section={PRICING.section}
        question={PRICING.question}
        headline={PRICING.headline}
        subtitle={PRICING.subtitle}
        meta={[
          { k: PRICING.metaA, v: PRICING.metaAValue },
          { k: PRICING.metaB, v: PRICING.metaBValue },
        ]}
      />

      <div className="mt-16 px-4 md:mt-24 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[344px_1fr_1fr]">
          {/* header row */}
          <div className="relative hidden overflow-hidden lg:block">
            <div className="hatch absolute inset-0 opacity-25" />
          </div>
          {[a, b].map((p) => (
            <div key={p.name.en} className={cn("flex flex-col gap-4 px-6 pb-8 pt-8 md:px-8", p.dark ? "bg-coal text-white" : "bg-snow text-fg")}>
              <div className="flex items-start justify-between">
                <span className={cn("font-tek text-[24px] font-medium uppercase", p.dark ? "text-accent" : "text-fg2")}>{tl(p.name)}</span>
              </div>
              <div className="flex items-end gap-2">
                {tl(p.prefix) && <span className="pb-3 text-[12px] font-semibold uppercase opacity-70">{tl(p.prefix)}</span>}
                <span className={cn("font-tek text-[48px] font-medium uppercase leading-none md:text-[64px]", p.dark && "text-accent")}>{tl(p.price)}</span>
                <span className="pb-2 text-[12px] font-semibold uppercase opacity-70">{tl(p.per)}</span>
              </div>
              <p className={cn("max-w-[300px] text-[14px] tracking-[-0.03em]", p.dark ? "text-white/70" : "text-mute")}>{tl(p.blurb)}</p>
            </div>
          ))}

          {/* rows */}
          {PRICING.rows.map((r) => (
            <div key={r.label.en} className="contents">
              <div className="flex items-center border-t border-rule px-4 py-4 text-[16px] tracking-[-0.03em] text-fg2 md:text-[18px] lg:px-4">
                {tl(r.label)}
              </div>
              <div className="flex items-center justify-between border-t border-rule bg-snow px-6 py-4 text-[16px] tracking-[-0.03em] text-fg2 md:px-8 md:text-[18px]">
                <span>
                  <span className="mr-2 text-[11px] font-semibold uppercase text-mute lg:hidden">{tl(a.name)}</span>
                  {tl(r.a)}
                </span>
                <Tick ok={r.aOk ?? true} />
              </div>
              <div className="flex items-center justify-between border-t border-white/10 bg-coal px-6 py-4 text-[16px] tracking-[-0.03em] text-white md:px-8 md:text-[18px]">
                <span>
                  <span className="mr-2 text-[11px] font-semibold uppercase text-white/40 lg:hidden">{tl(b.name)}</span>
                  {tl(r.b)}
                </span>
                <Tick ok={r.bOk ?? true} dark />
              </div>
            </div>
          ))}

          {/* footer row */}
          <div className="flex flex-col justify-center gap-4 border-t border-rule px-4 py-6">
            <p className="max-w-[260px] text-[13px] tracking-[-0.03em] text-fg2">{tl(PRICING.footnote)}</p>
            <Link href="/#faq" className="text-[12px] font-semibold uppercase text-fg hover:text-fg2">
              {tl(PRICING.question2)}
            </Link>
          </div>
          <div className="border-t border-rule bg-snow p-4">
            <CutButton href="/contact" label={a.cta} />
          </div>
          <div className="border-t border-white/10 bg-coal p-4">
            <CutButton href="/contact" label={b.cta} />
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="px-4 pt-24 md:px-8 md:pt-32">
        <Reveal>
          <h3 className="text-center font-tek text-[40px] font-medium uppercase leading-none tracking-[-0.02em] text-fg md:text-[64px]">
            {tl(PRICING.howTitle)}
          </h3>
          <p className="mt-4 text-center text-[16px] tracking-[-0.03em] text-mute">{tl(PRICING.howSub)}</p>
        </Reveal>
        <ol className="mt-12 grid grid-cols-1 gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {PRICING.how.map((h, i) => (
            <li key={h.title.en} className="flex flex-col gap-4 bg-snow p-6">
              <span className="flex items-center gap-2 border-b-2 border-accent pb-2 font-tek text-[22px] font-medium uppercase text-fg">{tl(h.title)}</span>
              <p className="min-h-[3em] text-[13px] tracking-[-0.02em] text-fg2">{tl(h.body)}</p>
              <span className="flex items-center gap-3">
                <span className="h-2.5 flex-1 bg-paper">
                  <span className="block h-full bg-rule" style={{ width: `${(i + 1) * 25}%` }} />
                </span>
                <span className="font-tek text-[20px] font-medium text-faint">{String(i + 1).padStart(2, "0")}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
