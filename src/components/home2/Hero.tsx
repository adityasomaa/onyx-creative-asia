"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useReduce } from "@/components/site/useReduce";
import { useL } from "@/lib/i18n";
import { HERO } from "@/lib/copy";
import { SERVICES, type Service } from "@/lib/services";
import { cn } from "@/lib/cn";
import CutButton, { Chevron } from "@/components/site/CutButton";
import Headline from "@/components/site/Headline";
import { useBaliTime } from "@/components/site/useBaliTime";
import ServiceArt from "@/components/site/art/ServiceArt";

/**
 * Home hero. A fixed intro column on the left; the ten services cascade
 * in from the right as you scroll, the reference's "Cascade" mechanic:
 *
 *   state 0       intro visible, service 1 fills the rest, card showing
 *   state i       service i fills the left, i+1 and i+2 wait as narrow
 *                 columns on the right (thumbnail, name, big number)
 *   between       everything interpolates, so the next column widens
 *                 into the main slot while the current one slides off left
 *
 * Phones get the intro followed by a plain stack of full-bleed cards.
 */

const N = SERVICES.length;

type Geo = { W: number; I: number; C: number; M: number };

function useGeo(): Geo {
  const [geo, set] = useState<Geo>({ W: 1440, I: 576, C: 256, M: 1018 });
  useEffect(() => {
    const on = () => {
      const W = window.innerWidth;
      const I = Math.max(440, W * 0.4);
      const C = Math.min(300, Math.max(190, W * 0.178));
      set({ W, I, C, M: W - 1.65 * C });
    };
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return geo;
}

/** Slide j's box at integer state s. */
function box(j: number, s: number, g: Geo): { x: number; w: number } {
  if (s === 0) {
    if (j === 1) return { x: g.I, w: g.W - g.I };
    return { x: g.W + (j - 2) * g.C, w: g.C };
  }
  const d = j - s;
  // The last service ends the run full width, so nothing white shows
  // to its right before the section releases.
  if (s === N && j === N) return { x: 0, w: g.W };
  if (d < 0) return { x: -g.M - 40, w: g.M };
  if (d === 0) return { x: 0, w: g.M };
  return { x: g.M + (d - 1) * g.C, w: g.C };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function HoursWidget() {
  const tl = useL();
  const t = useBaliTime();
  const hours = Array.from({ length: 14 }, (_, i) => 8 + i);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-[12px] font-semibold uppercase tracking-[-0.02em]">
        <span>{tl(HERO.hours)}</span>
        <span className="flex items-center gap-1.5 text-fg2">
          <span className={cn("h-1.5 w-1.5 rounded-full", t?.open ? "bg-accent" : "bg-faint")} />
          {t ? `${t.label} WITA · ${tl(t.open ? HERO.openNow : HERO.opensAt)}` : "—"}
        </span>
      </div>
      <div className="flex gap-[5px]">
        {hours.map((h) => (
          <span
            key={h}
            className={cn(
              "h-1.5 flex-1 transition-colors duration-700",
              t && t.open && h <= t.h ? "bg-accent" : t && t.open && h > t.h ? "bg-rule" : "bg-paper",
            )}
          />
        ))}
      </div>
      <div className="flex justify-between text-[11px] font-semibold uppercase text-mute">
        <span>08:00</span>
        <span>{tl(HERO.everyDay)}</span>
        <span>22:00</span>
      </div>
    </div>
  );
}

function Intro({ className }: { className?: string }) {
  const tl = useL();
  return (
    <div className={cn("flex flex-col bg-white px-4 pb-8 pt-[100px] md:px-8 lg:pb-6 lg:pt-[96px]", className)}>
      <div className="flex flex-col gap-6 lg:flex-1">
        <p className="border-b-2 border-rule pb-2.5 text-[13px] font-semibold uppercase tracking-[-0.02em] text-fg">
          {tl(HERO.eyebrow)}
        </p>
        <Headline
          as="h1"
          v={HERO.headline}
          className="text-[clamp(42px,min(5.7vw,7.6vh),84px)] leading-[1.02] tracking-[-0.03em] text-fg [&_.hl]:px-[0.08em] [&_.hl]:py-[0.02em]"
        />
        <div className="flex gap-4">
          <span className="w-1 shrink-0 bg-rule" />
          <p className="max-w-[360px] text-[15px] font-medium leading-[1.25] tracking-[-0.03em] text-mute md:text-[16px]">{tl(HERO.subtitle)}</p>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-8 lg:mt-6">
        <div>
          <p className="pb-4 text-[12px] font-semibold uppercase tracking-[-0.02em] text-fg2">{tl(HERO.reminder)}</p>
          <CutButton href="/contact" label={HERO.cta} meta={HERO.ctaMeta} />
        </div>
        <HoursWidget />
      </div>
    </div>
  );
}

function ServiceCard({ s, i, className }: { s: Service; i: number; className?: string }) {
  const tl = useL();
  return (
    <Link
      href={`/#svc-${s.id}`}
      className={cn("group cut flex flex-col justify-between gap-4 bg-accent p-5 text-accent-ink [--cut:24px] md:p-8", className)}
    >
      <span className="flex items-center gap-3 text-[11px] font-medium tabular-nums">
        {i + 1}
        <span className="h-px w-24 bg-current opacity-70" />
        {N}
      </span>
      <span className="flex items-end justify-between gap-6">
        <span className="flex flex-col gap-3">
          <span className="font-tek text-[26px] font-medium uppercase leading-none md:text-[32px]">{tl(s.title)}</span>
          <span className="max-w-[440px] text-[12px] font-semibold uppercase leading-[1.25] tracking-[-0.02em]">{tl(s.short)}</span>
        </span>
        <Chevron className="h-9 shrink-0 transition-transform duration-500 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function Slide({ s, j, state, geo }: { s: Service; j: number; state: MotionValue<number>; geo: Geo }) {
  const tl = useL();
  const pos = useTransform(state, (v) => {
    const a = Math.floor(v);
    const b = Math.min(N, a + 1);
    const t = v - a;
    const A = box(j, a, geo);
    const B = box(j, b, geo);
    return { x: lerp(A.x, B.x, t), w: lerp(A.w, B.w, t) };
  });
  // How "main" this slide is: 1 when it owns the big slot (or is leaving
  // left at full height), 0 as a narrow waiting column.
  const act = useTransform(state, (v) => (j === 1 ? 1 : j <= v ? 1 : Math.max(0, Math.min(1, 1 - (j - v)))));
  const x = useTransform(pos, (p) => p.x);
  const w = useTransform(pos, (p) => p.w);
  const imgH = useTransform(act, (a) => `${lerp(20.5, 100, a)}%`);
  const chrome = useTransform(act, (a) => 1 - Math.min(1, a * 1.6));
  const cardOpacity = useTransform(act, (a) => Math.max(0, (a - 0.86) / 0.14));
  const cardY = useTransform(act, (a) => (1 - Math.max(0, (a - 0.86) / 0.14)) * 40);

  return (
    <motion.div className="absolute top-0 h-full overflow-hidden bg-[#111]" style={{ x, width: w }}>
      <motion.div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: imgH }}>
        {/* Sized to the viewport, not the slide, so the strip widening never
            resizes the canvas: it is cropped like a cover image instead. */}
        <ServiceArt id={s.id} className="absolute left-1/2 top-0 h-screen w-screen -translate-x-1/2" />
      </motion.div>
      <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 top-[20.5%] flex flex-col justify-between p-4" style={{ opacity: chrome }}>
        <span className="pt-2 text-[11px] font-semibold uppercase leading-tight tracking-[-0.01em] text-white/90">{tl(s.title)}</span>
        <span className="font-tek text-[clamp(64px,7vw,110px)] font-medium leading-[0.8] text-[#4a4a4a]">{j}</span>
      </motion.div>
      <motion.div className="absolute bottom-0 left-0 w-[min(576px,100%)]" style={{ opacity: cardOpacity, y: cardY }}>
        <ServiceCard s={s} i={j - 1} className="h-[170px]" />
      </motion.div>
    </motion.div>
  );
}

function Cascade() {
  const ref = useRef<HTMLDivElement>(null);
  const geo = useGeo();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  const state = useTransform(smooth, (p) => Math.min(N, Math.max(0, p * N)));
  const [introGone, setIntroGone] = useState(false);
  useMotionValueEvent(state, "change", (v) => setIntroGone(v > 1.02));

  return (
    <section ref={ref} aria-label="Services" className="relative hidden lg:block" style={{ height: `${(N + 0.6) * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <Intro className={cn("absolute left-0 top-0 h-full w-[40vw] min-w-[440px]", introGone && "invisible")} />
        {/* Keyed by width: the transforms keep the geometry they were
            created with, so a resize remounts them with the new one. */}
        {SERVICES.map((s, i) => (
          <Slide key={`${s.id}-${Math.round(geo.W)}`} s={s} j={i + 1} state={state} geo={geo} />
        ))}
      </div>
    </section>
  );
}

function Stack() {
  const tl = useL();
  return (
    <section aria-label="Services" className="lg:hidden">
      <Intro />
      <div className="flex flex-col gap-1 bg-[#111] pt-1">
        {SERVICES.map((s, i) => (
          <article key={s.id} className="relative flex min-h-[78svh] flex-col justify-end overflow-hidden">
            <ServiceArt id={s.id} className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/80" />
            <div className="relative flex flex-col gap-3 p-4 pb-5 text-white">
              <span className="text-[13px] font-medium tabular-nums text-white/75">
                {s.number} / {String(N).padStart(2, "0")}
              </span>
              <h2 className="font-tek text-[26px] font-medium uppercase leading-none">{tl(s.title)}</h2>
              <p className="text-[15px] font-medium uppercase leading-[1.2] text-white/80">{tl(s.short)}</p>
              <CutButton href={`/#svc-${s.id}`} label={s.title} size="md" className="mt-2" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Hero() {
  const reduce = useReduce();
  return (
    <>
      {reduce ? (
        <div className="hidden lg:grid lg:grid-cols-[40vw_1fr]">
          <Intro className="min-h-screen" />
          <div className="grid grid-cols-2 gap-1 bg-[#111] p-1">
            {SERVICES.map((s, i) => (
              <div key={s.id} className="relative min-h-[46vh]">
                <ServiceArt id={s.id} className="absolute inset-0 h-full w-full" />
                <ServiceCard s={s} i={i} className="absolute inset-x-0 bottom-0 h-[150px]" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Cascade />
      )}
      <Stack />
    </>
  );
}
