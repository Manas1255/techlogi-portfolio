import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, Figtree, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AppProviders } from "@/components/providers/app-providers";
import { siteConfig } from "@/config/site";
import {
  DEFAULT_LOCALE,
  LOCALE_TAGS,
  SUPPORTED_LOCALES,
  isLocale,
} from "@/i18n/locales";
import { getTranslations } from "@/i18n/server";
import { LocaleSync } from "@/components/layout/locale-sync";
import "@/app/globals.css";

/**
 * Root layout, a Server Component.
 *
 * Fonts load through `next/font` (self-hosted, no layout shift, no runtime
 * request to a font CDN). `AppProviders` is the site's ONE client boundary;
 * everything above it stays server-rendered.
 *
 * Three faces, each with a job the other two can't do:
 *   display, Familjen Grotesk: tight apertures and a precise, Scandinavian
 *             skeleton. It reads engineered rather than friendly, which is the
 *             claim this studio is making, and it is uncommon enough not to
 *             carry another product's associations.
 *   sans   , Figtree: warm humanist, quiet at reading sizes, so the display
 *             face is the only one with an opinion.
 *   mono   , JetBrains Mono: the metadata, and the engineering signal that
 *             saves the page from needing a code screenshot.
 */

const display = Familjen_Grotesk({
  variable: "--font-familjen",
  subsets: ["latin"],
  display: "swap",
  weight: "variable",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

const sans = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
  weight: "variable",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: "variable",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

/**
 * Both locales are prerendered. `generateStaticParams` on the ROOT layout is
 * what makes `/de/...` a build-time page rather than a request-time render:
 * every route below inherits these values, so the whole site exists twice as
 * static HTML.
 */
export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations();
  const title = `${siteConfig.name} · ${t("site.role")}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: title, template: `%s · ${siteConfig.name}` },
    description: t("site.description"),
    applicationName: siteConfig.name,
    keywords: t("site.keywords").split("|"),
    /*
      Canonical points at THIS language's URL, and `languages` declares the
      other one. Without the alternates a translated site competes with itself:
      the two pages carry the same structure and images, so a crawler is
      entitled to treat one as a duplicate of the other and drop it. `hreflang`
      is what says "same page, different language", and it is the entire
      technical payoff of routing the locale instead of toggling it.
    */
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(
          SUPPORTED_LOCALES.map((code) => [LOCALE_TAGS[code], `/${code}`]),
        ),
        "x-default": `/${DEFAULT_LOCALE}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: LOCALE_TAGS[locale],
      title,
      description: t("site.description"),
      url: `${siteConfig.url}/${locale}`,
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: t("site.description"),
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  // Matches the ink canvas, so mobile browser chrome doesn't flash white.
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  // A path like `/fr/work` reaches here with an unsupported segment. 404 it
  // rather than rendering English under a French URL, which would ask Google
  // to index a page that lies about its own language.
  if (!isLocale(locale)) notFound();
  const t = await getTranslations();

  return (
    /*
      The font variables go on <html>, NOT <body>.

      `globals.css` applies `font-sans` to the html element, and custom
      properties inherit DOWNWARD only. With the variables one level below on
      <body>, `var(--font-figtree)` is undefined where `--font-sans` is read,
      `--font-sans` resolves to nothing, and every piece of body copy on the
      site silently falls back to Times. The display face still worked, because
      headings live inside <body> where the variable does exist, which is
      exactly what made it easy to miss.
    */
    <html
      lang={LOCALE_TAGS[locale]}
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
    >
      <head>
        {/*
          Enables the scroll-reveal system before first paint. The CSS that
          hides a `[data-reveal]` element is gated on this attribute, so if this
          script never runs, JS disabled, or it failed, nothing is ever
          hidden and the page reads normally. Inline and synchronous on purpose:
          a deferred script would let the un-revealed state paint first.
        */}
        <Script
          id="enable-motion"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.dataset.motion="on"`,
          }}
        />
      </head>
      <body className="antialiased">
        <AppProviders>
          {/* Hands the routed locale to the client store, so a Client
              Component leaf translates in the same language as the server
              markup around it. See `i18n/locale-store.ts`. */}
          <LocaleSync locale={locale} />
          <a
            href="#main"
            className="bg-primary text-primary-foreground text-label focus:ring-ring sr-only rounded-md px-4 py-2 focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:ring-2"
          >
            {t("nav.skipToContent")}
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
