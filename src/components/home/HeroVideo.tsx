"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

/**
 * Background video for the home hero with a cursor-following "spotlight":
 *   • Default state — desaturated (mono) + lightly dimmed
 *   • Inside the spotlight — full color + full brightness
 *
 * Drop these files in `public/videos/`:
 *   - hero.mp4         (H.264, 1920×1080, 24fps)
 *   - hero-poster.webp (single frame, ~50–80 KB)
 */
export default function HeroVideo({
  src = "/videos/hero.mp4",
  poster = "/videos/hero-poster.webp",
}: {
  src?: string;
  poster?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [interactive, setInteractive] = useState(false);
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

    const v = videoRef.current;
    if (!v) return;

    if (reduced) {
      v.pause();
      return;
    }
    v.muted = true;
    v.play().catch(() => undefined);
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

  // transparent center 0–220px → smooth feather → black at 420px (overlay covers)
  const maskImage = useMotionTemplate`radial-gradient(circle at ${sx}% ${sy}%, transparent 0px, transparent 220px, black 420px)`;

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="absolute inset-0 overflow-hidden bg-ink isolate"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Desaturation: drains color from the video. Masked on desktop so the
          cursor hole reveals full color; full-coverage on touch devices. */}
      {interactive ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-ink mix-blend-saturation"
          style={{ maskImage, WebkitMaskImage: maskImage }}
        />
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-ink mix-blend-saturation"
        />
      )}

      {/* Dim layer: extra darkness outside the spotlight (desktop only) */}
      {interactive && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-ink/55"
          style={{ maskImage, WebkitMaskImage: maskImage }}
        />
      )}

      {/* Always-on light wash for text legibility everywhere, including spotlight */}
      <div className="pointer-events-none absolute inset-0 bg-ink/30" />

      {/* Bottom gradient: anchors headline to the bottom edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
    </div>
  );
}
