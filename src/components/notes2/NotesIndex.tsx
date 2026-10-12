"use client";

import Image from "next/image";
import Link from "next/link";
import { useL, useLocale } from "@/lib/i18n";
import { NOTES_PAGE, UI } from "@/lib/copy";
import { NOTES, NOTE_AUTHOR, formatDate, type Note } from "@/lib/notes";
import Reveal from "@/components/site/Reveal";

export function NoteCard({ n, big }: { n: Note; big?: boolean }) {
  const tl = useL();
  const { locale } = useLocale();
  return (
    <Link href={`/notes/${n.slug}`} className="group flex flex-col">
      <div className={`relative overflow-hidden bg-paper ${big ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
        <Image src={n.cover} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.04]" />
      </div>
      <div className="mt-4 flex justify-between text-[10px] font-semibold uppercase text-mute">
        <span>{formatDate(n.date, locale)}</span>
        <span>
          {n.minutes} {tl(UI.minRead)}
        </span>
      </div>
      <h3 className="mt-2 font-tek text-[22px] font-medium leading-[1.05] text-fg md:text-[24px]">{tl(n.title)}</h3>
      <p className="mt-3 text-[11px] font-semibold uppercase leading-[1.3] text-mute">{tl(n.dek)}</p>
      <div className="mt-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-rule" />
        <span className="text-[10px] font-semibold uppercase text-mute">
          {tl(UI.by)} {tl(NOTE_AUTHOR)}
        </span>
      </div>
    </Link>
  );
}

export default function NotesIndex() {
  const tl = useL();
  return (
    <section className="px-4 pb-24 pt-[100px] md:px-8 md:pt-[120px]">
      <div className="flex justify-end">
        <p className="text-[12px] font-semibold uppercase text-fg2">
          <span className="text-faint">[</span> {tl(NOTES_PAGE.log)} <span className="text-faint">]</span>
        </p>
      </div>
      <h1 className="font-tek font-semibold uppercase leading-[0.8] tracking-[-0.04em] text-fg" style={{ fontSize: "clamp(96px, 24vw, 360px)" }}>
        Notes
      </h1>
      <p className="mt-10 max-w-[660px] text-[16px] font-medium leading-[1.35] tracking-[-0.03em] text-fg">{tl(NOTES_PAGE.intro)}</p>
      <div className="mt-8 h-1 bg-accent" />
      <div className="mt-6 flex justify-between text-[10px] font-semibold uppercase text-fg2">
        <span>{tl(NOTES_PAGE.newest)}</span>
        <span>[ 2026 ]</span>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-14 md:grid-cols-3">
        {NOTES.map((n, i) => (
          <Reveal key={n.slug} delay={i * 0.06}>
            <NoteCard n={n} big />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
