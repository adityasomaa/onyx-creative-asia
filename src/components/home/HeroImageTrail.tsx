"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const EASE = [0.25, 1, 0.5, 1] as const;
/** Pointer travel (px) between drops. Lower = denser trail. */
const STEP = 70;
/** How long each image stays before it fades out (ms). */
const LIFETIME = 950;
/** Hard cap on simultaneous images. */
const MAX_LIVE = 8;
/** Resting opacity of each trailing image. */
const TRAIL_OPACITY = 0.3;

type Drop = { id: number; x: number; y: number; src: string };

/**
 * Project screenshots that follow the cursor across the hero.
 *
 * Moving the pointer drops the next image in the list every STEP pixels of
 * travel, then fades it out. Images cycle through the project list, so
 * swapping in real client screenshots (the `cover` on each project)
 * updates this automatically.
 *
 * Skipped entirely on touch devices and for reduced-motion users.
 */
export default function HeroImageTrail({ images }: { images: string[] }) {
  const boundsRef = useRef<HTMLDivElement>(null);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [enabled, setEnabled] = useState(false);

  const last = useRef<{ x: number; y: number } | null>(null);
  const nextImage = useRef(0);
  const nextId = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hover = window.matchMedia("(hover: hover)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(hover && !reduced && images.length > 0);
  }, [images.length]);

  useEffect(() => {
    // Clear any pending fade-out timers on unmount.
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    if (!enabled) return;

    function onMove(e: PointerEvent) {
      const node = boundsRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Only trail while the pointer is actually over the hero.
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      const prev = last.current;
      if (prev && Math.hypot(x - prev.x, y - prev.y) < STEP) return;
      last.current = { x, y };

      const src = images[nextImage.current % images.length];
      nextImage.current += 1;
      const id = nextId.current++;

      setDrops((cur) => [...cur.slice(-(MAX_LIVE - 1)), { id, x, y, src }]);
      const t = window.setTimeout(() => {
        setDrops((cur) => cur.filter((d) => d.id !== id));
      }, LIFETIME);
      timers.current.push(t);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, images]);

  return (
    <div
      ref={boundsRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
    >
      <AnimatePresence>
        {drops.map((d) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: TRAIL_OPACITY, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ left: d.x, top: d.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative h-[110px] w-[180px] overflow-hidden md:h-[150px] md:w-[250px]">
              <Image
                src={d.src}
                alt=""
                fill
                sizes="250px"
                className="object-cover"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
