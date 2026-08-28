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
 *   "name":         "…",
 *   "email":        "…",                  // normalized: trimmed, lowercased
 *   "phone":        "…",                  // optional, omitted when empty
 *   "description":  "…",                  // 12–1000 chars
 *   "projectStage": "concept",            // ProjectStageId, required
 *   "budget":       "5-10k",              // BudgetId, optional
 *   "timeline":     "1-3-months",         // TimelineId, optional
 *   "anythingElse": "…",                  // may be empty
 *   "buildType":    "saas-platform",      // BuildTypeId, only from a choice card
 *   "services":     ["design", "ai"],     // service group ids, may be empty
 *   "attachments": File[],                // optional, ≤5 files, ≤25MB each,
 *                                         // repeated `attachments[]` parts
 *   "submittedAt": "2026-01-01T00:00:00.000Z",
 *   "source":      "site:gastudio.com"
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
  name: string;
  email: string;
  phone?: string;
  description: string;
  /** Where the project has got to. The form's qualifying question. */
  projectStage: string;
  budget?: string;
  timeline?: string;
  /** Free text, "" when the visitor left it blank. */
  anythingElse: string;
  /**
   * Only present when the brief was opened from a choice card, which records
   * what was clicked rather than asking the same question twice. Undefined
   * from every other entry point.
   */
  buildType?: BuildTypeId;
  services: string[];
  /**
   * Any format. The site deliberately does not whitelist types client-side
   * (see `siteConfig.inquiry`), so WHATEVER RECEIVES THIS MUST VALIDATE the
   * type and the content of every file itself.
   */
  attachments: File[];
  submittedAt: string;
  source: string;
}
