"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/**
 * Runtime accent colour.
 *
 * The accent is a CSS variable (`--accent`, an "R G B" triplet) so every
 * surface built with `bg-accent`, `text-accent`, `.hl` or `.cut` retints
 * at once. The visitor's pick is stored per browser; it is a preference,
 * not data, so localStorage is the right home for it.
 */

export const ORIGINAL_ACCENT = "#52FF9D";
export const SWATCHES = ["#52FF9D", "#8AEDFF", "#F7F990", "#F5A4D9", "#AAAEF2"] as const;
const KEY = "onyx_accent";

function hexToTriplet(hex: string): string | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** Ink on the accent: dark for light accents, white for dark custom picks. */
function inkFor(hex: string): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.35 ? "14 14 14" : "255 255 255";
}

function apply(hex: string) {
  const t = hexToTriplet(hex);
  if (!t) return;
  const root = document.documentElement;
  root.style.setProperty("--accent", t);
  root.style.setProperty("--accent-ink", inkFor(hex));
}

/**
 * Inline script that applies a stored accent before first paint, so a
 * returning visitor never sees the default green flash to their colour.
 */
export function AccentScript() {
  const js = `(function(){try{var h=localStorage.getItem(${JSON.stringify(KEY)});if(!h||!/^#[0-9a-f]{6}$/i.test(h))return;var n=parseInt(h.slice(1),16),R=(n>>16)&255,G=(n>>8)&255,B=n&255,r=document.documentElement;r.style.setProperty('--accent',R+' '+G+' '+B);var f=function(c){c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4)};r.style.setProperty('--accent-ink',(0.2126*f(R)+0.7152*f(G)+0.0722*f(B))>0.35?'14 14 14':'255 255 255');}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}

const Ctx = createContext<{ accent: string; setAccent: (h: string) => void; reset: () => void }>({
  accent: ORIGINAL_ACCENT,
  setAccent: () => {},
  reset: () => {},
});

export function AccentProvider({ children }: { children: ReactNode }) {
  const [accent, setState] = useState<string>(ORIGINAL_ACCENT);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored && hexToTriplet(stored)) {
        setState(stored.toUpperCase());
        apply(stored);
      }
    } catch {
      /* storage unavailable: keep the default */
    }
  }, []);

  const setAccent = useCallback((hex: string) => {
    if (!hexToTriplet(hex)) return;
    const up = hex.toUpperCase();
    setState(up);
    apply(up);
    try {
      localStorage.setItem(KEY, up);
    } catch {
      /* ignore */
    }
  }, []);

  const reset = useCallback(() => {
    setState(ORIGINAL_ACCENT);
    apply(ORIGINAL_ACCENT);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ accent, setAccent, reset }), [accent, setAccent, reset]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAccent() {
  return useContext(Ctx);
}
