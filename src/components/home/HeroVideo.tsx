"use client";

import { useEffect, useRef } from "react";

/**
 * Background video for the home hero: fully monochrome, sat behind a heavy
 * black overlay so the centered headline always reads. The cursor
 * interaction now lives in HeroImageTrail, so this layer stays static.
 *
 * Files live in `public/videos/`:
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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      v.pause();
      return;
    }
    v.muted = true;
    v.play().catch(() => undefined);
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-ink">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover grayscale"
      />
      {/* Heavy black wash so the centered copy holds at every viewport. */}
      <div className="pointer-events-none absolute inset-0 bg-black/80" />
    </div>
  );
}
