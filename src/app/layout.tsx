import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, Figtree, JetBrains_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AppProviders } from "@/components/providers/app-providers";
import { siteConfig } from "@/config/site";
import "./globals.css";

/**
 * Root layout — a Server Component.
 *
 * Fonts load through `next/font` (self-hosted, no layout shift, no runtime
 * request to a font CDN). `AppProviders` is the site's ONE client boundary;
 * everything above it stays server-rendered.
 *
 * Three faces, each with a job the other two can't do:
 *   display — Familjen Grotesk: tight apertures and a precise, Scandinavian
 *             skeleton. It reads engineered rather than friendly, which is the
 *             claim this studio is making, and it is uncommon enough not to
 *             carry another product's associations.
 *   sans    — Figtree: warm humanist, quiet at reading sizes, so the display
 *             face is the only one with an opinion.
 *   mono    — JetBrains Mono: the metadata, and the engineering signal that
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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Product engineering studio`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "software development",
    "product design",
    "SaaS development",
    "web application development",
    "mobile app development",
    "AI development",
    "product engineering studio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Product engineering studio`,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Product engineering studio`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // Matches the ink canvas, so mobile browser chrome doesn't flash white.
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // TODO(i18n): when a second locale ships, drive `lang` from the active
    // locale so screen readers announce content in the right language.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Enables the scroll-reveal system before first paint. The CSS that
          hides a `[data-reveal]` element is gated on this attribute, so if this
          script never runs — JS disabled, or it failed — nothing is ever
          hidden and the page reads normally. Inline and synchronous on purpose:
          a deferred script would let the un-revealed state paint first.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.dataset.motion="on"`,
          }}
        />
      </head>
      <body
        className={`${sans.variable} ${display.variable} ${mono.variable} antialiased`}
      >
        <AppProviders>
          <a
            href="#main"
            className="bg-primary text-primary-foreground text-label focus:ring-ring sr-only rounded-md px-4 py-2 focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:ring-2"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
