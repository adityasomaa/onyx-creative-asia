"use client";

import Image from "next/image";
import Link from "next/link";
import { useL, useLocale } from "@/lib/i18n";
import { NOTES_PAGE, UI } from "@/lib/copy";
import { NOTES, NOTE_AUTHOR, formatDate, type Note } from "@/lib/notes";
import { Bracket } from "@/components/site/SectionHeader";
import { NoteCard } from "./NotesIndex";

export default function NoteArticle({ note: n }: { note: Note }) {
  const tl = useL();
  const { locale } = useLocale();
  const others = NOTES.filter((x) => x.slug !== n.slug);

  return (
    <article>
      <header className="px-4 pb-10 pt-[100px] md:px-8 md:pt-[120px]">
        <div className="border-b-2 border-rule pb-2.5 text-[12px] font-semibold uppercase text-fg">
          <Link href="/notes" className="hover:text-fg2">
            {tl(UI.allNotes)}
          </Link>
        </div>
        <h1 className="mt-8 max-w-[22ch] font-tek text-[36px] font-medium uppercase leading-[1] tracking-[-0.02em] text-fg md:text-[64px]">
          {tl(n.title)}
        </h1>
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[620px] text-[16px] font-medium leading-[1.35] tracking-[-0.03em] text-mute md:text-[18px]">{tl(n.dek)}</p>
          <p className="text-[11px] font-semibold uppercase text-fg md:text-right">
            {formatDate(n.date, locale)}
            <br />
            <span className="text-mute">
              {n.minutes} {tl(UI.minRead)}
            </span>
          </p>
        </div>
      </header>

      <div className="relative h-[46vh] min-h-[300px] overflow-hidden bg-paper md:h-[72vh]">
        <Image src={n.cover} alt="" fill priority sizes="100vw" className="object-cover" />
      </div>

      <div className="grid grid-cols-1 gap-10 px-4 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:px-8 md:py-24">
        <aside className="md:sticky md:top-28 md:self-start">
          <p className="text-[16px] font-medium tracking-[-0.03em] text-fg">{tl(NOTE_AUTHOR)}</p>
          <p className="text-[11px] font-semibold uppercase text-mute">Bali, Indonesia</p>
          <dl className="mt-8 max-w-[300px] border-t border-rule text-[11px] font-semibold uppercase">
            <div className="flex justify-between border-b border-rule py-3">
              <dt className="text-mute">{tl(NOTES_PAGE.published)}</dt>
              <dd className="text-fg">{formatDate(n.date, locale)}</dd>
            </div>
            <div className="flex justify-between border-b border-rule py-3">
              <dt className="text-mute">{tl(NOTES_PAGE.reading)}</dt>
              <dd className="text-fg">
                {n.minutes} {tl(UI.minRead)}
              </dd>
            </div>
          </dl>
          <Link href="/notes" className="mt-6 inline-block text-[11px] font-semibold uppercase text-fg hover:text-fg2">
            › {tl(UI.allNotes)}
          </Link>
        </aside>

        <div className="max-w-[720px] text-[17px] font-medium leading-[1.55] tracking-[-0.03em] text-fg md:text-[18px]">
          {n.blocks.map((b, i) => {
            if (b.kind === "h")
              return (
                <h2 key={i} className="mb-5 mt-14 font-tek text-[26px] font-medium uppercase leading-[1.1] text-fg first:mt-0 md:text-[32px]">
                  {tl(b.text)}
                </h2>
              );
            if (b.kind === "quote")
              return (
                <blockquote key={i} className="my-12 border-l-[3px] border-accent pl-6 font-tek text-[22px] font-medium uppercase leading-[1.2] text-fg md:text-[28px]">
                  {tl(b.text)}
                </blockquote>
              );
            if (b.kind === "list")
              return (
                <ul key={i} className="my-6 flex flex-col gap-3">
                  {b.items.map((it, j) => (
                    <li key={j} className="flex gap-3 text-fg2">
                      <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 bg-accent" />
                      {tl(it)}
                    </li>
                  ))}
                </ul>
              );
            return (
              <p key={i} className="mb-5 text-fg2 first:text-fg">
                {tl(b.text)}
              </p>
            );
          })}
        </div>
      </div>

      <section className="border-t border-rule px-4 pb-24 pt-10 md:px-8">
        <div className="flex items-center justify-between">
          <Bracket v={UI.moreNotes} className="text-[11px]" />
          <Link href="/notes" className="text-[11px] font-semibold uppercase text-fg hover:text-fg2">
            › {tl(UI.allNotes)}
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-12 md:grid-cols-3">
          {others.map((o) => (
            <NoteCard key={o.slug} n={o} />
          ))}
        </div>
      </section>
    </article>
  );
}
