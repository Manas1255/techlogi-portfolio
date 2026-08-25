import { z } from "zod";
import { FIELD_LIMITS } from "@/constants";
import { emailField, nameField, phoneField } from "@/validations/fields";
import { buildTypeSchema } from "@/content/schemas";

/**
 * The inquiry form's shape, what the visitor SENDS, which is deliberately not
 * the same as what comes back (that lives in `models/inquiry.model.ts`).
 *
 * Messages are i18n keys, resolved by `useFieldError`, so an error is
 * translated like every other string on the site.
 *
 * There is no step machine any more. The three-step wizard this replaced
 * validated one slice of the schema per screen, which was the right design for
 * the form it was and the wrong one for a first contact.
 */

/*
  Plain dates, not project-management vocabulary. Someone who has never
  commissioned software does not think in "1–3 months"; they think "soon" or
  "after the summer".
*/
export const TIMELINES = [
  { id: "asap", label: "As soon as we can" },
  { id: "1-3-months", label: "In the next few months" },
  { id: "3-6-months", label: "Later this year" },
  { id: "exploring", label: "Just exploring for now" },
] as const;

/*
  Budget is the single most abandonment-prone question on a form like this, so
  it is optional, it says so, and "I'd rather not say" is an ordinary choice
  rather than a refusal. The ranges stay wide on purpose: the answer only has
  to tell us what shape of team fits.
*/
export const BUDGETS = [
  { id: "under-5k", label: "Under $5k" },
  { id: "5-10k", label: "$5k – $10k" },
  { id: "10-25k", label: "$10k – $25k" },
  { id: "over-25k", label: "More than $25k" },
  { id: "unsure", label: "I'm not sure yet" },
  { id: "private", label: "I'd rather not say" },
] as const;

export const inquirySchema = z.object({
  buildType: buildTypeSchema.shape.id,
  description: z
    .string()
    .min(12, "inquiry.validation.descriptionShort")
    .max(1000, "validation.maxLength")
    .transform((value) => value.trim()),
  services: z.array(z.string()).default([]),
  // Optional, and defaulted rather than required: a visitor who skips the
  // scope step still submits a complete, answerable inquiry.
  timeline: z.enum(TIMELINES.map((option) => option.id)).optional(),
  budget: z.enum(BUDGETS.map((option) => option.id)).optional(),
  name: nameField,
  // Optional fields keep "" as their empty value rather than `undefined`: a
  // controlled input can never hold `undefined` without React switching it to
  // uncontrolled mid-edit, so the schema speaks the same language the form does.
  company: z
    .string()
    .max(FIELD_LIMITS.name, "validation.maxLength")
    .transform((value) => value.trim())
    .default(""),
  email: emailField,
  phone: z.literal("").or(phoneField).default(""),
});

export type InquiryFormValues = z.input<typeof inquirySchema>;
export type InquiryValues = z.output<typeof inquirySchema>;
export type TimelineId = (typeof TIMELINES)[number]["id"];
export type BudgetId = (typeof BUDGETS)[number]["id"];
