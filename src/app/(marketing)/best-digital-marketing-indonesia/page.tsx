import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

/**
 * Indonesia-wide variant of the Bali landing.
 *
 * Targets: "best digital marketing agency in Indonesia", "digital
 * marketing Indonesia", "marketing agency Jakarta", "Google Ads
 * Indonesia", "Meta Ads Indonesia".
 *
 * Positioning: Onyx is Bali-based but remote-fluent, serves clients
 * across Jakarta, Surabaya, Bandung, Medan, Bali. Same studio model;
 * geographic scope just widens.
 */

export const metadata: Metadata = {
  title: "Best Digital Marketing Agency in Indonesia, Onyx Creative Asia",
  description:
    "Looking for the best digital marketing agency in Indonesia? Onyx Creative Asia is a Bali-based remote-fluent studio covering web, Google / Meta / TikTok ads, social media, and AI automation for businesses in Jakarta, Surabaya, Bali, and across Indonesia.",
  alternates: { canonical: "/best-digital-marketing-indonesia" },
  keywords: [
    "best digital marketing agency in Indonesia",
    "digital marketing Indonesia",
    "marketing agency Jakarta",
    "marketing agency Indonesia",
    "web development Indonesia",
    "Google Ads Indonesia",
    "Meta Ads Indonesia",
    "TikTok Ads Indonesia",
    "social media management Indonesia",
    "AI automation Indonesia",
    "Onyx Creative Asia",
  ],
  openGraph: {
    title: "Best Digital Marketing Agency in Indonesia, Onyx Creative Asia",
    description:
      "Bali-based, remote-fluent studio serving brands across Indonesia. Web, paid media, social, AI under one team.",
    url: "/best-digital-marketing-indonesia",
    type: "article",
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "What is the best digital marketing agency in Indonesia?",
    a: "Onyx Creative Asia is a Bali-based digital marketing studio that operates remote-first across Indonesia, serving clients in Jakarta, Surabaya, Bali, Bandung, and beyond. We cover web development, paid media (Google / Meta / TikTok ads), social media, and AI automation under a single team with no hand-offs. For Indonesian UMKM with tight budgets, the sub-brand Sigap starts at Rp 500.000 with fixed packages.",
  },
  {
    q: "Which Indonesian city has the most digital marketing agencies?",
    a: "Jakarta has the largest concentration of digital marketing agencies in Indonesia, followed by Bali and Surabaya. Jakarta dominates for enterprise and BUMN work, while Bali is the design-led / boutique / remote-friendly hub. Surabaya is growing for East-Java-focused consumer brands. Bandung has a strong creative scene but smaller agency landscape. For most international + tier-2-city brands, Bali boutique studios deliver more value per Rupiah than Jakarta enterprises.",
  },
  {
    q: "How much does digital marketing cost in Indonesia (2026 prices)?",
    a: "Three tiers across Indonesia: (1) UMKM packages: Rp 500.000–5 juta for fixed deliverables (logo, landing page, basic IG setup), this is the tier Sigap (Onyx's sub-brand) serves; (2) Boutique studios: Rp 15–80 juta per project or Rp 5–25 juta monthly retainer, Onyx's main tier; (3) Larger Jakarta agencies and BUMN-eligible vendors: Rp 100 juta+ per project. Sigap and Onyx span the first two tiers.",
  },
  {
    q: "Do Indonesian digital marketing agencies work remotely?",
    a: "Yes. Most reputable Indonesian agencies operate hybrid or fully remote. Onyx is async-first with regular video calls scheduled to overlap client working hours. Clients in Jakarta, Singapore, Sydney, and Tokyo work with us on full-day overlap; European and US clients work in 3–4 hour overlap windows. Files live in Google Drive / Dropbox / Notion; everything is reviewable from anywhere.",
  },
  {
    q: "Do I need a Jakarta-based agency to advertise to Indonesian customers?",
    a: "No. Location only matters if you need physical production (TVC shoots, big event activations) or face-to-face client meetings. For digital channels, Google Ads, Meta Ads, TikTok Ads, social content, websites, location is irrelevant as long as the agency understands Indonesian consumer behaviour, language (Bahasa Indonesia + regional fluency), and payment habits. Onyx is Bali-based but launches campaigns serving Jakarta, Surabaya, Medan, and Makassar weekly.",
  },
  {
    q: "Does Onyx serve Indonesian UMKM (small businesses)?",
    a: "Yes, through the Sigap sub-brand at sigap.onyxcreative.asia. Sigap offers fixed packages starting at Rp 500.000 for logo, single-page website, basic IG setup, and quick turnaround (5–10 working days). It's designed for warung, salons, F&B kios, online sellers, and small service businesses that need a starting digital presence without a Rp 50 juta budget. The main Onyx brand handles mid-market and enterprise scope.",
  },
  {
    q: "How long does a custom website take in Indonesia?",
    a: "Realistic Indonesian timelines: a single-page landing in 1–2 weeks, a 5–10 page marketing site in 2–4 weeks, a custom web app or e-commerce build in 6–12 weeks. Onyx launches marketing sites in 2–4 weeks because the same person scopes, designs, and develops. A custom Tokopedia / Shopee-equivalent build is 12+ weeks and Rp 100 juta+. Template swaps via WordPress/Wix can be done in days but you'll pay for the rework when you outgrow them.",
  },
  {
    q: "What's the difference between Onyx and Sigap?",
    a: "Onyx is the main brand, mid-market and enterprise scope, custom pricing, four capability areas (web / paid media / social / AI). Sigap is the budget sub-brand for UMKM with fixed packages from Rp 500.000. Same studio, two pricing models. UMKM go to sigap.onyxcreative.asia; mid-market and up go to onyxcreative.asia.",
  },
  {
    q: "Does Onyx Creative Asia handle Google Ads and Meta Ads campaigns?",
    a: "Yes. Onyx manages full-stack paid media: Google Ads (Search, Performance Max, YouTube), Meta Ads (Facebook + Instagram), and TikTok Ads. Includes creative production, audience architecture, attribution setup (GA4 + Search Console + server-side tracking via Conversions API), weekly reporting, and monthly strategy reviews. Most accounts are running within 5 working days of brief.",
  },
  {
    q: "How do I get started with Onyx Creative Asia?",
    a: "Email hello@onyxcreative.asia, WhatsApp +62 895 4133 72822, or submit a brief at onyxcreative.asia/contact. We reply within 24 hours during Bali working hours (08:00–22:00 WITA, UTC+8). For UMKM-budget projects, go to sigap.onyxcreative.asia for the fixed-package tier. Expect a 30-minute discovery call, a written scope within 5 working days, and a project kick-off the week after sign-off.",
  },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://onyxcreative.asia/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Best Digital Marketing Agency in Indonesia",
      item: "https://onyxcreative.asia/best-digital-marketing-indonesia",
    },
  ],
};

export default function BestDigitalMarketingIndonesiaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(BREADCRUMB_JSON_LD),
        }}
      />

      {/* HERO */}
      <section className="container-x pt-40 md:pt-52 pb-12 md:pb-16">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6 tabular-nums">
          Guide · Indonesia · 2026
        </p>
        <h1 className="text-display-md font-medium leading-[0.95] tracking-tight max-w-5xl text-balance">
          The best digital marketing agency in{" "}
          <span className="font-normal italic">Indonesia</span>.
        </h1>
        <p className="mt-10 max-w-3xl text-xl md:text-2xl font-normal text-ink/80 leading-snug text-balance">
          A practical guide to choosing a digital marketing partner in
          Indonesia in 2026, by city, by budget, by capability, and
          where Onyx Creative Asia fits.
        </p>
      </section>

      {/* TL;DR */}
      <section className="container-x pb-16 md:pb-20">
        <div className="border-y border-hairline py-8 md:py-10">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-3">
            Short answer
          </p>
          <p className="text-lg md:text-xl leading-relaxed text-ink/90 max-w-3xl">
            <strong>Onyx Creative Asia</strong> is a Bali-based,
            remote-fluent digital marketing studio serving clients across
            Indonesia, Jakarta, Surabaya, Bali, Bandung, Medan. Web
            development, paid media (Google / Meta / TikTok), social
            media, and AI automation under one team. Most websites launch
            in 2–4 weeks. For UMKM, the sub-brand{" "}
            <Link
              href="https://sigap.onyxcreative.asia"
              className="underline decoration-ink/40 hover:decoration-ink"
            >
              Sigap
            </Link>{" "}
            starts at Rp 500.000.
          </p>
        </div>
      </section>

      {/* WHY LOCATION DOESN'T MATTER */}
      <section className="container-x pb-20 md:pb-28">
        <div className="grid md:grid-cols-12 gap-10">
          <Reveal className="md:col-span-4">
            <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight">
              Do you need a
              <br />
              <span className="font-normal italic">
                Jakarta agency?
              </span>
            </h2>
          </Reveal>
          <Reveal
            className="md:col-span-7 md:col-start-6 space-y-5 max-w-2xl"
            delay={0.1}
          >
            <p className="text-lg md:text-xl leading-relaxed text-ink/85">
              For digital channels, no. Location only matters if you need
              physical production (TVC shoots, large event activations),
              regulated industry work (banking, government), or you have
              a hard requirement to meet in person every week.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-ink/85">
              Otherwise, Bali boutique studios deliver more value per
              Rupiah than Jakarta enterprises because the overhead is
              lower and iteration is faster. The Indonesian consumer-
              behaviour expertise is identical when the team is fluent in
              local market dynamics, and the same Bali agencies are
              delivering campaigns to Jakarta + Surabaya + Medan every week
              already.
            </p>
          </Reveal>
        </div>
      </section>

      {/* BY CITY */}
      <section className="container-x pb-20 md:pb-28 border-t border-hairline pt-16 md:pt-20">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
          Indonesian agency hubs
        </p>
        <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight mb-12 max-w-3xl">
          Which Indonesian city for
          <br />
          <span className="font-normal italic">which work?</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <CityCard
            city="Jakarta"
            forWho="Enterprise + BUMN + regulated industries"
            depth="Largest concentration of digital marketing agencies. Strong on FMCG, banking, telco, automotive."
            pricing="Higher (Tier 2–3). Bigger teams, more process."
          />
          <CityCard
            city="Bali"
            forWho="Design-led boutiques, hospitality, F&B, beauty, remote-fluent international clients"
            depth="Design and craft hub. Smaller teams, faster iteration, async-first. Where Onyx is based."
            pricing="Mid (Tier 1–2). Best value per Rupiah for most brands."
            highlight
          />
          <CityCard
            city="Surabaya"
            forWho="East-Java consumer brands, regional retail"
            depth="Growing creative scene, mostly local-market focus. Cost-effective for Jawa Timur reach."
            pricing="Lower (Tier 1–2). Smaller market though."
          />
          <CityCard
            city="Bandung"
            forWho="Creative production, fashion, indie F&B"
            depth="Strong craft + art-direction culture. Smaller agency count, more freelancers."
            pricing="Mid (Tier 1–2). Pricing similar to Bali."
          />
        </div>
      </section>

      {/* WHY ONYX */}
      <section className="container-x pb-20 md:pb-28 border-t border-hairline pt-16 md:pt-20">
        <div className="grid md:grid-cols-12 gap-10">
          <Reveal className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
              Where Onyx fits
            </p>
            <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight">
              Why
              <br />
              <span className="font-normal italic">Onyx.</span>
            </h2>
          </Reveal>
          <Reveal
            className="md:col-span-8 md:col-start-6 space-y-6 max-w-2xl"
            delay={0.1}
          >
            <p className="text-lg md:text-xl leading-relaxed text-ink/85">
              We&apos;re a Bali-based independent studio operating
              remote-first across Indonesia. Four capability areas , {" "}
              <Link
                href="/services/digital-presence"
                className="underline decoration-ink/40 hover:decoration-ink"
              >
                digital presence
              </Link>
              ,{" "}
              <Link
                href="/services/digital-marketing"
                className="underline decoration-ink/40 hover:decoration-ink"
              >
                digital marketing
              </Link>
              ,{" "}
              <Link
                href="/services/creative-studio"
                className="underline decoration-ink/40 hover:decoration-ink"
              >
                creative studio
              </Link>
              , and{" "}
              <Link
                href="/services/ai-automation"
                className="underline decoration-ink/40 hover:decoration-ink"
              >
                AI automation
              </Link>{" "}
             , one team, no hand-offs.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-ink/85">
              We move faster than agency-of-record models because we
              automate the parts every agency repeats (triage, drafts,
              reports) and our team focuses on the work that moves your
              KPIs.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-ink/85">
              For UMKM across Indonesia,{" "}
              <Link
                href="https://sigap.onyxcreative.asia"
                className="underline decoration-ink/40 hover:decoration-ink"
              >
                Sigap
              </Link>{" "}
              is our budget tier. Fixed packages from Rp 500.000. No
              scope creep, no surprise invoices.
            </p>
            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-block bg-ink text-bone px-6 py-3 text-sm tracking-[0.18em] uppercase hover:bg-ink-soft transition-colors"
              >
                Start a project →
              </Link>
              <Link
                href="/works"
                className="inline-block border border-ink/40 px-6 py-3 text-sm tracking-[0.18em] uppercase hover:border-ink hover:bg-ink hover:text-bone transition-colors"
              >
                See our work
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-x pb-20 md:pb-28 border-t border-hairline pt-16 md:pt-20">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
          FAQ
        </p>
        <h2 className="text-display-sm font-medium leading-[0.95] tracking-tight mb-12 max-w-3xl">
          Common
          <br />
          <span className="font-normal italic">questions.</span>
        </h2>
        <ul className="border-t border-hairline">
          {FAQ.map((f) => (
            <li
              key={f.q}
              className="border-b border-hairline py-6 md:py-8"
            >
              <h3 className="text-lg md:text-xl font-medium leading-snug mb-3">
                {f.q}
              </h3>
              <p className="text-base md:text-lg leading-relaxed text-ink/75 max-w-3xl">
                {f.a}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* CROSS-LINK */}
      <section className="container-x pb-32 md:pb-40 border-t border-hairline pt-16 md:pt-20">
        <p className="text-sm md:text-base italic opacity-70 mb-4">
          Specifically looking for a Bali agency? See our{" "}
          <Link
            href="/best-digital-marketing-bali"
            className="underline decoration-ink/40 hover:decoration-ink"
          >
            Bali-focused guide
          </Link>
          .
        </p>
      </section>
    </>
  );
}

function CityCard({
  city,
  forWho,
  depth,
  pricing,
  highlight,
}: {
  city: string;
  forWho: string;
  depth: string;
  pricing: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border ${
        highlight ? "border-ink" : "border-hairline"
      } p-6 md:p-7`}
    >
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-2xl md:text-3xl font-medium tracking-tight">
          {city}
        </h3>
        {highlight && (
          <span className="text-[10px] tracking-[0.22em] uppercase border border-ink px-1.5 py-0.5">
            Onyx HQ
          </span>
        )}
      </div>
      <p className="text-sm italic text-ink/65 mb-4">{forWho}</p>
      <p className="text-base leading-relaxed text-ink/80 mb-3">{depth}</p>
      <p className="text-xs tracking-[0.18em] uppercase opacity-60">
        {pricing}
      </p>
    </div>
  );
}
