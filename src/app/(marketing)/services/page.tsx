import type { Metadata } from "next";
import { RevealText } from "@/components/Reveal";
import ServicesStack from "@/components/services/ServicesStack";
import { T } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Digital presence, digital marketing, creative studio, AI automation, growth and analytics, and managed services, all from one team.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services, Onyx Creative Asia",
    description:
      "Six services, one team. Everything your business needs to grow digitally.",
    url: "/services",
    type: "website",
  },
};

export default function ServicesPage() {
  return (
    <>
      <section className="container-x pt-40 md:pt-52 pb-12 md:pb-16">
        <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-6">
          <T>Services</T>
        </p>
        <h1 className="text-display-md font-medium leading-[0.95] tracking-tight max-w-5xl text-balance">
          <RevealText text="Everything we do" />
        </h1>
        <p className="mt-8 max-w-xl text-lg text-ink/70 leading-relaxed">
          <T>
            Six services that cover everything your business needs to grow
            online, run by one team so nothing falls between the gaps.
          </T>
        </p>
      </section>

      <ServicesStack />
    </>
  );
}
