"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

/**
 * Background video for the home hero with a cursor-following "spotlight"
 * mask. Outside the spotlight the video is dimmed; inside, full brightness.
 *
 * Drop the actual files in `public/videos/`:
 *   - hero.mp4         (H.264, 1920×1080, 24fps, ~3 MB)
 *   - hero.webm        (VP9, optional — Chrome/Firefox fallback)
 *   - hero-poster.jpg  (single frame, WebP/JPG, ~50 KB)
 *
 * On `(hover: none)` devices the spotlight is disabled and the video plays
 * at full brightness. With `prefers-reduced-motion` the video is paused
 * and only the poster is shown.
 */
export default function HeroVideo({
  src = "/videos/hero.mp4",
  webm = "/videos/hero.webm",
  poster = "/videos/hero-poster.jpg",
}: {
  src?: string;
  webm?: string;
  poster?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [interactive, setInteractive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const x = useMotionValue(50);
  const y = useMotionValue(50);
  const sx = useSpring(x, { stiffness: 180, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 180, damping: 26, mass: 0.6 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const supportsHover = window.matchMedia("(hover: hover)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);
    setInteractive(supportsHover && !reduced);

    if (reduced && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  useEffect(() => {
    if (!interactive) return;
    const node = containerRef.current;
    if (!node) return;

    const onMove = (e: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      x.set(((e.clientX - rect.left) / rect.width) * 100);
      y.set(((e.clientY - rect.top) / rect.height) * 100);
    };

    const onLeave = () => {
      // Send the spotlight off-canvas so dimming covers the whole frame.
      x.set(130);
      y.set(130);
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [interactive, x, y]);

  // Mask: transparent center → soft 220px hole → black at 420px (overlay shown).
  const maskImage = useMotionTemplate`radial-gradient(circle at ${sx}% ${sy}%, transparent 0px, transparent 220px, black 420px)`;

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="absolute inset-0 overflow-hidden bg-ink"
    >
      <video
        ref={videoRef}
        poster={poster}
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setLoaded(true)}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out"
        style={{ opacity: loaded ? 1 : 0 }}
      >
        <source src={webm} type="video/webm" />
        <source src={src} type="video/mp4" />
      </video>

      {/* Base dim — always on; keeps text legible even in the spotlight */}
      <div className="pointer-events-none absolute inset-0 bg-ink/30" />

      {/* Spotlight overlay: extra dimming with a hole at the cursor */}
      {interactive && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-ink/55"
          style={{
            maskImage,
            WebkitMaskImage: maskImage,
          }}
        />
      )}

      {/* Bottom fade for headline contrast */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
    </div>
  );
}
