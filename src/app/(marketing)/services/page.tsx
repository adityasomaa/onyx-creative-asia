import type { Metadata } from "next";
import ServicesIndex from "@/components/services/ServicesIndex";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Six services from one team in Bali: web and software development, branding and design, ads management, social media management, growth and analytics, and AI automation.",
  alternates: { canonical: "/services" },
  openGraph: { title: "Services | Onyx Creative Asia", url: "/services" },
};

export default function ServicesPage() {
  return <ServicesIndex />;
}
