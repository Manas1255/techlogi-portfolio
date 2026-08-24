import { z } from "zod";
import type { BuildTypeId } from "@/content/schemas";

/**
 * THE INQUIRY PAYLOAD, the contract with whatever receives a project inquiry.
 *
 * `POST <NEXT_PUBLIC_API_URL><siteConfig.inquiry.endpoint>`
 * `Content-Type: multipart/form-data` when an attachment is present,
 * `application/json` otherwise.
 *
 * ```jsonc
 * {
 *   "buildType":   "saas-platform",       // one of BuildTypeId, see content/schemas.ts
 *   "description": "…",                   // 20–1000 chars
 *   "services":    ["design", "ai"],      // service group ids, may be empty
 *   "timeline":    "1-3-months",          // TimelineId
 *   "budget":      "50-150k",             // BudgetId
 *   "name":        "…",
 *   "company":     "…",                   // may be empty
 *   "email":       "…",                   // normalized: trimmed, lowercased
 *   "phone":       "…",                   // optional, omitted when empty
 *   "attachment":  File,                  // optional, ≤ 10MB, multipart only
 *   "submittedAt": "2026-01-01T00:00:00.000Z",
 *   "source":      "site:techlogi.com"
 * }
 * ```
 *
 * The response is parsed with `inquiryReceiptSchema` below, a backend that
 * returns something else fails at the boundary with the field path, rather than
 * handing a component `undefined`.
 */

/** What the backend returns. Both fields are optional on purpose: the form's
 *  success state must not depend on a reference the backend may not mint. */
export const inquiryReceiptSchema = z.object({
  id: z.string().optional(),
  reference: z.string().optional(),
});

export type InquiryReceipt = z.infer<typeof inquiryReceiptSchema>;

/** The submitted body, as the repository sends it. */
export interface InquiryPayload {
  buildType: BuildTypeId;
  description: string;
  services: string[];
  /**
   * Optional because the hero's short form omits them. The dialog collects
   * both; the hero trades them for a form a visitor will actually finish in
   * the first ten seconds, and a reply asks for the rest.
   */
  timeline?: string;
  budget?: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  attachment?: File;
  submittedAt: string;
  source: string;
}
