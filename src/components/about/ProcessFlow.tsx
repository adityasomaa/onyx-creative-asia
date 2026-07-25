import { T } from "@/lib/i18n";

const STEPS = [
  { t: "Inquiry", d: "You reach out and tell us what you need." },
  { t: "Discovery", d: "We dig into your goals, audience, and scope." },
  { t: "Development", d: "We design and build, with you in the loop." },
  { t: "Delivery", d: "We launch and hand it over, ready to run." },
  { t: "Maintenance", d: "We keep it healthy, updated, and improving." },
];

/**
 * Delivery process. A soft light glides along the connecting line in step
 * order. Desktop lays the steps out as one horizontal row; mobile switches
 * to a vertical timeline (dots + line on the left, copy on the right) so
 * there's never any sideways scrolling.
 */
export default function ProcessFlow() {
  return (
    <section className="bg-ink text-bone py-24 md:py-32">
      <div className="container-x text-center">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
          <T>Process</T>
        </p>
        <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight text-balance">
          <T>How we deliver your project</T>
        </h2>
      </div>

      {/* ─── Desktop: horizontal row ─── */}
      <div className="container-x mt-14 hidden md:mt-20 md:block">
        <div className="relative mx-auto max-w-5xl px-2">
          {/* The line simply gains opacity from first step to last: the
              progression is the point, so it does not need a moving light. */}
          <div className="absolute left-2 right-2 top-[7px] h-px -translate-y-1/2 bg-gradient-to-r from-bone/10 to-bone/60" />

          <div className="grid grid-cols-5 gap-4">
            {STEPS.map((s, i) => (
              <div key={s.t} className="px-2 text-center">
                <span
                  className="mx-auto mb-6 block h-3.5 w-3.5 rounded-full bg-bone"
                  style={{ opacity: 0.35 + (0.65 * i) / (STEPS.length - 1) }}
                />
                <p className="mb-2 text-[10px] uppercase tracking-[0.25em] tabular-nums opacity-45">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-base md:text-lg font-medium tracking-tight">
                  <T>{s.t}</T>
                </h3>
                <p className="mt-2 text-xs md:text-sm leading-snug opacity-70">
                  <T>{s.d}</T>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Mobile: vertical timeline ─── */}
      <div className="container-x mt-12 md:hidden">
        <ol className="relative mx-auto max-w-md">
          {STEPS.map((s, i) => {
            // Same idea as desktop, read top to bottom instead of left to right.
            const from = 0.35 + (0.65 * i) / (STEPS.length - 1);
            const to = 0.35 + (0.65 * (i + 1)) / (STEPS.length - 1);
            return (
            <li key={s.t} className="relative flex gap-5">
              {/* Dot column: dot on top, connector filling down to the next */}
              <div className="relative flex flex-col items-center">
                <span
                  className="z-10 mt-1 block h-3.5 w-3.5 shrink-0 rounded-full bg-bone"
                  style={{ opacity: from }}
                />
                {i < STEPS.length - 1 && (
                  <span
                    className="mt-1 w-px flex-1 bg-gradient-to-b from-bone to-bone"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, rgba(244,241,236,${from}), rgba(244,241,236,${to}))`,
                    }}
                  />
                )}
              </div>
              <div className="flex-1 pb-9">
                <p className="mb-1.5 text-[10px] uppercase tracking-[0.25em] tabular-nums opacity-45">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-lg font-medium tracking-tight">
                  <T>{s.t}</T>
                </h3>
                <p className="mt-1.5 text-sm leading-snug opacity-70">
                  <T>{s.d}</T>
                </p>
              </div>
            </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
