"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import type { InquiryType, SubmissionStatus } from "@/lib/db/types";

const TYPE_OPTIONS: { value: InquiryType; label: string }[] = [
  { value: "general", label: "Question" },
  { value: "project", label: "Project" },
  { value: "career", label: "Career" },
  { value: "partnership", label: "Partnership" },
];

const MENU_WIDTH = 208; // matches w-52
// Used to flip the menu above the trigger when there's not enough
// room below it.
const ESTIMATED_MENU_HEIGHT = 280;

/**
 * Per-row Action menu in the /agents/submissions table.
 *
 * The dropdown is rendered into a React Portal anchored to the
 * document body — this lets it escape the table wrapper's
 * `overflow-x-auto` (which clips overflowing children on both axes)
 * and the chrome's z-index stacks.
 *
 * Position: anchored to the trigger button's right edge. Opens below
 * by default, flips above if there's not enough viewport room.
 * Updates on scroll + resize so the menu doesn't drift while open.
 */
export default function SubmissionActions({
  id,
  currentType,
  currentStatus,
}: {
  id: string;
  currentType: InquiryType;
  currentStatus: SubmissionStatus;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pos, setPos] = useState<{
    top: number;
    right: number;
    openAbove: boolean;
  } | null>(null);

  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  // Portal can only render after mount — server renders nothing.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Position the dropdown relative to the trigger button.
  // Re-runs on open, on scroll, and on resize.
  useLayoutEffect(() => {
    if (!open) return;

    function place() {
      const btn = buttonRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const vh = window.innerHeight;
      const spaceBelow = vh - rect.bottom;
      const openAbove = spaceBelow < ESTIMATED_MENU_HEIGHT + 16;
      setPos({
        // align menu's right edge with button's right edge
        right: Math.max(8, window.innerWidth - rect.right),
        top: openAbove ? rect.top - 8 : rect.bottom + 4,
        openAbove,
      });
    }

    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  // Close on outside click + escape
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node | null;
      if (
        buttonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  async function patch(body: {
    status?: SubmissionStatus;
    inquiryType?: InquiryType;
  }) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      let payload: { ok?: boolean; error?: string } = {};
      try {
        payload = await res.json();
      } catch {
        // non-json
      }
      if (!res.ok || payload.ok === false) {
        setError(payload.error ?? "Update failed.");
        return;
      }
      setOpen(false);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        disabled={submitting}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Row actions"
        className="inline-flex items-center justify-center w-7 h-7 border border-bone/20 hover:border-bone/50 transition-colors text-bone/75 hover:text-bone disabled:opacity-50"
      >
        {submitting ? (
          <span className="block w-3 h-3 rounded-full border border-bone/70 border-t-transparent animate-spin" />
        ) : (
          <span className="text-xs leading-none tracking-tighter">···</span>
        )}
      </button>

      {mounted && open && pos &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{
              position: "fixed",
              top: pos.top,
              right: pos.right,
              width: MENU_WIDTH,
              transform: pos.openAbove ? "translateY(-100%)" : undefined,
            }}
            className="z-[300] border border-bone/15 bg-ink shadow-[0_8px_30px_-8px_rgba(0,0,0,0.6)] divide-y divide-bone/10 text-bone"
          >
            {/* Section: Move to type */}
            <div>
              <p className="px-3 py-2 text-[9px] tracking-[0.22em] uppercase opacity-50">
                Move to type
              </p>
              <ul>
                {TYPE_OPTIONS.map((opt) => {
                  const isCurrent = opt.value === currentType;
                  return (
                    <li key={opt.value}>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          if (isCurrent) return;
                          void patch({ inquiryType: opt.value });
                        }}
                        disabled={submitting || isCurrent}
                        className={`w-full text-left px-3 py-2 text-xs tracking-[0.12em] uppercase flex items-center justify-between transition-colors ${
                          isCurrent
                            ? "opacity-50 cursor-default"
                            : "hover:bg-bone/5"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isCurrent && (
                          <span className="text-[9px] opacity-60">current</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Section: Archive */}
            <div>
              {currentStatus === "archived" ? (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => void patch({ status: "new" })}
                  disabled={submitting}
                  className="w-full text-left px-3 py-2.5 text-xs tracking-[0.18em] uppercase hover:bg-bone/5 transition-colors flex items-center gap-2"
                >
                  <span aria-hidden>↺</span> Restore to New
                </button>
              ) : (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => void patch({ status: "archived" })}
                  disabled={submitting}
                  className="w-full text-left px-3 py-2.5 text-xs tracking-[0.18em] uppercase hover:bg-bone/5 transition-colors flex items-center gap-2"
                >
                  <span aria-hidden>✕</span> Archive
                </button>
              )}
            </div>

            {error && (
              <p className="px-3 py-2 text-[10px] text-red-300 leading-snug">
                {error}
              </p>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
