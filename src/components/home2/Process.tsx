"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useL } from "@/lib/i18n";
import { PROCESS } from "@/lib/copy";
import { cn } from "@/lib/cn";
import SectionHeader from "@/components/site/SectionHeader";

/**
 * Process: the section header, then a dark timeline. Five steps down the
 * left; to the right, a bar per step placed on the run's timeline, the
 * current step's bar in the accent. Tabs switch between three typical
 * runs (a landing page, a full site, a campaign).
 */
export default function Process() {
  const tl = useL();
  const [tab, setTab] = useState(0);
  const track = PROCESS.tracks[tab];
  const highlight = 2;

  return (
    <section id="process" className="relative z-10 scroll-mt-16 bg-white pt-24 md:pt-40">
      <SectionHeader
        section={PROCESS.section}
        question={PROCESS.question}
        headline={PROCESS.headline}
        subtitle={PROCESS.subtitle}
        meta={[
          { k: PROCESS.metaA, v: PROCESS.metaAValue },
          { k: PROCESS.metaB, v: PROCESS.metaBValue },
          { k: PROCESS.metaC, v: PROCESS.metaCValue },
        ]}
      />

      <div className="mt-24 bg-coal text-white md:mt-32">
        <div className="flex flex-wrap justify-end gap-2 border-b border-white/10 px-4 py-2 md:px-8">
          {PROCESS.tracks.map((t, i) => (
            <button
              key={t.tab.en}
              type="button"
              onClick={() => setTab(i)}
              aria-pressed={tab === i}
              className={cn(
                "h-9 px-4 font-tek text-[13px] font-medium uppercase transition-colors md:text-[14px]",
                tab === i ? "cut bg-accent text-accent-ink [--cut:6px]" : "border border-white/15 text-white/70 hover:text-white",
              )}
            >
              {tl(t.tab)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 px-4 py-10 md:grid-cols-[300px_1fr] md:px-8 md:py-12">
          <ol className="flex flex-col">
            {PROCESS.steps.map((s, i) => (
              <li key={s.title.en} className="flex min-h-[120px] flex-col justify-center gap-3 py-4 md:min-h-[120px]">
                <span className="flex items-baseline gap-2 font-tek text-[20px] font-medium uppercase md:text-[22px]">
                  <span className={i === highlight ? "text-accent" : "text-white/60"}>{String(i + 1).padStart(2, "0")}</span>
                  {tl(s.title)}
                </span>
                <span className="h-[2px] w-6 bg-accent" />
                <span className="max-w-[280px] text-[14px] tracking-[-0.03em] text-white/75">{tl(s.body)}</span>
                {/* phone: the bar sits under each step */}
                <span className="relative mt-1 h-2 bg-white/5 md:hidden">
                  <motion.span
                    className={cn("absolute inset-y-0", i === highlight ? "bg-accent" : "bg-[#4d4d4d]")}
                    animate={{ left: `${track.bars[i][0] * 100}%`, width: `${(track.bars[i][1] - track.bars[i][0]) * 100}%` }}
                    transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
                  />
                </span>
              </li>
            ))}
            <li className="pt-6 text-[13px] font-medium uppercase tracking-[-0.02em] text-white/75">{tl(track.label)}</li>
          </ol>

          <div className="relative hidden md:block">
            {/* grid lines */}
            <div className="absolute inset-0 grid grid-cols-5">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className="border-l border-white/10 last:border-r" />
              ))}
            </div>
            <p className="absolute left-1 top-0 text-[13px] font-medium uppercase">
              {tl(PROCESS.week)} 1{track.weeks > 1 ? ` — ${track.weeks}` : ""}
            </p>
            <div className="relative flex h-full flex-col pt-8">
              {track.bars.map(([a, b], i) => (
                <div key={i} className="relative min-h-[120px] flex-1">
                  <motion.div
                    className="absolute top-[30%] flex flex-col gap-3"
                    animate={{ left: `${a * 100}%`, width: `${(b - a) * 100}%` }}
                    transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
                  >
                    <span className={cn("h-8 w-full", i === highlight ? "bg-accent" : "bg-[#4d4d4d]")} />
                    <span className={cn("whitespace-nowrap text-[12px] font-medium uppercase", i === highlight ? "text-accent" : "text-white/80")}>
                      {tl(track.marks[i])}
                    </span>
                  </motion.div>
                </div>
              ))}
              <div className="flex justify-between pt-6 text-[13px] font-medium uppercase text-white/75">
                <span>[ {tl(PROCESS.noMeetings)} ]</span>
                <span>[ {tl(track.note)} ]</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
