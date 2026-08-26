/**
 * SITE CONFIG. Company-level facts, in one file.
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
  legalName: "GA Code", // TODO: replace with the registered company name.
  url: clientEnv.NEXT_PUBLIC_SITE_URL,

  /**
   * One line, used in the footer and Open Graph. Short on purpose: it sits
   * under the wordmark in a narrow column, and the previous version ran to
   * three lines listing four product types before it said anything.
   */
  tagline:
    "We build websites, mobile apps, SaaS platforms and AI products, and stay on after launch.",

  /** ~155 characters. This is the default meta description. */
  description:
    "GA Code builds websites, mobile apps, SaaS platforms and AI products, from an idea to something real people use. Book a 30-minute call and get a straight answer on scope and cost.",

  /**
   * BOOKING. The primary conversion action on this site.
   *
   * The strongest evidence in the whole research pass was about response time,
   * not form design: a Harvard Business Review study of 1.25 million leads
   * found that responding within an hour makes a lead roughly 60x more likely
   * to qualify than responding after a day. A booking link collapses that to
   * zero, because the prospect picks the slot themselves.
   *
   * So the site no longer leads with "send an inquiry". An inquiry is a
   * promise to reply; a booked slot is the meeting itself, and the difference
   * is the whole redesign. The project brief still exists, as the secondary
   * path for someone who would rather write than talk.
   *
   * `calLink` is SET, so booking is live. Setting it back to null is the kill
   * switch: every control degrades to the project brief and the embed renders
   * an honest "scheduling opens shortly" panel. Nothing 404s and nothing lies.
   *
   * Format is Cal.com's own `username/event-slug`, NOT a full URL: the embed
   * SDK and the fallback link both build what they need from it. Until it is
   * set, every booking control degrades to the project brief and the embed
   * renders an honest "scheduling opens shortly" panel instead of an iframe
   * pointed at nothing. Nothing 404s and nothing lies.
   */
  booking: {
    calLink: "muhammad-anas-dmzvgq/erstgesprach" as string | null,
    /*
      The button label and the "30 minutes" bound used to live here and were
      read straight into the embed's loading line, which printed "Freie Zeiten
      werden geladen, 30 minutes" the moment the link went live. They are copy,
      so they live in the catalogs under `booking.label` / `booking.duration`.
      Nothing but the link belongs in this object.
    */
  },

  /**
   * THE OPENING-WINDOW OFFER.
   *
   * A visible countdown offering 25% off to anyone who books inside the
   * window. It is real: the discount applies to anyone who books in it, and
   * the code below is the one they quote.
   *
   * The window is THIRTY minutes, widened from five. Five is long enough to
   * read one section, not long enough to read the case studies and then
   * decide, so it expired under most of the people it was meant to persuade
   * and the section spent the rest of the visit saying they had missed it.
   *
   * The design constraints exist because this pattern is usually a lie, and a
   * visitor has met the lying version many times:
   *
   *   · The clock starts ONCE, on the first visit, and is persisted. It does
   *     not restart on a reload, on a route change, or on a second visit. A
   *     timer that resets is the tell that the offer is theatre. Widening the
   *     window does NOT re-open it for someone whose five minutes already
   *     ran out: the stored start time is what it is, so they stay expired.
   *   · When it runs out it says so, and the offer is gone. It does not
   *     quietly begin again at 05:00.
   *   · No flashing, no red, no "HURRY". It is set in the same brass and the
   *     same mono as every other piece of metadata on the site.
   *
   * If any of that is ever traded away for conversions, the section stops
   * being an incentive and becomes the reason nobody believes the rest of the
   * page. Set `enabled: false` to remove it entirely.
   */
  offer: {
    enabled: true,
    /** Percent off. Shown as written; keep it a whole number. */
    discountPercent: 25,
    windowSeconds: 30 * 60,
    /** Quoted by the visitor on the call, so it has to be sayable. */
    code: "EARLY25",
    /*
      What the discount applies to is COPY, so it lives in the catalogs under
      `offer.appliesTo`. It was here, and being interpolated into a translated
      sentence, which produced "Gilt für your first project invoice." on the
      German page: a config string cannot be translated, and any config value
      that ends up inside a sentence will eventually prove it.
    */
  },

  /**
   * CONFIDENTIALITY.
   *
   * The commonest unspoken reason a founder does not describe their idea is
   * that they think it will be taken. Saying nothing does not answer that;
   * saying too much sounds defensive and slightly guilty.
   *
   * So this is deliberately narrow, and every clause is something the studio
   * can actually stand behind without a signed agreement in place. It claims
   * no certification, no encryption standard and no legal guarantee, because
   * an unbacked security claim is worse than silence. An NDA on request is a
   * real offer and the strongest thing on the list.
   */
  confidentiality: {
    headline: "Your idea stays yours",
    points: [
      "What you share stays between you and the people on your project.",
      "We never reuse your concept, your research or your materials elsewhere.",
      "Happy to sign your NDA before the call, or send ours.",
    ],
  },

  contact: {
    /** TODO: replace with the real inbox that answers inquiries. */
    email: "hello@gastudio.com",
    /** Null hides the phone line entirely rather than printing a placeholder. */
    phone: null as string | null, // TODO: add a real number, or leave null.
    /**
     * NO LONGER HERE. It is UI copy, not a deployment fact, so it lives in the
     * message catalogs under `contact.responseTime` where it can be
     * translated. Config holds the things that differ per DEPLOYMENT: an
     * address, a link, a key. A sentence the visitor reads is not one of them.
     */
  },

  locations: [
    {
      label: "PLACEHOLDER: Primary studio",
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

  /**
   * Legal pages. `published: false` keeps the link OUT of the footer rather
   * than pointing every page on the site at a 404. Shipping a
   * placeholder privacy policy would be worse than shipping none.
   *
   * ⚠️ A privacy policy is not optional here. The inquiry form collects a name,
   * an email and an optional phone number, which is personal data under GDPR
   * and most equivalent regimes. Write the real pages, add the routes, and set
   * `published: true`.
   */
  legal: [
    { label: "Privacy", href: "/privacy", published: false }, // TODO: write it.
    { label: "Terms", href: "/terms", published: false }, // TODO: write it.
  ],

  /**
   * PROJECT INQUIRY SUBMISSION
   *
   * `endpoint` is a path appended to `NEXT_PUBLIC_API_URL` and called through
   * `backendClient` (which unwraps the `{ statusCode, data, error }` envelope
   * and throws typed errors). Set it to null, the shipped default, and the
   * form takes a logged mock-success path instead, so the experience is
   * complete before a backend exists.
   *
   * The payload it receives is documented in
   * `src/features/inquiry/models/inquiry.model.ts`.
   */
  inquiry: {
    endpoint: null as string | null, // TODO: e.g. "/inquiries".
    /** Bytes, PER FILE. Larger is rejected client-side with a real message. */
    maxAttachmentBytes: 25 * 1024 * 1024,
    /**
     * How many files, not which kinds.
     *
     * There is deliberately NO accepted-types list any more. The old one was
     * four MIME strings (PDF, PNG, JPEG, .docx) which quietly rejected the
     * things people most often have: a Figma export, a .sketch file, a zip of
     * screenshots, a Keynote deck, a .mov screen recording, an .xlsx of the
     * data they want migrated. The file picker greys them out with no
     * explanation, and the visitor concludes their material is unwelcome and
     * sends nothing.
     *
     * Whitelisting types is a SERVER's job in any case: an `accept` attribute
     * is a hint the browser applies to a dialog and any client can ignore, so
     * it was never buying safety, only friction. Whatever finally receives
     * these must validate type and content itself.
     */
    maxAttachments: 5,
  },

  /**
   * Every metric, testimonial and client name on this site is illustrative
   * until a human replaces it. While this is true the site prints an honest
   * footnote next to figures instead of implying they were measured, which is
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

/** Legal pages that actually exist. */
export function publishedLegal(): readonly { label: string; href: string }[] {
  return siteConfig.legal.filter((item) => item.published);
}

/** Locations confirmed real, for the footer. */
export function publishedLocations(): readonly SiteLocation[] {
  return siteConfig.locations.filter((location) => location.isReal);
}

/**
 * The full Cal.com URL, or null while `calLink` is unset.
 *
 * Every booking control routes through this rather than concatenating its own,
 * so there is exactly one place that knows the format and exactly one thing to
 * change when it moves.
 */
export function bookingUrl(): string | null {
  const link = siteConfig.booking.calLink;
  return link === null ? null : `https://cal.com/${link}`;
}

/** Whether scheduling is live. Controls degrade to the brief when it is not. */
export function isBookingLive(): boolean {
  return siteConfig.booking.calLink !== null;
}
