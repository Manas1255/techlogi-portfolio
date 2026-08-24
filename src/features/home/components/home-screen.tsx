import {
  ClosingCta,
  FeaturedWork,
  Hero,
  ProcessSection,
  ServicesSection,
  Showreel,
  TechnologiesSection,
  TestimonialsSection,
} from "@/components/sections";

/**
 * The home page, as one composed experience.
 *
 * The ground alternates on purpose so the page reads as chapters rather than a
 * stack: ink through the hero, reel and portfolio; bone for services; back to
 * ink for process and stack; bone for proof; ink for the close. No two adjacent
 * sections share a composition, and the card grid appears exactly once.
 */
export function HomeScreen() {
  return (
    <>
      <Hero />
      <Showreel />
      <FeaturedWork />
      <ServicesSection />
      <ProcessSection />
      <TechnologiesSection />
      <TestimonialsSection />
      <ClosingCta origin="home-close" />
    </>
  );
}
