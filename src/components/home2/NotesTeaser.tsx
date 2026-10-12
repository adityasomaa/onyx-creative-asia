"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useL } from "@/lib/i18n";
import { NOTES_TEASER } from "@/lib/copy";
import { NOTES } from "@/lib/notes";
import { Bracket } from "@/components/site/SectionHeader";
import CutButton from "@/components/site/CutButton";

/**
 * Giant "NOTES" with the posts' covers drifting around it at different
 * scroll speeds, then the call to read them. The reference's blog teaser.
 */
const SPOTS = [
  { x: "4%", y: "18%", w: "18%", speed: -60 },
  { x: "76%", y: "30%", w: "15%", speed: 90 },
  { x: "60%", y: "64%", w: "14%", speed: -120 },
];

function Floater({ i }: { i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [SPOTS[i].speed, -SPOTS[i].speed]);
  const n = NOTES[i];
  const tl = useL();
  if (!n) return null;
  return (
    <motion.div ref={ref} style={{ y, left: SPOTS[i].x, top: SPOTS[i].y, width: SPOTS[i].w }} className="absolute hidden md:block">
      <Link href={`/notes/${n.slug}`} className="group block">
        <span className="relative block aspect-[4/3] overflow-hidden bg-paper">
          <Image src={n.cover} alt="" fill sizes="20vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        </span>
        <span className="mt-2 block text-[10px] font-semibold uppercase leading-tight text-fg2">{tl(n.title)}</span>
      </Link>
    </motion.div>
  );
}

export default function NotesTeaser() {
  const tl = useL();
  return (
    <section className="relative z-10 overflow-hidden bg-white pb-20 pt-10 md:pb-28">
      <div className="relative mx-auto min-h-[520px] max-w-[1440px] px-4 md:min-h-[640px] md:px-8">
        {SPOTS.map((_, i) => (
          <Floater key={i} i={i} />
        ))}
        <div className="relative flex flex-col items-center pt-10 md:pt-24">
          <Bracket v={NOTES_TEASER.question} className="md:self-end" />
          <h2 className="pointer-events-none mt-6 font-tek font-semibold uppercase leading-[0.8] tracking-[-0.04em] text-night" style={{ fontSize: "clamp(110px, 21vw, 300px)" }}>
            Notes
          </h2>
          <p className="mt-10 max-w-[420px] text-center text-[12px] font-semibold uppercase leading-[1.25] tracking-[-0.02em] text-fg2">{tl(NOTES_TEASER.body)}</p>
          <div className="mt-6 w-full max-w-[260px]">
            <CutButton href="/notes" label={NOTES_TEASER.cta} size="md" />
          </div>
        </div>
      </div>
    </section>
  );
}
