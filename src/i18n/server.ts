import { locale as rootLocale } from "next/root-params";
import { toLocale, type Locale } from "./locales";
import { translate } from "./translate";
import type { MessageKey, MessageVars } from "./types";

/**
 * TRANSLATION FOR SERVER COMPONENTS.
 *
 * `@/i18n` is a client module: it owns the hooks and the Zustand store, and a
 * Server Component importing from it would be dragged across the boundary for
 * the sake of one string. This is the other half, and it never touches React
 * state at all.
 *
 * The locale comes from `next/root-params`, which is what makes this bearable.
 * `[locale]` sits above the root layout, so `locale()` can be called from any
 * Server Component at any depth without threading a prop through every section
 * on the page. It is Server Components only: a Client Component still uses
 * `useTranslations`, and the two read the same catalogs.
 */
export async function getLocale(): Promise<Locale> {
  return toLocale(await rootLocale());
}

export type ServerTranslateFn = (key: MessageKey, vars?: MessageVars) => string;

/**
 * The server-side `t`.
 *
 *   const t = await getTranslations();
 *   <h2>{t("home.howItWorks.title")}</h2>
 */
export async function getTranslations(): Promise<ServerTranslateFn> {
  const active = await getLocale();
  return (key, vars) => translate(active, key, vars);
}
