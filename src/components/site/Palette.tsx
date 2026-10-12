"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useL } from "@/lib/i18n";
import { UI } from "@/lib/copy";
import { cn } from "@/lib/cn";
import { ORIGINAL_ACCENT, SWATCHES, useAccent } from "./Accent";

/**
 * The accent picker: five swatches, a custom colour, and a reset, in a
 * small dark card under the nav. Same feature set as the reference.
 */
export default function Palette({ open, onClose, hint }: { open: boolean; onClose: () => void; hint?: boolean }) {
  const tl = useL();
  const { accent, setAccent, reset } = useAccent();
  const input = useRef<HTMLInputElement>(null);

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
          className="absolute right-3 top-[78px] z-10 w-[232px] origin-top-right rounded-xl bg-coal p-5 text-white shadow-[0_24px_60px_-18px_rgba(0,0,0,0.55)] md:right-auto md:left-[calc(100%-150px)]"
          onKeyDown={(e) => e.key === "Escape" && onClose()}
        >
          {hint && (
            <svg viewBox="0 0 60 50" className="pointer-events-none absolute -top-[46px] right-[34px] h-[46px] w-[56px] text-white/80" aria-hidden>
              <path d="M8 46C6 26 18 10 46 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M40 3l7 5-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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

          <button
            type="button"
            onClick={() => input.current?.click()}
            className="mt-5 flex w-full items-center gap-3 text-left"
          >
            <span
              className="h-6 w-6 shrink-0 rounded-full"
              style={{ background: "conic-gradient(#ff6b6b, #ffd93d, #6bff95, #6bd5ff, #b06bff, #ff6b6b)" }}
            />
            <span className="flex flex-col">
              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">{tl(UI.accentCustom)}</span>
              <span className="text-[13px] font-medium lowercase tabular-nums">{accent.toLowerCase()}</span>
            </span>
            <input
              ref={input}
              type="color"
              value={accent.toLowerCase()}
              onChange={(e) => setAccent(e.target.value)}
              className="sr-only"
              tabIndex={-1}
              aria-label={tl(UI.accentCustom)}
            />
          </button>

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
