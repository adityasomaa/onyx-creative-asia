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
 * masonry of quotes and client logo tiles. Quotes come from TESTIMONIALS;
 * where a quote is still a placeholder awaiting the client's real words,
 * it is attributed to a role, never to an invented person. Logos are the
 * clients' own marks in solid black, inverted to white here.
 */

/** Tiles use the marks with enough resolution to sit large. */
const TILE_SLUGS = ["bhagawan-property", "jalak-cargo-logistics", "my-day-gili", "the-hair-extensions-bali"];

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
        <Link href={`/projects/${project.slug}`} className="group flex items-center justify-between gap-4 border-t border-white/10 pt-4">
          {project.logo ? (
            <span className="relative block h-9 w-[170px]">
              <Image src={project.logo} alt={project.client} fill sizes="170px" className="object-contain object-left opacity-70 invert transition-opacity group-hover:opacity-100" />
            </span>
          ) : (
            <span className="text-[11px] font-semibold uppercase text-white/70">{project.client}</span>
          )}
          <span className="text-[14px] text-accent transition-transform group-hover:translate-x-1">→</span>
        </Link>
      )}
    </figure>
  );
}

export default function ClientWords() {
  const tl = useL();
  const real = TESTIMONIALS.filter((t) => !t.placeholder);
  const stand = TESTIMONIALS.filter((t) => t.placeholder);
  const stills = TILE_SLUGS.map((slug) => PROJECTS.find((p) => p.slug === slug)).filter((p): p is (typeof PROJECTS)[number] => !!p?.logo);

  // Interleave quotes and logo tiles so the columns read like the reference.
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
          <CutButton href="/enquire?type=project" label={WORDS.start} size="md" />
        </div>
        {items.map((it, i) =>
          it.kind === "q" ? (
            <Reveal key={i} className="break-inside-avoid">
              <Quote t={it.t} />
            </Reveal>
          ) : (
            <Reveal key={i} className="relative break-inside-avoid">
              <Link href={`/projects/${it.p.slug}`} className="group relative block aspect-[5/4] overflow-hidden border border-white/10 bg-white/[0.03] transition-colors duration-500 hover:border-white/30">
                <span className="absolute inset-x-[18%] inset-y-[30%] transition-transform duration-700 group-hover:scale-105">
                  <Image src={it.p.logo as string} alt={it.p.client} fill sizes="(min-width: 1024px) 22vw, 64vw" className="object-contain invert" />
                </span>
                <span className="absolute bottom-4 left-4 text-[11px] font-semibold uppercase text-white/45">{it.p.client}</span>
                <span className="absolute bottom-4 right-4 text-[14px] text-accent transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>
          ),
        )}
      </div>
    </section>
  );
}
