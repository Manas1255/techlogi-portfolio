"use client";

import { useApiMutation } from "@/lib/mutations";
import { siteConfig } from "@/config/site";
import { inquiryRepository } from "@/features/inquiry/api/inquiry.repository";
import type {
  InquiryPayload,
  InquiryReceipt,
} from "@/features/inquiry/models/inquiry.model";
import type { InquiryValues } from "@/features/inquiry/validations/inquiry.schema";

export interface SubmitInquiryVariables extends InquiryValues {
  attachments: File[];
}

/**
 * Submits an inquiry.
 *
 * `showErrorToast: false`, the dialog renders a designed error state inline,
 * next to the submit button where the visitor is looking, rather than a toast
 * that can be missed at the other end of the viewport.
 */
export function useSubmitInquiry() {
  return useApiMutation<InquiryReceipt, SubmitInquiryVariables>({
    mutationFn: (values) => inquiryRepository.submit(toPayload(values)),
    showErrorToast: false,
    reportScope: "inquiry.submit",
  });
}

function toPayload(values: SubmitInquiryVariables): InquiryPayload {
  return {
    name: values.name,
    email: values.email,
    // An empty optional field is omitted rather than sent as "", the receiving
    // end shouldn't have to distinguish "not given" from "given as blank".
    phone: values.phone === "" ? undefined : values.phone,
    description: values.description,
    projectStage: values.projectStage,
    budget: values.budget,
    timeline: values.timeline,
    anythingElse: values.anythingElse,
    buildType: values.buildType,
    services: values.services,
    attachments: values.attachments,
    submittedAt: new Date().toISOString(),
    source: `site:${siteConfig.url}`,
  };
}
