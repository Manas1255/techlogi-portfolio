import { backendClient } from "@/lib/http";
import { reportMessage } from "@/lib/reporting";
import { siteConfig } from "@/config/site";
import {
  inquiryReceiptSchema,
  type InquiryPayload,
  type InquiryReceipt,
} from "@/features/inquiry/models/inquiry.model";

/**
 * Sends a project inquiry.
 *
 * Parses in BOTH directions, per the architecture: the payload is assembled
 * from a validated form, and the response goes through `inquiryReceiptSchema`
 * so a backend that changes shape fails here, at the boundary, with a field
 * path, instead of handing a component `undefined`.
 *
 * WHEN NO ENDPOINT IS CONFIGURED (the shipped default) this takes a mock
 * success path: the payload is logged through the reporting seam and an empty
 * receipt is returned, so the full experience, pending, success, reset, is
 * exercisable before a backend exists. Set `siteConfig.inquiry.endpoint` to
 * switch to the real thing; nothing else changes.
 */
export const inquiryRepository = {
  async submit(payload: InquiryPayload): Promise<InquiryReceipt> {
    const endpoint = siteConfig.inquiry.endpoint;

    if (endpoint === null) {
      reportMessage(
        "Inquiry submitted with no endpoint configured, taking the mock success path. Set siteConfig.inquiry.endpoint to deliver it.",
        { scope: "inquiry.submit", payload: describeForLog(payload) },
      );
      return {};
    }

    // An attachment forces multipart; without one, JSON keeps the payload
    // readable in a log and cheap to parse.
    const body =
      payload.attachment === undefined ? payload : toFormData(payload);

    return backendClient.post<InquiryReceipt>(endpoint, body, {
      auth: false,
      parse: inquiryReceiptSchema.parse,
    });
  },
};

function toFormData(payload: InquiryPayload): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) continue;
    if (value instanceof File) {
      form.append(key, value, value.name);
    } else if (Array.isArray(value)) {
      // Repeated keys rather than a JSON string: this is what every server-side
      // multipart parser already understands.
      for (const entry of value) form.append(`${key}[]`, String(entry));
    } else {
      form.append(key, String(value));
    }
  }
  return form;
}

/** Never log a visitor's message body or attachment, shape and size only. */
function describeForLog(payload: InquiryPayload): Record<string, unknown> {
  return {
    buildType: payload.buildType,
    services: payload.services,
    timeline: payload.timeline,
    budget: payload.budget,
    descriptionLength: payload.description.length,
    hasCompany: payload.company !== "",
    hasPhone: payload.phone !== undefined,
    attachmentBytes: payload.attachment?.size ?? 0,
  };
}
