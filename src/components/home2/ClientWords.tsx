"use client";

import Image from "next/image";
import Link from "next/link";
import { T, useL } from "@/lib/i18n";
import { WORDS } from "@/lib/copy";
import { PROJECTS, TESTIMONIALS } from "@/lib/data";
import { Bracket } from "@/components/site/SectionHeader";
import CutButton from "@/components/site/CutButton";
import Reveal from "@/components/site/Reveal";

/**
 * Client words: a huge outlined title between two accent rules, then a
 * masonry of quotes and project stills. Quotes come from TESTIMONIALS;
 * where a quote is still a placeholder awaiting the client's real words,
 * it is attributed to a role, never to an invented person.
 */

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function Quote({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  const project = PROJECTS.find((p) => p.slug === t.projectSlug);
  return (
    <figure className="flex break-inside-avoid flex-col gap-6 border border-white/10 bg-white/[0.03] p-5">
      <figcaption className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center bg-accent font-tek text-[15px] font-medium text-accent-ink">
          {initials(t.placeholder ? t.client : t.author)}
        </span>
        <span className="flex flex-col">
          <span className="text-[14px] font-medium tracking-[-0.03em] text-white">{t.placeholder ? <T>{t.role}</T> : t.author}</span>
          <span className="text-[11px] font-semibold uppercase text-white/45">
            {t.placeholder ? t.client : <T>{t.role}</T>} {project && !t.placeholder ? `| ${t.client}` : ""}
          </span>
        </span>
      </figcaption>
      <blockquote className="text-[18px] font-medium leading-[1.3] tracking-[-0.03em] text-white/90">
        “<T>{t.quote}</T>”
      </blockquote>
      {project && (
        <Link href={`/projects/${project.slug}`} className="text-[11px] font-semibold uppercase text-accent hover:underline">
          {project.client} →
        </Link>
      )}
    </figure>
  );
}

export default function ClientWords() {
  const tl = useL();
  const real = TESTIMONIALS.filter((t) => !t.placeholder);
  const stand = TESTIMONIALS.filter((t) => t.placeholder);
  const stills = PROJECTS.slice(0, 4);

  // Interleave quotes and stills so the columns read like the reference.
  const items: ({ kind: "q"; t: (typeof TESTIMONIALS)[number] } | { kind: "img"; p: (typeof PROJECTS)[number] })[] = [];
  [...real, ...stand].forEach((t, i) => {
    items.push({ kind: "q", t });
    if (i % 2 === 1 && stills[(i - 1) / 2]) items.push({ kind: "img", p: stills[(i - 1) / 2] });
  });

  return (
    <section className="relative z-10 bg-night py-24 text-white md:py-40">
      <div className="px-4 md:px-8">
        <div className="h-[2px] bg-accent" />
        <div className="flex flex-col items-center gap-4 py-10 md:py-14">
          <Bracket v={WORDS.says} dark />
          <h2
            className="w-full text-center font-tek font-semibold uppercase leading-[0.85] tracking-[-0.03em] text-transparent [-webkit-text-stroke:1.5px_#8a8a8a] md:[-webkit-text-stroke:2px_#8a8a8a]"
            style={{ fontSize: "clamp(56px, 12.4vw, 190px)" }}
          >
            {tl(WORDS.title)}
          </h2>
        </div>
        <div className="h-[2px] bg-accent" />
      </div>

      <div className="mt-16 columns-1 gap-3 px-4 sm:columns-2 md:px-8 lg:columns-3 [&>*]:mb-3">
        <div className="flex break-inside-avoid flex-col gap-5 border border-white/10 p-5">
          <p className="text-[18px] font-medium tracking-[-0.03em]">{tl(WORDS.ask)}</p>
          <CutButton href="/contact" label={WORDS.start} size="md" />
        </div>
        {items.map((it, i) =>
          it.kind === "q" ? (
            <Reveal key={i} className="break-inside-avoid">
              <Quote t={it.t} />
            </Reveal>
          ) : (
            <Reveal key={i} className="relative break-inside-avoid">
              <Link href={`/projects/${it.p.slug}`} className="group relative block aspect-[4/5] overflow-hidden">
                <Image src={it.p.cover} alt={it.p.client} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover grayscale transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute bottom-3 left-3 bg-night/80 px-2 py-1 text-[11px] font-semibold uppercase">{it.p.client}</span>
              </Link>
            </Reveal>
          ),
        )}
      </div>
    </section>
  );
}
