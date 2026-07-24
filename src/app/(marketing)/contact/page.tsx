import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import HeroVideo from "@/components/home/HeroVideo";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Start a project",
  description:
    "Tell us what you're working on. Project briefs, general questions, careers, or partnerships.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Start a project, Onyx Creative Asia",
    description: "Tell us what you're working on.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  // Canvas layout: no site header or footer (hidden on this route), the
  // same monochrome hero video behind a heavy overlay, and a single
  // centered, boxed form that steps through one question at a time.
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink px-4 py-16 md:py-20">
      <HeroVideo />

      <Link
        href="/"
        aria-label="Onyx Creative Asia, home"
        className="absolute left-5 top-5 z-20 block h-6 w-[48px] transition-transform duration-500 ease-out-expo hover:scale-[1.05] md:left-8 md:top-7 md:h-7 md:w-[56px]"
      >
        <Image
          src="/onyx-logo-white.png"
          alt="Onyx Creative Asia"
          fill
          priority
          sizes="56px"
          className="object-contain object-left"
        />
      </Link>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="flex h-[600px] max-h-[calc(100svh-6rem)] flex-col rounded-3xl bg-bone p-6 text-ink shadow-[0_40px_120px_-40px_rgba(0,0,0,0.7)] md:h-[640px] md:p-9">
          <Suspense fallback={null}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
