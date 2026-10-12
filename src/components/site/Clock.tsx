"use client";

import { useBaliTime } from "./useBaliTime";

/** Analog clock showing Bali time, drawn the way the reference draws its. */
export default function Clock({ className }: { className?: string }) {
  const t = useBaliTime();
  const h = t ? ((t.h % 12) + t.m / 60) * 30 : 0;
  const m = t ? (t.m + t.s / 60) * 6 : 0;
  const s = t ? t.s * 6 : 0;
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={t ? `Bali ${t.label}` : "Bali time"}>
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i * 6 * Math.PI) / 180;
        const r1 = i % 5 === 0 ? 40 : 43;
        return (
          <line
            key={i}
            // Rounded: raw trig output can differ in the last digit between
            // the server and the browser, which breaks hydration.
            x1={(50 + r1 * Math.sin(a)).toFixed(2)}
            y1={(50 - r1 * Math.cos(a)).toFixed(2)}
            x2={(50 + 46 * Math.sin(a)).toFixed(2)}
            y2={(50 - 46 * Math.cos(a)).toFixed(2)}
            stroke="#C4C4C4"
            strokeWidth={i % 5 === 0 ? 1 : 0.5}
          />
        );
      })}
      <line x1="50" y1="50" x2="50" y2="27" stroke="#262626" strokeWidth="2.4" strokeLinecap="round" transform={`rotate(${h} 50 50)`} />
      <line x1="50" y1="50" x2="50" y2="15" stroke="#262626" strokeWidth="1.6" strokeLinecap="round" transform={`rotate(${m} 50 50)`} />
      <line x1="50" y1="56" x2="50" y2="12" className="stroke-accent" strokeWidth="0.8" transform={`rotate(${s} 50 50)`} />
      <circle cx="50" cy="50" r="1.8" className="fill-accent" />
    </svg>
  );
}
