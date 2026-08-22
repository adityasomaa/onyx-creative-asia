import type { Metadata } from "next";
import Link from "next/link";
import { RevealText } from "@/components/Reveal";
import { SERVICES, PROJECTS } from "@/lib/data";
import { INSIGHTS } from "@/lib/insights";
import { T } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Every page on onyxcreative.asia in one place: services, works, insights, and the rest.",
  alternates: { canonical: "/sitemap" },
  openGraph: {
    title: "Sitemap, Onyx Creative Asia",
    description: "Every page on onyxcreative.asia in one place.",
    url: "/sitemap",
    type: "website",
  },
};

/** Built from the same data the routes are, so it cannot drift out of date. */
const GROUPS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Main",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Works", href: "/works" },
      { label: "Insights", href: "/insights" },
      { label: "Contact", href: "/enquire" },
    ],
  },
  {
    heading: "Services",
    links: SERVICES.map((s) => ({ label: s.title, href: `/services/${s.id}` })),
  },
  {
    heading: "Works",
    links: PROJECTS.map((p) => ({ label: p.client, href: `/works/${p.slug}` })),
  },
  {
    heading: "Insights",
    links: INSIGHTS.map((i) => ({ label: i.title, href: `/insights/${i.slug}` })),
  },
  {
    heading: "Guides",
    links: [
      {
        label: "Best Business Development Agency in Asia",
        href: "/best-business-development-agency-asia",
      },
      {
        label: "Best Digital Marketing Agency in Bali",
        href: "/best-digital-marketing-bali",
      },
      {
        label: "Best Digital Marketing Agency in Indonesia",
        href: "/best-digital-marketing-indonesia",
      },
    ],
  },
  {
    heading: "Extra",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Sitemap", href: "/sitemap" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <>
      <section className="container-x pt-40 md:pt-52 pb-12 md:pb-16">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
          <T>Sitemap</T>
        </p>
        <h1 className="text-display-md font-medium leading-[0.95] tracking-tight max-w-4xl text-balance">
          <RevealText text="Everything, in one place" />
        </h1>
        <p className="mt-8 max-w-xl text-lg text-ink/70 leading-relaxed">
          <T>
            Every page on this site, grouped so you can find what you came for.
          </T>
        </p>
      </section>

      <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-12 md:pt-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g) => (
            <div key={g.heading}>
              <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-5">
                <T>{g.heading}</T>
              </p>
              <ul className="border-t border-hairline">
                {g.links.map((l) => (
                  <li key={l.href} className="border-b border-hairline">
                    <Link
                      href={l.href}
                      className="group flex items-baseline justify-between gap-4 py-3.5 text-base transition-opacity hover:opacity-60"
                    >
                      <span className="min-w-0">
                        <T>{l.label}</T>
                      </span>
                      <span
                        aria-hidden
                        className="shrink-0 text-xs opacity-45 transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
