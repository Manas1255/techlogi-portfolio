/**
 * Page sections.
 *
 * This is composition tier, alongside `components/layout` — a section may reach
 * into `features/` (the closing CTA embeds the inquiry's first step), which is
 * why it is deliberately outside the shared-layer import boundary.
 */
export { Hero } from "./hero";
export { Showreel } from "./showreel";
export { ProjectPanel, type ProjectPanelProps } from "./project-panel";
export { FeaturedWork } from "./featured-work";
export { ServicesSection } from "./services-section";
export { ProcessSection } from "./process-section";
export { TechnologiesSection } from "./technologies-section";
export { TestimonialsSection } from "./testimonials-section";
export { CaseStudyHero, heroMediaCount } from "./case-study-hero";
export {
  CaseStudySection,
  type CaseStudySectionProps,
} from "./case-study-section";
export { ClosingCta, type ClosingCtaProps } from "./closing-cta";
