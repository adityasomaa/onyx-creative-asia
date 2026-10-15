"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useL } from "@/lib/i18n";
import { PROCESS } from "@/lib/copy";
import { SERVICES } from "@/lib/services";
import { cn } from "@/lib/cn";
import SectionHeader from "@/components/site/SectionHeader";

const EASE = [0.65, 0, 0.35, 1] as const;

type Track = (typeof PROCESS.tracks)[number];

/**
 * One service's run: five steps down the left and, to the right, a bar per
 * step on that run's timeline. Used under the tabs here and on each
 * service page.
 */
export function Timeline({ track, role, className }: { track: Track; role?: string; className?: string }) {
  const tl = useL();
  return (
    <div role={role} className={cn("grid grid-cols-1 px-4 py-10 md:grid-cols-[300px_minmax(0,1fr)] md:px-8 md:py-12", className)}>
      <ol className="flex flex-col">
        {track.steps.map((s, i) => (
          <motion.li
            key={`${track.service}-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-[120px] flex-col justify-center gap-3 py-4"
          >
            <span className="flex items-baseline gap-2 font-tek text-[20px] font-medium uppercase md:text-[22px]">
              <span className={i === track.focus ? "text-accent" : "text-white/60"}>{String(i + 1).padStart(2, "0")}</span>
              {tl(s.title)}
            </span>
            <span className="h-[2px] w-6 bg-accent" />
            <span className="max-w-[280px] text-[14px] tracking-[-0.03em] text-white/75">{tl(s.body)}</span>
            {/* phone: the bar sits under each step, with its milestone */}
            <span className="relative mt-1 h-2 bg-white/5 md:hidden">
              <motion.span
                className={cn("absolute inset-y-0", i === track.focus ? "bg-accent" : "bg-[#4d4d4d]")}
                initial={false}
                animate={{ left: `${s.bar[0] * 100}%`, width: `${(s.bar[1] - s.bar[0]) * 100}%` }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </span>
            <span className={cn("text-[11px] font-medium uppercase md:hidden", i === track.focus ? "text-accent" : "text-white/55")}>{tl(s.mark)}</span>
          </motion.li>
        ))}
        <li className="pt-6 text-[13px] font-medium uppercase tracking-[-0.02em] text-white/75">
          {tl(track.label)}
          <span className="mt-2 block text-white/45 md:hidden">[ {tl(track.note)} ]</span>
        </li>
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
          {track.steps.map((s, i) => (
            <div key={i} className="relative min-h-[120px] flex-1">
              <motion.div
                // A bar near the end hangs its label off its right edge, so it never runs off the grid.
                className={cn("absolute top-[30%] flex flex-col gap-3", s.bar[0] >= 0.8 && "items-end text-right")}
                initial={false}
                animate={{ left: `${s.bar[0] * 100}%`, width: `${(s.bar[1] - s.bar[0]) * 100}%` }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <span className={cn("h-8 w-full transition-colors duration-500", i === track.focus ? "bg-accent" : "bg-[#4d4d4d]")} />
                <span className={cn("whitespace-nowrap text-[12px] font-medium uppercase", i === track.focus ? "text-accent" : "text-white/80")}>
                  {tl(s.mark)}
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
  );
}

/**
 * Process: the section header, then a dark timeline. One tab per service,
 * each with its own run: five steps down the left and, to the right, a bar
 * per step placed on that run's timeline, the step where most of the work
 * happens in the accent. On phones the bar sits under each step.
 */
export default function Process() {
  const tl = useL();
  const [tab, setTab] = useState(0);
  const track = PROCESS.tracks[tab];

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
        <div className="flex items-center gap-4 border-b border-white/10 px-4 py-2 md:px-8">
          <span className="hidden shrink-0 text-[11px] font-semibold uppercase text-white/45 lg:block">[ {tl(PROCESS.pick)} ]</span>
          {/* Five tabs scroll sideways on a phone rather than wrapping into a block. */}
          <div role="tablist" aria-label={tl(PROCESS.pick)} className="no-scrollbar -mx-4 flex flex-1 gap-2 overflow-x-auto px-4 md:mx-0 md:justify-end md:px-0">
            {PROCESS.tracks.map((t, i) => (
              <button
                key={t.service}
                type="button"
                role="tab"
                aria-selected={tab === i}
                onClick={() => setTab(i)}
                className={cn(
                  "flex h-9 shrink-0 items-center gap-2 whitespace-nowrap px-4 font-tek text-[13px] font-medium uppercase transition-colors md:text-[14px]",
                  tab === i ? "cut bg-accent text-accent-ink [--cut:6px]" : "border border-white/15 text-white/70 hover:text-white",
                )}
              >
                <span className={tab === i ? "opacity-60" : "text-white/40"}>{SERVICES.find((s) => s.id === t.service)?.number}</span>
                {tl(t.tab)}
              </button>
            ))}
          </div>
        </div>

        <Timeline track={track} role="tabpanel" />
      </div>
    </section>
  );
}
