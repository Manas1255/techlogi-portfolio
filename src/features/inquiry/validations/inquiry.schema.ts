import { z } from "zod";
import { FIELD_LIMITS } from "@/constants";
import { emailField, nameField, phoneField } from "@/validations/fields";
import { buildTypeSchema } from "@/content/schemas";

/**
 * The inquiry form's shape — what the visitor SENDS, which is deliberately not
 * the same as what comes back (that lives in `models/inquiry.model.ts`).
 *
 * Messages are i18n keys, resolved by `useFieldError`, so an error is
 * translated like every other string on the site.
 *
 * `STEP_FIELDS` is what makes the multi-step flow work off ONE form instance:
 * each step validates only its own fields, so moving forward can't be blocked
 * by a field the visitor hasn't been shown yet.
 */

export const TIMELINES = [
  { id: "asap", label: "As soon as possible" },
  { id: "1-3-months", label: "In the next 1–3 months" },
  { id: "3-6-months", label: "In 3–6 months" },
  { id: "exploring", label: "Still exploring" },
] as const;

export const BUDGETS = [
  { id: "under-50k", label: "Under $50k" },
  { id: "50-150k", label: "$50k – $150k" },
  { id: "150-400k", label: "$150k – $400k" },
  { id: "400k-plus", label: "$400k+" },
  { id: "unsure", label: "Not sure yet" },
] as const;

export const inquirySchema = z.object({
  buildType: buildTypeSchema.shape.id,
  description: z
    .string()
    .min(20, "inquiry.validation.descriptionShort")
    .max(1000, "validation.maxLength")
    .transform((value) => value.trim()),
  services: z.array(z.string()).default([]),
  timeline: z.enum(TIMELINES.map((option) => option.id)),
  budget: z.enum(BUDGETS.map((option) => option.id)),
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

/** The four steps, and which fields each one owns. */
export const STEP_FIELDS = [
  ["buildType"],
  ["description", "services"],
  ["timeline", "budget"],
  ["name", "company", "email", "phone"],
] as const satisfies readonly (readonly (keyof InquiryFormValues)[])[];

export const STEP_COUNT = STEP_FIELDS.length;
