import { OrganizationSchema } from "@/components/layout/structured-data";
import {
  BookACall,
  FaqSection,
  FeaturedWork,
  Hero,
  HowItWorks,
  ProductStrip,
  ProofSection,
  WhatWeBuild,
} from "@/components/sections";

/**
 * THE HOME PAGE, as one argument rather than a stack of sections.
 *
 * Every band answers the objection raised by the one above it, and the page is
 * finished when there are none left:
 *
 *   Hero            what we make, and the one thing to do about it
 *   ProductStrip    "…but have you actually shipped anything?"  Seven marks.
 *   HowItWorks      "…this will be a six-month procurement."    Five steps.
 *   WhatWeBuild     "…but can you build MY thing?"              Eight answers.
 *   FeaturedWork    "…show me one properly."                    Four studies.
 *   ProofSection    "…what is it like when it goes wrong?"
 *   FaqSection      "…what does it cost?"                       Real numbers.
 *   BookACall       nothing left. Pick a time.
 *
 * Order is the design here. The previous page put the portfolio second and the
 * process seventh, which showed people the work before telling them how to buy
 * it, and buried the how-we-work answer past the point most readers stop. This
 * one establishes credibility in the first screen and a half, then spends the
 * middle of the page on the two things a buyer actually needs (how it works,
 * and whether we build their category), and closes on the calendar.
 *
 * The ground alternates so it reads as chapters: ink through the hero and the
 * product strip, paper for process, stone for capabilities, paper for the
 * work, stone for proof, paper for the FAQ, ink again for the close. Two ink
 * bands, no more, and no two adjacent sections share a ground. A sweep test
 * asserts it, because a later insertion is exactly what quietly breaks it.
 */
export function HomeScreen() {
  return (
    <>
      <OrganizationSchema />
      <Hero />
      <ProductStrip />
      <HowItWorks />
      <WhatWeBuild />
      <FeaturedWork />
      <ProofSection />
      <FaqSection />
      <BookACall origin="home-close" withScheduler />
    </>
  );
}
