import type { MetadataRoute } from "next";
import { APP_ROUTES } from "@/constants";
import { projectSlugs } from "@/content";
import { siteConfig } from "@/config/site";

/**
 * The sitemap is derived, never hand-maintained: static routes come from
 * `APP_ROUTES` and case studies from the content layer, so adding a project
 * adds its URL here automatically.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = Object.values(APP_ROUTES).map((route) => ({
    url: `${siteConfig.url}${route === "/" ? "" : route}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: route === APP_ROUTES.home ? 1 : 0.8,
  }));

  const caseStudies = projectSlugs().map((slug) => ({
    url: `${siteConfig.url}/work/${slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...caseStudies];
}
