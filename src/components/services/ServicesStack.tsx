import { SERVICES } from "@/lib/data";
import Button from "@/components/ui/Button";
import { T } from "@/lib/i18n";

/**
 * The six services as full-width sticky sections. Every section sticks at
 * the same offset with an opaque background, so as you scroll each service
 * simply covers the previous one, no visible card pile, no offset stack.
 */
export default function ServicesStack() {
  return (
    <section className="border-t border-hairline">
      {SERVICES.map((s) => (
        <div
          key={s.id}
          id={s.id}
          className="sticky top-16 md:top-20 scroll-mt-24 bg-bone"
        >
          <div className="container-x grid grid-cols-1 gap-8 border-t border-hairline py-14 md:grid-cols-12 md:gap-12 md:py-20">
            <div className="md:col-span-4">
              <p className="mb-3 text-xs uppercase tracking-[0.25em] tabular-nums opacity-55">
                {s.number} / {String(SERVICES.length).padStart(2, "0")}
              </p>
              <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight">
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
              <p className="text-xl md:text-2xl leading-snug text-ink/85 max-w-2xl text-balance">
                <T>{s.description}</T>
              </p>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 border-t border-hairline">
                {s.capabilities.map((c) => (
                  <li
                    key={c}
                    className="flex items-baseline gap-3 border-b border-hairline py-3.5 text-base"
                  >
                    <span className="text-xs tabular-nums opacity-45">→</span>
                    <span><T>{c}</T></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
