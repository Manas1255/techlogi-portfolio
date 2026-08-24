/**
 * SITE CONFIG — company-level facts, in one file.
 *
 * Everything a human must replace before launch is marked `PLACEHOLDER` or
 * `TODO:`. Both markers are grep-able:
 *
 *   grep -rn "PLACEHOLDER\|TODO:" src/
 *
 * Nothing here is a secret: this module is imported by client components, so a
 * value that must not reach the browser belongs in `config/env.ts` behind a
 * server-only variable instead.
 */

import { clientEnv } from "@/config/env";

export interface SiteLocation {
  /** City, or city + country. Shown in the footer only when `isReal`. */
  label: string;
  /** Full address lines, or null while unknown. */
  address: string | null;
  timezone: string;
  /**
   * Guard against publishing an office that doesn't exist. The footer renders
   * locations only where this is true, so a placeholder can sit here safely.
   */
  isReal: boolean;
}

export interface SiteSocial {
  label: string;
  href: string;
}

export const siteConfig = {
  name: clientEnv.NEXT_PUBLIC_APP_NAME,
  /** Legal entity, used in the copyright line. */
  legalName: "Techlogi", // TODO: replace with the registered company name.
  url: clientEnv.NEXT_PUBLIC_SITE_URL,

  /** One line. Used in metadata, the footer and Open Graph. */
  tagline:
    "Product engineering studio. Web applications, SaaS platforms, mobile apps and AI systems — discovery to production.",

  /** ~155 characters — this is the default meta description. */
  description:
    "Techlogi is a product engineering studio. We build web applications, SaaS platforms, mobile apps and AI systems, and stay on after launch to keep them fast and worth using.",

  contact: {
    /** TODO: replace with the real inbox that answers inquiries. */
    email: "hello@techlogi.com",
    /** Null hides the phone line entirely rather than printing a placeholder. */
    phone: null as string | null, // TODO: add a real number, or leave null.
    /** Shown next to the inquiry form as an expectation, not a promise. */
    responseTime: "We reply to every inquiry within one business day.",
  },

  locations: [
    {
      label: "PLACEHOLDER — Primary studio",
      address: null,
      timezone: "UTC",
      isReal: false, // → not rendered until a real address is supplied.
    },
  ] satisfies SiteLocation[],

  socials: [
    // TODO: replace every href. Entries with a "#" href are not rendered.
    { label: "LinkedIn", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "X", href: "#" },
    { label: "Dribbble", href: "#" },
  ] satisfies SiteSocial[],

  legal: [
    { label: "Privacy", href: "/privacy" }, // TODO: write the page.
    { label: "Terms", href: "/terms" }, // TODO: write the page.
  ],

  /**
   * PROJECT INQUIRY SUBMISSION
   *
   * `endpoint` is a path appended to `NEXT_PUBLIC_API_URL` and called through
   * `backendClient` (which unwraps the `{ statusCode, data, error }` envelope
   * and throws typed errors). Set it to null — the shipped default — and the
   * form takes a logged mock-success path instead, so the experience is
   * complete before a backend exists.
   *
   * The payload it receives is documented in
   * `src/features/inquiry/models/inquiry.model.ts`.
   */
  inquiry: {
    endpoint: null as string | null, // TODO: e.g. "/inquiries".
    /** Bytes. Anything larger is rejected client-side with a real message. */
    maxAttachmentBytes: 10 * 1024 * 1024,
    acceptedAttachmentTypes: [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },

  /**
   * Every metric, testimonial and client name on this site is illustrative
   * until a human replaces it. While this is true the site prints an honest
   * footnote next to figures instead of implying they were measured — which is
   * more credible than an unsourced "300% growth", and keeps the page from
   * shipping a claim nobody can stand behind.
   */
  hasVerifiedClientResults: false,
} as const;

export type SiteConfig = typeof siteConfig;

/** Social links that actually point somewhere. */
export function publishedSocials(): readonly SiteSocial[] {
  return siteConfig.socials.filter((social) => social.href !== "#");
}

/** Locations confirmed real, for the footer. */
export function publishedLocations(): readonly SiteLocation[] {
  return siteConfig.locations.filter((location) => location.isReal);
}
