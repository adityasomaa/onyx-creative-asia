"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

/** Full-screen routes that drop the nav, footer and contact badge. */
const CANVAS = ["/enquire"];
export const LAST_PATH_KEY = "onyx_last_path";

/**
 * The site chrome around every page, left out on canvas routes. It also
 * remembers the last ordinary page visited, so a canvas can close back
 * to where the visitor came from.
 */
export default function Chrome({ nav, footer, children }: { nav: ReactNode; footer: ReactNode; children: ReactNode }) {
  const pathname = usePathname();
  const canvas = CANVAS.includes(pathname);

  useEffect(() => {
    if (canvas) return;
    try {
      sessionStorage.setItem(LAST_PATH_KEY, pathname);
    } catch {
      /* ignore */
    }
  }, [pathname, canvas]);

  return (
    <>
      {!canvas && nav}
      <main id="main">{children}</main>
      {!canvas && footer}
    </>
  );
}
