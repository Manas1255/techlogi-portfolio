import Link from "next/link";
import {
  Container,
  Eyebrow,
  PlaceholderNote,
  Reveal,
} from "@/components/marketing";
import { MediaFrame } from "@/components/media";
import { APP_ROUTES } from "@/constants";
import type { Project } from "@/content";

/**
 * The case-study opening: the media at full width, with the project's facts
 * pinned beside the summary in a sticky rail.
 *
 * The rail is the mechanic worth borrowing from the best studio sites — what
 * this is stays on screen while the reader moves through what it took. It is
 * `position: sticky` on a grid column, so it costs nothing and degrades to
 * normal flow below `lg`.
 */
export function CaseStudyHero({ project }: { project: Project }) {
  const facts = [
    { label: "Industry", value: project.industry },
    { label: "Product", value: project.productType },
    { label: "Period", value: project.period },
    { label: "Platforms", value: project.platforms.join(", ") },
  ];

  return (
    <section data-surface="ink" className="grain pt-28 pb-16 md:pt-36 md:pb-24">
      <Container>
        <div className="flex flex-col gap-10">
          <Reveal variant="fade" className="flex flex-col gap-6">
            <Link
              href={APP_ROUTES.work}
              className="text-mono-label text-muted-foreground hover:text-foreground focus-visible:outline-ring w-fit rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              ← All work
            </Link>
            <Eyebrow>{project.industry}</Eyebrow>
            <h1 className="text-display-1 max-w-4xl text-balance">
              {project.name}
            </h1>
            <p className="text-lead text-muted-foreground">{project.tagline}</p>
          </Reveal>

          <Reveal variant="fade" delay={80}>
            <MediaFrame
              media={project.heroMedia}
              priority
              sizes="(min-width: 1280px) 1200px, 94vw"
            />
          </Reveal>

          <div className="grid gap-10 pt-4 lg:grid-cols-[18rem_1fr] lg:gap-16">
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <dl className="border-hairline flex flex-col border-t">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="border-hairline flex flex-col gap-1 border-b py-3.5"
                  >
                    <dt className="text-eyebrow text-muted-foreground">
                      {fact.label}
                    </dt>
                    <dd className="text-[0.9375rem]">{fact.value}</dd>
                  </div>
                ))}
                <div className="flex flex-col gap-2 py-4">
                  <dt className="text-eyebrow text-muted-foreground">
                    Services
                  </dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {project.services.map((service) => (
                      <span
                        key={service}
                        className="border-hairline text-mono-label text-muted-foreground rounded-full border px-2.5 py-1"
                      >
                        {service}
                      </span>
                    ))}
                  </dd>
                </div>
                {project.technologies.length > 0 && (
                  <div className="border-hairline flex flex-col gap-2 border-t py-4">
                    <dt className="text-eyebrow text-muted-foreground">
                      Technology
                    </dt>
                    <dd className="text-mono-label text-muted-foreground leading-relaxed">
                      {project.technologies.join(" · ")}
                    </dd>
                  </div>
                )}
              </dl>
            </Reveal>

            <Reveal delay={60} className="flex flex-col gap-8">
              <p className="text-display-3 text-balance">{project.summary}</p>

              <dl className="border-hairline grid gap-x-10 gap-y-5 border-t pt-6 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <dt className="text-eyebrow text-muted-foreground">
                    What we did
                  </dt>
                  <dd className="text-marketing-body text-muted-foreground">
                    {project.whatWeDid}
                  </dd>
                </div>
                <div className="flex flex-col gap-1.5">
                  <dt className="text-eyebrow text-muted-foreground">
                    Outcome
                  </dt>
                  <dd className="text-marketing-body text-muted-foreground">
                    {project.outcome}
                  </dd>
                </div>
              </dl>

              {project.metrics.length > 0 && (
                <div className="flex flex-col gap-4">
                  <dl className="grid gap-6 sm:grid-cols-3">
                    {project.metrics.map((metric) => (
                      <div key={metric.label} className="flex flex-col gap-1.5">
                        <dd className="text-display-2 text-primary tabular-nums">
                          {metric.value}
                        </dd>
                        <dt className="text-muted-foreground text-sm leading-snug">
                          {metric.label}
                        </dt>
                      </div>
                    ))}
                  </dl>
                  {project.isPlaceholder && (
                    <PlaceholderNote>
                      Figures shown are illustrative placeholders, not measured
                      results.
                    </PlaceholderNote>
                  )}
                </div>
              )}

              {project.isPlaceholder && (
                <PlaceholderNote tone="panel">
                  Illustrative case study. The engagement, the figures and the
                  quotes are placeholders until real, cleared client work
                  replaces them.
                </PlaceholderNote>
              )}
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
