import {
  ArrowLink,
  Reveal,
  Section,
  SectionIntro,
} from "@/components/marketing";
import { APP_ROUTES } from "@/constants";
import { featuredProjects } from "@/content";
import { getLocale, getTranslations } from "@/i18n/server";
import { ProjectCard } from "./project-card";

/**
 * The portfolio, as the page's centre of gravity.
 *
 * Composition alternates deliberately: side-by-side, mirrored, then a full-bleed
 * panel every third entry. Three consecutive identical layouts is the failure
 * mode this rhythm exists to prevent, and the variation does real work, giving
 * the strongest project the widest frame.
 */
export async function FeaturedWork() {
  const t = await getTranslations();
  const projects = featuredProjects(await getLocale());

  return (
    <Section rhythm="base" id="work">
      <SectionIntro
        index={3}
        eyebrow={t("featuredWork.eyebrow")}
        title={t("featuredWork.title")}
        lead={t("featuredWork.lead")}
        align="split"
        aside={
          <ArrowLink href={APP_ROUTES.work}>{t("site.viewAllWork")}</ArrowLink>
        }
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 md:mt-14">
        {projects.map((project, index) => (
          <Reveal key={project.slug} delay={Math.min(index * 60, 180)}>
            <ProjectCard project={project} className="h-full" />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
