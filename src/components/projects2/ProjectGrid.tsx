"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useReduce } from "@/components/site/useReduce";
import { T, useL } from "@/lib/i18n";
import { PROJECTS, type Project } from "@/lib/data";
import { PROJECTS_PAGE, UI } from "@/lib/copy";
import { disciplinesFor } from "@/lib/services";
import { Chevron } from "@/components/site/CutButton";
import WorkMedia from "@/components/site/WorkMedia";

/**
 * /projects: two columns of case studies moving in opposite directions as
 * the page scrolls, inside one sticky viewport. In the reference the grid
 * captures the wheel and never lets go, which strands the footer; here it
 * is driven by ordinary page scroll and releases at the end.
 */

function Card({ p, n }: { p: Project; n: number }) {
  const tl = useL();
  const first = disciplinesFor(p)[0];
  return (
    <Link href={`/projects/${p.slug}`} className="group block">
      <div className="flex items-end justify-between gap-4 pb-3">
        <div>
          <p className="font-tek text-[18px] font-medium uppercase leading-none text-fg md:text-[20px]">{p.client}</p>
          <p className="mt-1.5 text-[11px] tracking-[-0.02em] text-mute">{first ? tl(first.title) : <T>{p.category}</T>}</p>
        </div>
        <span className="font-tek text-[44px] font-medium leading-[0.8] text-transparent [-webkit-text-stroke:1px_#8a8a8a]">
          {String(n).padStart(2, "0")}
        </span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-paper">
        <WorkMedia project={p} sizes="(min-width: 768px) 46vw, 100vw" className="grayscale transition-[filter,transform] duration-[1.2s] ease-out group-hover:scale-[1.03] group-hover:grayscale-0" />
        <div className="on-dark absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/45 to-black/10 p-5 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 md:p-8">
          <p className="font-tek text-[28px] font-medium uppercase leading-none md:text-[40px]">
            <T>{p.title}</T>
          </p>
          <p className="mt-3 max-w-[420px] text-[12px] font-semibold uppercase leading-[1.25]">
            <T>{p.blurb ?? p.description}</T>
          </p>
          <p className="mt-4 flex items-center gap-1.5 font-tek text-[14px] font-medium uppercase text-accent">
            <Chevron /> {tl(UI.viewProject)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectGrid() {
  const tl = useL();
  const reduce = useReduce();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.3 });
  const left = PROJECTS.filter((_, i) => i % 2 === 0);
  const right = PROJECTS.filter((_, i) => i % 2 === 1);
  const yLeft = useTransform(p, [0, 1], ["0%", "-52%"]);
  const yRight = useTransform(p, [0, 1], ["-52%", "0%"]);

  return (
    <>
      <h1 className="sr-only">{tl(PROJECTS_PAGE.intro)}</h1>

      {/* Desktop: sticky counter-scrolling columns */}
      <section ref={ref} className="relative hidden md:block" style={{ height: reduce ? "auto" : "260vh" }}>
        <div className={reduce ? "" : "sticky top-0 h-screen overflow-hidden"}>
          <div className="grid h-full grid-cols-2 gap-8 px-8">
            <motion.div style={reduce ? undefined : { y: yLeft }} className="flex flex-col gap-16 pt-[110px]">
              {left.map((pr) => (
                <Card key={pr.slug} p={pr} n={PROJECTS.indexOf(pr) + 1} />
              ))}
            </motion.div>
            <motion.div style={reduce ? undefined : { y: yRight }} className="flex flex-col gap-16 pt-[110px]">
              {right.map((pr) => (
                <Card key={pr.slug} p={pr} n={PROJECTS.indexOf(pr) + 1} />
              ))}
            </motion.div>
          </div>
          {!reduce && (
            <>
              <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
            </>
          )}
        </div>
      </section>

      {/* Phones: one column */}
      <section className="flex flex-col gap-12 px-4 pb-16 pt-[100px] md:hidden">
        <p className="text-[13px] font-semibold uppercase leading-[1.25] text-fg2">{tl(PROJECTS_PAGE.intro)}</p>
        {PROJECTS.map((pr, i) => (
          <Card key={pr.slug} p={pr} n={i + 1} />
        ))}
      </section>
    </>
  );
}
