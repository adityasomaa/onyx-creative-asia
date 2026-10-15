import { cn } from "@/lib/cn";

/**
 * Letter roll: every character is set twice, stacked, and on hover of the
 * nearest `.group` both copies slide up one line, staggered left to right.
 * The visible text is aria-hidden; the label is read once from sr-only.
 *
 * Characters are grapheme clusters, so an accent stays on its letter.
 * Scripts that shape across letters (Arabic, Hebrew, Thaana, the Indic and
 * Southeast Asian scripts, Tibetan) are never split: a letter on its own
 * loses its joins and stacked marks, so that text is set whole, unrolled.
 */

const SHAPED = /[֐-ࣿऀ-෿฀-࿿က-႟ក-៿יִ-﷿ﹰ-﻿]/;

function graphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

export default function Roll({ text, className, stagger = 14 }: { text: string; className?: string; stagger?: number }) {
  if (SHAPED.test(text)) return <span className={cn("relative inline-flex", className)}>{text}</span>;
  const chars = graphemes(text);
  return (
    <span className={cn("relative inline-flex", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-flex">
        {chars.map((c, i) => {
          const ch = c === " " ? " " : c;
          const style = { transitionDelay: `${i * stagger}ms` };
          return (
            <span key={i} className="relative inline-block overflow-hidden leading-[1.1]">
              <span
                className="block transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-full motion-reduce:transition-none"
                style={style}
              >
                {ch}
              </span>
              <span
                className="absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-full motion-reduce:transition-none"
                style={style}
              >
                {ch}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
