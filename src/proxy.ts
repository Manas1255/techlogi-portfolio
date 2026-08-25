import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, isLocale } from "@/i18n/locales";

/**
 * LOCALE NEGOTIATION.
 *
 * Every page lives under `/[locale]`, so a request for `/work` has to become
 * `/en/work` or `/de/work` before it can be served. This picks which.
 *
 * Order of preference, and each step exists for a reason:
 *
 *   1. An explicit locale already in the path. Never overridden. A shared link
 *      to `/en/work` must open in English for a German speaker, because the
 *      person who sent it chose that.
 *   2. The `locale` cookie, which the language switcher writes. Someone who
 *      picked English last week gets English. It is the only signal that is a
 *      DECISION rather than a setting, so it is the only one that overrides
 *      the default.
 *   3. German. Not negotiated.
 *
 * `Accept-Language` is deliberately NOT consulted, and that is a business
 * decision rather than a technical one. This studio sells into a
 * German-speaking market, and nearly every browser ships `en-US` whatever its
 * owner reads, so honouring the header sent most visitors, including German
 * ones, to the English site. German is the front door; English is a choice
 * anyone can make from the header in one click, and the cookie remembers it.
 *
 * Restoring negotiation is re-adding one step to `negotiate` below, and the
 * parser it needs is still here for exactly that reason.
 *
 * A 307, not a 308: the target depends on a cookie, so it is per-request and
 * must not be cached as permanent by a CDN or a browser. A 308 here would pin
 * the first visitor's language onto everyone behind the same cache key.
 *
 * Note this is `proxy.ts`, not `middleware.ts`. In this version of Next that
 * is the file convention; see `node_modules/next/dist/docs`.
 */

/**
 * Parse `Accept-Language` into tags ordered by q-value, best first.
 *
 * UNUSED by `negotiate` today: German is served unconditionally, see above.
 * Kept because "respect the browser again" is a decision that gets reversed
 * more than once in a site's life, and rewriting a q-value parser each time is
 * how the subtle bugs get reintroduced.
 */
export function preferredLanguages(header: string | null): string[] {
  if (header === null) return [];
  return header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const quality = params
        .map((param) => param.trim())
        .find((param) => param.startsWith("q="));
      return {
        tag: tag.trim().toLowerCase(),
        quality: quality === undefined ? 1 : Number(quality.slice(2)),
      };
    })
    .filter((entry) => entry.tag !== "" && !Number.isNaN(entry.quality))
    .sort((a, b) => b.quality - a.quality)
    .map((entry) => entry.tag);
}

function negotiate(request: NextRequest): string {
  // An explicit choice, made in the switcher. The only thing that outranks the
  // default, because it is the only signal that is a decision.
  const chosen = request.cookies.get("locale")?.value;
  if (chosen !== undefined && isLocale(chosen)) return chosen;

  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${negotiate(request)}${pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  /*
    Everything except Next's internals and the files that must stay at the
    root of the site. `sitemap.xml`, `robots.txt`, the icons and the OG image
    are single, language-independent documents at fixed URLs; redirecting
    `/robots.txt` to `/en/robots.txt` would simply break them.
  */
  matcher: [
    "/((?!_next|api|media|.*\\..*|sitemap.xml|robots.txt|icon|apple-icon|opengraph-image).*)",
  ],
};
