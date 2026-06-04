import type { Metadata } from "next";
import Link from "next/link";
import { RevealText } from "@/components/Reveal";
import PricingGrid from "@/components/pricing/PricingGrid";
import { SERVICE_ROWS } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent monthly + yearly pricing for web development, social media, AI automation, and ads management. Bundles save up to ~29%.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing — Onyx Creative Asia",
    description:
      "Transparent monthly + yearly pricing across five services. Bundle and save up to ~29%.",
    url: "/pricing",
    type: "website",
  },
};

// JSON-LD: emit one Offer per cell (service × tier × cadence) so AI
// answer engines and Google rich results can quote our prices exactly.
// Builds straight off the pricing source of truth — no manual drift.
function PricingJsonLd() {
  const offers = SERVICE_ROWS.flatMap((row) =>
    (["startup", "growth", "enterprise"] as const).flatMap((tier) =>
      (["monthly", "yearly"] as const).map((cadence) => {
        const c = cadence === "monthly" ? row.monthly[tier] : row.yearly[tier];
        return {
          "@type": "Offer",
          name: `${row.name} — ${tier} (${cadence})`,
          priceCurrency: "IDR",
          price: c.price,
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: c.price,
            priceCurrency: "IDR",
            unitText: cadence === "monthly" ? "MONTH" : "ANN",
          },
          eligibleRegion: { "@type": "Country", name: "Indonesia" },
        };
      }),
    ),
  );

  const data = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Onyx Creative Asia — Service Pricing 2026",
    itemListElement: offers,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function PricingPage() {
  return (
    <>
      <PricingJsonLd />

      {/* Hero */}
      <section className="container-x pt-40 md:pt-52 pb-16 md:pb-24">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
          (Pricing)
        </p>
        <h1 className="text-display-md font-medium leading-[0.92] tracking-tight max-w-5xl text-balance">
          <RevealText text="Transparent." />
          <br />
          <span className="font-light italic">
            <RevealText text="No back-channel." delay={0.15} />
          </span>
        </h1>
        <p className="mt-14 md:mt-10 max-w-xl text-lg text-ink/70 leading-relaxed">
          Every retainer is published. Pick the tier, pick the cadence, sign,
          start. No tier-pricing email tag, no &ldquo;contact us for a
          quote&rdquo; on the small ones.
        </p>
      </section>

      {/* Pricing grid (client island — the cadence toggle is the only
          interactive piece, everything else is content) */}
      <PricingGrid />

      {/* Closing CTA */}
      <section className="container-x pb-32 md:pb-40 border-t border-hairline pt-16 md:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 gap-x-10">
          <div className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
              (Next step)
            </p>
            <h2 className="text-display-sm md:text-display-md font-medium leading-[0.95] tracking-tight">
              <span className="font-light italic block">Ready to</span>
              <span className="block">build together?</span>
            </h2>
            <p className="mt-6 max-w-md text-lg text-ink/70 leading-relaxed">
              Brief us in 30 minutes — we&apos;ll send back a scoped tier
              recommendation within 24 hours. No commitment to start.
            </p>
          </div>
          <div className="md:col-span-5 md:col-start-8 flex md:justify-end items-end">
            <Link
              href="/contact"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-bone transition-transform duration-500 ease-out-expo hover:scale-[1.03]"
            >
              <span className="text-sm font-medium">Start a brief</span>
              <span
                aria-hidden
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                ↗
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
