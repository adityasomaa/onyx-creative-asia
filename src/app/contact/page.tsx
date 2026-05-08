import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { RevealText } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your project. We reply within 48 hours — no account managers, no decks-first.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Onyx Creative Asia",
    description:
      "Brief us. We reply within 48 hours.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="container-x pt-40 md:pt-52 pb-12 md:pb-16">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
          (Start a project)
        </p>
        <h1 className="text-display-md font-medium leading-[0.92] tracking-tight max-w-5xl text-balance">
          <RevealText text="Tell us what you're" />
          <br />
          <span className="font-light italic">
            <RevealText text="trying to build." delay={0.15} />
          </span>
        </h1>
        <p className="mt-14 md:mt-10 max-w-xl text-lg text-ink/70 leading-relaxed">
          The form below goes straight to our inbox. The more you can share —
          goals, timing, what&apos;s already in flight — the sharper our reply.
        </p>
      </section>

      <section className="container-x pb-24 md:pb-32 border-t border-hairline pt-16 md:pt-20">
        <ContactForm />
      </section>
    </>
  );
}
