import type { Metadata } from "next";
import { localePath } from "@/constants";
import { siteConfig } from "@/config/site";
import { DEFAULT_LOCALE, LOCALE_TAGS, SUPPORTED_LOCALES } from "@/i18n/locales";

/**
 * Per-page metadata, with the locale applied and both languages declared.
 *
 * Every page needs the same four things and gets one of them wrong when it is
 * written by hand: a canonical that points at THIS language's URL, an
 * `hreflang` set naming every translation, an Open Graph URL that matches the
 * canonical, and a locale tag. Doing it per page meant `canonical: "/work"`
 * survived the move to `/[locale]/work` on every route at once, quietly
 * telling a crawler that the German page's canonical was an English URL.
 *
 * So there is one function, and adding a language changes nothing here.
 */
/** The generated card at `app/opengraph-image.tsx`. Resolved by `metadataBase`. */
const OG_IMAGE = "/opengraph-image";

export interface PageMetadataOptions {
  locale: string;
  /** Unprefixed route, e.g. `/work`. Prefixing is this function's job. */
  route: string;
  title: string;
  description: string;
  /** `article` for a case study, `website` for everything else. */
  type?: "website" | "article";
}

export function pageMetadata({
  locale,
  route,
  title,
  description,
  type = "website",
}: PageMetadataOptions): Metadata {
  const path = localePath(locale, route);

  return {
    /*
      Set HERE, on every page, not inherited. Next merges top-level metadata
      down the tree but REPLACES `openGraph` wholesale, so a page that declares
      its own openGraph silently drops the layout's `images` and every route
      shipped an Open Graph card with no picture. Same reason `metadataBase`
      is repeated: without it a relative image URL resolves against
      localhost:3000 at build time, which is what the build was warning about.
    */
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        ...Object.fromEntries(
          SUPPORTED_LOCALES.map((code) => [
            LOCALE_TAGS[code],
            localePath(code, route),
          ]),
        ),
        "x-default": localePath(DEFAULT_LOCALE, route),
      },
    },
    openGraph: {
      type,
      title: `${title} · ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}${path}`,
      locale: locale in LOCALE_TAGS ? locale : DEFAULT_LOCALE,
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
