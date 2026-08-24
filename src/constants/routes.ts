/**
 * Every route string in the site. Never hardcode a path in `<Link href>`,
 * `router.push`, or `redirect()` — import from here so a route rename is one
 * edit and `jinn-web doctor` can verify pages ↔ constants stay in sync.
 */

export const APP_ROUTES = {
  home: "/",
  work: "/work",
  services: "/services",
  about: "/about",
  contact: "/contact",
} as const;

export const ROUTES = { ...APP_ROUTES } as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

/** Case studies are a dynamic route; build the path, never concatenate inline. */
export function caseStudyPath(slug: string): string {
  return `${APP_ROUTES.work}/${slug}`;
}

/**
 * Nav model for the header and footer. Labels are i18n keys, resolved at the
 * render site — a route table must not depend on the locale store.
 */
export const NAV_ITEMS = [
  { href: APP_ROUTES.work, labelKey: "nav.work" },
  { href: APP_ROUTES.services, labelKey: "nav.services" },
  { href: APP_ROUTES.about, labelKey: "nav.about" },
  { href: APP_ROUTES.contact, labelKey: "nav.contact" },
] as const;
