import {
  Container,
  Eyebrow,
  HairlineList,
  Reveal,
  Section,
} from "@/components/marketing";
import { MediaFrame } from "@/components/media";
import {
  BookACall,
  HowItWorks,
  TechnologiesSection,
} from "@/components/sections";
import { caseStudyPath } from "@/constants";
import { findProject, getContent } from "@/content";
import { ArrowLink } from "@/components/marketing";
import { getLocale, getTranslations } from "@/i18n/server";

/**
 * `/services`, the long form of the capability index.
 *
 * The home page's tabbed version is for scanning; this one is for reading, so
 * every group is expanded and anchored (`/services#engineering`), which is what
 * the footer links point at. Composition alternates side per group so six
 * sections in a row don't read as one long list.
 */
export async function ServicesScreen() {
  const t = await getTranslations();
  const locale = await getLocale();
  const { serviceGroups } = getContent(locale);

  return (
    <>
      <section
        data-surface="slab"
        className="wash-slab grain pt-32 pb-16 md:pt-40 md:pb-20"
      >
        <Container>
          <div className="flex flex-col gap-6">
            <Reveal variant="fade">
              <Eyebrow>{t("pages.services.eyebrow")}</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="text-display-1 max-w-4xl text-balance">
                {t("pages.services.title")}
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-lead text-muted-foreground">
                {t("pages.services.lead")}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {serviceGroups.map((group, index) => {
        const related =
          group.relatedProjectSlug === null
            ? undefined
            : findProject(group.relatedProjectSlug, locale);
        const isReversed = index % 2 === 1;

        return (
          <Section
            key={group.id}
            id={group.id}
            surface={index % 2 === 1 ? "slab" : "inherit"}
            rhythm="base"
            divided={index % 2 === 0}
          >
            <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
              <Reveal className={isReversed ? "lg:order-2" : undefined}>
                <div className="flex flex-col gap-5 lg:sticky lg:top-28">
                  <Eyebrow index={index + 1}>
                    {t("pages.services.group")}
                  </Eyebrow>
                  <h2 className="text-display-2">{group.name}</h2>
                  <p className="text-marketing-body text-muted-foreground">
                    {group.summary}
                  </p>
                  {related !== undefined && (
                    <div className="mt-2 flex flex-col gap-3">
                      <MediaFrame
                        media={related.heroMedia}
                        sizes="(min-width: 1024px) 34vw, 92vw"
                      />
                      <ArrowLink href={caseStudyPath(related.slug)} size="sm">
                        {related.name}
                        <span className="sr-only"> case study</span>
                      </ArrowLink>
                    </div>
                  )}
                </div>
              </Reveal>

              <Reveal
                delay={60}
                className={isReversed ? "lg:order-1" : undefined}
              >
                <div className="flex flex-col gap-10">
                  <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
                    {group.capabilities.map((capability) => (
                      <div
                        key={capability.name}
                        className="flex flex-col gap-1.5"
                      >
                        <h3 className="text-[0.9375rem] font-medium">
                          {capability.name}
                        </h3>
                        <p className="text-muted-foreground text-[0.9375rem] leading-relaxed">
                          {capability.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4">
                    <h3 className="text-eyebrow text-muted-foreground">
                      {t("pages.services.whatYouReceive")}
                    </h3>
                    <HairlineList items={group.deliverables} />
                  </div>
                </div>
              </Reveal>
            </div>
          </Section>
        );
      })}

      <HowItWorks />
      <TechnologiesSection />
      <BookACall
        origin="services-close"
        title={t("pages.services.closeTitle")}
        lead={t("pages.services.closeLead")}
      />
    </>
  );
}
