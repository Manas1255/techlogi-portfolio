"use client";

import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { resolve, translate } from "./translate";
import { toLocale, type Locale } from "./locales";
import type { MessageKey, MessageVars } from "./types";

/**
 * Minimal, fully-typed i18n. No runtime dependency, the catalogs are plain
 * objects and `MessageKey` is derived from the source catalog, so an unknown
 * key or a missing translation is a TYPE error, not a runtime surprise.
 *
 * Usage:
 *   const t = useTranslations();
 *   t("booking.trigger")
 *   t("offer.percentOff", { percent: 25 })
 *
 * ⚠️ THE LOCALE COMES FROM THE PATH, NOT FROM THE STORE, and the difference is
 * not cosmetic. The store is filled by an effect after hydration, so during
 * SERVER rendering it still holds the source locale: every Client Component on
 * `/de` emitted ENGLISH into the prerendered HTML and then swapped to German
 * once JavaScript ran. A visitor saw a flash; a crawler saw an English page at
 * a German URL, which is the one thing routing the locale was supposed to fix.
 *
 * `usePathname` is available during server rendering, so the first render is
 * already correct. The store remains for `getLocale()`, which non-React code
 * calls where no hook is available.
 */

export type TranslateFn = (key: MessageKey, vars?: MessageVars) => string;

export function useTranslations(): TranslateFn {
  const locale = useLocale();
  return useCallback(
    (key: MessageKey, vars?: MessageVars) => translate(locale, key, vars),
    [locale],
  );
}

export function useLocale(): Locale {
  const pathname = usePathname();
  return toLocale(pathname.split("/").filter(Boolean)[0]);
}

/**
 * Resolve a string that MAY be a message key, used by form error rendering,
 * where Zod messages are authored as i18n keys but a server may also return a
 * ready-made sentence. A non-key string passes through unchanged.
 */
export function useMessageResolver(): (value: string) => string {
  const locale = useLocale();
  return useCallback(
    (value: string) => resolve(locale, value) ?? value,
    [locale],
  );
}

export { translate } from "./translate";
export { SUPPORTED_LOCALES, LOCALE_NAMES, type Locale } from "./locales";
export type { MessageKey, MessageVars, Messages } from "./types";
