import Hero from "@/components/home/Hero";
import ServicesPreview from "@/components/home/ServicesPreview";
import FeaturedWorks from "@/components/home/FeaturedWorks";
import ClientRow from "@/components/home/ClientRow";
import InsightsPreview from "@/components/home/InsightsPreview";

/**
 * Rebrand 2026: the homepage follows the reference layout, which runs
 * hero, services, selected work, trusted-by, insights, then the CTA band
 * the global Footer already renders.
 *
 * Two sections from the reference are deliberately absent. Its results
 * panel (312% traffic, 218% leads, 52% conversion, 4.9/5) and its client
 * logos are placeholder content invented for the mockup; none of those
 * figures or brands exist in our data. The trusted-by row is rebuilt from
 * the real client list instead, and the results panel waits on real
 * numbers rather than shipping invented ones.
 *
 * The old About and Testimonials blocks are dropped from the homepage to
 * match the reference. Both still live on their own pages.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesPreview />
      <FeaturedWorks />
      <ClientRow />
      <InsightsPreview />
    </>
  );
}
