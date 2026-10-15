"use client";

import Link from "next/link";
import { useL, type L } from "@/lib/i18n";
import { HERO, PROCESS, SERVICES_PAGE } from "@/lib/copy";
import { PROJECTS } from "@/lib/data";
import { SERVICES, projectsFor, type Service } from "@/lib/services";
import { cn } from "@/lib/cn";
import CutButton, { Chevron } from "@/components/site/CutButton";
import Headline from "@/components/site/Headline";
import Reveal from "@/components/site/Reveal";
import ServiceArt from "@/components/site/art/ServiceArt";
import SilkAurora from "@/components/site/art/SilkAurora";
import { Timeline } from "@/components/home2/Process";
import { ProjectCard } from "@/components/projects2/ProjectGrid";

const pad = (n: number) => String(n).padStart(2, "0");

function Kicker({ n, v, dark }: { n: string; v: L; dark?: boolean }) {
  const tl = useL();
  return (
    <p className={cn("flex items-center gap-1.5 text-[12px] font-semibold uppercase", dark ? "text-white/70" : "text-fg2")}>
      <span className={dark ? "text-white/35" : "text-faint"}>[</span>
      {n} — {tl(v)}
      <span className={dark ? "text-white/35" : "text-faint"}>]</span>
    </p>
  );
}

/**
 * /services/[slug]: one service. A full-bleed hero with its aurora and
 * motion graphic, then what it is, what it covers, how a run of it goes
 * (the same timeline as the home page's Process tab), the work that used
 * it, and a way in. The enquiry link carries the service, so the form
 * opens with it ticked.
 */
export default function ServiceDetail({ service: s }: { service: Service }) {
  const tl = useL();
  const i = SERVICES.indexOf(s);
  const next = SERVICES[(i + 1) % SERVICES.length];
  const track = PROCESS.tracks.find((t) => t.service === s.id) ?? PROCESS.tracks[0];
  const work = projectsFor(s.id);
  const enquire = `/enquire?type=project&service=${s.id}`;

  return (
    <article>
      <header className="on-dark relative flex min-h-[88svh] flex-col justify-end overflow-hidden bg-[#111] text-white md:min-h-[92vh]">
        <SilkAurora seed={i + 1} className="absolute inset-0 h-full w-full" />
        <ServiceArt id={s.art} bare className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/85" />
        <div className="relative grid grid-cols-1 gap-8 px-4 pb-10 pt-[110px] md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:px-8 md:pb-14">
          <div>
            <p className="flex flex-wrap items-center gap-1.5 text-[12px] font-semibold uppercase text-white/70">
              <span className="text-white/35">[</span>
              <Link href="/services" className="hover:text-white">
                {tl(SERVICES_PAGE.section)}
              </Link>
              <span className="text-white/35">/</span>
              {s.number}
              <span className="text-white/35">]</span>
            </p>
            <h1 className="mt-6 max-w-[16ch] font-tek text-[42px] font-medium uppercase leading-[0.95] tracking-[-0.02em] md:text-[clamp(56px,6.6vw,104px)]">
              {tl(s.title)}
            </h1>
            <div className="mt-6 flex max-w-[600px] gap-4">
              <span className="w-1 shrink-0 bg-accent" />
              <p className="text-[13px] font-semibold uppercase leading-[1.3] text-white/85">{tl(s.short)}</p>
            </div>
          </div>
          <div className="w-full md:w-[360px]">
            <CutButton href={enquire} label={HERO.cta} meta={HERO.ctaMeta} />
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-8 bg-white px-4 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:px-8 md:py-28">
        <Kicker n="01" v={SERVICES_PAGE.overview} />
        <Reveal>
          <p className="font-tek text-[30px] font-medium uppercase leading-[1.05] tracking-[-0.02em] text-fg md:text-[48px]">{tl(s.headline)}</p>
          <p className="mt-8 max-w-[680px] text-[17px] font-medium leading-[1.45] tracking-[-0.03em] text-fg2 md:text-[19px]">{tl(s.body)}</p>
        </Reveal>
      </section>

      <section className="grid grid-cols-1 gap-8 bg-snow px-4 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:px-8 md:py-28">
        <Kicker n="02" v={SERVICES_PAGE.included} />
        <ul className="grid grid-cols-1 border-t border-rule sm:grid-cols-2 sm:gap-x-8">
          {s.included.map((it, j) => (
            <li key={it.en} className="grid grid-cols-[40px_minmax(0,1fr)] gap-3 border-b border-rule py-5">
              <span className="font-tek text-[15px] font-medium text-faint">{pad(j + 1)}</span>
              <span className="text-[17px] font-medium leading-[1.35] tracking-[-0.02em] text-fg">{tl(it)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-coal text-white">
        <div className="flex flex-col gap-4 px-4 pt-20 md:flex-row md:items-end md:justify-between md:px-8 md:pt-28">
          <Kicker n="03" v={SERVICES_PAGE.howItRuns} dark />
          <p className="font-tek text-[24px] font-medium uppercase leading-[1.1] md:text-right md:text-[34px]">{tl(track.label)}</p>
        </div>
        <Timeline track={track} className="pb-16 md:pb-24" />
      </section>

      <section className="bg-white px-4 py-20 md:px-8 md:py-28">
        <Kicker n="04" v={SERVICES_PAGE.work} />
        {work.length ? (
          <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-12 md:grid-cols-2">
            {work.map((p) => (
              <ProjectCard key={p.slug} p={p} n={PROJECTS.indexOf(p) + 1} />
            ))}
          </div>
        ) : (
          <p className="mt-8 max-w-[520px] text-[13px] font-semibold uppercase leading-[1.3] text-fg2">{tl(SERVICES_PAGE.noWork)}</p>
        )}
      </section>

      <section className="on-dark bg-night px-4 py-20 text-white md:px-8 md:py-28">
        <Headline v={SERVICES_PAGE.ctaTitle} className="max-w-[16ch] text-[38px] leading-[1.05] tracking-[-0.03em] md:text-[72px]" />
        <p className="mt-6 max-w-[520px] text-[13px] font-semibold uppercase leading-[1.3] text-white/70">{tl(SERVICES_PAGE.ctaBody)}</p>
        <div className="mt-10 w-full max-w-[420px]">
          <CutButton href={enquire} label={HERO.cta} meta={HERO.ctaMeta} />
        </div>
      </section>

      <Link href={`/services/${next.id}`} className="group flex items-end justify-between gap-6 border-t border-rule bg-white px-4 py-10 md:px-8 md:py-16">
        <span className="flex flex-col gap-3">
          <span className="text-[12px] font-semibold uppercase text-fg2">
            [ {tl(SERVICES_PAGE.next)} — {next.number} ]
          </span>
          <span className="font-tek text-[32px] font-medium uppercase leading-none text-fg md:text-[64px]">{tl(next.title)}</span>
        </span>
        <Chevron className="h-10 text-fg transition-transform duration-500 group-hover:translate-x-2 md:h-16" />
      </Link>
    </article>
  );
}
