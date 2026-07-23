"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SERVICES } from "@/lib/data";
import { useT } from "@/lib/i18n";

const EASE = [0.76, 0, 0.24, 1] as const;

const SITEMAP = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Works", href: "/works" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

const SERVICES_LINKS = SERVICES.map((s) => ({
  label: s.title,
  href: `/services/${s.id}`,
}));

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

export default function Footer() {
  const t = useT();
  return (
    <footer className="relative bg-ink text-bone overflow-hidden">
      {/* Big CTA */}
      <section className="container-x pt-24 pb-16 md:pt-32 md:pb-24 border-b border-hairline-light">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-8">
          {t("(Let's build)")}
        </p>
        <motion.h2
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: EASE }}
          className="text-display-md font-medium leading-[0.92] tracking-tight text-balance"
        >
          {t("Got a brand to")}{" "}
          <span className="font-normal italic">{t("build,")}</span>{" "}
          {t("a system to")}{" "}
          <span className="font-normal italic">{t("automate,")}</span>{" "}
          {t("or growth to")}{" "}
          <span className="font-normal italic">{t("unlock?")}</span>
        </motion.h2>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 rounded-full bg-bone px-6 py-3 text-ink transition-transform duration-500 ease-out-expo hover:scale-[1.03]"
          >
            <span className="text-sm font-medium">{t("Start a project")}</span>
            <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <a
            href="mailto:hello@onyxcreative.asia"
            className="inline-flex items-center gap-2 text-sm border-b border-bone/40 hover:border-bone pb-1 transition-colors"
          >
            hello@onyxcreative.asia
          </a>
        </div>
      </section>

      {/* Lower grid */}
      <section className="container-x py-14 grid grid-cols-2 md:grid-cols-12 gap-8 text-sm">
        <div className="col-span-2 md:col-span-4">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
            {t("Studio")}
          </p>
          <p className="leading-relaxed opacity-80 max-w-xs">
            {t(
              "Onyx Creative Asia, an independent studio in Bali, building brands, performance, and AI systems for ambitious teams.",
            )}
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
            {t("Sitemap")}
          </p>
          <ul className="space-y-2">
            {SITEMAP.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:opacity-60 transition-opacity">
                  {t(l.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
            {t("Services")}
          </p>
          <ul className="space-y-2">
            {SERVICES_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:opacity-60 transition-opacity">
                  {t(l.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-4">
            {t("Legal")}
          </p>
          <ul className="space-y-2">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:opacity-60 transition-opacity">
                  {t(l.label)}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] opacity-60">
            Bali, ID
          </p>
        </div>
      </section>

      {/* Massive wordmark */}
      <div className="container-x pb-10">
        <div className="border-t border-hairline-light pt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] opacity-60">
            © {new Date().getFullYear()} Onyx Creative Asia. {t("All rights reserved.")}
          </span>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] opacity-60">
            {t("Made with intent in Bali")}
          </span>
        </div>
      </div>

      <div className="leading-none select-none pointer-events-none px-2">
        <h3
          aria-hidden
          className="text-display-xl font-medium tracking-[-0.05em] text-bone leading-[0.85] pb-4"
        >
          ONYX
          <span className="font-normal italic"> Creative</span>
        </h3>
      </div>
    </footer>
  );
}
