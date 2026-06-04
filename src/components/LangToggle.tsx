"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { useLang, type Lang } from "@/lib/i18n";

/**
 * Compact EN | ID pill toggle. Sits in the Nav between the desktop
 * links and the "Start a project" CTA. On mobile it's also rendered
 * (smaller) so the language preference travels with the user.
 *
 * Visual mirrors the Pricing cadence pill — animated `layoutId`
 * highlight slides under the active option. Two options keeps it
 * compact; expanding to a third language later just means adding
 * another button + dict entry.
 */
export default function LangToggle({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const { lang, setLang } = useLang();
  const options: Array<{ value: Lang; label: string }> = [
    { value: "en", label: "EN" },
    { value: "id", label: "ID" },
  ];

  return (
    <div
      role="tablist"
      aria-label="Language"
      className={cn(
        "inline-flex items-center rounded-full p-[3px] text-[11px] tracking-[0.18em] uppercase font-medium",
        variant === "dark"
          ? "border border-bone/20 bg-transparent"
          : "border border-ink/15 bg-bone/60",
        className,
      )}
    >
      {options.map((o) => {
        const active = lang === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setLang(o.value)}
            className="relative px-3 py-1.5 rounded-full transition-colors duration-300"
            data-cursor="hover"
          >
            {active && (
              <motion.span
                layoutId={`lang-pill-${variant}`}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className={cn(
                  "absolute inset-0 rounded-full",
                  variant === "dark" ? "bg-bone" : "bg-ink",
                )}
                aria-hidden
              />
            )}
            <span
              className={cn(
                "relative z-10 transition-colors duration-300",
                active
                  ? variant === "dark"
                    ? "text-ink"
                    : "text-bone"
                  : variant === "dark"
                    ? "text-bone/65"
                    : "text-ink/65",
              )}
            >
              {o.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
