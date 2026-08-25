import de from "./messages/de";
import en from "./messages/en";
import { SOURCE_LOCALE, type Locale } from "./locales";
import type { MessageKey, MessageVars, Messages } from "./types";

/**
 * The pure translator, deliberately WITHOUT `"use client"`.
 *
 * `@/i18n` is a client module, it owns the hooks and the locale store, so a
 * Server Component importing from it would be dragged across the boundary for
 * the sake of one string. Server Components go through `@/i18n/server`, which
 * reads the active locale from the `[locale]` route segment and calls in here.
 * One set of catalogs serves both sides.
 */

const CATALOGS: Record<Locale, Messages> = {
  en: en,
  de: de,
  // jinn-web:locales, `add-locale` registers new catalogs here.
};

export function lookup(catalog: Messages, key: string): string | undefined {
  const value = key
    .split(".")
    .reduce<unknown>(
      (node, segment) =>
        typeof node === "object" && node !== null
          ? (node as Record<string, unknown>)[segment]
          : undefined,
      catalog,
    );
  return typeof value === "string" ? value : undefined;
}

export function interpolate(message: string, vars?: MessageVars): string {
  if (!vars) return message;
  return message.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

export function resolve(locale: Locale, value: string): string | undefined {
  return (
    lookup(CATALOGS[locale], value) ?? lookup(CATALOGS[SOURCE_LOCALE], value)
  );
}

export function translate(
  locale: Locale,
  key: MessageKey,
  vars?: MessageVars,
): string {
  // A missing key can only happen if a catalog was edited outside TypeScript;
  // showing the key beats showing nothing, and it's obvious in review.
  return interpolate(resolve(locale, key) ?? key, vars);
}
