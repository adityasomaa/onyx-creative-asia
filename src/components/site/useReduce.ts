"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * framer's useReducedMotion, but false until mounted. The server cannot
 * know the visitor's setting, so rendering by it straight away makes the
 * first client render differ from the HTML and breaks hydration.
 */
export function useReduce() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !!reduce;
}
