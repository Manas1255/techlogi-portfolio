"use client";

import { useEffect } from "react";
import { useLocaleStore } from "@/i18n/locale-store";
import type { Locale } from "@/i18n/locales";

/**
 * Mirrors the routed locale into the client store, once per navigation.
 *
 * Client Components cannot call `next/root-params`, so `useTranslations` has
 * to read the language from somewhere. This is that somewhere, and it renders
 * nothing: the URL decides, this only reports.
 *
 * Writing to an external store is exactly what an effect is for, and the
 * store's setter is a no-op when the value already matches, so this does not
 * re-render anything on a same-locale navigation.
 */
export function LocaleSync({ locale }: { locale: Locale }) {
  const syncFromRoute = useLocaleStore((state) => state.syncFromRoute);
  useEffect(() => {
    syncFromRoute(locale);
  }, [locale, syncFromRoute]);
  return null;
}
