"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { localePath } from "@/constants";
import { toLocale } from "@/i18n/locales";

/**
 * `next/link`, with the active locale applied.
 *
 * Every page now lives under `/[locale]`, so `/work` is not a route: it is a
 * redirect that quietly drops a German reader back into English. The redirect
 * SUCCEEDS, which is what makes this dangerous. Nothing 404s, nothing fails to
 * build, no type is wrong, and the only symptom is that half the site silently
 * changes language when someone clicks a link.
 *
 * Rather than prefix at eighteen call sites and rely on the next person
 * remembering, the whole site imports this AS `Link` and keeps writing
 * `href={APP_ROUTES.work}`. One module knows the URL shape.
 *
 * The locale comes from `usePathname` rather than the Zustand store, and that
 * matters more than it looks. The store is filled by an effect, so it holds
 * the SOURCE locale during server rendering, and every href in the prerendered
 * German HTML would point at the English page: a crawler following `/de` would
 * find a page whose links all leave the language. `usePathname` is available
 * during SSR, so the markup is right the first time.
 *
 * External and non-route hrefs pass straight through, so this is safe to use
 * everywhere `next/link` was used.
 */
export type AppLinkProps = React.ComponentProps<typeof NextLink>;

export function AppLink({ href, ...props }: AppLinkProps) {
  const pathname = usePathname();
  const locale = toLocale(pathname.split("/").filter(Boolean)[0]);

  const resolved =
    typeof href === "string" && href.startsWith("/") && !href.startsWith("//")
      ? localePath(locale, href)
      : href;

  return <NextLink href={resolved} {...props} />;
}
