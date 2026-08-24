import {
  ArrowLink,
  Reveal,
  Section,
  SectionIntro,
} from "@/components/marketing";
import { APP_ROUTES } from "@/constants";
import { featuredProjects } from "@/content";
import { ProjectCard } from "./project-card";

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
