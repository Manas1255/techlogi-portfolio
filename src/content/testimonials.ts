import { l } from "./localized";
import type { RawTestimonial } from "./schemas";
import { projects } from "./projects";

/**
 * CLIENT PROOF.
 *
 * The proof section is built around VERTICAL VIDEO, because a written quote
 * from a company nobody can call is the weakest evidence on an agency site and
 * a thirty-second clip of a named person is close to the strongest. A client
 * can film one on the phone in their hand, which is the only reason it is a
 * realistic ask; `video: null` renders a designed empty slot, never a player.
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
 *   3. Optionally add a portrait at `public/media/people/<slug>.jpg`, a
 *      PORTRAIT clip at `public/media/testimonials/<slug>.{webm,mp4}` with a
 *      poster frame, and an `outcome`, but only one actually measured.
 */
const standalone: RawTestimonial[] = [
  {
    quote: l(
      "PLACEHOLDER, a client quote goes here. The useful ones are specific: what was hard before, what changed, and what it let the team do next. Approved in writing before it ships.",
      "PLATZHALTER, hier steht ein Kundenzitat. Die nützlichen sind konkret: was vorher schwierig war, was sich geändert hat, und was das Team danach tun konnte. Vor der Veröffentlichung schriftlich freigegeben.",
    ),
    person: "PLACEHOLDER, Name",
    role: l("PLACEHOLDER, Role", "PLATZHALTER, Rolle"),
    company: "PLACEHOLDER, Company",
    projectSlug: "zyuela",
    portrait: null,
    video: null,
    outcome: null,
    isPlaceholder: true,
  },
  {
    quote: l(
      "PLACEHOLDER, a second quote, ideally from a different kind of buyer: an engineering leader rather than a product sponsor, so the two are not making the same point twice.",
      "PLATZHALTER, ein zweites Zitat, idealerweise von einem anderen Typ Auftraggeber: aus der technischen Leitung statt aus dem Produktbereich, damit beide nicht denselben Punkt machen.",
    ),
    person: "PLACEHOLDER, Name",
    role: l("PLACEHOLDER, Role", "PLATZHALTER, Rolle"),
    company: "PLACEHOLDER, Company",
    projectSlug: "our-ummah",
    portrait: null,
    video: null,
    outcome: null,
    isPlaceholder: true,
  },
];

/**
 * Every testimonial the site can show: the ones attached to a project, plus
 * the standalone ones. Attaching a quote to a project keeps it next to the work
 * it is about; this collects both for the proof section.
 */
export const testimonials: RawTestimonial[] = [
  ...projects.flatMap((project) =>
    project.testimonial ? [project.testimonial] : [],
  ),
  ...standalone,
];
