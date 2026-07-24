import type { Metadata } from "next";
import { Suspense } from "react";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what you're working on. Project briefs, general questions, careers, or partnerships, we reply within 48 hours.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact, Onyx Creative Asia",
    description:
      "Briefs, questions, careers, partnerships. We reply within 48 hours.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  // No hero: the page is a single, non-scrolling screen. The fixed nav is
  // cleared with top padding; the form fills the rest and steps through
  // one field at a time so nothing overflows on any viewport.
  return (
    <section className="flex h-[100svh] flex-col overflow-hidden">
      <div className="container-x flex min-h-0 flex-1 flex-col pt-24 pb-6 md:pt-28 md:pb-8">
        <Suspense fallback={null}>
          <ContactForm />
        </Suspense>
      </div>
    </section>
  );
}
