import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./locales";

/**
 * THE URL IS THE SOURCE OF TRUTH. This store only mirrors it.
 *
 * `/de/work` is a real German document, so the locale is decided by routing
 * before a single component renders. What this exists for is Client
 * Components, which cannot call `next/root-params`: the root layout writes the
 * segment in here once per navigation and `useTranslations` reads it, so a
 * client leaf agrees with the server-rendered page around it.
 *
 * It is also persisted, which is what lets `proxy.ts` send a returning visitor
 * back to the language they last chose instead of re-negotiating their browser
 * header every time.
 *
 * Never `setLocale` to change language. Navigate to the other locale's URL and
 * this follows; setting it alone would leave a German store on an English
 * document, which is the split-brain the routing exists to prevent.
 */
interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  syncFromRoute: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => set({ locale }),
      /** Called by the root layout on every navigation. Idempotent. */
      syncFromRoute: (locale) =>
        set((state) => (state.locale === locale ? state : { locale })),
    }),
    { name: "locale" },
  ),
);

/**
 * Read the active locale from NON-React code (the HTTP transport's
 * `Accept-Language` header, formatters, validators). Reading the store outside
 * React is the whole reason this exists, never duplicate the storage key.
 */
export function getLocale(): Locale {
  const { locale } = useLocaleStore.getState();
  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}
