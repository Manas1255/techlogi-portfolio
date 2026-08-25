import type { MetadataRoute } from "next";
import { APP_ROUTES, HOME_ROUTE, caseStudyPath, localePath } from "@/constants";
import { projectSlugs } from "@/content";
import { siteConfig } from "@/config/site";
import { DEFAULT_LOCALE, LOCALE_TAGS, SUPPORTED_LOCALES } from "@/i18n/locales";

/**
 * The sitemap is derived, never hand-maintained: static routes come from
 * `APP_ROUTES`, case studies from the content layer, and both are multiplied
 * by the supported locales, so adding a project or a language adds its URLs
 * here automatically.
 *
 * Each entry carries `alternates.languages`, which is the sitemap half of the
 * `hreflang` contract the layout declares in its `<head>`. Both are needed and
 * they must agree: a search engine treats a one-sided declaration as unproven,
 * and the German pages then compete with the English ones as near-duplicates
 * instead of being grouped as translations of each other. This is the entire
 * reason the locale is in the URL rather than in a toggle.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const paths = [
    ...[HOME_ROUTE, ...Object.values(APP_ROUTES)].map((route) => ({
      route,
      changeFrequency: "monthly" as const,
      priority: route === HOME_ROUTE ? 1 : 0.8,
    })),
    ...projectSlugs().map((slug) => ({
      route: caseStudyPath(slug),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];

  return paths.flatMap(({ route, changeFrequency, priority }) => {
    const languages = Object.fromEntries(
      SUPPORTED_LOCALES.map((locale) => [
        LOCALE_TAGS[locale],
        `${siteConfig.url}${localePath(locale, route)}`,
      ]),
    );

    return SUPPORTED_LOCALES.map((locale) => ({
      url: `${siteConfig.url}${localePath(locale, route)}`,
      lastModified: now,
      changeFrequency,
      // The DEFAULT locale carries the stronger signal where a page exists
      // in both: an equal priority asks the crawler to choose, and it will.
      priority: locale === DEFAULT_LOCALE ? priority : priority * 0.9,
      alternates: { languages },
    }));
  });
}
