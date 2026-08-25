/**
 * CONTENT LAYER, authored site content, and the accessors that read it.
 *
 * Presentation components import from here and never from a data file
 * directly, so the shape of storage (a TS module today, a CMS later) stays
 * behind one seam. That seam is what made localisation cheap: the data files
 * now hold every language at once, and almost no component changed, because
 * the accessors flatten a locale out before anything renders.
 *
 * There are two ways in, and which one you use is decided by the boundary:
 *
 *   `getContent(locale)`  Server Components. Pair it with `getLocale()`.
 *   `useContent()`        Client Components, which cannot read root params.
 *
 * Both return the SAME resolved shape, so a section can move across the
 * boundary without its content access changing.
 */

export * from "./schemas";
export type { RawFaq } from "./faqs";
export { l, ls, pick, pickAll, type Localized } from "./localized";

import { resolve } from "./localized";
import { capabilities, differences } from "./capabilities";
import { faqs } from "./faqs";
import { processStages } from "./process";
import { projects } from "./projects";
import { shippedProducts, productLogoSrc } from "./products";
import { buildTypes, serviceGroups } from "./services";
import { techGroups } from "./technologies";
import { testimonials } from "./testimonials";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/locales";
import type { Project, ProjectCategory, Testimonial } from "./schemas";

export { productLogoSrc };

/** The raw catalogs, every language at once. For tests and for the resolver. */
export const rawContent = {
  capabilities,
  differences,
  faqs,
  processStages,
  projects,
  shippedProducts,
  serviceGroups,
  buildTypes,
  techGroups,
  testimonials,
} as const;

export type Content = {
  [K in keyof typeof rawContent]: ReturnType<
    typeof resolve<(typeof rawContent)[K]>
  >;
};

/**
 * Resolved content, memoised per locale.
 *
 * The catalogs are module constants, so there are exactly as many resolved
 * copies as there are languages and they are built once for the process
 * lifetime. Without this, every section on every page would walk the whole
 * content tree again: cheap individually, and pointless work repeated a few
 * hundred times per render pass.
 */
const CACHE = new Map<Locale, Content>();

export function getContent(locale: Locale = DEFAULT_LOCALE): Content {
  const cached = CACHE.get(locale);
  if (cached !== undefined) return cached;
  const resolved = resolve(rawContent, locale) as Content;
  CACHE.set(locale, resolved);
  return resolved;
}

/** Projects selected for the home page, in authored order. */
export function featuredProjects(locale: Locale): Project[] {
  return getContent(locale).projects.filter((project) => project.featured);
}

/** One project, or undefined, the caller decides whether that's a 404. */
export function findProject(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Project | undefined {
  return getContent(locale).projects.find((project) => project.slug === slug);
}

/** Every slug, for `generateStaticParams` and the sitemap. Locale-free. */
export function projectSlugs(): string[] {
  return projects.map((project) => project.slug);
}

/**
 * The next project, wrapping at the end, so a case study always has somewhere
 * to go rather than ending in a footer.
 */
export function nextProject(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Project | undefined {
  const all = getContent(locale).projects;
  const index = all.findIndex((project) => project.slug === slug);
  if (index === -1) return undefined;
  return all[(index + 1) % all.length];
}

export function projectsByCategory(
  category: ProjectCategory | null,
  locale: Locale = DEFAULT_LOCALE,
): Project[] {
  const all = getContent(locale).projects;
  if (category === null) return all;
  return all.filter((project) => project.categories.includes(category));
}

/**
 * Categories that actually have work behind them, with counts. A filter that
 * leads to an empty state is a design failure, not a feature.
 */
export function activeCategories(): { id: ProjectCategory; count: number }[] {
  const counts = new Map<ProjectCategory, number>();
  for (const project of projects) {
    for (const category of project.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count);
}

/** The service group a capability belongs to, for cross-linking. */
export function findServiceGroup(id: string, locale: Locale = DEFAULT_LOCALE) {
  return getContent(locale).serviceGroups.find((group) => group.id === id);
}

/**
 * True while any case study is still an unreviewed draft. Drives the honest
 * notice on `/work`, see `siteConfig.hasVerifiedClientResults`.
 */
export function hasDraftCaseStudies(): boolean {
  return projects.some((project) => project.isDraft);
}

/**
 * Testimonials that have a cleared, filmed vertical clip behind them.
 *
 * The proof section renders these as a video rail and everything else as an
 * honest empty state, so filming one client is a content edit rather than a
 * rebuild, and filming none never produces a broken player.
 */
export function videoTestimonials(locale: Locale): Testimonial[] {
  return getContent(locale).testimonials.filter(
    (testimonial) => testimonial.video !== null && !testimonial.isPlaceholder,
  );
}
