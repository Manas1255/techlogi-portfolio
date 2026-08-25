"use client";

import { usePathname } from "next/navigation";
import { toLocale } from "@/i18n/locales";
import { getContent, type Content } from "./index";

/**
 * Resolved content for a Client Component.
 *
 * The locale comes from `usePathname` rather than the Zustand store for the
 * same reason `AppLink` does it: the store is filled by an effect, so during
 * server rendering it still holds the source locale, and a client component
 * reading it would emit ENGLISH content into the prerendered German HTML.
 * `usePathname` is available on the server, so the markup is right first time
 * and hydration stays quiet.
 *
 * `getContent` is memoised per locale, so calling this from several components
 * on one page costs one lookup each.
 */
export function useContent(): Content {
  const pathname = usePathname();
  return getContent(toLocale(pathname.split("/").filter(Boolean)[0]));
}
