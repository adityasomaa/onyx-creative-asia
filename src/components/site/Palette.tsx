"use client";

import { useLayoutEffect, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useL } from "@/lib/i18n";
import { UI } from "@/lib/copy";
import { cn } from "@/lib/cn";
import { ORIGINAL_ACCENT, SWATCHES, useAccent } from "./Accent";

/**
 * The accent picker: six swatches, a custom colour, and a reset, in a
 * small dark card under the nav. Same feature set as the reference.
 *
 * It is placed from the real position of the accent dot (`anchor`), which
 * moves as the nav widens and narrows, so the first-visit arrow lands on
 * the dot at every width. The custom colour is the native picker laid over
 * its row: a direct tap on the input is what phones require to open it.
 */

const WIDTH = 232;
const TOP = 78;
const EDGE = 12;

export default function Palette({
  open,
  onClose,
  hint,
  anchor,
  container,
}: {
  open: boolean;
  onClose: () => void;
  hint?: boolean;
  anchor: RefObject<HTMLElement | null>;
  container: RefObject<HTMLElement | null>;
}) {
  const tl = useL();
  const { accent, setAccent, reset } = useAccent();
  const [place, setPlace] = useState<{ left: number; dotX: number; tipY: number } | null>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const measure = () => {
      const a = anchor.current?.getBoundingClientRect();
      const c = container.current?.getBoundingClientRect();
      if (!a || !c) return;
      const dotCx = a.left + a.width / 2;
      // Keep the dot near the card's right edge, and the card on screen.
      const left = Math.min(Math.max(dotCx - WIDTH + 44, EDGE), window.innerWidth - WIDTH - EDGE) - c.left;
      setPlace({ left, dotX: dotCx - c.left - left, tipY: a.bottom - c.top - TOP + 2 });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (container.current) ro.observe(container.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [open, anchor, container]);

  const rise = place ? -place.tipY : 30;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label={tl(UI.accentTitle)}
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="absolute z-10 origin-top-right rounded-xl bg-coal p-5 text-white shadow-[0_24px_60px_-18px_rgba(0,0,0,0.55)]"
          style={{ top: TOP, width: WIDTH, left: place?.left ?? undefined, right: place ? undefined : EDGE, visibility: place ? "visible" : "hidden" }}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
        >
          {hint && place && (
            // A short curve from the card up to the dot, tip exactly under its centre.
            <svg
              className="pointer-events-none absolute text-white/85"
              style={{ left: place.dotX - 34, top: -rise, width: 40, height: rise }}
              viewBox={`0 0 40 ${rise}`}
              aria-hidden
            >
              <path d={`M6 ${rise}C6 ${rise * 0.45} 18 6 34 2`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M27 0.5L34 2L30.5 8.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <p className="text-center text-[15px] font-semibold tracking-[-0.02em]">{tl(UI.accentTitle)}</p>
          <p className="mx-auto mt-1.5 max-w-[170px] text-center text-[11px] leading-[1.35] text-white/55">{tl(UI.accentBody)}</p>

          <div className="mt-5 flex items-center justify-between">
            {SWATCHES.map((hex) => (
              <button
                key={hex}
                type="button"
                aria-label={hex}
                aria-pressed={accent === hex}
                onClick={() => setAccent(hex)}
                className={cn(
                  "h-6 w-6 rounded-full transition-transform duration-200 hover:scale-110",
                  accent === hex && "ring-2 ring-white/70 ring-offset-2 ring-offset-coal",
                )}
                style={{ background: hex }}
              />
            ))}
          </div>

          <label className="relative mt-5 flex w-full cursor-pointer items-center gap-3 text-left">
            <span
              className="h-6 w-6 shrink-0 rounded-full"
              style={{ background: "conic-gradient(#ff6b6b, #ffd93d, #6bff95, #6bd5ff, #b06bff, #ff6b6b)" }}
            />
            <span className="flex flex-col">
              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">{tl(UI.accentCustom)}</span>
              <span className="text-[13px] font-medium lowercase tabular-nums">{accent.toLowerCase()}</span>
            </span>
            <input
              type="color"
              value={accent.toLowerCase()}
              onChange={(e) => setAccent(e.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label={tl(UI.accentCustom)}
            />
          </label>

          <button
            type="button"
            onClick={reset}
            disabled={accent === ORIGINAL_ACCENT}
            className="mt-5 w-full rounded-md bg-white/10 py-2 text-[12px] font-medium transition-colors hover:bg-white/15 disabled:opacity-50"
          >
            {tl(UI.accentReset)}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
