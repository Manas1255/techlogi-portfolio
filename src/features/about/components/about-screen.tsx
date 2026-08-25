import {
  Container,
  Eyebrow,
  HairlineList,
  PlaceholderNote,
  Reveal,
  Section,
  SectionIntro,
} from "@/components/marketing";
import { MediaFrame } from "@/components/media";
import { BookACall } from "@/components/sections";
import { findProject, getContent } from "@/content";
import { getLocale, getTranslations } from "@/i18n/server";

/**
 * `/about`, how the studio works, in the studio's own terms.
 *
 * Deliberately not a team grid: no real people can be listed without their
 * consent and photographs, and a page of invented headshots would be exactly
 * the fabrication the brief rules out. What's here instead is the operating
 * philosophy, which is the thing a buyer is actually assessing.
 */
const PRINCIPLES = [
  "plan",
  "boundary",
  "states",
  "boring",
  "stay",
  "honest",
] as const;
const ENGAGEMENTS = ["discovery", "build", "embedded"] as const;

export async function AboutScreen() {
  const t = await getTranslations();
  const locale = await getLocale();
  const { projects } = getContent(locale);
  // A landscape frame: this sits in a wide column beside the intro.
  const showcase = findProject("zyuela", locale) ?? projects[0];

  return (
    <>
      <section
        data-surface="slab"
        className="wash-slab grain pt-32 pb-16 md:pt-40 md:pb-20"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
            <div className="flex flex-col gap-6">
              <Reveal variant="fade">
                <Eyebrow>{t("pages.about.eyebrow")}</Eyebrow>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="text-display-1 text-balance">
                  {t("pages.about.title")}
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="text-lead text-muted-foreground">
                  {t("pages.about.lead")}
                </p>
              </Reveal>
            </div>
            <Reveal variant="fade" delay={120}>
              <MediaFrame
                media={showcase.heroMedia}
                priority
                sizes="(min-width: 1024px) 44vw, 92vw"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      <Section surface="slab" rhythm="loose" className="wash-slab">
        <SectionIntro
          index={1}
          eyebrow={t("pages.about.principlesEyebrow")}
          title={t("pages.about.principlesTitle")}
          lead={t("pages.about.principlesLead")}
        />
        <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {PRINCIPLES.map((key, index) => (
            <Reveal
              key={key}
              delay={Math.min(index * 40, 160)}
              className="border-hairline flex flex-col gap-3 border-t pt-6"
            >
              <span className="text-mono-label text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-display-3">
                {t(
                  `pages.about.principles.${key}.title` as "pages.about.principles.plan.title",
                )}
              </h3>
              <p className="text-marketing-body text-muted-foreground">
                {t(
                  `pages.about.principles.${key}.body` as "pages.about.principles.plan.body",
                )}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section rhythm="base" divided>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal className="flex flex-col gap-5">
            <Eyebrow index={2}>{t("pages.about.engagementsEyebrow")}</Eyebrow>
            <h2 className="text-display-2 text-balance">
              {t("pages.about.engagementsTitle")}
            </h2>
            <p className="text-marketing-body text-muted-foreground">
              {t("pages.about.engagementsLead")}
            </p>
          </Reveal>
          <Reveal delay={60} className="flex flex-col gap-8">
            {ENGAGEMENTS.map((key) => (
              <div
                key={key}
                className="border-hairline flex flex-col gap-2.5 border-t pt-5"
              >
                <h3 className="text-display-3">
                  {t(
                    `pages.about.engagements.${key}.name` as "pages.about.engagements.discovery.name",
                  )}
                </h3>
                <p className="text-marketing-body text-muted-foreground">
                  {t(
                    `pages.about.engagements.${key}.detail` as "pages.about.engagements.discovery.detail",
                  )}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </Section>

      <Section rhythm="base" className="bg-sunken">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal className="flex flex-col gap-5">
            <Eyebrow index={5}>{t("pages.about.studioEyebrow")}</Eyebrow>
            <h2 className="text-display-2 text-balance">
              {t("pages.about.studioTitle")}
            </h2>
          </Reveal>
          <Reveal delay={60} className="flex flex-col gap-6">
            <p className="text-marketing-body text-muted-foreground">
              {t("pages.about.studioLead")}
            </p>
            <HairlineList
              items={[
                t("pages.about.studio1"),
                t("pages.about.studio2"),
                t("pages.about.studio3"),
                t("pages.about.studio4"),
              ]}
            />
            <PlaceholderNote tone="panel">
              {t("pages.about.studioNote", { file: "src/config/site.ts" })}
            </PlaceholderNote>
          </Reveal>
        </div>
      </Section>

      <BookACall
        origin="about-close"
        title={t("pages.about.closeTitle")}
        lead={t("pages.about.closeLead")}
      />
    </>
  );
}
