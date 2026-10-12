"use client";

import { useEffect, useState } from "react";

/** Current time in Bali (WITA, Asia/Makassar, UTC+8), ticking each second. */
export function useBaliTime() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return null;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Makassar",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short",
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const h = get("hour") % 24;
  const m = get("minute");
  const s = get("second");
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const workday = !["Sat", "Sun"].includes(weekday);
  return {
    h,
    m,
    s,
    label: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    // Studio hours as published in the LocalBusiness JSON-LD: Mon–Fri, 08–22.
    open: workday && h >= 8 && h < 22,
  };
}
