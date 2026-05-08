"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Pick a same-case scramble pool for a target character, so an uppercase
 * target only cycles through uppercase, lowercase only through lowercase,
 * and digits only through digits. Falls back to the full charset if the
 * target's class isn't present in the supplied charset.
 */
function poolFor(targetChar: string, charset: string): string {
  if (/\d/.test(targetChar)) {
    const digits = charset.replace(/[^\d]/g, "");
    return digits.length > 0 ? digits : charset;
  }
  if (/[A-Z]/.test(targetChar)) {
    const upper = charset.replace(/[^A-Z]/g, "");
    return upper.length > 0 ? upper : charset;
  }
  if (/[a-z]/.test(targetChar)) {
    const lower = charset.replace(/[^a-z]/g, "");
    return lower.length > 0 ? lower : charset;
  }
  return charset;
}

/**
 * Cryptographic text scramble — each letter cycles through random characters
 * before settling on its target. Letters resolve left-to-right with a small
 * randomness so the reveal feels organic. Case-preserving: an uppercase
 * letter never scrambles to lowercase, and vice versa.
 *
 *   "hsnx" → "ywhe" → "osjf" → "onsh" → "onyt" → "onyx"
 *
 * Use it anywhere the brand wants to read like a system unlocking itself —
 * loaders, headline reveals, key value props.
 */
export default function TextScramble({
  text,
  className,
  duration = 1500,
  startDelay = 0,
  charset = DEFAULT_CHARS,
  scramblePerSecond = 22,
  preserveSpaces = true,
  preservePunctuation = true,
  /** Re-trigger the animation if `text` changes. */
  resetKey,
}: {
  text: string;
  className?: string;
  /** Total animation length in ms. */
  duration?: number;
  /** Wait this many ms after mount before starting. */
  startDelay?: number;
  charset?: string;
  /** How many scramble swaps per second per letter. Higher = noisier. */
  scramblePerSecond?: number;
  preserveSpaces?: boolean;
  preservePunctuation?: boolean;
  resetKey?: string | number;
}) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number>(0);

  // Per-letter "reveal time" — letters near the start settle first, with
  // a small random jitter. Stable per render (we re-pick when text changes).
  const revealsRef = useRef<number[]>([]);

  // Memoise per-target-character pools so we don't rebuild them every swap.
  const poolsRef = useMemo(
    () => Array.from(text).map((ch) => poolFor(ch, charset)),
    [text, charset]
  );

  useEffect(() => {
    const N = text.length;
    revealsRef.current = Array.from({ length: N }, (_, i) => {
      // Spread reveals across the first 80% of the duration; jitter ±10%.
      const base = (i / Math.max(1, N - 1)) * duration * 0.8;
      const jitter = (Math.random() - 0.5) * duration * 0.18;
      return Math.max(0, base + jitter);
    });

    let cancelled = false;
    const start = performance.now() + startDelay;
    const stepMs = 1000 / scramblePerSecond;
    let lastSwap = 0;
    let swappedDisplay = text;

    const isStatic = (ch: string) =>
      (preserveSpaces && /\s/.test(ch)) ||
      (preservePunctuation && /[^\p{L}\p{N}]/u.test(ch));

    function tick(now: number) {
      if (cancelled) return;
      const elapsed = now - start;

      if (elapsed < 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // Only re-randomise letters at the configured rate (don't fight
      // the GPU; 22Hz of swaps is plenty to feel "decoding"). Per-letter
      // pool is case-aware: uppercase target → uppercase pool, etc.
      if (now - lastSwap >= stepMs) {
        lastSwap = now;
        const next = Array.from(text)
          .map((target, i) => {
            if (isStatic(target)) return target;
            if (elapsed >= revealsRef.current[i]) return target;
            const pool = poolsRef[i];
            return pool[Math.floor(Math.random() * pool.length)];
          })
          .join("");
        swappedDisplay = next;
        setDisplay(next);
      }

      if (elapsed < duration) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Make sure we end on the exact target.
        if (swappedDisplay !== text) setDisplay(text);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [
    text,
    duration,
    startDelay,
    charset,
    scramblePerSecond,
    preserveSpaces,
    preservePunctuation,
    resetKey,
  ]);

  return (
    <span className={className} aria-label={text}>
      {display}
    </span>
  );
}
