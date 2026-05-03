"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "onyx-loader-shown";

/**
 * Returns whether the intro loader should be shown for this session.
 * `null` while detecting (first paint), `true` if loader should show,
 * `false` if it has already shown this session.
 */
export function useIntroState() {
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const alreadyShown = sessionStorage.getItem(SESSION_KEY);
    setShow(!alreadyShown);
  }, []);

  return show;
}

export function markIntroShown() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_KEY, "1");
  }
}

export function hasIntroShown() {
  if (typeof window === "undefined") return false;
  return Boolean(sessionStorage.getItem(SESSION_KEY));
}

/** Total duration of the loader (count + hold + exit) */
export const LOADER_TOTAL_MS = 2200 + 350 + 1100;
