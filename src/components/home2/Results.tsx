"use client";

import Image from "next/image";
import { useL } from "@/lib/i18n";
import { RESULTS, HERO } from "@/lib/copy";
import SectionHeader from "@/components/site/SectionHeader";
import DotArt from "@/components/site/DotArt";
import Odometer from "@/components/site/Odometer";
import CutButton from "@/components/site/CutButton";
import Reveal from "@/components/site/Reveal";

type Card = (typeof RESULTS.cards)[number];

function StatCard({ c, n }: { c: Card; n: number }) {
  const tl = useL();
  return (
    <Reveal className="flex flex-col bg-snow p-6">
      <span className="w-fit border-b border-faint pb-1.5 text-[13px] font-semibold uppercase tracking-[-0.02em] text-night">{tl(c.tag)}</span>
      <div className="cut relative mt-4 aspect-[290/262] bg-paper/70 [--cut:28px]">
        <DotArt kind={c.art} />
        <span className="absolute bottom-2 right-4 text-[11px] text-faint">{String(n).padStart(2, "0")}</span>
      </div>
      <div className="mt-6 flex items-end gap-2 border-b-[3px] border-accent pb-2 font-tek font-medium text-fg">
        <Odometer value={c.value} className="text-[72px] md:text-[78px]" />
        <span className="pb-2 text-[20px] uppercase text-mute">
          {c.suffix} {tl(c.unit)}
        </span>
      </div>
      <p className="mt-4 max-w-[240px] text-[13px] font-semibold uppercase leading-[1.2] tracking-[-0.02em] text-fg2">{tl(c.note)}</p>
    </Reveal>
  );
}

export default function Results() {
  const tl = useL();
  const [a, b, c, d] = RESULTS.cards;
  return (
    <section className="relative z-10 bg-white py-24 md:py-40">
      <SectionHeader
        section={RESULTS.section}
        question={RESULTS.question}
        headline={RESULTS.headline}
        subtitle={RESULTS.subtitle}
        meta={[
          { k: RESULTS.metaA, v: RESULTS.metaAValue },
          { k: RESULTS.metaB, v: RESULTS.metaBValue },
        ]}
      />

      <div className="mt-16 grid grid-cols-1 gap-2 px-4 md:mt-20 md:grid-cols-2 md:px-8 lg:grid-cols-[1fr_2fr_1fr]">
        <div className="flex flex-col gap-2">
          <StatCard c={a} n={1} />
          <StatCard c={c} n={3} />
        </div>
        <div className="order-first flex flex-col bg-snow p-6 md:col-span-2 lg:order-none lg:col-span-1">
          <span className="text-[20px] font-medium tracking-[-0.03em] text-night">{tl(RESULTS.next)}</span>
          <h3 className="mt-8 max-w-[11ch] font-tek text-[40px] font-medium uppercase leading-[1.05] tracking-[-0.02em] text-fg md:text-[64px]">
            {tl(RESULTS.nextHeadline)}
          </h3>
          <div className="relative mt-8 min-h-[280px] flex-1 overflow-hidden">
            <Image src="/images/results-blocks.jpg" alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            <div className="hatch absolute inset-0 opacity-30 mix-blend-darken" />
          </div>
          <div className="mt-6 flex flex-col gap-4">
            <CutButton href="/enquire?type=project" label={HERO.cta} />
            <p className="text-[12px] font-semibold uppercase tracking-[-0.02em] text-fg">{tl(HERO.reminder)}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <StatCard c={b} n={2} />
          <StatCard c={d} n={4} />
        </div>
      </div>
    </section>
  );
}
