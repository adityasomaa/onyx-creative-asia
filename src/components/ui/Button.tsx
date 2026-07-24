"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Shared button with a distinctive hover: the label flips (the current
 * line rolls up and out while a duplicate rolls in from below) while a
 * fill sweeps up from the bottom, swapping the colours. No plain scale.
 *
 * Tones carry their own colours so a button works on light or dark
 * surfaces:
 *   - dark        : ink button on a light surface
 *   - light       : bone button on a dark surface (hero / footer)
 *   - outlineDark : outlined, fills ink on hover (light surface)
 *   - outlineLight: outlined, fills bone on hover (dark surface)
 */
const TONES = {
  dark: { base: "bg-ink text-bone ring-1 ring-ink", fill: "bg-bone", copy2: "text-ink" },
  light: { base: "bg-bone text-ink ring-1 ring-bone", fill: "bg-ink", copy2: "text-bone" },
  outlineDark: { base: "bg-transparent text-ink ring-1 ring-ink/25", fill: "bg-ink", copy2: "text-bone" },
  outlineLight: { base: "bg-transparent text-bone ring-1 ring-bone/40", fill: "bg-bone", copy2: "text-ink" },
} as const;

type Tone = keyof typeof TONES;

export default function Button({
  href,
  onClick,
  type = "button",
  children,
  tone = "dark",
  arrow = true,
  disabled = false,
  className,
}: {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  children: string;
  tone?: Tone;
  arrow?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const c = TONES[tone];

  const inner = (
    <span
      className={cn(
        "group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium",
        c.base,
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 z-0 translate-y-[102%] transition-transform duration-500 ease-out-expo group-hover:translate-y-0",
          c.fill,
        )}
      />
      <span className="relative z-10 block overflow-hidden">
        <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-[130%]">
          {children}
        </span>
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 translate-y-[130%] transition-transform duration-500 ease-out-expo group-hover:translate-y-0",
            c.copy2,
          )}
        >
          {children}
        </span>
      </span>
      {arrow && (
        <span
          aria-hidden
          className={cn(
            "relative z-10 leading-none transition-[transform,color] duration-500 group-hover:translate-x-1",
            `group-hover:${c.copy2}`,
          )}
        >
          →
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} data-cursor="hover" className="inline-block">
        {inner}
      </Link>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-cursor="hover"
      className="inline-block"
    >
      {inner}
    </button>
  );
}
