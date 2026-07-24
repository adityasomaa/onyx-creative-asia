"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { SERVICES } from "@/lib/data";
import ProjectForm from "@/components/contact/forms/ProjectForm";
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
  const pathname = usePathname();
  // /contact is a chrome-less canvas: no footer there.
  if (pathname === "/contact") return null;
  return (
    <footer className="relative bg-ink text-bone overflow-hidden">
      {/* Big CTA + embedded project form */}
      <section className="container-x pt-24 pb-16 md:pt-32 md:pb-24 border-b border-hairline-light">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
              {t("Contact")}
            </p>
            <motion.h2
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1, ease: EASE }}
              className="text-4xl sm:text-5xl md:text-display-md font-medium leading-[1.02] tracking-tight text-balance"
            >
              {t("Ready to grow your business")}{" "}
              <span className="font-light italic">{t("the correct way?")}</span>
            </motion.h2>
            <p className="mt-6 max-w-md text-base md:text-lg leading-relaxed opacity-75">
              {t(
                "Tell us a little about your business and what you need. We'll take it from there.",
              )}
            </p>
          </div>

          <div className="flex h-[440px] flex-col rounded-3xl bg-bone p-6 text-ink md:h-[460px] md:p-8">
            <div className="min-h-0 flex-1">
              <ProjectForm submitLabel="Send" />
            </div>
          </div>
        </div>
      </section>

      {/* Lower grid */}
      <section className="container-x py-14 grid grid-cols-2 md:grid-cols-12 gap-8 text-sm">
        <div className="col-span-2 md:col-span-4">
          <p className="text-lg font-medium tracking-tight">
            Onyx Creative Asia
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.22em] opacity-60">
            #1 Digital Marketing in Asia
          </p>
          <p className="mt-4 max-w-xs leading-relaxed opacity-80">
            {t("Your one stop business development digital solution")}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://www.instagram.com/onyxcreative.asia"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline-light transition-colors hover:bg-bone hover:text-ink"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@onyxcreative.asia"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="TikTok"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline-light transition-colors hover:bg-bone hover:text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M13 3v11.2a3.2 3.2 0 1 1-2.5-3.12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13 3c.4 2.5 2 4.3 4.5 4.6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
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
        </div>
      </section>

      {/* Massive wordmark */}
      <div className="container-x pb-10">
        <div className="border-t border-hairline-light pt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] opacity-60">
            © {new Date().getFullYear()} Onyx Creative Asia. {t("All rights reserved.")}
          </span>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] opacity-60">
            {t("Made with intent in Bali, Indonesia")}
          </span>
        </div>
      </div>

      <div className="leading-none select-none pointer-events-none px-2">
        <h3
          aria-hidden
          className="text-display-xl font-medium tracking-[-0.05em] text-bone leading-[0.85] pb-4"
        >
          ONYX
          <span className="font-light italic"> Creative</span>
        </h3>
      </div>
    </footer>
  );
}
