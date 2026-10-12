"use client";

import { Fragment, type ElementType } from "react";
import type { L } from "@/lib/l10n";
import { useL } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/**
 * Display copy with highlighted runs. `*word*` marks a run that renders
 * as an accent-on-ink block (`.hl`); separate markers make separate
 * blocks, which is how the reference sets each highlighted word apart.
 */
export function Marked({ text }: { text: string }) {
  const parts = text.split("*");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="hl">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

export default function Headline({
  v,
  as: Tag = "h2",
  className,
}: {
  v: L | string;
  as?: ElementType;
  className?: string;
}) {
  const tl = useL();
  return (
    <Tag className={cn("font-tek font-medium uppercase", className)}>
      <Marked text={tl(v)} />
    </Tag>
  );
}
