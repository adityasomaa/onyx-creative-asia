"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { T, useL } from "@/lib/i18n";
import { PROJECTS, defaultUrlLabel, getTestimonialForProject, type Project } from "@/lib/data";
import { PROJECTS_PAGE, UI } from "@/lib/copy";
import { disciplinesFor } from "@/lib/services";
import { Bracket } from "@/components/site/SectionHeader";
import CutButton from "@/components/site/CutButton";
import Reveal from "@/components/site/Reveal";
import WorkMedia from "@/components/site/WorkMedia";

function Kicker({ n, v }: { n: string; v: Parameters<typeof Bracket>[0]["v"] }) {
  const tl = useL();
  return (
    <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase text-fg2">
      <span className="text-faint">[</span>
      {n} — {tl(v)}
      <span className="text-faint">]</span>
    </p>
  );
}

function Hero({ p }: { p: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  return (
    // The preview is a 16:10 frame on #F4F4F4, shown whole: phones get its
    // own proportions, larger screens a tall paper box it sits inside.
    <div ref={ref} className="relative aspect-[16/10] overflow-hidden bg-paper md:aspect-auto md:h-[86vh] md:min-h-[340px]">
      <motion.div className="absolute inset-0" style={{ y }}>
        <WorkMedia project={p} size="hd" fit="contain" sizes="100vw" priority />
      </motion.div>
    </div>
  );
}

export default function ProjectDetail({ project: p }: { project: Project }) {
  const tl = useL();
  const services = disciplinesFor(p);
  const quote = getTestimonialForProject(p.slug);
  const others = PROJECTS.filter((x) => x.slug !== p.slug).slice(0, 6);
  const study = p.study;

  return (
    <article>
      {/* Header */}
      <header className="px-4 pb-10 pt-[100px] md:px-8 md:pb-14 md:pt-[110px]">
        <div className="flex items-center gap-3 border-b-2 border-rule pb-2.5 text-[12px] font-semibold uppercase">
          <span className="text-fg">{p.client}</span>
          <span className="text-faint">[</span>
          <span className="text-mute">
            <T>{p.location ?? p.category}</T>
          </span>
          <span className="text-faint">]</span>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <h1 className="font-tek text-[40px] font-medium uppercase leading-[0.95] tracking-[-0.02em] text-fg md:text-[72px]">
              <T>{p.title}</T>
            </h1>
            <div className="mt-6 flex max-w-[640px] gap-4">
              <span className="w-1 shrink-0 bg-rule" />
              <p className="text-[13px] font-semibold uppercase leading-[1.3] text-fg2">
                <T>{p.blurb ?? p.description}</T>
              </p>
            </div>
          </div>
          <div className="md:text-right">
            <p className="text-[10px] font-semibold uppercase text-mute">{tl(PROJECTS_PAGE.scope)}</p>
            <ul className="mt-1 text-[11px] font-semibold uppercase leading-[1.35] text-fg">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={`/services/${s.id}`} className="underline-offset-2 hover:text-fg2 hover:underline">
                    {tl(s.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <Hero p={p} />

      {/* Project data */}
      <section className="grid grid-cols-1 gap-10 px-4 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:px-8 md:py-28">
        <div>
          <Bracket v={PROJECTS_PAGE.data} className="text-[11px]" />
          <p className="mt-6 font-tek text-[30px] font-medium uppercase leading-none text-fg md:text-[36px]">{p.client}</p>
          <p className="mt-2 text-[11px] font-semibold uppercase text-mute">
            <T>{p.blurb ?? p.category}</T>
          </p>
        </div>
        <div>
          <dl className="border-t border-rule">
            {(
              [
                [PROJECTS_PAGE.title, <T key="t">{p.title}</T>],
                [PROJECTS_PAGE.client, p.client],
                [PROJECTS_PAGE.year, p.year],
                [PROJECTS_PAGE.location, <T key="l">{p.location ?? "—"}</T>],
                [PROJECTS_PAGE.type, services.map((s) => tl(s.title)).join(", ")],
              ] as [typeof PROJECTS_PAGE.title, React.ReactNode][]
            ).map(([k, v], i) => (
              <div key={i} className="grid grid-cols-[120px_minmax(0,1fr)] gap-4 border-b border-rule py-3.5 md:grid-cols-[200px_minmax(0,1fr)]">
                <dt className="text-[10px] font-semibold uppercase text-mute">{tl(k)}</dt>
                <dd className="text-[12px] font-semibold uppercase text-fg">{v}</dd>
              </div>
            ))}
          </dl>
          {p.url && (
            <div className="mt-8 max-w-[640px]">
              <CutButton href={p.url} external label={p.urlLabel ? tl(UI.liveProject) : defaultUrlLabel(p.url)} size="md" />
            </div>
          )}
        </div>
      </section>

      {/* Overview */}
      <section className="grid grid-cols-1 gap-8 bg-snow px-4 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:px-8 md:py-28">
        <Kicker n="01" v={PROJECTS_PAGE.overview} />
        <Reveal className="max-w-[720px] space-y-5 text-[16px] font-medium leading-[1.45] tracking-[-0.03em] text-fg md:text-[18px]">
          <p>
            <T>{study?.overview ?? p.description}</T>
          </p>
          {p.longDescription && (
            <p className="text-fg2">
              <T>{p.longDescription}</T>
            </p>
          )}
        </Reveal>
      </section>

      {study && (
        <>
          {[
            { n: "02", k: PROJECTS_PAGE.challenge, h: PROJECTS_PAGE.challengeHead, items: study.needed },
            { n: "03", k: PROJECTS_PAGE.solution, h: PROJECTS_PAGE.solutionHead, items: study.did },
          ].map((b) => (
            <section key={b.n} className="grid grid-cols-1 gap-8 px-4 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:px-8 md:py-28">
              <div className="flex flex-col gap-6">
                <Kicker n={b.n} v={b.k} />
                <h2 className="max-w-[12ch] font-tek text-[30px] font-medium uppercase leading-[1.05] text-fg md:text-[40px]">{tl(b.h)}</h2>
              </div>
              <ul className="max-w-[760px] border-t border-rule">
                {b.items.map((it, i) => (
                  <Reveal as="li" key={i} delay={i * 0.04} className="grid grid-cols-[48px_minmax(0,1fr)] gap-4 border-b border-rule py-5">
                    <span className="font-tek text-[18px] font-medium text-faint">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[16px] font-medium leading-[1.4] tracking-[-0.03em] text-fg md:text-[18px]">
                      <T>{it}</T>
                    </span>
                  </Reveal>
                ))}
              </ul>
            </section>
          ))}

          {/* Result */}
          <section className="px-4 py-20 md:px-8 md:py-28">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
              <div className="flex flex-col gap-6">
                <Kicker n="04" v={PROJECTS_PAGE.result} />
                <h2 className="max-w-[12ch] font-tek text-[30px] font-medium uppercase leading-[1.05] text-fg md:text-[40px]">{tl(PROJECTS_PAGE.resultHead)}</h2>
              </div>
              <div className="grid grid-cols-1 gap-px border border-rule bg-rule sm:grid-cols-2">
                {study.changed.map((c, i) => (
                  <Reveal key={i} delay={i * 0.05} className="flex min-h-[200px] flex-col justify-between gap-6 bg-white p-6">
                    <span className="font-tek text-[44px] font-medium leading-none text-fg">{String(i + 1).padStart(2, "0")}</span>
                    <span className="border-t-[3px] border-accent pt-4 text-[13px] font-semibold uppercase leading-[1.3] text-fg2">
                      <T>{c}</T>
                    </span>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* In their words */}
      {quote && (
        <section className="bg-night px-4 py-20 text-white md:px-8 md:py-28">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <Bracket v={PROJECTS_PAGE.words} dark />
            <figure>
              <blockquote className="max-w-[880px] text-[22px] font-medium leading-[1.3] tracking-[-0.03em] md:text-[30px]">
                “<T>{quote.quote}</T>”
              </blockquote>
              <figcaption className="mt-8 border-t border-white/10 pt-6 text-[12px] font-semibold uppercase text-white/60">
                {quote.placeholder ? (
                  <T>{quote.role}</T>
                ) : (
                  <>
                    {quote.author} — <T>{quote.role}</T>
                  </>
                )}
                , {quote.client}
              </figcaption>
            </figure>
          </div>
        </section>
      )}

      {p.url && (
        <section className="px-4 py-16 md:px-[10vw] md:py-24">
          <CutButton href={p.url} external label={UI.liveProject} />
        </section>
      )}

      {/* More projects */}
      <section className="border-t border-rule px-4 pb-24 pt-10 md:px-8">
        <div className="flex items-center justify-between">
          <Bracket v={UI.moreProjects} className="text-[11px]" />
          <Link href="/projects" className="text-[11px] font-semibold uppercase text-fg hover:text-fg2">
            › {tl(UI.allProjects)}
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((o) => (
            <Link key={o.slug} href={`/projects/${o.slug}`} className="group">
              <div className="relative aspect-[16/10] overflow-hidden bg-paper">
                <WorkMedia project={o} sizes="(min-width: 1024px) 33vw, 50vw" className="grayscale transition-[filter,transform] duration-700 group-hover:scale-[1.03] group-hover:grayscale-0" />
              </div>
              <p className="mt-3 text-[12px] font-semibold uppercase text-fg">
                <T>{o.title}</T>
              </p>
              <p className="text-[11px] font-semibold uppercase text-mute">{o.client}</p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
