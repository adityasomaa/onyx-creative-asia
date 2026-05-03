"use client";

import { cn } from "@/lib/cn";

export default function Marquee({
  items,
  className,
  reverse = false,
}: {
  items: string[];
  className?: string;
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="flex gap-12 whitespace-nowrap animate-marquee w-max"
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-12 text-sm uppercase tracking-[0.25em]">
            <span>{item}</span>
            <span aria-hidden className="opacity-50">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
