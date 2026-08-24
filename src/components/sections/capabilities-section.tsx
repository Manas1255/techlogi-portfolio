import Link from "next/link";
import {
  CapabilityDiagram,
  Reveal,
  Section,
  SectionIntro,
} from "@/components/marketing";
import { caseStudyPath } from "@/constants";
import { capabilities, findProject } from "@/content";

/**
 * WHAT WE CAN BUILD.
 *
 * The portfolio proves we finished things. This section answers the question
 * that comes before that one: can these people build MY thing? A visitor whose
 * project does not resemble anything in the portfolio needs somewhere to
 * recognise themselves, and a list of case studies is not it.
 *
 * Each card names the technology in real text rather than a logo wall, and
 * links to where we actually shipped it, so a claim can be checked in one
 * click. That link is what separates this from a price list.
 */
export function CapabilitiesSection() {
  return (
    <Section rhythm="loose" divided id="capabilities">
      <SectionIntro
        index={4}
        eyebrow="What we build"
        title="Six things we do, and the stack we do them with."
        lead="Every technology below is one we have shipped, not one we could learn. Each card links to the project where we used it."
      />

      <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((capability, index) => {
          const project =
            capability.projectSlug === null
              ? undefined
              : findProject(capability.projectSlug);

          return (
            <Reveal
              as="li"
              key={capability.id}
              delay={Math.min(index * 50, 200)}
              className="flex flex-col gap-5"
            >
              <CapabilityDiagram capability={capability} />

              <div className="flex flex-col gap-2.5">
                <h3 className="text-display-3">{capability.name}</h3>
                <p className="text-muted-foreground text-[0.9375rem] leading-relaxed">
                  {capability.description}
                </p>
              </div>

              {project !== undefined && (
                <Link
                  href={caseStudyPath(project.slug)}
                  className="tap-target text-mono-label text-muted-foreground hover:text-foreground focus-visible:outline-ring mt-auto w-fit rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  Shipped in {project.name} →
                </Link>
              )}
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
