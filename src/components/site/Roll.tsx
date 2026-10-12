import { cn } from "@/lib/cn";

/**
 * Letter roll: every character is set twice, stacked, and on hover of the
 * nearest `.group` both copies slide up one line, staggered left to right.
 * The visible text is aria-hidden; the label is read once from sr-only.
 */
export default function Roll({ text, className, stagger = 14 }: { text: string; className?: string; stagger?: number }) {
  const chars = Array.from(text);
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
