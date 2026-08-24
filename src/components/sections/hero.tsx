import Link from "next/link";
import { Container, Eyebrow, Reveal } from "@/components/marketing";
import { MediaFrame } from "@/components/media";
import { APP_ROUTES, caseStudyPath } from "@/constants";
import { HERO_PROJECT_SLUG, findProject, projects } from "@/content";
import { HeroInquiryForm } from "@/features/inquiry";

/**
 * THE HERO.
 *
 * Four questions in the first seconds: who Techlogi is, what it builds, why to
 * trust it, and what to do next. The headline answers the first two, the
 * capability rail answers the third by naming artifacts rather than adjectives,
 * and the fourth is not a button that routes somewhere — it is a form, right
 * there, above the fold.
 *
 * That is the whole shape of this section. A visitor is at their most willing
 * in the first few seconds and least willing to be sent somewhere else; a hero
 * whose primary action is "go to a contact page" spends that willingness on
 * navigation. The four-step dialog still exists for anyone who wants to brief
 * properly — the header's "Start a Project" opens it — but the default path is
 * four fields and done.
 *
 * Beneath the fold the section keeps going into a proof band: one real product
 * at full measure, captioned, so the claim above it is answered by evidence
 * rather than by another claim.
 */
export function Hero() {
  // The lead frame is chosen by slug rather than by position: it is an
  // art-direction decision about which product opens the site, and it should
  // not silently change because the portfolio was reordered.
  const lead = findProject(HERO_PROJECT_SLUG) ?? projects[0];

  return (
    <section className="wash-warm grain relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <Container>
        {/*
          Three grid children, ordered for a PHONE: copy, then the form, then
          the capability rail. On a narrow screen the rail would otherwise push
          the form most of a screen further down, and the form is the point of
          this section. On `lg` the rail returns to the left column under the
          copy and the form spans both rows on the right, which is the
          composition the desktop layout wants — no duplicated markup, and
          nothing hidden at either size.
        */}
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-16 lg:gap-y-10">
          <div className="flex flex-col gap-8 lg:col-start-1 lg:row-start-1 lg:pt-6">
            <Reveal variant="fade">
              <Eyebrow>Product engineering studio</Eyebrow>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="text-hero text-balance">
                <span className="mask-line">
                  <span>We build production</span>
                </span>
                <span className="mask-line">
                  <span>software for companies</span>
                </span>
                <span className="mask-line">
                  <span>
                    that can&apos;t afford a{" "}
                    <span className="text-primary">rewrite</span>.
                  </span>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="text-lead text-muted-foreground">
                Web applications, SaaS platforms, mobile apps and AI systems —
                taken from discovery to production, then kept fast, secure and
                worth using long after launch.
              </p>
            </Reveal>
          </div>

          <Reveal
            variant="lift"
            delay={100}
            className="lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1"
          >
            <HeroInquiryForm />
          </Reveal>

          {/* Capability rail — concrete nouns instead of a trust badge. */}
          <Reveal
            delay={180}
            variant="fade"
            className="lg:col-start-1 lg:row-start-2"
          >
            <dl className="border-hairline grid grid-cols-2 gap-x-8 gap-y-5 border-t pt-6 sm:grid-cols-4">
              {[
                { term: "Discovery", detail: "to a written plan" },
                { term: "Design", detail: "as a system" },
                { term: "Engineering", detail: "typed end to end" },
                { term: "After launch", detail: "we stay on" },
              ].map((item) => (
                <div key={item.term} className="flex flex-col gap-1">
                  <dt className="text-mono-label text-foreground">
                    {item.term}
                  </dt>
                  <dd className="text-muted-foreground text-[0.8125rem] leading-snug">
                    {item.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* The proof band: one real product, at full measure, captioned. */}
        <Reveal variant="fade" delay={80} className="mt-20 md:mt-28">
          <div className="flex flex-col gap-5">
            <div className="border-hairline flex flex-wrap items-end justify-between gap-4 border-t pt-6">
              <p className="text-mono-label text-muted-foreground">
                <span className="text-foreground">{lead.name}</span> ·{" "}
                {lead.tagline}
              </p>
              <Link
                href={caseStudyPath(lead.slug)}
                className="text-mono-label text-muted-foreground hover:text-foreground focus-visible:outline-ring rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                View case study →
              </Link>
            </div>

            <Link
              href={caseStudyPath(lead.slug)}
              className="group rounded-frame focus-visible:outline-ring block focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <MediaFrame
                media={lead.heroMedia}
                priority
                sizes="(min-width: 1280px) 1200px, 94vw"
              />
              <span className="sr-only">
                {lead.name} — {lead.tagline}. View case study.
              </span>
            </Link>

            <p className="text-mono-label text-muted-foreground">
              <Link
                href={APP_ROUTES.work}
                className="hover:text-foreground transition-colors"
              >
                Explore all work →
              </Link>
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
