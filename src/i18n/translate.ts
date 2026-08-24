import en from "./messages/en";
import { SOURCE_LOCALE, type Locale } from "./locales";
import type { MessageKey, MessageVars, Messages } from "./types";

/**
 * The pure translator, deliberately WITHOUT `"use client"`.
 *
 * `@/i18n` is a client module, it owns the hooks and the locale store, so a
 * Server Component importing from it would be dragged across the boundary for
 * the sake of one string. Server Components render the source locale (there is
 * no locale routing), so they call `translate(SOURCE_LOCALE, key)` from here
 * while the catalog stays the single source of truth for both.
 */

const CATALOGS: Record<Locale, Messages> = {
  en: en,
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
