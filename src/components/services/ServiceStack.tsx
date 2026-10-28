"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useL } from "@/lib/i18n";
import { SERVICES_PAGE, UI } from "@/lib/copy";
import { SERVICES, projectsFor, type Service } from "@/lib/services";
import { cn } from "@/lib/cn";
import CutButton from "@/components/site/CutButton";
import ServiceArt from "@/components/site/art/ServiceArt";
import SilkAurora from "@/components/site/art/SilkAurora";
import { useReduce } from "@/components/site/useReduce";

const N = SERVICES.length;

/**
 * The six services as a stack of cards. Each card pins under the nav and
 * the next one slides up over it; the ones underneath shrink a little so
 * their top edges stay visible. Nothing has to be opened to be read, and
 * every card leads to its service page.
 *
 *   "hero"   full-bleed aurora cards (the home hero on phones and tablets)
 *   "panel"  dark cards, copy on the left and the motion graphic on the
 *            right (Expertise on the home page, and /services)
 *
 * Every card sits in a screen-tall sticky slot, so the stack needs one
 * screen of scroll per service; the last card holds until the stack ends.
 */
export default function ServiceStack({ variant, className }: { variant: "hero" | "panel"; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduce();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <div ref={ref} className={cn("relative", className)}>
      {SERVICES.map((s, i) => (
        <Slot key={s.id} s={s} i={i} variant={variant} progress={scrollYProgress} still={reduce} />
      ))}
    </div>
  );
}

function Slot({ s, i, variant, progress, still }: { s: Service; i: number; variant: "hero" | "panel"; progress: MotionValue<number>; still: boolean }) {
  // Cards further down the stack end smaller, so the edges fan out.
  const scale = useTransform(progress, [i / N, 1], [1, still ? 1 : 1 - (N - 1 - i) * 0.035]);
  return (
    <div
      className="sticky top-0 flex h-[100svh] flex-col px-2 md:px-8 [--step:10px] md:[--step:14px]"
      style={{ paddingTop: `calc(80px + ${i} * var(--step))` }}
    >
      <motion.div style={{ scale, transformOrigin: "50% 0%" }} className="h-[calc(100svh-150px)] max-h-[740px] md:h-[calc(100vh-190px)]">
        {variant === "hero" ? <HeroCard s={s} i={i} /> : <PanelCard s={s} />}
      </motion.div>
    </div>
  );
}

function HeroCard({ s, i }: { s: Service; i: number }) {
  const tl = useL();
  return (
    <article className="cut on-dark relative flex h-full flex-col justify-end overflow-hidden bg-[#111] [--cut:24px]">
      <SilkAurora seed={i + 1} className="absolute inset-0 h-full w-full" />
      <ServiceArt id={s.art} bare className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/80" />
      <div className="relative flex flex-col gap-3 p-4 pb-5 text-white md:p-8">
        <span className="text-[13px] font-medium tabular-nums text-white/75">
          {s.number} / {String(N).padStart(2, "0")}
        </span>
        <h2 className="font-tek text-[26px] font-medium uppercase leading-none md:text-[34px]">{tl(s.title)}</h2>
        <p className="max-w-[520px] text-[15px] font-medium uppercase leading-[1.2] text-white/80">{tl(s.short)}</p>
        <CutButton href={`/services/${s.id}`} label={SERVICES_PAGE.view} size="md" className="mt-2 md:max-w-[340px]" />
      </div>
    </article>
  );
}

function PanelCard({ s }: { s: Service }) {
  const tl = useL();
  const count = projectsFor(s.id).length;
  return (
    <article className="cut on-dark relative grid h-full grid-rows-[34%_1fr] overflow-hidden border-t border-white/10 bg-coal text-white [--cut:28px] md:grid-cols-[minmax(0,1fr)_38%] md:grid-rows-1">
      <div className="relative md:order-last">
        <ServiceArt id={s.art} className="absolute inset-0 h-full w-full" />
      </div>
      <div className="flex min-h-0 flex-col justify-between gap-5 p-5 md:p-10">
        <div className="min-h-0">
          <span className="block w-fit font-tek text-[24px] font-medium leading-none text-accent md:text-[26px]">
            {s.number}
            <span className="mt-2.5 block h-[2px] w-16 bg-accent" />
          </span>
          <h3 className="mt-5 font-tek text-[20px] font-medium uppercase leading-[1.05] md:mt-8 md:text-[22px]">{tl(s.title)}</h3>
          <p className="mt-3 max-w-[620px] font-tek text-[24px] font-medium uppercase leading-[1.08] tracking-[-0.02em] md:mt-5 md:text-[clamp(30px,3.2vw,44px)]">
            {tl(s.headline)}
          </p>
          <p className="mt-4 max-w-[560px] text-[14px] font-medium leading-[1.35] tracking-[-0.03em] text-white/60 md:hidden">{tl(s.short)}</p>
          <p className="mt-6 hidden max-w-[560px] text-[16px] font-medium leading-[1.4] tracking-[-0.03em] text-white/55 md:block">{tl(s.body)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <CutButton href={`/services/${s.id}`} label={SERVICES_PAGE.view} size="md" className="w-full sm:w-[300px]" />
          {count > 0 && (
            <span className="text-[12px] font-semibold uppercase text-accent">
              {count} {tl(count === 1 ? UI.projectCount : UI.projectsCount)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
