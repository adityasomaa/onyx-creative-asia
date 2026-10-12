"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";

/**
 * Dotted line drawings for the stat cards: a wireframe cube stack,
 * concentric rings, a target and an open box, each in dots that drift
 * slowly. Pure SVG; the motion is CSS so it costs nothing off screen and
 * stops under prefers-reduced-motion.
 */

type Kind = "cube" | "rings" | "target" | "box";
type P = [number, number];

function dotsOnLine(a: P, b: P, gap = 6): P[] {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.max(2, Math.round(len / gap));
  return Array.from({ length: n + 1 }, (_, i) => [a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n] as P);
}

function dotsOnCircle(cx: number, cy: number, r: number, gap = 7): P[] {
  const n = Math.max(8, Math.round((2 * Math.PI * r) / gap));
  return Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2;
    return [cx + r * Math.cos(t), cy + r * Math.sin(t)] as P;
  });
}

// Isometric projection of a 3D point.
const iso = (x: number, y: number, z: number, ox = 145, oy = 150, s = 1): P => [
  ox + (x - z) * 0.866 * s,
  oy + (x + z) * 0.5 * s - y * s,
];

function boxEdges(x: number, y: number, z: number, w: number, h: number, d: number): [P, P][] {
  const c = (a: number, b: number, e: number) => iso(x + a, y + b, z + e);
  const v = [c(0, 0, 0), c(w, 0, 0), c(w, 0, d), c(0, 0, d), c(0, h, 0), c(w, h, 0), c(w, h, d), c(0, h, d)];
  const e: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  return e.map(([a, b]) => [v[a], v[b]]);
}

export default function DotArt({ kind, className }: { kind: Kind; className?: string }) {
  const groups = useMemo(() => {
    if (kind === "rings") return [dotsOnCircle(145, 130, 88, 8), dotsOnCircle(145, 130, 58, 7), dotsOnCircle(145, 130, 30, 6), [[145, 130] as P]];
    if (kind === "target") return [dotsOnCircle(145, 130, 92, 9), dotsOnCircle(145, 130, 54, 6), dotsOnCircle(145, 130, 26, 5), [[145, 130] as P]];
    if (kind === "box") return [boxEdges(-55, -45, -55, 110, 95, 110).flatMap(([a, b]) => dotsOnLine(a, b, 9))];
    // cube: a tall column and a stack of three small cubes beside it
    return [
      boxEdges(-90, -40, -10, 34, 120, 34).flatMap(([a, b]) => dotsOnLine(a, b, 6)),
      boxEdges(-30, -40, -10, 34, 34, 34).flatMap(([a, b]) => dotsOnLine(a, b, 6)),
      boxEdges(10, -40, -10, 34, 34, 34).flatMap(([a, b]) => dotsOnLine(a, b, 6)),
      boxEdges(-10, -6, -10, 34, 34, 34).flatMap(([a, b]) => dotsOnLine(a, b, 6)),
    ];
  }, [kind]);

  return (
    <svg viewBox="0 0 290 262" className={cn("h-full w-full", className)} aria-hidden>
      {groups.map((g, gi) => (
        <g
          key={gi}
          className="origin-[145px_130px] motion-safe:animate-[dotdrift_9s_ease-in-out_infinite]"
          style={{ animationDelay: `${gi * -1.7}s` }}
        >
          {g.map(([x, y], i) => (
            <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={kind === "box" ? 1.05 : 0.95} fill="#262626" opacity={0.75} />
          ))}
        </g>
      ))}
    </svg>
  );
}
