import type { Metadata } from "next";
import { Suspense } from "react";
import ContactForm from "@/components/contact/ContactForm";
import { RevealText } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what you're working on. Project briefs, general questions, careers, or partnerships — we reply within 48 hours.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Onyx Creative Asia",
    description:
      "Briefs, questions, careers, partnerships. We reply within 48 hours.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="container-x pt-40 md:pt-52 pb-12 md:pb-16">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
          (Get in touch)
        </p>
        <h1 className="text-display-md font-medium leading-[0.92] tracking-tight max-w-5xl text-balance">
          <RevealText text="Let's start" />
          <br />
          <span className="font-light italic">
            <RevealText text="a conversation." delay={0.15} />
          </span>
        </h1>
        <p className="mt-14 md:mt-10 max-w-xl text-lg text-ink/70 leading-relaxed">
          Project brief, quick question, job application, or partnership
          proposal — pick the path below and we&apos;ll tailor the form. We
          read every message and reply within 48 hours.
        </p>
      </section>

      <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-16 md:pt-20">
        <Suspense fallback={null}>
          <ContactForm />
        </Suspense>
      </section>
    </>
  );
}
