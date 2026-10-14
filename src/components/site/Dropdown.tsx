"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

/**
 * The site's own select: a trigger in the form's field style and a listbox
 * panel in the site's type, instead of the operating system's menu.
 *
 * It submits through a hidden input, so FormData sees it like a <select>,
 * and returns to its default when the form resets. Keyboard: arrows,
 * Home/End, Enter/Space to pick, Escape to close, a letter to jump. It
 * opens upward when there is no room below.
 */

export type Option = { value: string; label: string };

export default function Dropdown({
  name,
  options,
  defaultValue = "",
  placeholder,
  label,
  tone = "light",
  className,
}: {
  name: string;
  options: Option[];
  defaultValue?: string;
  placeholder?: string;
  /** Accessible name when no visible label is tied to the trigger. */
  label?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [up, setUp] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const dark = tone === "dark";
  const current = options.find((o) => o.value === value);

  // Follow form.reset() like a native control does.
  useEffect(() => {
    const form = root.current?.closest("form");
    if (!form) return;
    const onReset = () => setValue(defaultValue);
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, [defaultValue]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function show() {
    const r = trigger.current?.getBoundingClientRect();
    const need = Math.min(options.length * 48 + 12, 300);
    setUp(!!r && r.bottom + need > window.innerHeight && r.top > need);
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  }

  function pick(i: number) {
    setValue(options[i].value);
    setOpen(false);
    trigger.current?.focus();
  }

  function onKey(e: KeyboardEvent) {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        show();
      }
      return;
    }
    if (e.key === "ArrowDown") setActive((a) => Math.min(options.length - 1, a + 1));
    else if (e.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(options.length - 1);
    else if (e.key === "Enter" || e.key === " ") pick(active);
    else if (e.key === "Escape") setOpen(false);
    else if (e.key === "Tab") {
      setOpen(false);
      return;
    } else if (e.key.length === 1) {
      const k = e.key.toLowerCase();
      const i = options.findIndex((o, j) => j > active && o.label.toLowerCase().startsWith(k));
      const j = i >= 0 ? i : options.findIndex((o) => o.label.toLowerCase().startsWith(k));
      if (j >= 0) setActive(j);
      return;
    } else return;
    e.preventDefault();
  }

  return (
    <div ref={root} className={cn("relative", className)}>
      <input type="hidden" name={name} value={value} />
      <button
        ref={trigger}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={label}
        aria-activedescendant={open ? `${id}-o${active}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKey}
        className={cn(
          "flex h-12 w-full items-center justify-between gap-3 px-3 text-left font-tek text-[15px] uppercase outline-none transition-shadow",
          "focus-visible:shadow-[inset_0_0_0_1.5px_rgb(var(--accent-s))]",
          dark ? "bg-white/[0.07] text-white" : "cut bg-paper text-fg [--cut:8px]",
          open && "shadow-[inset_0_0_0_1.5px_rgb(var(--accent-s))]",
        )}
      >
        <span className={cn("truncate", !current && (dark ? "text-white/35" : "text-mute"))}>{current ? current.label : placeholder}</span>
        <svg viewBox="0 0 12 7" className={cn("h-2 w-3 shrink-0 transition-transform duration-300", open && "rotate-180", dark ? "text-white/60" : "text-fg2")} aria-hidden>
          <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={list}
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            data-lenis-prevent
            initial={{ opacity: 0, y: up ? 6 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: up ? 6 : -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute inset-x-0 z-40 max-h-[300px] overflow-auto overscroll-contain p-1.5",
              up ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]",
              dark ? "border border-white/10 bg-coal shadow-[0_24px_50px_-20px_rgba(0,0,0,.7)]" : "border border-rule bg-white shadow-[0_24px_50px_-24px_rgba(0,0,0,.35)]",
            )}
          >
            {options.map((o, i) => {
              const selected = o.value === value;
              return (
                <li
                  key={o.value}
                  id={`${id}-o${i}`}
                  data-i={i}
                  role="option"
                  aria-selected={selected}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => pick(i)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 px-3 py-3 font-tek text-[14px] uppercase transition-colors",
                    i === active && (dark ? "bg-white/[0.07]" : "bg-paper"),
                    dark ? "text-white/85" : "text-fg",
                  )}
                >
                  <span className={cn("w-6 shrink-0 text-[11px] tabular-nums", dark ? "text-white/35" : "text-mute")}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">{o.label}</span>
                  <span className={cn("h-2 w-2 shrink-0", selected ? "bg-accent" : "bg-transparent")} aria-hidden />
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
