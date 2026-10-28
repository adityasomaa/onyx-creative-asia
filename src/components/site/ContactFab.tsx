"use client";

import { useL } from "@/lib/i18n";
import { UI } from "@/lib/copy";
import { getWaLinkWithText } from "@/lib/wa-number";
import ChatAssistant from "./ChatAssistant";

/**
 * Floating contact badge, bottom-right, in the slot the reference uses for
 * its "Get Template" badge: a dark pill that opens WhatsApp, which is how
 * most of our clients prefer to start. The AI assistant's launcher sits
 * beside it, so the corner holds both ways of asking.
 */
export default function ContactFab() {
  const tl = useL();
  return (
    <div className="fixed bottom-3 right-3 z-[140] flex items-center gap-2 md:bottom-4 md:right-4">
      <ChatAssistant />
      <a
        href={getWaLinkWithText("Hi Onyx, I'd like to talk about a project.")}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 rounded-[10px] border border-white/10 bg-night/95 p-2 text-white shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)] backdrop-blur sm:pr-4"
      >
        <span className="grid h-9 w-9 place-items-center rounded-md bg-accent text-accent-ink transition-transform duration-300 group-hover:scale-105">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path
              fill="currentColor"
              d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"
            />
          </svg>
        </span>
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="text-[14px] font-semibold tracking-[-0.03em]">{tl(UI.contactFab)}</span>
          <span className="font-mono2 text-[10px] uppercase text-white/55">{tl(UI.contactFabSub)}</span>
        </span>
      </a>
    </div>
  );
}
