"use client";

/**
 * Nodes on a dot grid, joined by right-angled traces with pulses of
 * "electricity" running along them.
 *
 * Adapted from componentry.dev "circuit-board"
 * (MIT License, Copyright (c) 2026 Harsh Jadhav).
 *
 * Changes for Onyx:
 *   - one `color` prop drives grid, traces, pulses and nodes, replacing
 *     light/dark auto-detection (three MutationObservers and a media
 *     query) on a site that has no theme switch
 *   - SVG ids are unique per instance. The original hardcoded "glow" and
 *     "circuitGrid", so two boards on one page resolved each other's
 *     filters
 *   - prefers-reduced-motion draws the board still: no pulses, no draw-in
 *   - `background` fills the nodes so traces end at the node edge rather
 *     than showing through it
 *   - dropped the unused CircuitPattern / CircuitNode / CircuitTrace
 *     exports and the per-connection gradients nothing referenced
 */

import { useId, useMemo, type HTMLAttributes, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

export type CircuitNode = {
  id: string;
  x: number;
  y: number;
  label?: string;
  icon?: ReactNode;
  size?: "sm" | "md" | "lg";
  /** Breathing fill, for the step that is doing the work. */
  processing?: boolean;
};

export type CircuitConnection = {
  from: string;
  to: string;
  animated?: boolean;
  bidirectional?: boolean;
};

const NODE_SIZE = { sm: 24, md: 36, lg: 48 } as const;

/** Approximate trace length the dash pattern is tuned for. */
const PATH_LENGTH = 500;

function rgba(hex: string, alpha: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/** Right-angled path between two node edges: the longer axis goes first. */
function tracePath(from: CircuitNode, to: CircuitNode) {
  const fromR = NODE_SIZE[from.size ?? "md"] / 2 + 4;
  const toR = NODE_SIZE[to.size ?? "md"] / 2 + 4;
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    const startX = from.x + (dx > 0 ? fromR : -fromR);
    const endX = to.x + (dx > 0 ? -toR : toR);
    const midX = from.x + dx / 2;
    return `M ${startX} ${from.y} H ${midX} V ${to.y} H ${endX}`;
  }
  const startY = from.y + (dy > 0 ? fromR : -fromR);
  const endY = to.y + (dy > 0 ? -toR : toR);
  const midY = from.y + dy / 2;
  return `M ${from.x} ${startY} V ${midY} H ${to.x} V ${endY}`;
}

export type CircuitBoardProps = HTMLAttributes<HTMLDivElement> & {
  nodes: CircuitNode[];
  connections: CircuitConnection[];
  width?: number;
  height?: number;
  gridSize?: number;
  showGrid?: boolean;
  /** Hex colour everything is drawn in, at varying opacity. */
  color?: string;
  /** Node fill. Match the section background. */
  background?: string;
  /** Seconds for one pulse to travel a trace. */
  pulseSpeed?: number;
  traceWidth?: number;
};

export default function CircuitBoard({
  nodes,
  connections,
  width = 600,
  height = 400,
  gridSize = 20,
  showGrid = true,
  color = "#0E0E0E",
  background = "transparent",
  pulseSpeed = 2,
  traceWidth = 2,
  className,
  style,
  ...props
}: CircuitBoardProps) {
  const reduced = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const glowId = `cb-glow-${uid}`;
  const gridId = `cb-grid-${uid}`;

  const gridColor = rgba(color, 0.16);
  const traceColor = rgba(color, 0.28);
  const pulseColor = rgba(color, 0.95);
  const nodeColor = rgba(color, 0.85);

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <div
      className={cn("relative", className)}
      style={{ width, height, ...style }}
      {...props}
    >
      <svg
        width={width}
        height={height}
        className="absolute inset-0 overflow-visible"
        aria-hidden
      >
        <defs>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {showGrid && (
            <pattern id={gridId} width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
              <circle cx={gridSize / 2} cy={gridSize / 2} r="0.75" fill={gridColor} />
            </pattern>
          )}
        </defs>

        {showGrid && <rect width={width} height={height} fill={`url(#${gridId})`} />}

        {connections.map((conn, i) => {
          const from = nodeMap.get(conn.from);
          const to = nodeMap.get(conn.to);
          if (!from || !to) return null;
          const d = tracePath(from, to);
          const dash = `${PATH_LENGTH * 0.1} ${PATH_LENGTH * 0.9}`;

          return (
            <g key={`${conn.from}-${conn.to}`}>
              <motion.path
                d={d}
                fill="none"
                stroke={traceColor}
                strokeWidth={traceWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduced ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: i * 0.2 }}
              />
              {!reduced && conn.animated !== false && (
                <motion.path
                  d={d}
                  fill="none"
                  stroke={pulseColor}
                  strokeWidth={traceWidth + 1}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter={`url(#${glowId})`}
                  strokeDasharray={dash}
                  initial={{ strokeDashoffset: PATH_LENGTH }}
                  animate={{ strokeDashoffset: -PATH_LENGTH }}
                  transition={{ duration: pulseSpeed, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
                />
              )}
              {!reduced && conn.bidirectional && (
                <motion.path
                  d={d}
                  fill="none"
                  stroke={pulseColor}
                  strokeWidth={traceWidth + 1}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter={`url(#${glowId})`}
                  strokeDasharray={dash}
                  initial={{ strokeDashoffset: -PATH_LENGTH }}
                  animate={{ strokeDashoffset: PATH_LENGTH }}
                  transition={{
                    duration: pulseSpeed,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.3 + pulseSpeed / 2,
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {nodes.map((node, i) => {
        const size = NODE_SIZE[node.size ?? "md"];
        return (
          <motion.div
            key={node.id}
            className="absolute flex items-center justify-center"
            style={{ left: node.x - size / 2, top: node.y - size / 2, width: size, height: size }}
            initial={reduced ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 + 0.5, type: "spring" }}
          >
            <div className="absolute inset-0 rounded-lg" style={{ backgroundColor: background }} />
            <motion.div
              className="absolute inset-0 rounded-lg"
              style={{ backgroundColor: nodeColor }}
              animate={node.processing && !reduced ? { opacity: [0.08, 0.28, 0.08] } : { opacity: 0.1 }}
              transition={node.processing && !reduced ? { duration: 1.6, repeat: Infinity } : undefined}
            />
            <div className="absolute inset-0 rounded-lg border" style={{ borderColor: nodeColor }} />
            {node.icon && (
              <div className="relative z-10" style={{ color: nodeColor }}>
                {node.icon}
              </div>
            )}
            {node.label && (
              <div
                className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium tracking-wide"
                style={{ color: nodeColor }}
              >
                {node.label}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
