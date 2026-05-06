"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Renders a project cover. If `loop` is provided, plays the video on top of
 * the poster; otherwise shows the still image only.
 *
 * Both are treated identically by the brand:
 *   - default state: grayscale + slight contrast bump (Black Box treatment)
 *   - hovering the parent .group element: smoothly transitions to full color
 *
 * Video is paused when offscreen (IntersectionObserver) so we don't burn
 * cycles for cards the user can't see.
 */
export default function ProjectCover({
  src,
  loop,
  alt,
  sizes,
  priority = false,
  className,
}: {
  src: string;
  loop?: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Pause when off-screen; resume when on-screen. Saves CPU/GPU on long pages.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) v.play().catch(() => undefined);
          else v.pause();
        }
      },
      { threshold: 0.05 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={90}
        className={cn(
          "object-cover grayscale contrast-[1.05] transition-[filter,transform] duration-[1200ms] ease-out-expo group-hover:grayscale-0 group-hover:scale-[1.04]",
          className
        )}
      />
      {loop && (
        <video
          ref={videoRef}
          src={loop}
          poster={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          onCanPlay={() => setLoaded(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover grayscale contrast-[1.05] transition-[opacity,filter,transform] duration-[1200ms] ease-out-expo group-hover:grayscale-0 group-hover:scale-[1.04]",
            loaded ? "opacity-100" : "opacity-0",
            className
          )}
        />
      )}
    </>
  );
}
