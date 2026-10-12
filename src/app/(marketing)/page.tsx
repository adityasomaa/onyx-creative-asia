import type { Metadata } from "next";
import { FAQ } from "@/lib/copy";
import Hero from "@/components/home2/Hero";
import ClientLogos from "@/components/home2/ClientLogos";
import Showreel from "@/components/home2/Showreel";
import Expertise from "@/components/home2/Expertise";
import Results from "@/components/home2/Results";
import WorkIndex from "@/components/home2/WorkIndex";
import Manifesto from "@/components/home2/Manifesto";
import Process from "@/components/home2/Process";
import ClientWords from "@/components/home2/ClientWords";
import Pricing from "@/components/home2/Pricing";
import Faq from "@/components/home2/Faq";
import NotesTeaser from "@/components/home2/NotesTeaser";

export const metadata: Metadata = {
  title: { absolute: "Onyx Creative Asia | Digital Business Development Agency in Bali, Asia" },
  description:
    "Digital business development agency in Bali. Websites, software and mobile apps, plus social media, SEO/AEO/GEO, ads, content, photo and video, branding and analytics, from one team.",
  alternates: { canonical: "/" },
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.items.map((f) => ({
    "@type": "Question",
    name: f.q.en,
    acceptedAnswer: { "@type": "Answer", text: f.a.en },
  })),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />
      <Hero />
      <ClientLogos />
      <Showreel />
      <Expertise />
      <Results />
      <WorkIndex />
      <Manifesto />
      <Process />
      <ClientWords />
      <Pricing />
      <Faq />
      <NotesTeaser />
    </>
  );
}
