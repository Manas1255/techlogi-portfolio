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
 * `STEP_FIELDS` is what makes the multi-step flow work off ONE form instance:
 * each step validates only its own fields, so moving forward can't be blocked
 * by a field the visitor hasn't been shown yet.
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
  { id: "under-50k", label: "Under $50k" },
  { id: "50-150k", label: "$50k – $150k" },
  { id: "150-400k", label: "$150k – $400k" },
  { id: "400k-plus", label: "More than $400k" },
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

/**
 * THREE steps, and which fields each one owns.
 *
 * It was four. The scope step (timeline and budget) and the brief step were
 * merged, because every extra screen is another place to stop, and because
 * both of the scope questions are now optional, so a step that could be
 * skipped entirely does not deserve a screen of its own.
 */
export const STEP_FIELDS = [
  ["buildType"],
  ["description", "services", "timeline", "budget"],
  ["name", "company", "email", "phone"],
] as const satisfies readonly (readonly (keyof InquiryFormValues)[])[];

export const STEP_COUNT = STEP_FIELDS.length;

/**
 * THE SHORT FORM, as it appears in the hero.
 *
 * Four fields, one of them optional. A visitor who has just landed will not
 * fill in timeline and budget, and asking anyway is how a hero form becomes
 * decoration, so the short form collects only what is needed to reply, and
 * the reply asks for the rest. It submits through the SAME repository and the
 * same success path as the dialog; there is one implementation of "send an
 * inquiry", not two.
 */
export const quickInquirySchema = z.object({
  buildType: buildTypeSchema.shape.id,
  name: nameField,
  email: emailField,
  description: z
    .string()
    .max(1000, "validation.maxLength")
    .transform((value) => value.trim())
    .default(""),
});

export type QuickInquiryFormValues = z.input<typeof quickInquirySchema>;
export type QuickInquiryValues = z.output<typeof quickInquirySchema>;
