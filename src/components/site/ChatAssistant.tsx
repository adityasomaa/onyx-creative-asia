"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useL } from "@/lib/i18n";
import { CHAT } from "@/lib/copy";
import { getWaLinkWithText } from "@/lib/wa-number";
import { useReduce } from "./useReduce";

/**
 * The site assistant: a launcher beside the WhatsApp badge and a chat panel
 * streaming from /api/chat. It is also the studio's own demo of the AI
 * receptionists it sells.
 *
 * The panel is portalled into `.site` rather than <body>: the font
 * variables and the per-surface accent are scoped to that wrapper. While
 * it is open Lenis is stopped, and the message list is `data-lenis-prevent`
 * so it scrolls on its own.
 */

type Msg = { role: "user" | "assistant"; content: string };
type LenisLike = { stop: () => void; start: () => void };

const MAX_INPUT = 600;
const MAX_QUESTIONS = 20;
const SITE = /^https?:\/\/(www\.)?onyxcreative\.asia/;

/** Turns URLs in a reply into links; the studio's own open in place. */
function linkify(text: string): ReactNode[] {
  return text.split(/(https?:\/\/[^\s)]+)/g).map((part, i) => {
    if (!/^https?:\/\//.test(part)) return part;
    const url = part.replace(/[.,;:]+$/, "");
    const tail = part.slice(url.length);
    const internal = SITE.test(url);
    return (
      <span key={i}>
        <a
          href={internal ? url.replace(SITE, "") || "/" : url}
          {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
          className="break-all underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
        >
          {url.replace(/^https?:\/\/(www\.)?/, "")}
        </a>
        {tail}
      </span>
    );
  });
}

export default function ChatAssistant() {
  const tl = useL();
  const reduce = useReduce();
  const pathname = usePathname();
  const [host, setHost] = useState<Element | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const asked = messages.filter((m) => m.role === "user").length;
  const limitReached = asked >= MAX_QUESTIONS;

  useEffect(() => setHost(document.querySelector(".site") ?? document.body), []);

  // A link in a reply navigates through the page transition; get out of its way.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages, reduce]);

  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    lenis?.stop();
    const t = setTimeout(() => field.current?.focus(), 300);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const q = text.trim().slice(0, MAX_INPUT);
      if (!q || pending || limitReached) return;
      const history = [...messages, { role: "user" as const, content: q }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setInput("");
      setPending(true);
      const replace = (content: string) => setMessages((m) => [...m.slice(0, -1), { role: "assistant", content }]);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Odd count keeps the window starting on a user turn.
          body: JSON.stringify({ messages: history.slice(-11) }),
        });
        if (!res.ok || !res.body) {
          replace(tl(res.status === 429 ? CHAT.tooFast : CHAT.failed));
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          replace(acc);
        }
        if (!acc.trim()) replace(tl(CHAT.failed));
      } catch {
        replace(tl(CHAT.failed));
      } finally {
        setPending(false);
      }
    },
    [messages, pending, limitReached, tl],
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const wa = getWaLinkWithText("Hi Onyx, I was chatting with your AI assistant and would like to talk about a project.");
  const shown: Msg[] = [{ role: "assistant", content: tl(CHAT.greeting) }, ...messages];

  const panel = (
    <AnimatePresence>
      {open && (
        <motion.section
          role="dialog"
          aria-label={tl(CHAT.title)}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="font-inter fixed inset-0 z-[210] flex flex-col overflow-hidden bg-night text-white md:inset-auto md:bottom-[76px] md:right-4 md:h-[min(620px,calc(100svh-110px))] md:w-[400px] md:rounded-[10px] md:border md:border-white/10 md:shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]"
        >
          <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-coal">
                <Image src="/onyx-mark-white.png" alt="" width={20} height={20} className="h-5 w-5 object-contain" />
              </span>
              <div className="leading-tight">
                <p className="font-tek text-[15px] font-semibold uppercase tracking-[0.02em]">{tl(CHAT.title)}</p>
                <p className="mt-0.5 flex items-center gap-1.5 font-mono2 text-[10px] uppercase text-white/55">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7fd39b]" />
                  {tl(CHAT.status)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-2.5 py-2 font-mono2 text-[10px] uppercase text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={tl(CHAT.title) + " · ×"}
                className="grid h-9 w-9 place-items-center rounded-md transition-colors hover:bg-white/10"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
                  <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </header>

          <div
            ref={list}
            data-lenis-prevent
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-5"
          >
            {shown.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <p
                  className={`max-w-[86%] whitespace-pre-wrap rounded-[10px] px-3.5 py-2.5 text-[14px] leading-relaxed ${
                    m.role === "user" ? "rounded-br-sm bg-accent text-accent-ink" : "rounded-bl-sm bg-coal text-white/90"
                  }`}
                >
                  {m.content ? (
                    m.role === "assistant" ? linkify(m.content) : m.content
                  ) : (
                    <span className="flex gap-1 py-1.5" aria-label={tl(CHAT.typing)}>
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          className="h-1.5 w-1.5 rounded-full bg-white/60"
                          animate={{ opacity: [0.25, 1, 0.25] }}
                          transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
                        />
                      ))}
                    </span>
                  )}
                </p>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {CHAT.suggestions.map((s) => (
                  <button
                    key={s.en}
                    type="button"
                    onClick={() => send(tl(s))}
                    className="rounded-md border border-white/15 px-3 py-2 text-left text-[13px] text-white/80 transition-colors hover:border-white/40 hover:text-white"
                  >
                    {tl(s)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {limitReached ? (
            <p className="border-t border-white/10 p-4 text-center text-[13px] text-white/75">
              {tl(CHAT.limit)}{" "}
              <a href={wa} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                WhatsApp
              </a>
            </p>
          ) : (
            <form onSubmit={submit} className="flex items-end gap-2 border-t border-white/10 p-3">
              <label htmlFor="onyx-chat-input" className="sr-only">
                {tl(CHAT.inputLabel)}
              </label>
              <textarea
                id="onyx-chat-input"
                ref={field}
                rows={1}
                value={input}
                maxLength={MAX_INPUT}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder={tl(CHAT.placeholder)}
                data-lenis-prevent
                className="max-h-32 min-h-11 flex-1 resize-none rounded-md border border-white/10 bg-coal px-3.5 py-2.5 text-[15px] text-white outline-none focus-visible:outline-none placeholder:text-white/40 focus:border-white/30"
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                aria-label={tl(CHAT.send)}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-accent text-accent-ink transition-opacity disabled:opacity-35"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
                  <path d="M10 16V4M5 9l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </form>
          )}
          <p className="px-4 pb-3 font-mono2 text-[10px] uppercase leading-snug text-white/40">{tl(CHAT.disclaimer)}</p>
        </motion.section>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={tl(CHAT.open)}
        className="group flex items-center gap-3 rounded-[10px] border border-white/10 bg-night/95 p-2 text-white shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)] backdrop-blur sm:pr-4"
      >
        <span className="relative grid h-9 w-9 place-items-center rounded-md bg-accent text-accent-ink transition-transform duration-300 group-hover:scale-105">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path
              fill="currentColor"
              d="M12 2.5c.4 3.9 1.6 6.2 3.3 7.6 1.4 1.1 3.2 1.6 5.7 1.9-2.5.3-4.3.8-5.7 1.9-1.7 1.4-2.9 3.7-3.3 7.6-.4-3.9-1.6-6.2-3.3-7.6C7.3 12.8 5.5 12.3 3 12c2.5-.3 4.3-.8 5.7-1.9C10.4 8.7 11.6 6.4 12 2.5Z"
            />
          </svg>
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-night bg-[#7fd39b]" />
        </span>
        <span className="hidden flex-col text-left leading-tight sm:flex">
          <span className="text-[14px] font-semibold tracking-[-0.03em]">{tl(CHAT.launcher)}</span>
          <span className="font-mono2 text-[10px] uppercase text-white/55">{tl(CHAT.launcherSub)}</span>
        </span>
      </button>
      {host && createPortal(panel, host)}
    </>
  );
}
