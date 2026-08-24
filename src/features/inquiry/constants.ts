/**
 * Inquiry endpoints.
 *
 * The path is configured in `src/config/site.ts` rather than hardcoded here,
 * because it is a deployment fact, the site ships with it unset, and the form
 * takes a logged mock-success path until someone fills it in.
 *
 * `src/api.ts` re-exports this, so the site's whole backend surface is one file.
 */
export const INQUIRY_ENDPOINTS = {
  /** POST, resolved from `siteConfig.inquiry.endpoint`; null disables it. */
  submit: () => null as string | null,
} as const;
