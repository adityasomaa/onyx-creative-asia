"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useL } from "@/lib/i18n";
import { SHOWREEL } from "@/lib/copy";
import { PROJECTS } from "@/lib/data";
import CutButton from "@/components/site/CutButton";
import Wordmark from "@/components/site/Wordmark";
import SilkAurora from "@/components/site/art/SilkAurora";

// The in-place loop uses the lighter card-size file; the player uses HD.
const WITH_PREVIEW = PROJECTS.filter((p) => p.preview);
const REEL = WITH_PREVIEW.map((p) => ({ src: p.preview!.video, poster: p.cover, client: p.client }));

/**
 * Full-height dark showreel. In place, the silk aurora (coloured by the
 * visitor's accent) moves behind the question; "View works" opens a
 * full-screen player that runs every project loop back to back.
 */
export default function Showreel() {
  const tl = useL();
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const player = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;
    const l = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    l?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      l?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) player.current?.play().catch(() => {});
  }, [open, i]);

  return (
    <section className="relative z-10 h-[100svh] min-h-[620px] overflow-hidden bg-night text-white">
      <SilkAurora seed={6} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="relative flex h-full flex-col justify-between px-4 pb-10 pt-24 md:px-8 md:pb-20 md:pt-20">
        <div className="flex items-start justify-between gap-6">
          <p className="pl-0 text-[16px] font-medium tracking-[-0.03em] md:pl-[420px] md:text-[20px]">{tl(SHOWREEL.label)}</p>
          <Wordmark className="hidden text-[26px] text-white md:inline-flex" />
        </div>
        <div className="flex flex-col gap-3">
          <p className="max-w-[520px] text-[26px] font-medium leading-[1.1] tracking-[-0.03em] md:text-[32px]">{tl(SHOWREEL.question)}</p>
          <div className="w-full max-w-[540px]">
            <CutButton label={SHOWREEL.cta} meta={SHOWREEL.ctaMeta} onClick={() => { setI(0); setOpen(true); }} className="h-[88px] md:h-[112px]" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal
            aria-label={tl(SHOWREEL.label)}
            className="fixed inset-0 z-[260] flex items-center justify-center bg-night"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <video
              key={i}
              ref={player}
              className="h-full w-full object-contain"
              src={REEL[i]?.src}
              poster={REEL[i]?.poster}
              muted
              playsInline
              autoPlay
              onEnded={() => setI((n) => (n + 1) % REEL.length)}
            />
            <p className="absolute bottom-6 left-6 font-tek text-[18px] font-medium uppercase md:text-[22px]">
              {String(i + 1).padStart(2, "0")} / {String(REEL.length).padStart(2, "0")} — {REEL[i]?.client}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={tl(SHOWREEL.close)}
              className="absolute right-4 top-4 grid h-14 w-14 place-items-center bg-accent text-accent-ink md:right-8 md:top-8"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden>
                <path d="M3 3l14 14M17 3L3 17" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
