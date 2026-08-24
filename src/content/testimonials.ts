import type { Testimonial } from "./schemas";
import { projects } from "./projects";

/**
 * CLIENT PROOF.
 *
 * ⚠️ Every entry is a PLACEHOLDER. Nothing here is attributed to a real person
 * or company, and `isPlaceholder: true` makes the UI say so rather than
 * implying endorsement.
 *
 * Replacing them:
 *   1. Get the quote in writing, with the person's name, role and company, and
 *      explicit permission to publish.
 *   2. Replace the entry and set `isPlaceholder: false`. The placeholder
 *      treatment disappears on its own.
 *   3. Optionally add a portrait at `public/media/people/<slug>.jpg` and an
 *      `outcome` — but only one that was actually measured.
 */
const standalone: Testimonial[] = [
  {
    quote:
      "PLACEHOLDER — a client quote goes here. The useful ones are specific: what was hard before, what changed, and what it let the team do next. Approved in writing before it ships.",
    person: "PLACEHOLDER — Name",
    role: "PLACEHOLDER — Role",
    company: "PLACEHOLDER — Company",
    projectSlug: "zyuela",
    portrait: null,
    outcome: null,
    isPlaceholder: true,
  },
  {
    quote:
      "PLACEHOLDER — a second quote, ideally from a different kind of buyer: an engineering leader rather than a product sponsor, so the two are not making the same point twice.",
    person: "PLACEHOLDER — Name",
    role: "PLACEHOLDER — Role",
    company: "PLACEHOLDER — Company",
    projectSlug: "our-ummah",
    portrait: null,
    outcome: null,
    isPlaceholder: true,
  },
];

/**
 * Every testimonial the site can show: the ones attached to a project, plus
 * the standalone ones. Attaching a quote to a project keeps it next to the work
 * it is about; this collects both for the proof section.
 */
export const testimonials: Testimonial[] = [
  ...projects.flatMap((project) =>
    project.testimonial ? [project.testimonial] : [],
  ),
  ...standalone,
];
