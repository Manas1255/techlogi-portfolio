/**
 * CONTENT LAYER, authored site content, and the accessors that read it.
 *
 * Presentation components import from here and never from a data file
 * directly, so the shape of storage (a TS module today, a CMS later) stays
 * behind one seam.
 */

export * from "./schemas";
export { projects } from "./projects";
export { serviceGroups, buildTypes } from "./services";
export { processStages } from "./process";
export { techGroups } from "./technologies";
export { capabilities, differences } from "./capabilities";
export { testimonials } from "./testimonials";

import { projects } from "./projects";
import { serviceGroups } from "./services";
import type { Project, ProjectCategory } from "./schemas";

/**
 * The project whose media opens the site. Named here rather than picked by
 * position so that reordering the portfolio cannot silently change which
 * product leads, and so the showreel can avoid opening on the same one.
 */
export const HERO_PROJECT_SLUG = "zyuela";

/** Projects selected for the home page, in authored order. */
export function featuredProjects(): Project[] {
  return projects.filter((project) => project.featured);
}

/** One project, or undefined, the caller decides whether that's a 404. */
export function findProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Every slug, for `generateStaticParams` and the sitemap. */
export function projectSlugs(): string[] {
  return projects.map((project) => project.slug);
}

/**
 * The next project, wrapping at the end, so a case study always has somewhere
 * to go rather than ending in a footer.
 */
export function nextProject(slug: string): Project | undefined {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return undefined;
  return projects[(index + 1) % projects.length];
}

export function projectsByCategory(
  category: ProjectCategory | null,
): Project[] {
  if (category === null) return projects;
  return projects.filter((project) => project.categories.includes(category));
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
export function findServiceGroup(id: string) {
  return serviceGroups.find((group) => group.id === id);
}

/**
 * True while any case study is still an unreviewed draft. Drives the honest
 * notice on `/work`, see `siteConfig.hasVerifiedClientResults`.
 */
export function hasDraftCaseStudies(): boolean {
  return projects.some((project) => project.isDraft);
}
