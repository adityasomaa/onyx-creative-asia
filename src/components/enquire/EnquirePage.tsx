"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { useL, type L } from "@/lib/i18n";
import { ENQUIRE, FOOTER, UI } from "@/lib/copy";
import { SERVICES } from "@/lib/services";
import { getWaDisplay, getWaLink, getWaLinkWithText } from "@/lib/wa-number";
import { cn } from "@/lib/cn";
import CutButton, { Chevron } from "@/components/site/CutButton";
import BudgetSlider from "@/components/site/BudgetSlider";
import Wordmark, { InfinityMark } from "@/components/site/Wordmark";
import { Marked } from "@/components/site/Headline";
import { LAST_PATH_KEY } from "@/components/site/Chrome";
import LangMenu from "@/components/site/LangMenu";
import { postLead, withExtras, type LeadPayload } from "@/components/site/leads";
import { useReduce } from "@/components/site/useReduce";

/**
 * /enquire: a full-screen canvas, one question per screen.
 *
 * The first screen picks the kind of enquiry, and the questions after it
 * follow that kind. Every step stays mounted inside one form (only the
 * current one is visible and interactive), so going back keeps what was
 * typed, and the submit reads the whole form at once. Each kind posts the
 * shape /api/leads expects for it.
 *
 * Enter moves on from a text field, Ctrl/Cmd + Enter from a long answer.
 * Clicking a single-choice option moves on by itself.
 */

export type Kind = "project" | "partnership" | "career" | "general";
const KINDS: Kind[] = ["project", "partnership", "career", "general"];

type StepId = "kind" | "services" | "budget" | "start" | "ptype" | "company" | "dept" | "work" | "contact" | "problem" | "proposal" | "letter" | "note";

const FLOWS: Record<Kind, StepId[]> = {
  project: ["kind", "services", "budget", "start", "contact", "problem"],
  partnership: ["kind", "ptype", "company", "contact", "proposal"],
  career: ["kind", "dept", "work", "contact", "letter"],
  general: ["kind", "contact", "note"],
};

const MAX_CV = 3 * 1024 * 1024;
const CV_EXT = /\.(pdf|docx?)$/i;
const MAX_TEXT = 4800; // the API caps at 5000, and WhatsApp / start lines ride along
const EASE = [0.22, 1, 0.36, 1] as const;

const pad = (n: number) => String(n).padStart(2, "0");
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/** "" when empty, the normalised URL when valid, null when not a link. */
function asUrl(raw: string): string | null {
  const v = raw.trim();
  if (!v) return "";
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    return u.hostname.includes(".") ? u.toString() : null;
  } catch {
    return null;
  }
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const s = typeof r.result === "string" ? r.result : "";
      resolve(s.slice(s.indexOf(",") + 1));
    };
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

type Problem = { field?: string; err: L };

function check(id: StepId, fd: FormData): Problem | null {
  const s = (k: string) => String(fd.get(k) ?? "").trim();
  switch (id) {
    case "kind":
    case "start":
    case "ptype":
    case "dept":
      return s(id) ? null : { err: ENQUIRE.errPick };
    case "services":
      return fd.getAll("services").length ? null : { err: ENQUIRE.errPickAny };
    case "company":
      if (!s("company")) return { field: "company", err: ENQUIRE.errRequired };
      return asUrl(s("website")) === null ? { field: "website", err: ENQUIRE.errUrl } : null;
    case "work": {
      if (asUrl(s("portfolio")) === null) return { field: "portfolio", err: ENQUIRE.errUrl };
      const f = fd.get("cv");
      if (f instanceof File && f.size) {
        if (f.size > MAX_CV) return { err: ENQUIRE.errCvSize };
        if (!CV_EXT.test(f.name)) return { err: ENQUIRE.errCvType };
      }
      return null;
    }
    case "contact":
      if (!s("name")) return { field: "name", err: ENQUIRE.errRequired };
      return isEmail(s("email")) ? null : { field: "email", err: ENQUIRE.errEmail };
    case "problem":
    case "proposal":
    case "letter":
    case "note":
      return s(id) ? null : { field: id, err: ENQUIRE.errRequired };
    default:
      return null;
  }
}

/* ── Pieces ─────────────────────────────────────────────────────────── */

const field =
  "w-full border-b border-white/25 bg-transparent pb-2.5 pt-1 font-tek text-[20px] text-white outline-none transition-colors placeholder:uppercase placeholder:text-white/30 focus:border-accent focus-visible:!outline-none aria-[invalid=true]:border-red-400 md:text-[26px]";
const area =
  "block h-[24vh] min-h-[112px] max-h-[300px] w-full resize-none border border-white/20 bg-white/[0.04] p-4 text-[17px] leading-[1.45] text-white outline-none transition-colors placeholder:text-white/30 focus:border-accent focus-visible:!outline-none aria-[invalid=true]:border-red-400";

type Opt = { value: string; label: string; body?: string };

/** Option cards. Single choice moves on when clicked; keyboard picks wait for Enter. */
function Choices({ name, options, multi, checked, defaults, onChange, onPick, wide }: {
  name: string;
  options: Opt[];
  multi?: boolean;
  /** Uncontrolled options ticked on arrival. */
  defaults?: string[];
  checked?: string | null;
  onChange?: (v: string) => void;
  onPick?: () => void;
  wide?: boolean;
}) {
  const click = (e: MouseEvent) => {
    // The label's own click (detail > 0) means a pointer; the click the
    // browser forwards to the input, and Space or arrow keys, are ignored.
    if (multi || e.detail === 0 || e.target instanceof HTMLInputElement) return;
    onPick?.();
  };
  return (
    <div role={multi ? "group" : "radiogroup"} className={cn("grid gap-2", wide && "md:grid-cols-2")}>
      {options.map((o, i) => (
        <label
          key={o.value}
          onClick={click}
          className={cn(
            "relative flex cursor-pointer items-center gap-4 border border-white/15 px-4 py-3 transition-colors duration-200 hover:border-white/45 md:py-4",
            "has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-accent-ink",
            "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
          )}
        >
          <input
            type={multi ? "checkbox" : "radio"}
            name={name}
            value={o.value}
            className="peer sr-only"
            data-first={i === 0 ? "" : undefined}
            defaultChecked={checked === undefined ? defaults?.includes(o.value) : undefined}
            {...(checked !== undefined ? { checked: checked === o.value, onChange: () => onChange?.(o.value) } : {})}
          />
          <span className="font-mono2 text-[11px] opacity-50">{pad(i + 1)}</span>
          <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <span className="font-tek text-[18px] font-medium uppercase leading-none md:text-[22px]">{o.label}</span>
            {o.body ? <span className="text-[11px] font-semibold uppercase leading-[1.25] opacity-60 sm:max-w-[300px] sm:text-right">{o.body}</span> : null}
          </span>
          {multi ? <span aria-hidden className="h-4 w-4 shrink-0 border-2 border-current peer-checked:bg-current" /> : null}
        </label>
      ))}
    </div>
  );
}

function Panel({ state, q, hint, error, children, setRef, reduce }: {
  state: "on" | "past" | "future";
  q: string;
  hint: string;
  error: ReactNode;
  children: ReactNode;
  setRef: (el: HTMLElement | null) => void;
  reduce: boolean;
}) {
  const t = (d: number) => ({ duration: reduce ? 0 : d, ease: EASE });
  return (
    <motion.section
      ref={setRef}
      inert={state !== "on"}
      aria-hidden={state !== "on"}
      initial={false}
      animate={state}
      variants={{
        on: { opacity: 1, y: 0, transition: { ...t(0.55), delay: reduce ? 0 : 0.14 } },
        past: { opacity: 0, y: -32, transition: t(0.3) },
        future: { opacity: 0, y: 32, transition: t(0.3) },
      }}
      className={cn("absolute inset-0 flex flex-col [@media(max-height:640px)]:overflow-y-auto", state !== "on" && "pointer-events-none")}
    >
      <div className="mx-auto my-auto w-full max-w-[920px] px-4 py-6 md:px-8">
        <h2 tabIndex={-1} className="max-w-[18ch] font-tek text-[30px] font-medium uppercase leading-[1.02] tracking-[-0.03em] outline-none md:text-[54px]">
          {q}
        </h2>
        <p className="mt-3 max-w-[520px] text-[11px] font-semibold uppercase leading-[1.3] text-white/50 md:text-[12px]">{hint}</p>
        <div className="mt-7 md:mt-10">{children}</div>
        <p role="alert" className="mt-4 min-h-[1.3em] text-[11px] font-semibold uppercase text-red-400">
          {error}
        </p>
      </div>
    </motion.section>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */

export default function EnquirePage({ initial, services = [] }: { initial: Kind | null; services?: string[] }) {
  const tl = useL();
  const reduce = useReduce();
  const form = useRef<HTMLFormElement>(null);
  const cvInput = useRef<HTMLInputElement>(null);
  const panels = useRef<Partial<Record<StepId, HTMLElement | null>>>({});
  const pickTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [kind, setKind] = useState<Kind | null>(initial);
  const [at, setAt] = useState(initial ? 1 : 0);
  const [problem, setProblem] = useState<(Problem & { step: StepId }) | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [cvName, setCvName] = useState("");
  const [sentAs, setSentAs] = useState("");
  const [back, setBack] = useState("/");

  const flow = FLOWS[kind ?? "project"];
  const id = flow[at];
  const last = at === flow.length - 1;
  const sent = state === "sent";

  useEffect(() => {
    try {
      setBack(sessionStorage.getItem(LAST_PATH_KEY) || "/");
    } catch {
      /* ignore */
    }
    return () => clearTimeout(pickTimer.current);
  }, []);

  // Move focus to the new step's first control (or its question), once it has started to appear.
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }
    const el = panels.current[id];
    if (!el) return;
    const t = setTimeout(() => {
      const target = el.querySelector<HTMLElement>("[data-first]") ?? el.querySelector<HTMLElement>("h2");
      target?.focus({ preventScroll: true });
    }, reduce ? 0 : 240);
    return () => clearTimeout(t);
  }, [id, at, reduce]);

  function next() {
    clearTimeout(pickTimer.current);
    const el = form.current;
    if (!el || state === "sending") return;
    const fd = new FormData(el);
    const bad = check(id, fd);
    if (bad) {
      setProblem({ ...bad, step: id });
      if (bad.field) el.querySelector<HTMLElement>(`[name="${bad.field}"]`)?.focus({ preventScroll: true });
      return;
    }
    setProblem(null);
    if (last) void send(fd);
    else setAt((a) => Math.min(a + 1, flow.length - 1));
  }

  function prev() {
    clearTimeout(pickTimer.current);
    setProblem(null);
    if (state === "failed") setState("idle");
    setAt((a) => Math.max(0, a - 1));
  }

  // A pointer pick moves on after a beat, so the selection is seen first.
  const pick = () => {
    clearTimeout(pickTimer.current);
    pickTimer.current = setTimeout(next, reduce ? 0 : 260);
  };

  async function send(fd: FormData) {
    const k = kind ?? "project";
    const s = (n: string) => String(fd.get(n) ?? "").trim();
    const base = { name: s("name"), email: s("email") };
    const phone = s("phone") || null;
    setState("sending");
    let payload: LeadPayload;
    try {
      if (k === "project") {
        payload = {
          inquiryType: "project",
          ...base,
          message: withExtras(s("problem"), { phone, start: s("start") || null }),
          budget: s("budget") || null,
          services: fd.getAll("services").map(String),
          company: s("pcompany") || null,
        };
      } else if (k === "partnership") {
        payload = {
          inquiryType: "partnership",
          ...base,
          company: s("company"),
          website: asUrl(s("website")) || null,
          partnershipType: s("ptype"),
          proposal: withExtras(s("proposal"), { phone }),
        };
      } else if (k === "career") {
        const f = fd.get("cv");
        const cv = f instanceof File && f.size ? { name: f.name, type: f.type || "application/octet-stream", size: f.size, dataBase64: await toBase64(f) } : null;
        payload = {
          inquiryType: "career",
          ...base,
          department: s("dept"),
          portfolioUrl: asUrl(s("portfolio")) || null,
          coverLetter: withExtras(s("letter"), { phone }),
          cv,
        };
      } else {
        payload = { inquiryType: "general", ...base, message: withExtras(s("note"), { phone }) };
      }
    } catch {
      setState("failed");
      return;
    }
    const ok = await postLead(payload);
    if (ok) setSentAs(base.name);
    setState(ok ? "sent" : "failed");
  }

  function again() {
    form.current?.reset();
    setCvName("");
    setKind(null);
    setAt(0);
    setProblem(null);
    setState("idle");
  }

  function onKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    // isComposing: Enter that confirms a Chinese or Japanese IME candidate is not "next".
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    const t = e.target as HTMLElement;
    if (t instanceof HTMLTextAreaElement) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        next();
      }
      return;
    }
    if (t instanceof HTMLInputElement && t.type !== "file") {
      e.preventDefault();
      next();
    }
  }

  const stateOf = (s: StepId): "on" | "past" | "future" => {
    if (sent) return "past";
    const i = flow.indexOf(s);
    return s === id ? "on" : i !== -1 && i < at ? "past" : "future";
  };
  const errorOf = (s: StepId) =>
    s === id && state === "failed" ? (
      <>
        {tl(FOOTER.failed)}{" "}
        <a href={getWaLink()} target="_blank" rel="noopener noreferrer" className="text-white underline">
          {getWaDisplay()}
        </a>
      </>
    ) : problem?.step === s ? (
      tl(problem.err)
    ) : null;
  const invalid = (name: string) => (problem?.field === name ? true : undefined);
  const ref = (s: StepId) => (el: HTMLElement | null) => {
    panels.current[s] = el;
  };
  const panel = (s: StepId) => ({ state: stateOf(s), error: errorOf(s), setRef: ref(s), reduce });

  const kindLabel = kind ? tl(ENQUIRE.kinds[kind].label) : null;
  const pct = sent ? 100 : kind ? ((at + 1) / flow.length) * 100 : 8;
  const consent = (
    <p className="mt-4 max-w-[640px] text-[10px] font-semibold uppercase leading-[1.4] text-white/40">
      {tl(FOOTER.consent)}{" "}
      <Link href="/terms-and-conditions" className="text-white/70 hover:text-white">
        {tl(FOOTER.terms)}
      </Link>{" "}
      {tl(FOOTER.and)}{" "}
      <Link href="/privacy-policy" className="text-white/70 hover:text-white">
        {tl(FOOTER.privacy)}
      </Link>
      . {tl(FOOTER.noList)}
    </p>
  );
  const textArea = (name: StepId, ph: L) => (
    <>
      <textarea name={name} maxLength={MAX_TEXT} placeholder={tl(ph)} aria-invalid={invalid(name)} data-first="" className={area} />
      {consent}
    </>
  );

  return (
    <div className="enquire-canvas fixed inset-0 z-[100] flex h-[100dvh] flex-col overflow-hidden bg-night text-white" data-lenis-prevent>
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 px-4 md:h-[76px] md:px-8">
        <Link href="/" aria-label={tl(UI.home)} className="shrink-0 text-white">
          <Wordmark className="text-[15px] max-[359px]:[&>span:last-child]:hidden md:text-[18px]" />
        </Link>
        <p className="hidden truncate text-[11px] font-semibold uppercase text-white/50 md:block" aria-live="polite">
          <span className="text-white/30">[</span>{" "}
          {sent ? "✓" : kindLabel ? `${kindLabel} · ${pad(at + 1)} / ${pad(flow.length)}` : pad(1)}{" "}
          <span className="text-white/30">]</span>
        </p>
        <div className="flex shrink-0 items-center gap-4 md:gap-6">
          <LangMenu />
          <Link href={back} className="group flex shrink-0 items-center gap-2 font-tek text-[14px] font-medium uppercase text-white/70 transition-colors hover:text-white">
          <span className="hidden sm:inline">{tl(ENQUIRE.close)}</span>
          <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" aria-hidden>
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          <span className="sr-only sm:hidden">{tl(ENQUIRE.close)}</span>
          </Link>
        </div>
      </header>

      <div className="h-[3px] w-full shrink-0 bg-white/10" aria-hidden>
        <div className="h-full bg-accent transition-[width] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ width: `${pct}%` }} />
      </div>

      <form
        ref={form}
        noValidate
        onSubmit={(e) => e.preventDefault()}
        onKeyDown={onKeyDown}
        // Any edit clears the last complaint; Next checks again.
        onChange={() => problem && setProblem(null)}
        className="relative flex min-h-0 flex-1 flex-col"
      >
        <div className="relative min-h-0 flex-1">
          {/* The step number, large and faint, behind the question. */}
          <AnimatePresence initial={false}>
            {!sent && (
              <motion.span
                key={`${kind}-${at}`}
                aria-hidden
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
                className="pointer-events-none absolute -bottom-[0.18em] right-4 hidden select-none font-tek text-[34vh] font-semibold leading-none tracking-[-0.06em] text-white/[0.035] md:block md:right-8"
              >
                {pad(at + 1)}
              </motion.span>
            )}
          </AnimatePresence>

          <Panel q={tl(ENQUIRE.kindQ)} hint={tl(ENQUIRE.kindHint)} {...panel("kind")}>
            <Choices
              name="kind"
              checked={kind}
              onChange={(v) => setKind(v as Kind)}
              onPick={pick}
              options={KINDS.map((k) => ({ value: k, label: tl(ENQUIRE.kinds[k].label), body: tl(ENQUIRE.kinds[k].body) }))}
            />
            <p className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold uppercase text-white/45">
              <span>{tl(ENQUIRE.orWrite)}</span>
              <a href="mailto:hello@onyxcreative.asia" className="text-white/80 hover:text-white">
                hello@onyxcreative.asia
              </a>
              <a href={getWaLink()} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">
                WhatsApp {getWaDisplay()}
              </a>
            </p>
          </Panel>

          {/* Project */}
          <Panel q={tl(ENQUIRE.servicesQ)} hint={tl(ENQUIRE.servicesHint)} {...panel("services")}>
            <Choices name="services" multi wide defaults={services} options={SERVICES.map((s) => ({ value: s.title.en, label: tl(s.title) }))} />
          </Panel>
          <Panel q={tl(ENQUIRE.budgetQ)} hint={tl(ENQUIRE.budgetHint)} {...panel("budget")}>
            <BudgetSlider tone="dark" className="max-w-[680px]" />
          </Panel>
          <Panel q={tl(ENQUIRE.startQ)} hint={tl(ENQUIRE.startHint)} {...panel("start")}>
            <Choices name="start" onPick={pick} wide options={ENQUIRE.starts.map((o) => ({ value: o.value, label: tl(o.label) }))} />
          </Panel>

          {/* Partnership */}
          <Panel q={tl(ENQUIRE.ptypeQ)} hint={tl(ENQUIRE.ptypeHint)} {...panel("ptype")}>
            <Choices name="ptype" onPick={pick} wide options={ENQUIRE.ptypes.map((o) => ({ value: o.value, label: tl(o.label) }))} />
          </Panel>
          <Panel q={tl(ENQUIRE.companyQ)} hint={tl(ENQUIRE.companyHint)} {...panel("company")}>
            <div className="grid max-w-[760px] gap-6">
              <input name="company" autoComplete="organization" enterKeyHint="next" maxLength={200} placeholder={tl(ENQUIRE.companyPh)} aria-label={tl(ENQUIRE.companyPh)} aria-invalid={invalid("company")} data-first="" className={field} />
              <input name="website" type="url" inputMode="url" autoComplete="url" enterKeyHint="next" placeholder={tl(ENQUIRE.websitePh)} aria-label={tl(ENQUIRE.websitePh)} aria-invalid={invalid("website")} className={field} />
            </div>
          </Panel>

          {/* Career */}
          <Panel q={tl(ENQUIRE.deptQ)} hint={tl(ENQUIRE.deptHint)} {...panel("dept")}>
            <Choices
              name="dept"
              onPick={pick}
              wide
              options={[...SERVICES.map((s) => ({ value: s.title.en, label: tl(s.title) })), ...ENQUIRE.deptExtra.map((o) => ({ value: o.value, label: tl(o.label) }))]}
            />
          </Panel>
          <Panel q={tl(ENQUIRE.workQ)} hint={tl(ENQUIRE.workHint)} {...panel("work")}>
            <div className="grid max-w-[760px] gap-6">
              <input name="portfolio" type="url" inputMode="url" enterKeyHint="next" placeholder={tl(ENQUIRE.portfolioPh)} aria-label={tl(ENQUIRE.portfolioPh)} aria-invalid={invalid("portfolio")} data-first="" className={field} />
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex cursor-pointer items-center gap-3 border border-dashed border-white/30 px-4 py-3.5 transition-colors hover:border-white/60 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent">
                  <input
                    ref={cvInput}
                    type="file"
                    name="cv"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="sr-only"
                    onChange={(e) => setCvName(e.target.files?.[0]?.name ?? "")}
                  />
                  <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" aria-hidden>
                    <path d="M10.5 4.5 5.4 9.6a1.4 1.4 0 0 0 2 2l5.3-5.3a2.8 2.8 0 0 0-4-4L3.4 7.6a4.2 4.2 0 0 0 6 6l4.1-4.1" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                  <span className="max-w-[60vw] truncate font-tek text-[16px] font-medium uppercase md:max-w-[420px]">{cvName || tl(ENQUIRE.cvPick)}</span>
                </label>
                {cvName ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (cvInput.current) cvInput.current.value = "";
                      setCvName("");
                    }}
                    className="text-[11px] font-semibold uppercase text-white/55 underline hover:text-white"
                  >
                    {tl(ENQUIRE.cvRemove)}
                  </button>
                ) : null}
              </div>
            </div>
          </Panel>

          {/* Everyone */}
          <Panel q={tl(ENQUIRE.contactQ)} hint={tl(ENQUIRE.contactHint)} {...panel("contact")}>
            <div className="grid max-w-[860px] gap-6 md:grid-cols-2 md:gap-x-10">
              <input name="name" autoComplete="name" enterKeyHint="next" maxLength={200} placeholder={tl(FOOTER.name)} aria-label={tl(FOOTER.name)} aria-invalid={invalid("name")} data-first="" className={field} />
              <input name="email" type="email" inputMode="email" autoComplete="email" enterKeyHint="next" placeholder={tl(FOOTER.email)} aria-label={tl(FOOTER.email)} aria-invalid={invalid("email")} className={field} />
              <input name="phone" type="tel" inputMode="tel" autoComplete="tel" enterKeyHint="next" placeholder={tl(FOOTER.phone)} aria-label={tl(FOOTER.phone)} className={field} />
              {kind === "project" ? (
                <input name="pcompany" autoComplete="organization" enterKeyHint="next" maxLength={200} placeholder={tl(ENQUIRE.projectCompanyPh)} aria-label={tl(ENQUIRE.projectCompanyPh)} className={field} />
              ) : null}
            </div>
          </Panel>

          <Panel q={tl(ENQUIRE.problemQ)} hint={tl(ENQUIRE.problemHint)} {...panel("problem")}>
            {textArea("problem", ENQUIRE.problemPh)}
          </Panel>
          <Panel q={tl(ENQUIRE.proposalQ)} hint={tl(ENQUIRE.proposalHint)} {...panel("proposal")}>
            {textArea("proposal", ENQUIRE.proposalPh)}
          </Panel>
          <Panel q={tl(ENQUIRE.letterQ)} hint={tl(ENQUIRE.letterHint)} {...panel("letter")}>
            {textArea("letter", ENQUIRE.letterPh)}
          </Panel>
          <Panel q={tl(ENQUIRE.noteQ)} hint={tl(ENQUIRE.noteHint)} {...panel("note")}>
            {textArea("note", ENQUIRE.notePh)}
          </Panel>

          {/* Sent */}
          <AnimatePresence>
            {sent && (
              <motion.section
                key="sent"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.6, ease: EASE, delay: reduce ? 0 : 0.2 }}
                className="absolute inset-0 flex flex-col"
              >
                <div className="mx-auto my-auto w-full max-w-[920px] px-4 py-6 md:px-8">
                  <InfinityMark draw={!reduce} className="h-9 text-accent md:h-12" />
                  <h2 className="mt-8 max-w-[16ch] font-tek text-[40px] font-medium uppercase leading-[1.05] tracking-[-0.03em] md:text-[72px]">
                    <Marked text={tl(ENQUIRE.sentTitle)} />
                  </h2>
                  <p className="mt-5 max-w-[520px] text-[12px] font-semibold uppercase leading-[1.35] text-white/60">{tl(ENQUIRE.sentBody)}</p>
                  <div className="mt-10 grid max-w-[600px] gap-3 sm:grid-cols-2">
                    <CutButton size="md" label={ENQUIRE.sentHome} href={back} />
                    <CutButton
                      size="md"
                      tone="ghost"
                      label={ENQUIRE.sentWa}
                      external
                      href={getWaLinkWithText(`Hi Onyx, I just sent an enquiry (${kind ? ENQUIRE.kinds[kind].label.en : "General"}) through the site${sentAs ? `, as ${sentAs}` : ""}.`)}
                    />
                  </div>
                  <button type="button" onClick={again} className="mt-6 text-[11px] font-semibold uppercase text-white/50 underline hover:text-white">
                    {tl(ENQUIRE.sentAgain)}
                  </button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {!sent && (
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 px-4 py-3 md:px-8 md:py-4">
            <button
              type="button"
              onClick={prev}
              className={cn("flex h-12 items-center gap-2 font-tek text-[15px] font-medium uppercase text-white/65 transition-colors hover:text-white", at === 0 && "invisible")}
            >
              <Chevron className="rotate-180" />
              {tl(ENQUIRE.back)}
            </button>
            <p className="text-[11px] font-semibold uppercase text-white/35">
              <span className="md:hidden">{kind ? `${pad(at + 1)} / ${pad(flow.length)}` : pad(1)}</span>
              <span className="hidden md:inline">{tl(["problem", "proposal", "letter", "note"].includes(id) ? ENQUIRE.textHint : ENQUIRE.enterHint)}</span>
            </p>
            <div className="w-[170px] md:w-[240px]">
              <CutButton
                size="md"
                label={last ? (state === "sending" ? ENQUIRE.sending : ENQUIRE.send) : ENQUIRE.next}
                onClick={next}
                disabled={state === "sending"}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
