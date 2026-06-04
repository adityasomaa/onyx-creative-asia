"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
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
const DEFAULT_TYPE: InquiryType = "project";

/**
 * Tab-driven contact form. Pick an inquiry type at the top, the form
 * below swaps inline — no chooser screen, no back button, no full
 * navigation. The active tab is mirrored to ?type=<inquiry> so deep
 * links still work (sharing /contact?type=career lands on the careers
 * tab pre-selected), but tab switches feel instant.
 *
 * Sub-forms own their own state, validation, and POST to /api/leads.
 */
export default function ContactForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const raw = searchParams.get("type");
  const fromUrl = (INQUIRY_TYPES as string[]).includes(raw ?? "")
    ? (raw as InquiryType)
    : DEFAULT_TYPE;

  // Local state mirrors the URL but updates synchronously on click so
  // the highlight pill never lags behind the cursor. We still push to
  // the URL so deep links + browser-back keep working.
  const [active, setActive] = useState<InquiryType>(fromUrl);

  const switchTab = useCallback(
    (next: InquiryType) => {
      if (next === active) return;
      setActive(next);
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      params.set("type", next);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [active, pathname, router, searchParams],
  );

  return (
    <div className="space-y-10 md:space-y-12">
      <Tabs active={active} onChange={switchTab} />
      <FormSlot type={active} />
    </div>
  );
}

function Tabs({
  active,
  onChange,
}: {
  active: InquiryType;
  onChange: (t: InquiryType) => void;
}) {
  return (
    <div role="tablist" aria-label="Inquiry type" className="-mx-4 sm:mx-0">
      <div className="flex flex-wrap gap-2 sm:gap-3 px-4 sm:px-0">
        {INQUIRY_TYPES.map((t) => {
          const isActive = active === t;
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(t)}
              data-cursor="hover"
              className="relative px-4 sm:px-5 py-2.5 rounded-full text-sm tracking-tight transition-colors duration-300"
            >
              {isActive && (
                <motion.span
                  layoutId="inquiry-pill"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 32,
                  }}
                  className="absolute inset-0 rounded-full bg-ink"
                  aria-hidden
                />
              )}
              <span
                className={`relative z-10 flex items-baseline gap-2 transition-colors duration-300 ${
                  isActive ? "text-bone" : "text-ink/70 hover:text-ink"
                }`}
              >
                <span
                  className={`text-[10px] tracking-[0.22em] uppercase tabular-nums ${
                    isActive ? "text-bone/60" : "text-ink/45"
                  }`}
                >
                  {INQUIRY_KICKER[t]}
                </span>
                <span className="font-medium">{INQUIRY_LABEL[t]}</span>
              </span>
            </button>
          );
        })}
      </div>
      {/* Subtle helper text under the active tab — drawn from the same
          description map the old chooser screen used, so we don't lose
          the "what is this for" hint when the chooser goes away. */}
      <div className="mt-5 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="text-sm md:text-base text-ink/65 leading-relaxed"
          >
            {INQUIRY_DESCRIPTION[active]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function FormSlot({ type }: { type: InquiryType }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`form-${type}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        {type === "general" && <GeneralForm />}
        {type === "project" && <ProjectForm />}
        {type === "career" && <CareerForm />}
        {type === "partnership" && <PartnershipForm />}
      </motion.div>
    </AnimatePresence>
  );
}
