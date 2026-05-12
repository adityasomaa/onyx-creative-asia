"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import {
  INQUIRY_TYPES,
  INQUIRY_LABEL,
  INQUIRY_DESCRIPTION,
  INQUIRY_KICKER,
  type InquiryType,
} from "./inquiry-types";
import GeneralForm from "./forms/GeneralForm";
import ProjectForm from "./forms/ProjectForm";
import CareerForm from "./forms/CareerForm";
import PartnershipForm from "./forms/PartnershipForm";

const EASE = [0.25, 1, 0.5, 1] as const;

/**
 * The contact page's primary container. Reads `?type=<inquiry>` from the
 * URL and renders either the type chooser (no param) or one of the four
 * sub-forms.
 *
 * Each sub-form encapsulates its own state, validation, and POST to
 * /api/leads. The chooser → sub-form transition is route-based so deep
 * links work (sharing /contact?type=career sends someone straight to the
 * careers form, no extra click).
 */
export default function ContactForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const raw = searchParams.get("type");
  const type = (INQUIRY_TYPES as string[]).includes(raw ?? "")
    ? (raw as InquiryType)
    : null;

  const setType = useCallback(
    (next: InquiryType | null) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (next) params.set("type", next);
      else params.delete("type");
      const q = params.toString();
      router.push(`${pathname}${q ? `?${q}` : ""}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  return (
    <AnimatePresence mode="wait">
      {type === null ? (
        <motion.div
          key="chooser"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <TypeChooser onSelect={setType} />
        </motion.div>
      ) : (
        <motion.div
          key={`form-${type}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <BackToChooser onClick={() => setType(null)} type={type} />
          {type === "general" && <GeneralForm />}
          {type === "project" && <ProjectForm />}
          {type === "career" && <CareerForm />}
          {type === "partnership" && <PartnershipForm />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TypeChooser({ onSelect }: { onSelect: (t: InquiryType) => void }) {
  return (
    <div className="space-y-10">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
          (Pick one)
        </p>
        <p className="text-lg md:text-xl opacity-80 leading-relaxed">
          What kind of conversation are we starting? We&apos;ll tailor the form
          to what you need.
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/10 border border-ink/10">
        {INQUIRY_TYPES.map((t) => (
          <li key={t} className="bg-bone">
            <button
              type="button"
              onClick={() => onSelect(t)}
              className="block w-full text-left p-6 md:p-8 group hover:bg-ink/[0.025] transition-colors h-full"
            >
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-[11px] tracking-[0.25em] uppercase opacity-55 tabular-nums">
                  {INQUIRY_KICKER[t]}
                </span>
                <span
                  aria-hidden
                  className="text-base leading-none opacity-40 transition-all duration-500 group-hover:opacity-90 group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-medium tracking-tight leading-tight mb-2">
                {INQUIRY_LABEL[t]}
              </h3>
              <p className="text-sm opacity-65 leading-relaxed max-w-md">
                {INQUIRY_DESCRIPTION[t]}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BackToChooser({
  onClick,
  type,
}: {
  onClick: () => void;
  type: InquiryType;
}) {
  return (
    <div className="mb-12 flex items-center gap-3 text-xs uppercase tracking-[0.25em] opacity-60">
      <button
        type="button"
        onClick={onClick}
        className="hover:opacity-100 transition-opacity"
      >
        ← All inquiry types
      </button>
      <span aria-hidden>·</span>
      <span>{INQUIRY_LABEL[type]}</span>
    </div>
  );
}
