import { AppLink as Link } from "@/components/layout/app-link";
import {
  Container,
  PlaceholderNote,
  Reveal,
  Section,
} from "@/components/marketing";
import { MediaFrame } from "@/components/media";
import {
  CaseStudyHero,
  CaseStudySection,
  BookACall,
  heroMediaCount,
} from "@/components/sections";
import { CaseStudySchema } from "@/components/layout/structured-data";
import { caseStudyPath } from "@/constants";
import { siteConfig } from "@/config/site";
import { nextProject, type Project } from "@/content";
import { getLocale, getTranslations } from "@/i18n/server";

/**
 * A case study, assembled entirely from the content model.
 *
 * Nothing here is project-specific: the hero, the five narrative blocks, the
 * gallery, the quote and the next-project link all read from the entry in
 * `src/content/projects.ts`. Adding a case study is a data addition plus media.
 */
export async function CaseStudyScreen({ project }: { project: Project }) {
  const t = await getTranslations();
  const next = nextProject(project.slug, await getLocale());
  // A mobile project's hero shows a row of screens; the gallery picks up from
  // wherever that left off rather than repeating them.
  const gallery = project.galleryMedia.slice(heroMediaCount(project));

  return (
    <>
      <CaseStudySchema
        name={`${project.name}, ${project.tagline}`}
        description={project.summary}
        url={`${siteConfig.url}${caseStudyPath(project.slug)}`}
      />
      <CaseStudyHero project={project} />

      <Section rhythm="base" divided>
        <div className="flex flex-col gap-16 md:gap-20">
          {project.caseStudySections.map((section, index) => (
            <CaseStudySection
              key={section.kind}
              section={section}
              index={index}
            />
          ))}
        </div>
      </Section>

      {gallery.length > 0 && (
        <Section width="wide" rhythm="base" divided>
          <Reveal variant="fade" className="flex flex-col gap-8">
            <p className="text-eyebrow text-muted-foreground">
              {t("pages.caseStudy.moreFrom", { project: project.name })}
            </p>
            <div className="grid gap-8 lg:grid-cols-2">
              {gallery.map((media, index) => (
                <MediaFrame
                  key={index}
                  media={media}
                  sizes="(min-width: 1024px) 46vw, 92vw"
                />
              ))}
            </div>
          </Reveal>
        </Section>
      )}

      {project.testimonial !== null && (
        <Section rhythm="base" className="bg-sunken">
          <Reveal
            as="figure"
            className="max-w-reading mx-auto flex flex-col gap-6"
          >
            <blockquote className="text-quote text-balance">
              <span aria-hidden="true" className="text-primary">
                &ldquo;
              </span>
              {project.testimonial.quote}
              <span aria-hidden="true" className="text-primary">
                &rdquo;
              </span>
            </blockquote>
            <figcaption className="flex flex-col gap-1.5">
              <span className="text-[0.9375rem] font-medium">
                {project.testimonial.person}
              </span>
              <span className="text-muted-foreground text-sm">
                {project.testimonial.role}, {project.testimonial.company}
              </span>
              {project.testimonial.isPlaceholder && (
                <PlaceholderNote className="pt-2">
                  Placeholder, awaiting an approved client quote.
                </PlaceholderNote>
              )}
            </figcaption>
          </Reveal>
        </Section>
      )}

      {next !== undefined && (
        <section className="border-hairline border-t">
          <Container>
            <Link
              href={caseStudyPath(next.slug)}
              className="group focus-visible:outline-ring flex flex-col gap-8 py-16 focus-visible:outline-2 focus-visible:-outline-offset-4 md:flex-row md:items-center md:justify-between md:py-20"
            >
              <div className="flex flex-col gap-3">
                <span className="text-eyebrow text-muted-foreground">
                  {t("site.nextProject")}
                </span>
                <span className="text-display-1">{next.name}</span>
                <span className="text-muted-foreground text-lg">
                  {next.tagline}
                </span>
              </div>
              <div className="w-full shrink-0 md:w-80 lg:w-96">
                <MediaFrame
                  media={next.heroMedia}
                  sizes="(min-width: 768px) 384px, 92vw"
                />
              </div>
            </Link>
          </Container>
        </section>
      )}

      <BookACall
        origin={`case-study:${project.slug}`}
        title={t("pages.caseStudy.closeTitle")}
        lead={t("pages.caseStudy.closeLead")}
      />
    </>
  );
}
