"use client";

import { useL } from "@/lib/i18n";
import { SHOWREEL } from "@/lib/copy";
import CutButton from "@/components/site/CutButton";
import Wordmark from "@/components/site/Wordmark";
import SilkAurora from "@/components/site/art/SilkAurora";

/**
 * Full-height dark showreel. The silk aurora (coloured by the visitor's
 * accent) moves behind the question; "View works" goes to /projects.
 */
export default function Showreel() {
  const tl = useL();
  return (
    <section className="relative z-10 h-[100svh] min-h-[620px] overflow-hidden bg-night text-white">
      <SilkAurora seed={6} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="relative flex h-full flex-col justify-between px-4 pb-10 pt-24 md:px-8 md:pb-20 md:pt-20">
        <div className="flex items-start justify-between gap-6">
          <p className="pl-0 text-[16px] font-medium tracking-[-0.03em] md:pl-[420px] md:text-[20px]">{tl(SHOWREEL.label)}</p>
          <Wordmark className="hidden text-[26px] text-white md:inline-flex" />
        </div>
        <div className="flex flex-col gap-3">
          <p className="max-w-[520px] text-[26px] font-medium leading-[1.1] tracking-[-0.03em] md:text-[32px]">{tl(SHOWREEL.question)}</p>
          <div className="w-full max-w-[540px]">
            <CutButton href="/projects" label={SHOWREEL.cta} meta={SHOWREEL.ctaMeta} className="h-[88px] md:h-[112px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
