"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { L } from "@/lib/l10n";
import { useL } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import Roll from "./Roll";

/**
 * The reference's primary button: an accent slab with the bottom-right
 * corner cut, a chevron, and the label set in Tektur with a letter roll
 * on hover. `meta` is the small note that sits at the right end.
 */

const SIZES = {
  lg: "h-[72px] px-4 md:px-5 text-[22px] md:text-[24px] [--cut:10px]",
  md: "h-14 px-4 text-[18px] md:text-[20px] [--cut:8px]",
  sm: "h-10 px-3 text-[14px] [--cut:6px]",
} as const;

type Props = {
  label: L | string;
  meta?: L | string;
  href?: string;
  onClick?: () => void;
  size?: keyof typeof SIZES;
  tone?: "accent" | "dark" | "ghost";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  external?: boolean;
  icon?: ReactNode;
};

export function Chevron({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 16" className={cn("h-[0.62em] w-auto shrink-0", className)} aria-hidden>
      <path d="M1.5 1.5 8 8l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function CutButton({
  label,
  meta,
  href,
  onClick,
  size = "lg",
  tone = "accent",
  className,
  type = "button",
  disabled,
  external,
  icon,
}: Props) {
  const tl = useL();
  const text = tl(label);
  const cls = cn(
    "group cut relative flex w-full items-center justify-between gap-4 font-tek font-medium uppercase transition-[filter,opacity] duration-300",
    SIZES[size],
    tone === "accent" && "bg-accent text-accent-ink hover:brightness-[1.04]",
    tone === "dark" && "bg-fg text-white",
    tone === "ghost" && "bg-white/10 text-white",
    disabled && "pointer-events-none opacity-50",
    className,
  );
  const inner = (
    <>
      <span className="flex items-center gap-2">
        {icon ?? <Chevron className="transition-transform duration-500 group-hover:translate-x-1" />}
        <Roll text={text} />
      </span>
      {meta ? (
        <span className="hidden font-inter text-[11px] font-semibold tracking-[-0.02em] opacity-70 sm:block">
          {tl(meta)}
        </span>
      ) : null}
    </>
  );

  if (href) {
    if (external || href.startsWith("http") || href.startsWith("mailto:")) {
      return (
        <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled}>
      {inner}
    </button>
  );
}
