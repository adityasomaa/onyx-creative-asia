"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useL } from "@/lib/i18n";
import { ABOUT, RESULTS } from "@/lib/copy";
import { SERVICES } from "@/lib/services";
import Headline from "@/components/site/Headline";
import { Bracket } from "@/components/site/SectionHeader";
import Odometer from "@/components/site/Odometer";
import Reveal from "@/components/site/Reveal";
import { InfinityMark } from "@/components/site/Wordmark";
import Showreel from "@/components/home2/Showreel";
import WorkIndex from "@/components/home2/WorkIndex";
import ClientLogos from "@/components/home2/ClientLogos";
import NotesTeaser from "@/components/home2/NotesTeaser";
import SilkAurora from "@/components/site/art/SilkAurora";
import ServiceArt from "@/components/site/art/ServiceArt";

function Studio() {
  const tl = useL();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  return (
    <section className="relative z-10 bg-snow px-4 pb-24 pt-10 md:px-8 md:pb-32">
      <div ref={ref} className="relative h-[40vh] min-h-[260px] overflow-hidden md:h-[62vh]">
        <motion.div className="absolute inset-[-12%_0]" style={{ y }}>
          <Image src="/images/about-studio.jpg" alt="" fill sizes="100vw" className="object-cover" />
        </motion.div>
        <p aria-hidden className="absolute inset-x-0 bottom-[-0.12em] flex items-center gap-[0.3em] whitespace-nowrap px-4 font-tek font-semibold uppercase leading-none tracking-[-0.03em] text-white/80 mix-blend-overlay text-[clamp(30px,9vw,150px)]">
          <InfinityMark />
          <span>Onyx Creative</span>
        </p>
      </div>
      <p className="mt-3 text-right text-[10px] font-semibold uppercase text-mute">Studio — Bali, ID</p>
      <div className="mt-16 grid grid-cols-1 gap-8 md:mt-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <span className="hidden md:block" />
        <div className="flex flex-col gap-8">
          <Headline v={ABOUT.oneTeam} className="text-[36px] leading-[1.08] tracking-[-0.03em] text-fg md:text-[56px]" />
          <p className="text-[20px] font-medium leading-[1.3] tracking-[-0.03em] text-fg md:text-[24px]">{tl(ABOUT.oneTeamBody)}</p>
          <div className="flex gap-4">
            <span className="w-1 shrink-0 bg-rule" />
            <p className="max-w-[480px] text-[15px] font-medium leading-[1.35] tracking-[-0.03em] text-mute">{tl(ABOUT.oneTeamNote)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const tl = useL();
  return (
    <>
      {/* Hero */}
      <section className="bg-white px-4 pb-16 pt-[110px] md:px-8 md:pb-24 md:pt-[150px]">
        <Headline as="h1" v={ABOUT.headline} className="max-w-[16ch] text-[44px] leading-[1] tracking-[-0.03em] text-fg md:text-[88px]" />
        <p className="mt-8 max-w-[620px] text-[20px] font-medium leading-[1.3] tracking-[-0.03em] text-fg md:text-[24px]">{tl(ABOUT.lede)}</p>
        <div className="mt-8 flex max-w-[600px] gap-4">
          <span className="w-1 shrink-0 bg-rule" />
          <p className="text-[15px] font-medium leading-[1.35] tracking-[-0.03em] text-mute">{tl(ABOUT.note)}</p>
        </div>
      </section>

      <Showreel />
      <Studio />

      {/* Ambitious */}
      <section className="relative z-10 bg-accent px-4 py-24 text-center text-accent-ink md:px-8 md:py-32">
        <Bracket v={ABOUT.where} className="justify-center [&_span]:!text-current" />
        <Headline v={ABOUT.ambitious} className="mx-auto mt-8 max-w-[18ch] text-[40px] leading-[1.06] tracking-[-0.03em] md:text-[72px]" />
        <p className="mx-auto mt-8 max-w-[520px] text-[16px] font-medium leading-[1.35] tracking-[-0.03em]">{tl(ABOUT.ambitiousBody)}</p>
        <div className="mx-auto mt-14 grid max-w-[1000px] grid-cols-3 gap-3 md:gap-5">
          {["/images/about-facade.jpg", "/images/about-curve.jpg", "/images/results-blocks.jpg"].map((src) => (
            <Reveal key={src} className="relative aspect-[4/3] overflow-hidden">
              <Image src={src} alt="" fill sizes="33vw" className="object-cover" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Crew */}
      <section className="relative z-10 bg-white px-4 py-24 md:px-8 md:py-32">
        <Bracket v={ABOUT.crewTag} />
        <Headline v={ABOUT.crewHeadline} className="mt-6 text-[36px] leading-[1.06] tracking-[-0.03em] text-fg md:text-[64px]" />
        <p className="mt-6 max-w-[560px] text-[12px] font-semibold uppercase leading-[1.3] text-fg2">{tl(ABOUT.crewBody)}</p>
        <div className="mt-10 h-1 bg-accent" />
        <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
          {SERVICES.map((s, i) => (
            <Reveal key={s.id} delay={(i % 5) * 0.05}>
              <Link href={`/services/${s.id}`} className="group block">
                <div className="cut on-dark relative aspect-[3/4] overflow-hidden bg-[#111] [--cut:22px]">
                  <SilkAurora seed={i + 1} className="absolute inset-0 h-full w-full" />
                  <ServiceArt id={s.art} bare className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="mt-4 font-tek text-[18px] font-medium uppercase leading-[1.05] text-fg">{tl(s.title)}</p>
                <div className="mt-3 flex items-end gap-2 border-b border-rule pb-3">
                  <span className="font-tek text-[30px] font-medium leading-none text-fg">{s.number}</span>
                  <span className="pb-0.5 text-[9px] font-semibold uppercase leading-tight text-mute">/ {String(SERVICES.length).padStart(2, "0")}</span>
                </div>
                <p className="mt-3 text-[11px] leading-[1.35] tracking-[-0.02em] text-fg2">{tl(s.short)}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Noticed */}
      <section className="relative z-10 bg-white px-4 pb-16 md:px-8">
        <Headline v={ABOUT.noticed} className="text-[36px] leading-[1.06] tracking-[-0.03em] text-fg md:text-[64px]" />
        <p className="mt-6 text-[12px] font-semibold uppercase text-fg">{tl(ABOUT.noticedBody)}</p>
        <div className="mt-10 h-1 bg-accent" />
        <div className="mt-12 grid grid-cols-2 gap-px border border-rule bg-rule lg:grid-cols-4">
          {RESULTS.cards.map((c) => (
            <div key={c.tag.en} className="flex flex-col gap-6 bg-white p-5">
              <span className="text-[11px] font-semibold uppercase text-fg">{tl(c.tag)}</span>
              <div className="flex flex-wrap items-end gap-x-2 border-b-[3px] border-accent pb-2 font-tek font-medium text-fg">
                <Odometer value={c.value} className="text-[44px] md:text-[64px]" />
                <span className="pb-1.5 text-[14px] uppercase text-mute">
                  {c.suffix} {tl(c.unit)}
                </span>
              </div>
              <p className="text-[11px] font-semibold uppercase leading-[1.25] text-mute">{tl(c.note)}</p>
            </div>
          ))}
        </div>
      </section>

      <WorkIndex />
      <ClientLogos />
      <NotesTeaser />
    </>
  );
}
