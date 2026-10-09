import Hero from "@/components/home/Hero";
import DisciplinesVelocity from "@/components/home/DisciplinesVelocity";
import ThreeJobs from "@/components/home/ThreeJobs";
import AboutPreview from "@/components/home/AboutPreview";
import ServicesPreview from "@/components/home/ServicesPreview";
import FeaturedWorks from "@/components/home/FeaturedWorks";
import Testimonials from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <DisciplinesVelocity />
      <AboutPreview />
      <ThreeJobs />
      <ServicesPreview />
      <FeaturedWorks />
      <Testimonials />
      {/* Section #6 (CTA) is rendered by the global Footer below. */}
    </>
  );
}
