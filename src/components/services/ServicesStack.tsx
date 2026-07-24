import { SERVICES } from "@/lib/data";
import Button from "@/components/ui/Button";
import { T } from "@/lib/i18n";

/**
 * The six services as a stack of cards. Each card is sticky and parks a
 * little lower than the one before, so as you scroll they pile up with
 * the previous card's top edge peeking out behind. Pure CSS sticky, no
 * scroll JS.
 */
export default function ServicesStack() {
  return (
    <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-12 md:pt-16">
      {SERVICES.map((s, i) => (
        <div
          key={s.id}
          id={s.id}
          className="sticky scroll-mt-28"
          style={{ top: `${88 + i * 16}px` }}
        >
          <article className="mb-6 grid grid-cols-1 gap-8 rounded-3xl border border-hairline bg-bone p-7 shadow-[0_-10px_50px_-28px_rgba(14,14,14,0.35)] md:grid-cols-12 md:gap-12 md:p-10 lg:p-12">
            <div className="md:col-span-4">
              <p className="mb-3 text-xs uppercase tracking-[0.25em] tabular-nums opacity-55">
                {s.number} / {String(SERVICES.length).padStart(2, "0")}
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[0.98] tracking-tight">
                <T>{s.title}</T>
              </h2>
              <p className="mt-4 text-base md:text-lg font-light italic text-ink/60 max-w-xs">
                <T>{s.short}</T>
              </p>
              <div className="mt-7">
                <Button href={`/services/${s.id}`} tone="dark">
                  Explore
                </Button>
              </div>
            </div>

            <div className="md:col-span-8">
              <p className="text-lg md:text-2xl leading-snug text-ink/85 text-balance">
                <T>{s.description}</T>
              </p>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 border-t border-hairline">
                {s.capabilities.map((c) => (
                  <li
                    key={c}
                    className="flex items-baseline gap-3 border-b border-hairline py-3.5 text-base"
                  >
                    <span className="text-xs tabular-nums opacity-45">→</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      ))}
    </section>
  );
}
