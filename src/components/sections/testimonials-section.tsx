import Link from "next/link";
import {
  PlaceholderNote,
  Reveal,
  Section,
  SectionIntro,
} from "@/components/marketing";
import { caseStudyPath } from "@/constants";
import { findProject, testimonials } from "@/content";

/**
 * CLIENT PROOF.
 *
 * Every quote here is currently a marked placeholder, no person, company or
 * endorsement is invented. The structure is real, so replacing them is a
 * content edit: set `isPlaceholder: false` in `src/content/testimonials.ts` and
 * the placeholder treatment disappears on its own.
 *
 * Two quotes, not a carousel. A carousel of testimonials is a way of admitting
 * none of them are worth reading.
 */
export function TestimonialsSection() {
  const featured = testimonials.slice(0, 2);
  if (featured.length === 0) return null;

  return (
    <Section surface="tint" rhythm="loose">
      <SectionIntro
        index={6}
        eyebrow="Client proof"
        title="What clients say, once they've said it."
        lead="We publish quotes only with written approval, attributed to a real person at a real company. Until then, these are placeholders, and labelled as such."
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {featured.map((testimonial, index) => {
          const project =
            testimonial.projectSlug === null
              ? undefined
              : findProject(testimonial.projectSlug);

          return (
            <Reveal
              as="figure"
              key={`${testimonial.person}-${index}`}
              delay={index * 60}
              className="border-hairline flex flex-col gap-6 border-t pt-8"
            >
              <blockquote className="text-quote text-balance">
                <span aria-hidden="true" className="text-primary">
                  &ldquo;
                </span>
                {testimonial.quote}
                <span aria-hidden="true" className="text-primary">
                  &rdquo;
                </span>
              </blockquote>

              <figcaption className="flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[0.9375rem] font-medium">
                    {testimonial.person}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {testimonial.role}, {testimonial.company}
                  </span>
                </div>

                {project !== undefined && (
                  <Link
                    href={caseStudyPath(project.slug)}
                    className="tap-target text-mono-label text-muted-foreground hover:text-foreground focus-visible:outline-ring w-fit rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    On {project.name} →
                  </Link>
                )}

                {testimonial.isPlaceholder && (
                  <PlaceholderNote>
                    Placeholder, awaiting an approved client quote.
                  </PlaceholderNote>
                )}
              </figcaption>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
