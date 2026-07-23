import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES } from "@/lib/data";
import Reveal, { RevealText } from "@/components/Reveal";
import RelatedWorks from "@/components/services/RelatedWorks";
import { T } from "@/lib/i18n";

type Params = { slug: string };

// Pre-render one static page per service at build time.
export function generateStaticParams(): Params[] {
  return SERVICES.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.id === slug);
  if (!service) return { title: "Service not found" };

  return {
    title: `${service.title}, Services`,
    description: service.intro,
    alternates: { canonical: `/services/${service.id}` },
    openGraph: {
      title: `${service.title}, Onyx Creative Asia`,
      description: service.intro,
      url: `/services/${service.id}`,
      type: "article",
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.id === slug);
  if (!service) notFound();

  const others = SERVICES.filter((s) => s.id !== service.id);

  // ───────── JSON-LD: per-service Service schema ─────────
  // Scopes the capability to this URL so AI answer engines can cite
  // the right page when asked about a specific service ("best web
  // development agency in Bali" → /services/web-development).
  const SERVICE_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.intro || service.description,
    url: `https://onyxcreative.asia/services/${service.id}`,
    provider: {
      "@id": "https://onyxcreative.asia/#organization",
    },
    areaServed: [
      { "@type": "Country", name: "Indonesia" },
      { "@type": "Country", name: "Singapore" },
      { "@type": "Country", name: "Australia" },
      { "@type": "Place", name: "Asia" },
    ],
    audience: {
      "@type": "Audience",
      audienceType: [
        "Hospitality",
        "Property",
        "Beauty + Wellness",
        "F&B",
        "Education",
        "B2B Technology",
        "UMKM",
      ],
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} capabilities`,
      itemListElement: service.capabilities.map((cap) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: cap,
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_JSON_LD) }}
      />

      {/* ───────────────────── HERO ───────────────────── */}
      <section className="container-x pt-40 md:pt-52 pb-16 md:pb-24">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6 tabular-nums">
          ({service.number} / 04) · <T>Capability</T>
        </p>
        <h1 className="text-display-md font-medium leading-[0.92] tracking-tight max-w-5xl text-balance">
          <RevealText text={service.title} />
        </h1>
        <p className="mt-10 max-w-2xl text-xl md:text-2xl font-normal italic text-ink/75 leading-snug text-balance">
          <T>{service.intro}</T>
        </p>
      </section>

      {/* ───────────────────── NARRATIVE ───────────────────── */}
      <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-16 md:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          <Reveal className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] opacity-60">
              <T>What we do</T>
            </p>
          </Reveal>
          <Reveal
            className="md:col-span-8 md:col-start-6 space-y-6 max-w-2xl"
            delay={0.1}
          >
            {service.narrative.map((para, i) => (
              <p
                key={i}
                className="text-lg md:text-xl leading-relaxed text-ink/85"
              >
                <T>{para}</T>
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ───────────────────── CAPABILITIES ───────────────────── */}
      <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-16 md:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          <Reveal className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-3">
              <T>Inside the scope</T>
            </p>
            <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight">
              <T>Capabilities.</T>
            </h2>
            <p className="mt-6 text-sm opacity-65 max-w-xs italic">
              <T>
                Mix and match. Most engagements pull from three or four; a few
                pull all of them.
              </T>
            </p>
          </Reveal>
          <Reveal className="md:col-span-8 md:col-start-6" delay={0.1}>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 border-t border-hairline">
              {service.capabilities.map((c) => (
                <li
                  key={c}
                  className="border-b border-hairline py-4 flex items-baseline gap-3 text-base"
                >
                  <span className="text-xs opacity-50 tabular-nums">→</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────── PROCESS ───────────────────── */}
      <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-16 md:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          <Reveal className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-3">
              <T>How it goes</T>
            </p>
            <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight">
              <T>The shape of an</T>
              <br />
              <span className="font-normal italic">
                <T>engagement.</T>
              </span>
            </h2>
          </Reveal>
          <Reveal className="md:col-span-8 md:col-start-6" delay={0.1}>
            <ol className="border-t border-hairline">
              {service.process.map((step, i) => (
                <li
                  key={step.title}
                  className="border-b border-hairline py-6 grid grid-cols-12 gap-4 md:gap-6"
                >
                  <span className="col-span-2 md:col-span-1 text-xs opacity-50 tabular-nums pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="col-span-10 md:col-span-11">
                    <p className="text-lg md:text-xl font-medium tracking-tight">
                      <T>{step.title}</T>
                    </p>
                    <p className="mt-2 text-base text-ink/65 leading-relaxed max-w-xl">
                      <T>{step.detail}</T>
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────── WHO THIS IS FOR ───────────────────── */}
      <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-16 md:pt-20">
        <Reveal className="max-w-6xl">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
            <T>Who this is for</T>
          </p>
          <p className="text-3xl md:text-4xl lg:text-[2.75rem] font-normal italic leading-[1.1] tracking-tight text-balance">
            <T>{service.fitFor}</T>
          </p>
        </Reveal>
      </section>

      {/* ───────────────────── RELATED WORK ─────────────────────
          Case studies that used this discipline. Renders nothing when
          there are no matching projects yet. */}
      <RelatedWorks serviceSlug={service.id} />

      {/* ───────────── PROBLEM → SOLUTION CTA ─────────────
          Funnel close: name the problem, offer to take it off their
          plate, invite a free consultation. */}
      <section className="bg-ink text-bone py-24 md:py-32">
        <div className="container-x">
          <Reveal className="max-w-6xl">
            <h2 className="text-4xl sm:text-5xl md:text-display-md font-medium leading-[1.0] tracking-tight text-balance">
              <T>{service.cta.problem}</T>
            </h2>
            <p className="mt-6 md:mt-8 text-lg md:text-xl leading-relaxed text-bone/85 max-w-2xl">
              <T>{service.cta.solution}</T>
            </p>
          </Reveal>
          <Reveal
            className="mt-10 md:mt-12 flex flex-wrap items-center gap-5"
            delay={0.1}
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-bone text-ink px-7 py-4 text-sm font-medium transition-transform duration-500 ease-out-expo hover:scale-[1.03]"
            >
              <T>Book a free consultation</T>
              <span
                aria-hidden
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                ↗
              </span>
            </Link>
            <Link
              href="/works"
              className="inline-flex items-center gap-2 text-sm text-bone/70 hover:text-bone transition-colors"
            >
              <T>See related work</T>
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────── OTHER SERVICES ───────────────────── */}
      <section className="container-x pb-32 md:pb-40 border-t border-hairline pt-16 md:pt-20">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-8">
          <T>Other capabilities</T>
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {others.map((o) => (
            <li key={o.id}>
              <Link
                href={`/services/${o.id}`}
                className="group block border border-hairline p-6 md:p-8 transition-colors hover:bg-ink/[0.03]"
              >
                <p className="text-xs uppercase tracking-[0.25em] opacity-60 tabular-nums mb-4">
                  {o.number} / 04
                </p>
                <h3 className="text-2xl md:text-3xl font-medium tracking-tight leading-tight">
                  <T>{o.title}</T>
                </h3>
                <p className="mt-3 text-sm italic text-ink/65 leading-relaxed">
                  <T>{o.short}</T>
                </p>
                <p className="mt-6 text-xs uppercase tracking-[0.22em] opacity-70 inline-flex items-center gap-2">
                  <T>Read more</T>
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
                  >
                    →
                  </span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
