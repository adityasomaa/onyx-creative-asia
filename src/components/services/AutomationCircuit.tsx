"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import { useInView } from "framer-motion";
import CircuitBoard, { type CircuitConnection, type CircuitNode } from "@/components/ui/CircuitBoard";
import { useT } from "@/lib/i18n";

/**
 * "What one automated workflow looks like", drawn as a circuit: an
 * enquiry is triaged, the CRM and the team are updated in parallel, and
 * both feed the weekly report. Shown on the AI Automation service page.
 *
 * Two layouts rather than one scaled board, because scaling a 660px board
 * onto a phone would shrink the labels to unreadable. The board mounts
 * when it scrolls into view, so its draw-in plays where it can be seen
 * instead of above the fold at page load.
 */

const BONE = "#F4F1EC";
const INK = "#0E0E0E";

const CONNECTIONS: CircuitConnection[] = [
  { from: "enquiry", to: "triage" },
  { from: "triage", to: "crm" },
  { from: "triage", to: "team" },
  { from: "crm", to: "report" },
  { from: "team", to: "report" },
];

const WIDE = { width: 660, height: 300, at: { enquiry: [50, 150], triage: [210, 150], crm: [380, 70], team: [380, 230], report: [570, 150] } };
const COMPACT = { width: 320, height: 300, at: { enquiry: [36, 150], triage: [118, 150], crm: [205, 70], team: [205, 230], report: [292, 150] } };

export default function AutomationCircuit() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [wide, setWide] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const layout = wide ? WIDE : COMPACT;
  const node = (id: keyof typeof WIDE.at, label: string, icon: ReactElement, extra: Partial<CircuitNode> = {}): CircuitNode => ({
    id,
    x: layout.at[id][0],
    y: layout.at[id][1],
    label,
    icon,
    ...extra,
  });

  const nodes: CircuitNode[] = [
    node("enquiry", t("Enquiry"), <IconInbox />),
    node("triage", t("AI triage"), <IconSpark />, { size: "lg", processing: true }),
    node("crm", "CRM", <IconDatabase />),
    node("team", t("Team"), <IconBell />),
    node("report", t("Report"), <IconChart />),
  ];

  return (
    <section
      className="overflow-hidden bg-ink py-24 text-bone md:py-32"
      style={{
        // The dot grid lives on the section, so the board sits in an
        // unbroken field instead of a visible rectangle.
        backgroundImage: "radial-gradient(rgba(244, 241, 236, 0.14) 0.75px, transparent 0.75px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div className="container-x">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] opacity-60">{t("In practice")}</p>
            <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight text-balance">
              {t("One enquiry. Nobody retyping it.")}
            </h2>
          </div>
          <p className="text-base leading-relaxed text-bone/75 md:col-span-6 md:col-start-7 md:self-end md:text-lg">
            {t(
              "A typical first workflow: the enquiry is read and sorted, the CRM record fills itself in, the right person gets told, and the week's numbers land in a report. Every step runs inside tools you already use.",
            )}
          </p>
        </div>

        <div ref={ref} className="mt-14 flex h-[300px] justify-center md:mt-20">
          {inView && wide !== null && (
            <CircuitBoard
              key={wide ? "wide" : "compact"}
              nodes={nodes}
              connections={CONNECTIONS}
              width={layout.width}
              height={layout.height}
              showGrid={false}
              color={BONE}
              background={INK}
              pulseSpeed={2.4}
              traceWidth={1.5}
            />
          )}
        </div>
      </div>
    </section>
  );
}

/* 16px line icons, drawn in currentColor. */
const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function IconInbox() {
  return (
    <svg {...iconProps}>
      <path d="M3 13h5l1.5 3h5L16 13h5" />
      <path d="M5.5 5h13L21 13v6H3v-6z" />
    </svg>
  );
}
function IconSpark() {
  return (
    <svg {...iconProps} width={20} height={20}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M12 8.5l1.2 2.3 2.3 1.2-2.3 1.2L12 15.5l-1.2-2.3L8.5 12l2.3-1.2z" />
    </svg>
  );
}
function IconDatabase() {
  return (
    <svg {...iconProps}>
      <ellipse cx="12" cy="6" rx="7" ry="2.5" />
      <path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
      <path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg {...iconProps}>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg {...iconProps}>
      <path d="M4 20h16" />
      <path d="M7 16v-4M12 16V8M17 16v-6" />
    </svg>
  );
}
