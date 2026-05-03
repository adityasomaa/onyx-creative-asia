import Hero from "@/components/home/Hero";
import Clients from "@/components/home/Clients";
import FeaturedWorks from "@/components/home/FeaturedWorks";
import ServicesPreview from "@/components/home/ServicesPreview";
import Manifesto from "@/components/home/Manifesto";
import Stats from "@/components/home/Stats";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Clients />
      <FeaturedWorks />
      <ServicesPreview />
      <Manifesto />
      <Stats />
    </>
  );
}
