import { ArrowLink, Section, SectionIntro } from "@/components/marketing";
import { APP_ROUTES } from "@/constants";
import { featuredProjects } from "@/content";
import { ProjectPanel } from "./project-panel";

/**
 * The portfolio, as the page's centre of gravity.
 *
 * Composition alternates deliberately: side-by-side, mirrored, then a full-bleed
 * panel every third entry. Three consecutive identical layouts is the failure
 * mode this rhythm exists to prevent, and the variation does real work, giving
 * the strongest project the widest frame.
 */
export function FeaturedWork() {
  const projects = featuredProjects();

  return (
    <Section rhythm="loose" id="work">
      <SectionIntro
        index={2}
        eyebrow="Selected work"
        title="Products in production, not pitches."
        lead="Every engagement below shipped, went live, and is still running. Each case study covers the problem, the approach and the trade-offs, including the ones that didn't go to plan."
        align="split"
        aside={<ArrowLink href={APP_ROUTES.work}>View all work</ArrowLink>}
      />

      <div className="mt-16 flex flex-col gap-24 md:mt-20 md:gap-32">
        {projects.map((project, index) => (
          <ProjectPanel
            key={project.slug}
            project={project}
            index={index}
            reversed={index % 2 === 1}
            fullBleed={index === 2}
            // The hero opens the page with the first project's hero frame;
            // showing it again 1,500px later is repetition, not emphasis.
            media={index === 0 ? project.galleryMedia[0] : undefined}
          />
        ))}
      </div>
    </Section>
  );
}
