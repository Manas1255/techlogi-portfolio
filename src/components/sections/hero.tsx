import Link from "next/link";
import { Container, Eyebrow, Reveal } from "@/components/marketing";
import { MediaFrame } from "@/components/media";
import { Button } from "@/components/ui/button";
import { APP_ROUTES, caseStudyPath } from "@/constants";
import { featuredProjects } from "@/content";
import { InquiryTrigger } from "@/features/inquiry";

/**
 * THE HERO.
 *
 * Four questions in the first seconds: who Techlogi is, what it builds, why to
 * trust it, and what to do next. The headline answers the first two, the
 * capability rail answers the third by naming artifacts rather than adjectives,
 * and both CTAs are above the fold on every viewport.
 *
 * The visual side is a real product interface, not artwork. It is a synthetic
 * composition (see `components/media/compositions`) rather than a video,
 * because the largest contentful element on this page must not be a
 * multi-megabyte autoplaying file — the showreel below handles motion once the
 * page has already painted.
 *
 * The headline is a Server Component. `mask-line` reveals it per line, and if
 * the reveal script never runs, the text is simply there.
 */
export function Hero() {
  const [lead] = featuredProjects();

  return (
    <section
      data-surface="ink"
      className="grain relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24"
    >
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="flex flex-col gap-8">
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

            <Reveal delay={180} className="flex flex-wrap items-center gap-3">
              <InquiryTrigger origin="hero" size="lg" />
              <Button asChild size="lg" variant="outline">
                <Link href={APP_ROUTES.work}>Explore Our Work</Link>
              </Button>
            </Reveal>

            {/* Capability rail — concrete nouns instead of a trust badge. */}
            <Reveal delay={240} variant="fade" className="pt-2">
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

          {/* Composition: a lead interface, with a second offset behind it. */}
          <Reveal variant="fade" delay={120} className="relative">
            <div className="relative">
              <Link
                href={caseStudyPath(lead.slug)}
                className="group focus-visible:outline-ring rounded-frame block focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <MediaFrame
                  media={lead.heroMedia}
                  priority
                  sizes="(min-width: 1024px) 46vw, 92vw"
                />
                <span className="sr-only">
                  {lead.name} — {lead.tagline}. View case study.
                </span>
              </Link>
            </div>

            <p className="text-mono-label text-muted-foreground mt-4">
              <span className="text-foreground">{lead.name}</span> ·{" "}
              {lead.tagline}
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
