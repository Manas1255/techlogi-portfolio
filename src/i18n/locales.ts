/**
 * Supported locales. The FIRST entry is the source locale, its catalog is the
 * single source of truth, and TypeScript forces every other catalog to match
 * its shape (see `messages/`).
 *
 * These are also ROUTE SEGMENTS. `/de/work` is a real, server-rendered,
 * indexable German page, not a client-side string swap: the whole reason a
 * marketing site translates itself is to be found in the other language, and
 * a toggle that never changes the URL is invisible to a crawler.
 *
 * Every locale is prefixed, including the default. An unprefixed default reads
 * nicer but makes `/` and `/de/` two URLs for one page, which is a canonical
 * problem to solve on every route forever; one shape for every language is
 * simpler and is what `proxy.ts` negotiates into.
 *
 * ORDER IS THE SWITCHER'S ORDER, so German leads. It is deliberately NOT where
 * the defaults come from; see below.
 */
export const SUPPORTED_LOCALES = ["de", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

/**
 * TWO DEFAULTS, and conflating them is the trap.
 *
 * `SOURCE_LOCALE` is an AUTHORING fact: `messages/en.ts` defines the shape
 * every other catalog is checked against, and it is what a lookup falls back
 * to when a key or a translation is somehow missing. It is English because
 * that is the language this codebase is written and reviewed in, and changing
 * it would mean re-pointing `Messages = typeof en` and re-checking every
 * catalog against a new source for no benefit.
 *
 * `DEFAULT_LOCALE` is a PRODUCT fact: what a visitor gets when they express no
 * preference, which language `x-default` points at, and which one the sitemap
 * gives the stronger priority. It is German.
 *
 * They were the same value until German became the default, and the whole
 * reason to separate them rather than reorder the array is that a single
 * constant would have quietly moved the type system's source of truth at the
 * same time as the marketing default.
 */
export const SOURCE_LOCALE: Locale = "en";

export const DEFAULT_LOCALE: Locale = "de";

/** Native names for the language switcher, never translated. */
export const LOCALE_NAMES: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
};

/** BCP 47 tags for `<html lang>`, `hreflang` and `Intl` formatters. */
export const LOCALE_TAGS: Record<Locale, string> = {
  de: "de",
  en: "en",
};

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * Narrow an unknown route segment to a locale.
 *
 * Every page reads its own segment, and an unsupported one has to fall back
 * rather than throw: `proxy.ts` only redirects what it sees, and a stale link
 * to `/fr/work` should render the default language, not a 500.
 */
export function toLocale(value: string | undefined): Locale {
  return value !== undefined && isLocale(value) ? value : DEFAULT_LOCALE;
}
