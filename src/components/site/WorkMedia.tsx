"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Project } from "@/lib/data";
import { cn } from "@/lib/cn";
import ServiceArt from "./art/ServiceArt";

/**
 * A project's moving preview: the scroll-through of its live site in a
 * browser + phone frame (16:10 on #F4F4F4), or, for work without a public
 * site, its motion graphic. The poster shows until the video can play; the
 * video only plays while on screen, and never under reduced motion.
 *
 * Fills its parent; give the parent the 16:10 box.
 */
export default function WorkMedia({
  project: p,
  size = "card",
  fit = "cover",
  sizes = "50vw",
  priority,
  className,
}: {
  project: Project;
  size?: "card" | "hd";
  /** "contain" for boxes that are not 16:10: the frame's flat #F4F4F4
   *  edge meets a bg-paper parent, so the letterbox does not show. */
  fit?: "cover" | "contain";
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const src = p.preview ? (size === "hd" ? p.preview.video : p.preview.card) : undefined;

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  if (p.art) return <ServiceArt id={p.art} theme="light" className={cn("absolute inset-0 h-full w-full", className)} />;

  return (
    <>
      <Image src={p.cover} alt={p.client} fill sizes={sizes} priority={priority} className={cn(fit === "contain" ? "object-contain" : "object-cover", className)} />
      {src && <video ref={ref} src={src} poster={p.cover} muted loop playsInline preload="none" aria-hidden className={cn("absolute inset-0 h-full w-full", fit === "contain" ? "object-contain" : "object-cover", className)} />}
    </>
  );
}
