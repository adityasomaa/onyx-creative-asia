"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useIntroState, markIntroShown } from "@/lib/intro";

const EASE = [0.76, 0, 0.24, 1] as const;

export default function Loader() {
  const introState = useIntroState();
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (introState === null) return;
    if (introState === false) {
      document.body.style.overflow = "";
      return;
    }
    markIntroShown();
    setShow(true);
  }, [introState]);

  useEffect(() => {
    if (!show) return;

    let raf = 0;
    const start = performance.now();
    const duration = 2200;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * 100));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setShow(false), 350);
      }
    };

    raf = requestAnimationFrame(tick);

    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, [show]);

  useEffect(() => {
    if (!show) document.body.style.overflow = "";
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.1, ease: EASE }}
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-ink text-bone"
        >
          {/* Top bar */}
          <div className="container-x flex items-center justify-between pt-6 md:pt-8 text-xs uppercase tracking-[0.2em]">
            <span>Onyx Creative Asia</span>
            <span className="hidden md:inline">EST. 2025 — Asia</span>
          </div>

          {/* Center wordmark */}
          <div className="container-x flex items-center justify-center flex-1">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
                className="text-display-md font-medium leading-none text-balance text-center"
              >
                Onyx<span className="font-light italic"> Creative</span>
              </motion.h1>
            </div>
          </div>

          {/* Bottom row: progress + counter */}
          <div className="container-x pb-6 md:pb-8">
            <div className="flex items-end justify-between">
              <div className="text-xs uppercase tracking-[0.2em] opacity-70">
                Loading experience
              </div>
              <div className="font-medium tabular-nums text-2xl md:text-3xl">
                {String(count).padStart(3, "0")}
              </div>
            </div>
            <div className="mt-4 h-px w-full bg-bone/15 overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: count / 100 }}
                transition={{ ease: "linear" }}
                style={{ originX: 0 }}
                className="h-full w-full bg-bone"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
