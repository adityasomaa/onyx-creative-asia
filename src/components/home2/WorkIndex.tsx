"use client";

import Image from "next/image";
import Link from "next/link";
import { T, useL } from "@/lib/i18n";
import { INDEX } from "@/lib/copy";
import { PROJECTS } from "@/lib/data";
import { disciplinesFor } from "@/lib/services";
import { SectionTitle } from "@/components/site/SectionHeader";
import Odometer from "@/components/site/Odometer";
import Reveal from "@/components/site/Reveal";

/**
 * Where the reference lists awards, we list the work: every published
 * case study by year, client, what it was and how many disciplines it
 * used. Nothing here can't be checked by opening the project.
 */
export default function WorkIndex() {
  const tl = useL();
  const rows = [...PROJECTS].sort((a, b) => b.year.localeCompare(a.year));
  return (
    <section className="relative z-10 bg-white pb-24 md:pb-32">
      <div className="px-4 pb-12 pt-4 md:px-8 md:pb-20">
        <Reveal>
          <h2 className="font-tek text-[44px] font-medium uppercase leading-[0.9] tracking-[-0.02em] text-fg sm:text-[64px] md:text-[clamp(64px,7.6vw,110px)]">
            {tl(INDEX.heading)}
          </h2>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 gap-10 px-4 md:px-8 lg:grid-cols-[305px_1fr] lg:gap-8">
        <aside className="flex flex-col gap-8 lg:pr-8 lg:pt-4">
          <SectionTitle v={INDEX.side} className="[&>span:first-child]:text-[20px]" />
          <div className="relative h-[225px] w-[150px] overflow-hidden bg-paper">
            <Image src={PROJECTS[1].cover} alt="" fill sizes="150px" className="object-cover grayscale" />
          </div>
          <div className="flex items-end gap-4 border-b border-rule pb-4">
            <Odometer value={String(PROJECTS.length).padStart(2, "0")} className="font-tek text-[80px] font-medium text-fg" />
            <span className="pb-3 text-[13px] font-semibold uppercase leading-[1.2] text-mute">{tl(INDEX.total)}</span>
          </div>
          <p className="max-w-[220px] text-[11px] font-semibold uppercase leading-[1.25] text-mute">{tl(INDEX.totalNote)}</p>
        </aside>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse text-left md:min-w-[640px]">
            <thead>
              <tr className="border-b border-rule text-[11px] font-semibold uppercase text-mute">
                <th className="w-[64px] px-3 py-4 font-semibold md:w-[96px] md:px-4">{tl(INDEX.colYear)}</th>
                <th className="px-3 py-4 font-semibold md:px-4">{tl(INDEX.colClient)}</th>
                <th className="hidden px-4 py-4 font-semibold md:table-cell">{tl(INDEX.colWork)}</th>
                <th className="w-[64px] px-3 py-4 text-right font-semibold md:w-[96px] md:px-4">{tl(INDEX.colScope)}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const n = disciplinesFor(p).length;
                return (
                  <tr key={p.slug} className="group border-b border-rule transition-colors hover:bg-snow">
                    <td className="px-3 py-4 align-top text-[12px] font-semibold uppercase text-fg2 md:px-4 md:align-middle">{p.year}</td>
                    <td className="px-3 py-4 text-[14px] tracking-[-0.04em] text-fg md:px-4">
                      <Link href={`/projects/${p.slug}`} className="underline-offset-4 hover:underline">
                        {p.client}
                      </Link>
                      {/* On phones the work column folds in under the client. */}
                      <span className="mt-1 block text-[12px] text-fg2 md:hidden">
                        <T>{p.title}</T>
                      </span>
                    </td>
                    <td className="hidden px-4 py-4 text-[14px] tracking-[-0.04em] text-fg2 md:table-cell">
                      <Link href={`/projects/${p.slug}`} tabIndex={-1} className="hover:text-fg">
                        <T>{p.title}</T>
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-right md:px-4">
                      <span className="inline-flex items-center gap-3">
                        <span className="hidden gap-[3px] sm:flex" aria-hidden>
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={i < n ? "h-1.5 w-1.5 bg-fg" : "h-1.5 w-1.5 bg-rule"} />
                          ))}
                        </span>
                        <span className="w-4 font-tek text-[24px] font-medium leading-none text-faint">{n}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
