"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { SCENES, type Pal, type SceneId } from "./scenes";
import { ACCENT_EVENT } from "../Accent";

/**
 * A looping motion graphic (see scenes.ts) on a canvas that fills its own
 * box. Size it with className like an image.
 *
 * It only draws while on screen, and gives its pixels back when it leaves
 * (a hero has five of these). Colours follow the visitor's accent: the true
 * accent on the dark theme, the light-surface version on the light one.
 * Under reduced motion it draws a single still frame.
 */

const ORDER = Object.keys(SCENES) as SceneId[];

function triplet(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return (v || fallback).split(/\s+/).join(",");
}

function palette(theme: "dark" | "light", bare: boolean): Pal {
  const dark = theme === "dark";
  const fg = dark ? "255,255,255" : "14,14,14";
  const ac = triplet(dark ? "--accent" : "--accent-light", dark ? "255 255 255" : "14 14 14");
  const ink = triplet(dark ? "--accent-ink" : "--accent-light-ink", dark ? "14 14 14" : "255 255 255");
  return {
    fg: (a) => `rgba(${fg},${a})`,
    ac: (a) => `rgba(${ac},${a})`,
    ink: (a) => `rgba(${ink},${a})`,
    // Bare: drawn over another background, so panels become dark glass.
    bg: bare ? "rgba(8,8,10,0.55)" : dark ? "#111111" : "#F4F4F4",
    clear: bare,
  };
}

export default function ServiceArt({
  id,
  theme = "dark",
  bare = false,
  className,
}: {
  id: SceneId;
  theme?: "dark" | "light";
  /** No background of its own, for layering over another one. */
  bare?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const scene = SCENES[id];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Each scene starts at its own point in its loop so a row of them
    // does not move in lockstep.
    const offset = ORDER.indexOf(id) * 1.37;
    let raf = 0;
    let visible = false;
    let w = 0;
    let h = 0;
    let pal = palette(theme, bare);
    const t0 = performance.now();

    const alloc = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = Math.max(1, Math.round(w * dpr));
      const H = Math.max(1, Math.round(h * dpr));
      if (cv.width !== W || cv.height !== H) {
        cv.width = W;
        cv.height = H;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      if (!visible || !w || !h) return;
      scene(ctx, w, h, reduce ? 2.6 + offset : (now - t0) / 1000 + offset, pal);
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      alloc();
      raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(([entry]) => {
      w = entry.contentRect.width;
      h = entry.contentRect.height;
      if (visible) start();
    });
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else {
        cancelAnimationFrame(raf);
        cv.width = 1;
        cv.height = 1;
      }
    });
    // Recolour on the accent event, the same frame the CSS changes.
    const onAccent = () => {
      pal = palette(theme, bare);
      if (reduce && visible) start();
    };
    window.addEventListener(ACCENT_EVENT, onAccent);
    ro.observe(cv);
    io.observe(cv);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener(ACCENT_EVENT, onAccent);
    };
  }, [id, theme, bare]);

  return <canvas ref={ref} aria-hidden className={cn("block", className)} />;
}
