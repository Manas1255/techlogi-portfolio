import { z } from "zod";
import { SOURCE_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/i18n/locales";

/**
 * AUTHORED CONTENT, IN EVERY LANGUAGE.
 *
 * The message catalogs and this are two different problems, and merging them
 * would be a mistake in both directions. A catalog is INTERFACE text: short,
 * reused, keyed, and edited by whoever is building the component. This is
 * AUTHORED text: a case study is a thousand words of argument that belongs
 * beside the project it describes, not scattered across a translation file
 * under keys like `projects.zyuela.sections.2.body.1`.
 *
 * So a localized value is one object holding both languages, sitting exactly
 * where the English used to:
 *
 *   name: l("Mobile apps", "Apps"),
 *
 * The shape is `Record<Locale, string>` and it is EXHAUSTIVE, which is the
 * whole point: adding a locale to `SUPPORTED_LOCALES` turns every piece of
 * content in the repo into a compile error until it is translated. There is no
 * silent fallback to English, because a half-translated page is worse than an
 * English one: the reader cannot tell whether the missing part is an oversight
 * or a different offer.
 */
export const localizedSchema = z.object(
  Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [locale, z.string().min(1)]),
  ) as Record<Locale, z.ZodString>,
);

export type Localized = Record<Locale, string>;

/**
 * Author a localized string. Positional, in `SUPPORTED_LOCALES` order.
 *
 * Deliberately terse: it appears several hundred times in `projects.ts`, and
 * `{ en: "…", de: "…" }` at every one of those turns a readable content file
 * into a wall of punctuation.
 */
export function l(en: string, de: string): Localized {
  return { en, de };
}

/** Author an array of localized strings, for paragraphs and bullet lists. */
export function ls(pairs: readonly (readonly [string, string])[]): Localized[] {
  return pairs.map(([en, de]) => l(en, de));
}

/**
 * Read a localized value.
 *
 * The fallback exists for one case only: a locale that is valid at the type
 * level but missing at runtime, which can happen if content was edited outside
 * TypeScript. It is not a licence to ship untranslated entries.
 */
export function pick(value: Localized, locale: Locale): string {
  return value[locale] || value[SOURCE_LOCALE];
}

/** Read a list of localized values. */
export function pickAll(
  values: readonly Localized[],
  locale: Locale,
): string[] {
  return values.map((value) => pick(value, locale));
}

/**
 * The RENDERED shape of an authored type: every `Localized` collapsed to a
 * plain `string`, at any depth, through arrays and nested objects.
 *
 * This is what keeps the localisation out of the components. `Project` is
 * `Resolved<RawProject>`, so `project.tagline` is still a `string` and every
 * section that renders one is unchanged; only the accessors in `./index.ts`
 * had to learn about locales.
 */
export type Resolved<T> = T extends Localized
  ? string
  : T extends readonly (infer U)[]
    ? Resolved<U>[]
    : T extends object
      ? { [K in keyof T]: Resolved<T[K]> }
      : T;

/**
 * True when a value is an authored localized string rather than an ordinary
 * object. The test is EXACT: the same keys as `SUPPORTED_LOCALES`, no more and
 * no fewer, all of them strings.
 *
 * "No more" is the part that matters. A looser check (has an `en` key) would
 * eventually meet a content object that happens to carry one and flatten it
 * into a bare string, and the failure would surface as a missing section
 * rather than as a type error.
 */
function isLocalized(value: object): value is Localized {
  const keys = Object.keys(value);
  return (
    keys.length === SUPPORTED_LOCALES.length &&
    SUPPORTED_LOCALES.every(
      (locale) =>
        typeof (value as Record<string, unknown>)[locale] === "string",
    )
  );
}

/**
 * Walk an authored value and flatten every localized string into one language.
 *
 * Recursive rather than a resolver per entity: there are eight content types
 * with localized fields nested three deep in places, and hand-written
 * resolvers for all of them would be a second copy of every schema, drifting
 * from the first the moment someone adds a field.
 */
export function resolve<T>(value: T, locale: Locale): Resolved<T> {
  if (Array.isArray(value)) {
    return value.map((item) => resolve(item, locale)) as Resolved<T>;
  }
  if (typeof value === "object" && value !== null) {
    if (isLocalized(value)) return pick(value, locale) as Resolved<T>;
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolve(item, locale)]),
    ) as Resolved<T>;
  }
  return value as Resolved<T>;
}
