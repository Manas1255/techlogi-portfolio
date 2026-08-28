import { isLocale } from "@/i18n/locales";

/**
 * Every route string in the site. Never hardcode a path in `<Link href>`,
 * `router.push`, or `redirect()`, import from here so a route rename is one
 * edit and `jinn-web doctor` can verify pages ↔ constants stay in sync.
 */

/**
 * The home route is separate from `APP_ROUTES` because that object is keyed by
 * PAGE SEGMENT, `jinn-web doctor` verifies each key against a directory under
 * `src/app/(app)`, and the home page has no segment of its own.
 */
export const HOME_ROUTE = "/";

export const APP_ROUTES = {
  work: "/work",
  services: "/services",
  about: "/about",
  contact: "/contact",
} as const;

export const ROUTES = { home: HOME_ROUTE, ...APP_ROUTES } as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

/** Case studies are a dynamic route; build the path, never concatenate inline. */
export function caseStudyPath(slug: string): string {
  return `${APP_ROUTES.work}/${slug}`;
}

/**
 * Nav model for the header and footer. Labels are i18n keys, resolved at the
 * render site, a route table must not depend on the locale store.
 */
export const NAV_ITEMS = [
  { href: HOME_ROUTE, labelKey: "nav.home" },
  { href: APP_ROUTES.work, labelKey: "nav.work" },
  { href: APP_ROUTES.services, labelKey: "nav.services" },
  { href: APP_ROUTES.about, labelKey: "nav.about" },
  { href: APP_ROUTES.contact, labelKey: "nav.contact" },
] as const;

/**
 * Is `href` the route the reader is currently on?
 *
 * Both navs used to answer this with `pathname.startsWith(item.href)`, and it
 * was ALWAYS FALSE. The hrefs here are unprefixed (`/work`), the pathname
 * never is (`/de/work`), so nothing ever matched: no nav item has carried
 * `aria-current` or its underline since the locale segment was introduced.
 * Nothing failed, because a missing highlight looks exactly like being on a
 * page that isn't in the nav.
 *
 * Adding the home tab is what makes this urgent rather than cosmetic: `"/de"`
 * and `"/de/work"` both start with `"/"`, so the naive check would have marked
 * Home as the current page on every route on the site.
 *
 * So: drop the locale segment, then match a WHOLE segment. `startsWith` alone
 * would light up `/work` for a hypothetical `/workshops`, and prefix bugs of
 * that shape are why this is one function rather than one expression repeated
 * in the header, the mobile sheet and the footer.
 */
export function isRouteActive(pathname: string, href: string): boolean {
  const [, first, ...rest] = pathname.split("/");
  const unprefixed = isLocale(first) ? `/${rest.join("/")}` : pathname;
  const path = unprefixed.replace(/\/+$/, "") || "/";

  return href === HOME_ROUTE
    ? path === HOME_ROUTE
    : path === href || path.startsWith(`${href}/`);
}

/**
 * LOCALE PREFIXING. Every internal href on the site goes through here.
 *
 * `/work` is not a page any more; `/en/work` and `/de/work` are. A raw href
 * therefore does not 404 (proxy.ts redirects it), it does something worse: it
 * silently drops a German reader back into English, and because the redirect
 * succeeds, nothing in the build or the type check ever complains. That is why
 * this is a function rather than a convention, and why `jinn-web doctor` and
 * the sweep both check for unprefixed internal links.
 */
export function localePath(locale: string, route: string): string {
  return route === HOME_ROUTE ? `/${locale}` : `/${locale}${route}`;
}

/** A case study, already prefixed. The common case, so it gets its own helper. */
export function localeCaseStudyPath(locale: string, slug: string): string {
  return localePath(locale, caseStudyPath(slug));
}

/**
 * Swap the locale on the CURRENT path, for the language switcher.
 *
 * The switcher has to keep the reader where they are: someone three quarters
 * of the way down the OrthoTrack case study who picks Deutsch wants the German
 * OrthoTrack case study, not the German home page. Dropping them at `/de` is
 * the commonest bug in a language switcher and the most annoying.
 */
export function swapLocale(pathname: string, locale: string): string {
  const segments = pathname.split("/").filter(Boolean);
  // The first segment is always the locale on a routed path; if it is missing
  // (a direct hit that proxy.ts has not rewritten yet) prefix rather than
  // replace, so nothing is eaten.
  const rest = segments.slice(1).join("/");
  return rest === "" ? `/${locale}` : `/${locale}/${rest}`;
}
