"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useL } from "@/lib/i18n";
import { FAQ } from "@/lib/copy";
import { getWaLink } from "@/lib/wa-number";
import { cn } from "@/lib/cn";
import SectionHeader from "@/components/site/SectionHeader";
import { InfinityMark } from "@/components/site/Wordmark";

/** FAQ: header with a contact card at the side, then accordion rows. */
export default function Faq() {
  const tl = useL();
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative z-10 scroll-mt-16 bg-white pb-24 pt-24 md:pb-32 md:pt-40">
      <SectionHeader
        section={FAQ.section}
        question={FAQ.question}
        headline={FAQ.headline}
        subtitle={FAQ.subtitle}
        aside={
          <div className="flex flex-col gap-2">
            {/* The studio's avatar: the icon tile, square. */}
            <span className="grid h-[72px] w-[72px] place-items-center bg-night text-accent">
              <InfinityMark className="h-auto w-[76%]" />
            </span>
            <span className="mt-2 text-[13px] font-semibold uppercase text-fg2">{tl(FAQ.studio)}</span>
            <span className="text-[12px] font-semibold uppercase text-mute">{tl(FAQ.studioRole)}</span>
            <a href={getWaLink()} target="_blank" rel="noopener noreferrer" className="text-[12px] font-semibold uppercase text-fg hover:text-fg2">
              {tl(FAQ.getInTouch)}
            </a>
          </div>
        }
      />

      <ul className="mt-16 flex flex-col gap-1.5 px-4 md:mt-24 md:px-8">
        {FAQ.items.map((it, i) => {
          const isOpen = open === i;
          return (
            <li key={it.q.en} className={cn("cut transition-colors duration-500 [--cut:28px]", isOpen ? "bg-accent text-accent-ink" : "bg-snow text-fg hover:bg-paper")}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-6 px-5 py-7 text-left md:px-10 md:py-9"
              >
                <span className="font-tek text-[18px] font-medium uppercase leading-[1.15] md:text-[26px]">{tl(it.q)}</span>
                <svg viewBox="0 0 34 18" className={cn("h-4 w-8 shrink-0 transition-transform duration-500", isOpen && "rotate-180")} aria-hidden>
                  <path d="M1.5 2l15.5 14L32.5 2" fill="none" stroke="currentColor" strokeWidth="2.4" />
                </svg>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-[980px] px-5 pb-8 text-[16px] font-medium leading-[1.4] tracking-[-0.03em] md:px-10 md:pb-10 md:text-[20px]">{tl(it.a)}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
