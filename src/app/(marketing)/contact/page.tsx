import type { Metadata } from "next";
import { Suspense } from "react";
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
  // The site header stays (it carries the logo and nav); the footer is
  // suppressed on this route. The section is pinned to exactly one screen
  // so the page itself never scrolls, and the form sizes to its content
  // rather than reserving a fixed block of height.
  return (
    <section className="relative flex h-[100svh] items-center justify-center overflow-hidden bg-ink px-4 pt-16 md:pt-20">
      <HeroVideo />

      {/* No panel behind the form: bone text straight on the video,
          centred at every width. */}
      <div className="relative z-10 w-full max-w-2xl">
        <div
          className="flex max-h-[calc(100svh-7rem)] flex-col p-2 text-center text-bone md:p-4"
          style={
            {
              // Bone on ink for this surface; see --form-* in globals.css.
              // Fields centre, but the step nav stays split so Back sits at
              // the left edge of the field and Next at the right.
              "--form-fg": "#FFFFFF",
              "--form-bg": "#0A0A0A",
              "--form-justify": "center",
              "--form-nav-justify": "space-between",
            } as React.CSSProperties
          }
        >
          <Suspense fallback={null}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
