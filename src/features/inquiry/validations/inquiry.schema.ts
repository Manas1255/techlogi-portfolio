import { z } from "zod";
import { emailField, nameField, phoneField } from "@/validations/fields";
import { buildTypeSchema } from "@/content/schemas";

/**
 * The inquiry form's shape, what the visitor SENDS, which is deliberately not
 * the same as what comes back (that lives in `models/inquiry.model.ts`).
 *
 * Messages are i18n keys, resolved by `useFieldError`, so an error is
 * translated like every other string on the site.
 *
 * EIGHT QUESTIONS, in the order a person can answer them: who you are, how we
 * reach you, what you want, where you have got to, what it is worth, when you
 * want it, and anything else. The form is now the step BEFORE the calendar
 * rather than an alternative to it, so every answer here is context that
 * arrives with a booked call instead of a meeting starting from nothing.
 *
 * OPTION LABELS ARE i18n KEYS, and that is a fix, not a refactor. They used to
 * be English string literals in this file, rendered straight into the select
 * on `/de`: a German visitor picked their timeline from "As soon as we can"
 * and their budget from "I'd rather not say". Nothing failed, because a
 * hardcoded label is a valid label. The rule this file broke is the same one
 * `siteConfig` has: text a visitor reads never lives in a module that cannot
 * be translated.
 */

/**
 * Where the project has got to. The qualifying question: it separates someone
 * who needs the idea shaped from someone holding finished designs, and those
 * are different first conversations.
 */
export const PROJECT_STAGES = [
  { id: "idea", labelKey: "inquiry.options.stage.idea" },
  { id: "concept", labelKey: "inquiry.options.stage.concept" },
  { id: "design", labelKey: "inquiry.options.stage.design" },
  { id: "existing-app", labelKey: "inquiry.options.stage.existingApp" },
] as const;

/*
  Plain dates, not project-management vocabulary. Someone who has never
  commissioned software does not think in "1–3 months"; they think "soon" or
  "after the summer".
*/
export const TIMELINES = [
  { id: "asap", labelKey: "inquiry.options.timeline.asap" },
  { id: "1-3-months", labelKey: "inquiry.options.timeline.months" },
  { id: "3-6-months", labelKey: "inquiry.options.timeline.later" },
  { id: "exploring", labelKey: "inquiry.options.timeline.exploring" },
] as const;

/*
  Budget is the single most abandonment-prone question on a form like this, so
  it is optional, it says so, and "I'd rather not say" is an ordinary choice
  rather than a refusal. The ranges stay wide on purpose: the answer only has
  to tell us what shape of team fits.
*/
export const BUDGETS = [
  { id: "under-5k", labelKey: "inquiry.options.budget.under5k" },
  { id: "5-10k", labelKey: "inquiry.options.budget.from5to10k" },
  { id: "10-25k", labelKey: "inquiry.options.budget.from10to25k" },
  { id: "over-25k", labelKey: "inquiry.options.budget.over25k" },
  { id: "unsure", labelKey: "inquiry.options.budget.unsure" },
  { id: "private", labelKey: "inquiry.options.budget.private" },
] as const;

export const inquirySchema = z.object({
  name: nameField,
  email: emailField,
  /*
    Optional, and empty-string rather than `undefined`: a controlled input can
    never hold `undefined` without React switching it to uncontrolled mid-edit,
    so the schema speaks the same language the form does. It stays optional
    because the call is booked on the next screen, where a time and a calendar
    invite are agreed anyway; demanding a phone number to reach that screen
    buys nothing and costs completions.
  */
  phone: z.literal("").or(phoneField).default(""),
  description: z
    .string()
    .min(12, "inquiry.validation.descriptionShort")
    .max(1000, "validation.maxLength")
    .transform((value) => value.trim()),
  /*
    The message is NOT optional. Every other field passes an i18n key, and an
    unmessaged enum surfaces Zod's own default, which prints the enum's ids, in
    English, whatever the page language: a raw internal shown to a visitor.
  */
  projectStage: z.enum(
    PROJECT_STAGES.map((option) => option.id),
    { message: "inquiry.validation.stageRequired" },
  ),
  budget: z.enum(BUDGETS.map((option) => option.id)).optional(),
  timeline: z.enum(TIMELINES.map((option) => option.id)).optional(),
  anythingElse: z
    .string()
    .max(1000, "validation.maxLength")
    .transform((value) => value.trim())
    .default(""),
  /*
    Not a question on the form. `InquiryLauncher` on the closing section and
    `/contact` is a row of choice cards, and clicking one both opens this
    dialog and records what was clicked, so the answer travels with the brief
    without being asked for a second time. Optional because most entry points
    (the header, the hero, a case study) have no such choice behind them.
  */
  buildType: z.enum(buildTypeSchema.shape.id.options).optional(),
  services: z.array(z.string()).default([]),
});

export type InquiryFormValues = z.input<typeof inquirySchema>;
export type InquiryValues = z.output<typeof inquirySchema>;
export type ProjectStageId = (typeof PROJECT_STAGES)[number]["id"];
export type TimelineId = (typeof TIMELINES)[number]["id"];
export type BudgetId = (typeof BUDGETS)[number]["id"];
