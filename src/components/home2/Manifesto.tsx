"use client";

import { Fragment, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useReduce } from "@/components/site/useReduce";
import { useL } from "@/lib/i18n";
import { MANIFESTO } from "@/lib/copy";
import { Marked } from "@/components/site/Headline";

/**
 * Three statements, one sticky viewport. Scroll drives an accent panel
 * across from the left, swaps the statement at each third, and fills each
 * highlighted run in reading order within its third — so the line you
 * are on is the line being marked.
 */

function Filling({ text, q }: { text: string; q: number }) {
  const parts = text.split("*");
  const marks = parts.filter((_, i) => i % 2 === 1).length || 1;
  let k = -1;
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
        k += 1;
        const start = (k / marks) * 0.8;
        const fill = Math.max(0, Math.min(1, (q - start) / (0.8 / marks)));
        return (
          <span
            key={i}
            className="px-[0.08em] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
            style={{
              backgroundImage: "linear-gradient(#262626,#262626)",
              backgroundRepeat: "no-repeat",
              backgroundSize: `${fill * 100}% 100%`,
              color: fill > 0.55 ? "rgb(var(--accent))" : undefined,
              transition: "color .2s",
            }}
          >
            {part}
          </span>
        );
      })}
    </>
  );
}

export default function Manifesto() {
  const tl = useL();
  const reduce = useReduce();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const panel = useTransform(scrollYProgress, [0, 0.95], ["0%", "100%"]);
  const [state, setState] = useState({ scene: 0, q: 0 });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const v = Math.min(0.9999, Math.max(0, p)) * MANIFESTO.length;
    const scene = Math.floor(v);
    setState({ scene, q: v - scene });
  });

  if (reduce) {
    return (
      <section className="relative z-10 flex flex-col gap-24 bg-paper px-4 py-32 text-center md:px-8">
        {MANIFESTO.map((m) => (
          <div key={m.kicker.en}>
            <p className="text-[20px] font-medium uppercase tracking-[-0.03em] text-fg2">{tl(m.kicker)}</p>
            <p className="mx-auto mt-8 max-w-[18ch] font-tek text-[40px] font-medium uppercase leading-[1.1] text-fg md:text-[72px]">
              <Marked text={tl(m.text)} />
            </p>
          </div>
        ))}
      </section>
    );
  }

  const m = MANIFESTO[state.scene];
  return (
    <section ref={ref} className="relative z-10 bg-paper" style={{ height: `${MANIFESTO.length * 110 + 40}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="absolute inset-y-0 left-0 bg-accent" style={{ width: panel }} />
        <div className="relative flex h-full flex-col px-4 pb-16 pt-24 md:px-8 md:pt-28">
          <motion.p
            key={`k-${state.scene}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={state.scene === 2 ? "self-end text-[16px] font-medium uppercase tracking-[-0.03em] text-fg md:text-[20px]" : "text-[16px] font-medium uppercase tracking-[-0.03em] text-fg2 md:pl-[14vw] md:text-[20px]"}
          >
            {tl(m.kicker)}
          </motion.p>
          <div className="flex flex-1 items-center justify-center">
            <motion.p
              key={`t-${state.scene}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[16ch] text-center font-tek text-[clamp(38px,6.4vw,92px)] font-medium uppercase leading-[1.06] tracking-[-0.02em] text-fg"
            >
              <Filling text={tl(m.text)} q={state.q} />
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
