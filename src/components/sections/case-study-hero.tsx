import { AppLink as Link } from "@/components/layout/app-link";
import {
  Container,
  Eyebrow,
  PlaceholderNote,
  Reveal,
} from "@/components/marketing";
import { MediaFrame } from "@/components/media";
import { getTranslations } from "@/i18n/server";
import { APP_ROUTES } from "@/constants";
import type { Project } from "@/content";

/**
 * The case-study opening: the media at full width, with the project's facts
 * pinned beside the summary in a sticky rail.
 *
 * The rail is the mechanic worth borrowing from the best studio sites, what
 * this is stays on screen while the reader moves through what it took. It is
 * `position: sticky` on a grid column, so it costs nothing and degrades to
 * normal flow below `lg`.
 */
/** True when a piece of media is taller than it is wide. */
function isPortrait(media: Project["heroMedia"]): boolean {
  return media.kind === "image"
    ? media.height > media.width
    : media.aspect === "9/16" || media.aspect === "4/5";
}

/**
 * How many gallery items the hero consumes. A single phone alone in a
 * 1200px column reads as an accident rather than a composition, so a mobile
 * project opens on a row of three screens instead, and the gallery below
 * skips the ones already shown.
 */
export function heroMediaCount(project: Project): number {
  return isPortrait(project.heroMedia) ? 2 : 0;
}

export async function CaseStudyHero({ project }: { project: Project }) {
  const t = await getTranslations();
  const facts = [
    { label: t("site.industry"), value: project.industry },
    { label: t("site.productType"), value: project.productType },
    { label: t("site.period"), value: project.period },
    { label: t("site.platforms"), value: project.platforms.join(", ") },
  ];

  return (
    <section
      data-surface="slab"
      className="wash-slab grain pt-28 pb-16 md:pt-36 md:pb-24"
    >
      <Container>
        <div className="flex flex-col gap-10">
          <Reveal variant="fade" className="flex flex-col gap-6">
            <Link
              href={APP_ROUTES.work}
              className="tap-target text-mono-label text-muted-foreground hover:text-foreground focus-visible:outline-ring w-fit rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              ← {t("site.allWork")}
            </Link>
            <Eyebrow>{project.industry}</Eyebrow>
            <h1 className="text-display-1 max-w-4xl text-balance">
              {project.name}
            </h1>
            <p className="text-lead text-muted-foreground">{project.tagline}</p>
          </Reveal>

          <Reveal variant="fade" delay={80}>
            {isPortrait(project.heroMedia) ? (
              <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-8">
                {[
                  project.heroMedia,
                  ...project.galleryMedia.slice(0, heroMediaCount(project)),
                ].map((media, index) => (
                  // A definite width at every breakpoint: `w-auto` here would
                  // shrink-wrap the wrapper, and the device shell inside sizes
                  // itself with `w-full`.
                  <div
                    key={index}
                    className="w-[68%] max-w-[17rem] sm:w-[17rem]"
                  >
                    <MediaFrame
                      media={media}
                      priority={index === 0}
                      sizes="(min-width: 640px) 272px, 68vw"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <MediaFrame
                media={project.heroMedia}
                priority
                sizes="(min-width: 1280px) 1200px, 94vw"
              />
            )}
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
                    {t("site.whatWeDid")}
                  </dt>
                  <dd className="text-marketing-body text-muted-foreground">
                    {project.whatWeDid}
                  </dd>
                </div>
                <div className="flex flex-col gap-1.5">
                  <dt className="text-eyebrow text-muted-foreground">
                    {t("site.outcome")}
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
                  {project.isDraft && (
                    <PlaceholderNote>
                      Figures shown are not yet verified against a measured
                      source.
                    </PlaceholderNote>
                  )}
                </div>
              )}

              {project.isDraft && (
                <PlaceholderNote tone="panel">
                  Draft write-up. The product and the screens are real; this
                  account of the work is a draft awaiting review by the team who
                  built it, and by the client.
                </PlaceholderNote>
              )}
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
