"use client";

import { useApiMutation } from "@/lib/mutations";
import { siteConfig } from "@/config/site";
import { inquiryRepository } from "@/features/inquiry/api/inquiry.repository";
import type {
  InquiryPayload,
  InquiryReceipt,
} from "@/features/inquiry/models/inquiry.model";
import type {
  InquiryValues,
  QuickInquiryValues,
} from "@/features/inquiry/validations/inquiry.schema";

export interface SubmitInquiryVariables extends InquiryValues {
  attachment?: File;
}

/**
 * Submits an inquiry.
 *
 * `showErrorToast: false` — the drawer renders a designed error state inline,
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
    buildType: values.buildType,
    description: values.description,
    services: values.services,
    timeline: values.timeline,
    budget: values.budget,
    name: values.name,
    company: values.company,
    email: values.email,
    // An empty optional field is omitted rather than sent as "" — the receiving
    // end shouldn't have to distinguish "not given" from "given as blank".
    phone: values.phone === "" ? undefined : values.phone,
    attachment: values.attachment,
    submittedAt: new Date().toISOString(),
    source: `site:${siteConfig.url}`,
  };
}

/**
 * Submits the hero's short form.
 *
 * Same repository, same error handling, same success semantics — only the
 * shape of what was collected differs, so there is one place that knows how to
 * send an inquiry rather than two that drift.
 */
export function useSubmitQuickInquiry() {
  return useApiMutation<InquiryReceipt, QuickInquiryValues>({
    mutationFn: (values) =>
      inquiryRepository.submit({
        buildType: values.buildType,
        description: values.description,
        services: [],
        name: values.name,
        company: "",
        email: values.email,
        submittedAt: new Date().toISOString(),
        source: `site:${siteConfig.url}`,
      }),
    showErrorToast: false,
    reportScope: "inquiry.submit.quick",
  });
}
