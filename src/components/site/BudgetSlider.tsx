"use client";

import { useEffect, useRef, useState } from "react";
import { useCurrency, useLocale, useL } from "@/lib/i18n";
import { LOCALE_TAG } from "@/lib/l10n";
import { BUDGET } from "@/lib/copy";
import { CURRENCIES, currencyName, formatMoney, type CurrencyCode, type Rates } from "@/lib/currency";
import { cn } from "@/lib/cn";
import Dropdown from "./Dropdown";

/**
 * Budget as a slider: 0 to 100 million rupiah in 1 million steps, read in
 * any Asian currency at the day's rate. The currency is the site-wide one
 * (also set from the nav), so changing it here changes it there.
 *
 * Submits one readable string through a hidden input, always anchored in
 * rupiah: "IDR 45,000,000 (≈ SGD 3,210)". Untouched, it submits nothing.
 */

const MAX = 100_000_000;
const STEP = 1_000_000;
const TICKS = [0, 25_000_000, 50_000_000, 75_000_000, MAX];

function compact(idr: number, code: CurrencyCode, rates: Rates, locale: string) {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency: code, notation: "compact", maximumFractionDigits: 1 }).format(
      idr * (rates.perIdr[code] ?? 0),
    );
  } catch {
    return `${code} ${Math.round(idr * (rates.perIdr[code] ?? 0))}`;
  }
}

export default function BudgetSlider({ name = "budget", tone = "dark", className }: { name?: string; tone?: "light" | "dark"; className?: string }) {
  const tl = useL();
  const { locale } = useLocale();
  const { currency, setCurrency, rates } = useCurrency();
  const tag = LOCALE_TAG[locale];
  const [value, setValue] = useState(0);
  const [touched, setTouched] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const dark = tone === "dark";

  useEffect(() => {
    const form = root.current?.closest("form");
    if (!form) return;
    const onReset = () => {
      setValue(0);
      setTouched(false);
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  const plus = value >= MAX ? "+" : "";
  const shown = formatMoney(value, currency, rates, tag) + plus;
  const inIdr = formatMoney(value, "IDR", rates, tag) + plus;
  const submitted = touched
    ? `IDR ${value.toLocaleString("en-US")}${plus}${currency === "IDR" ? "" : ` (≈ ${formatMoney(value, currency, rates, "en")}${plus})`}`
    : "";
  const pct = (value / MAX) * 100;

  return (
    <div ref={root} className={cn("flex flex-col gap-4", className)}>
      <input type="hidden" name={name} value={submitted} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <output className={cn("block font-tek text-[26px] font-medium uppercase leading-none md:text-[30px]", dark ? "text-white" : "text-fg", !touched && (dark ? "text-white/35" : "text-mute"))}>
            {touched ? shown : tl(BUDGET.unset)}
          </output>
          <span className={cn("mt-1.5 block min-h-[1.2em] text-[11px] font-semibold uppercase", dark ? "text-white/45" : "text-mute")}>
            {touched && currency !== "IDR" ? `≈ ${inIdr}` : touched && value >= MAX ? tl(BUDGET.more) : ""}
          </span>
        </div>
        <Dropdown
          tone={tone}
          name={`${name}_currency`}
          label={tl(BUDGET.currency)}
          className="w-[230px] max-w-full"
          value={currency}
          onChange={(v) => setCurrency(v as CurrencyCode)}
          options={CURRENCIES.map((c) => ({ value: c, label: `${c} · ${currencyName(c, tag)}` }))}
        />
      </div>
      <input
        type="range"
        min={0}
        max={MAX}
        step={STEP}
        value={value}
        aria-label={tl(BUDGET.unset)}
        aria-valuetext={touched ? shown : tl(BUDGET.unset)}
        onChange={(e) => {
          setValue(+e.target.value);
          setTouched(true);
        }}
        className={cn("budget-range w-full", dark ? "budget-range--dark" : "budget-range--light")}
        style={{ ["--p" as string]: `${pct}%` }}
      />
      <div className={cn("flex justify-between text-[11px] font-semibold uppercase tabular-nums", dark ? "text-white/45" : "text-mute")}>
        {TICKS.map((t) => (
          <span key={t}>
            {compact(t, currency, rates, tag)}
            {t === MAX ? "+" : ""}
          </span>
        ))}
      </div>
      <p className={cn("text-[11px] font-semibold uppercase", dark ? "text-white/35" : "text-mute")}>{tl(BUDGET.note)}</p>
    </div>
  );
}
