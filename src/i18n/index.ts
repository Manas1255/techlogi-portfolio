"use client";

import { useCallback } from "react";
import { useLocaleStore } from "./locale-store";
import { resolve, translate } from "./translate";
import type { Locale } from "./locales";
import type { MessageKey, MessageVars } from "./types";

/**
 * Minimal, fully-typed i18n. No runtime dependency, the catalogs are plain
 * objects and `MessageKey` is derived from the source catalog, so an unknown
 * key or a missing translation is a TYPE error, not a runtime surprise.
 *
 * Usage:
 *   const t = useTranslations();
 *   t("auth.login.title")
 *   t("dashboard.welcome", { name: user.name })
 */

export type TranslateFn = (key: MessageKey, vars?: MessageVars) => string;

export function useTranslations(): TranslateFn {
  const locale = useLocaleStore((state) => state.locale);
  return useCallback(
    (key: MessageKey, vars?: MessageVars) => translate(locale, key, vars),
    [locale],
  );
}

export function useLocale(): Locale {
  return useLocaleStore((state) => state.locale);
}

export function useSetLocale(): (locale: Locale) => void {
  return useLocaleStore((state) => state.setLocale);
}

/**
 * Resolve a string that MAY be a message key, used by form error rendering,
 * where Zod messages are authored as i18n keys but a server may also return a
 * ready-made sentence. A non-key string passes through unchanged.
 */
export function useMessageResolver(): (value: string) => string {
  const locale = useLocaleStore((state) => state.locale);
  return useCallback(
    (value: string) => resolve(locale, value) ?? value,
    [locale],
  );
}

export { translate } from "./translate";
export { SUPPORTED_LOCALES, LOCALE_NAMES, type Locale } from "./locales";
export type { MessageKey, MessageVars, Messages } from "./types";
