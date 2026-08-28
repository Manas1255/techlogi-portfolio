"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CalendarCheck,
  CircleAlert,
  CircleCheck,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { ChoiceCards } from "@/components/marketing";
import { SelectField, TextField, TextareaField } from "@/components/form";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ConfidentialityNote, useBookingHandoff } from "@/features/booking";
import { useTranslations } from "@/i18n";
import type { MessageKey } from "@/i18n";
import { errorMessage } from "@/lib/mutations";
import { useInquiryStore } from "@/features/inquiry/inquiry-store";
import { useSubmitInquiry } from "@/features/inquiry/services/use-submit-inquiry";
import {
  BUDGETS,
  PROJECT_STAGES,
  TIMELINES,
  inquirySchema,
  type InquiryFormValues,
  type InquiryValues,
  type ProjectStageId,
} from "@/features/inquiry/validations/inquiry.schema";
import { cn } from "@/lib/utils";
import { AttachmentField } from "./attachment-field";
import { DictateButton } from "./dictate-button";
import { BriefProgress } from "./brief-progress";

export interface QuickBriefFormProps {
  /** Where this instance sits, carried into the payload. */
  origin: string;
  /** `inline` sits on a page; `dialog` sits in the modal and gets its actions. */
  tone?: "inline" | "dialog";
  onSubmitted?: () => void;
  className?: string;
}

/**
 * THE BRIEF, as four short screens, and the step in front of the calendar.
 *
 * Every "book a call" control opens this. It asks eight questions, then hands
 * off to Cal.com with the answers attached, so a booked call starts with the
 * brief already read rather than with ten minutes of finding out what it is
 * about.
 *
 * IT IS A FLOW AGAIN, and that is a reversal worth explaining, because the
 * comment this replaces argued the opposite. The original three-step wizard
 * was removed for good reasons: a progress bar over eight questions, per-step
 * validation slices and separate copy per screen made a first contact feel
 * like an application form. It was replaced with one screen, which was right
 * while the form was four fields.
 *
 * At eight fields one screen stops working, and the failure is not
 * theoretical: the whole form is visible at once, so its length is the first
 * thing a visitor evaluates, and they decide before reading a single label.
 * Perceived length, not actual length, is what loses people.
 *
 * So the flow is back, built to avoid what made the first one bad:
 *
 *   · The first step is ONE TAP and advances itself. No typing to begin, and
 *     the visitor is 25% done before deciding whether to commit.
 *   · Every screen holds one idea. Nothing needs scrolling to answer.
 *   · The end is always visible. Four segments, and the count is the point.
 *   · The whole third screen is skippable in one click, because all of it is
 *     optional and pretending otherwise is what makes people abandon.
 *   · Back always works, Enter always advances, and the draft persists, so no
 *     step is a decision a visitor can regret.
 *
 * One react-hook-form instance underneath, so the steps only gate what is
 * RENDERED and what is VALIDATED. Validation, the payload and the success
 * state stay single implementations; splitting them per step is what made the
 * original wizard expensive to change.
 */

/**
 * The four screens. `fields` is both what renders and what must pass before
 * the step will advance, so a step can never validate a field it did not show.
 */
const STEPS = [
  { id: "stage", fields: ["projectStage"] },
  { id: "idea", fields: ["description"] },
  { id: "prepare", fields: ["budget", "timeline", "anythingElse"] },
  { id: "contact", fields: ["name", "email", "phone"] },
] as const satisfies ReadonlyArray<{
  id: string;
  fields: ReadonlyArray<keyof InquiryFormValues>;
}>;

/** The one step where every field is optional, so it offers a way past itself. */
const SKIPPABLE_STEP = 2;

export function QuickBriefForm({
  origin,
  tone = "inline",
  onSubmitted,
  className,
}: QuickBriefFormProps) {
  const t = useTranslations();
  const values = useInquiryStore((state) => state.values);
  const setValues = useInquiryStore((state) => state.setValues);
  const clearDraft = useInquiryStore((state) => state.clearDraft);
  const booking = useBookingHandoff();

  const [step, setStep] = useState(0);
  // Drives the slide direction, so "back" visibly undoes rather than advances.
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const headingRef = useRef<HTMLHeadingElement>(null);
  /*
    Auto-advance is for POINTERS ONLY, and this flag is what keeps it that way.
    A Radix radio group is roving: arrow keys move focus AND change the value,
    so advancing on every change threw a keyboard user to the next step on
    their first arrow press, before they had read the second option. The flag
    is set on pointer-down and consumed by the very next change.
  */
  const advanceOnChange = useRef(false);

  // A File cannot be serialized, so attachments stay in component state rather
  // than the persisted draft. Losing them silently on rehydrate would be worse
  // than not persisting them.
  const [attachments, setAttachments] = useState<File[]>([]);
  // True when the brief was sent AND the calendar took over, so the success
  // panel can say "pick a time" rather than "we will reply".
  const [didHandOff, setDidHandOff] = useState(false);
  const mutation = useSubmitInquiry();

  const form = useForm<InquiryFormValues, unknown, InquiryValues>({
    resolver: zodResolver(inquirySchema),
    mode: "onBlur",
    defaultValues: {
      name: values.name ?? "",
      email: values.email ?? "",
      phone: values.phone ?? "",
      description: values.description ?? "",
      projectStage: values.projectStage,
      budget: values.budget,
      timeline: values.timeline,
      anythingElse: values.anythingElse ?? "",
      // Set by a choice card rather than asked for here; see the schema.
      buildType: values.buildType ?? undefined,
      services: [],
    },
  });

  const isLastStep = step === STEPS.length - 1;
  /*
    `useWatch` rather than `form.watch()` in the render body: the latter
    returns a fresh function the React Compiler cannot reason about, so it
    silently skips memoising this whole component. This is the subscription
    API, and it re-renders only on the field it names.
  */
  const selectedStage = useWatch({
    control: form.control,
    name: "projectStage",
  });

  const goTo = useCallback((next: number, how: "forward" | "back") => {
    setDirection(how);
    setStep(next);
    /*
      Move focus to the new step's heading, not into its first input. A screen
      reader then announces the question before the control, and a keyboard
      user is not dropped mid-form with no idea what changed. The heading is
      `tabIndex={-1}` so it is focusable programmatically without joining the
      tab order.
    */
    requestAnimationFrame(() => headingRef.current?.focus());
  }, []);

  const next = useCallback(async () => {
    const isValid = await form.trigger([...STEPS[step].fields]);
    if (!isValid) return;
    setValues(form.getValues());
    goTo(Math.min(step + 1, STEPS.length - 1), "forward");
  }, [form, goTo, setValues, step]);

  const back = useCallback(() => {
    goTo(Math.max(step - 1, 0), "back");
  }, [goTo, step]);

  const onSubmit: SubmitHandler<InquiryValues> = (submitted) => {
    mutation.mutate(
      { ...submitted, attachments },
      {
        onSuccess: () => {
          /*
            The calendar opens BEFORE the draft is cleared and the form reset,
            because the prefill is read from what was just submitted rather
            than from the form, and because a visitor who has pressed submit
            should meet the next screen without an intervening blank one.
          */
          const opened = booking.open({
            name: submitted.name,
            email: submitted.email,
            notes: briefNotes(submitted),
          });
          setDidHandOff(opened);
          clearDraft();
          setAttachments([]);
          form.reset();
          setStep(0);
          onSubmitted?.();
        },
      },
    );
  };

  if (mutation.isSuccess) {
    return (
      <div
        className={cn(
          "flex flex-col gap-5",
          tone === "inline" &&
            "border-hairline bg-raised rounded-2xl border p-6",
          className,
        )}
      >
        <span className="border-success-border bg-success-subtle text-success-subtle-foreground flex size-11 items-center justify-center rounded-full border">
          <CircleCheck aria-hidden="true" className="size-5" />
        </span>
        <div className="flex flex-col gap-2">
          <p className="text-display-3">{t("inquiry.success.heading")}</p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {/*
              Two different true things. If the calendar opened, the visitor is
              mid-booking and the only useful sentence is about the times in
              front of them. If it did not, we owe them a reply and say so.
            */}
            {didHandOff
              ? t("inquiry.success.bookingBody")
              : t("inquiry.success.body", { email: siteConfig.contact.email })}
          </p>
        </div>
        <Button
          onClick={() => {
            setDidHandOff(false);
            mutation.reset();
          }}
          variant="ghost"
          className="w-fit rounded-full"
        >
          {t("inquiry.success.another")}
        </Button>
      </div>
    );
  }

  const stepCopy = STEPS[step].id;
  const StepHeading = tone === "dialog" ? "h3" : "h2";

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      // Persist on blur rather than on every keystroke: the draft only has to
      // survive closing the dialog, and writing to storage per character is a
      // lot of serialising for a value nobody reads until then.
      onBlur={() => setValues(form.getValues())}
      onKeyDown={(event) => {
        /*
          Enter advances rather than submitting. Without this the browser fires
          the form's only submit button from step one, so a visitor who presses
          Enter after typing their answer sends an empty brief. Textareas keep
          Enter for newlines, which is the whole point of a textarea.
        */
        if (event.key !== "Enter" || isLastStep) return;
        const target = event.target as HTMLElement;
        if (target.tagName === "TEXTAREA") return;
        event.preventDefault();
        void next();
      }}
      noValidate
      /*
        The inline card is PAPER, even on the ink hero, and that is a fix
        rather than a flourish. Radix portals a select popover to
        `document.body`, which is outside the `data-surface="slab"` subtree, so
        it always resolves the ROOT tokens and rendered as a large white sheet
        over a dark form. Chasing the portal is the wrong repair: the popover
        would still be one ground and the field that opened it another.
      */
      data-surface={tone === "inline" ? "paper" : undefined}
      className={cn(
        "flex flex-col gap-6",
        tone === "inline" &&
          "border-hairline rounded-2xl border p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] sm:p-7",
        className,
      )}
    >
      <BriefProgress
        current={step}
        total={STEPS.length}
        label={t("inquiry.flow.progress", {
          current: String(step + 1),
          total: String(STEPS.length),
        })}
      />

      {/*
        `key` on the panel restarts the entrance animation per step, and
        `data-step-panel` carries the direction. A min height keeps the dialog
        from resizing under the reader's cursor between a one-line step and a
        four-field one, which reads as the layout breaking rather than as
        progress.
      */}
      <div
        key={step}
        data-step-panel={direction}
        className="flex min-h-[16rem] flex-col gap-5"
      >
        <div className="flex flex-col gap-1.5">
          {/*
            The level DEPENDS ON WHERE THIS SITS, and hardcoding either one
            skips a level somewhere. In the dialog, Radix renders DialogTitle
            as an h2, so the step is an h3 beneath it. Inline on the hero the
            nearest heading above is the page's h1, so the same markup as an h3
            would jump h1 to h3. A sweep test walks every page's outline.
          */}
          <StepHeading
            ref={headingRef}
            tabIndex={-1}
            className="text-display-3 focus-visible:outline-ring rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {t(`inquiry.flow.${stepCopy}.title` as MessageKey)}
          </StepHeading>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t(`inquiry.flow.${stepCopy}.lead` as MessageKey)}
          </p>
        </div>

        {step === 0 && (
          // Pointer intent, recorded before Radix handles the press.
          <div
            onPointerDown={() => {
              advanceOnChange.current = true;
            }}
          >
            <ChoiceCards
              label={t("inquiry.fields.stage.label")}
              columns={1}
              options={PROJECT_STAGES.map((option) => ({
                id: option.id,
                label: t(option.labelKey satisfies MessageKey),
              }))}
              value={selectedStage}
              /*
              Tapping a card IS advancing. A "next" button under four radio
              cards asks a visitor to confirm a choice they just made, which is
              the extra click that makes a wizard feel like paperwork.

              It is a shortcut, never the only way forward, and both halves
              matter. Radix fires no change when the ALREADY SELECTED option is
              tapped, so a visitor returning to a saved draft, or stepping back
              to look, tapped their own answer and watched nothing happen. The
              Continue button below appears as soon as an answer exists.
            */
              onChange={(value) => {
                form.setValue("projectStage", value as ProjectStageId, {
                  shouldValidate: true,
                });
                setValues({
                  ...form.getValues(),
                  projectStage: value as ProjectStageId,
                });
                if (advanceOnChange.current) {
                  advanceOnChange.current = false;
                  goTo(1, "forward");
                }
              }}
              disabled={mutation.isPending}
            />
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-3">
            <TextareaField
              control={form.control}
              name="description"
              label={t("inquiry.fields.description.label")}
              description={t("inquiry.fields.description.hint")}
              placeholder={t("inquiry.fields.description.placeholder")}
              rows={5}
              disabled={mutation.isPending}
            />
            {/*
              Dictation APPENDS to whatever is already typed rather than
              replacing it, so speaking and typing can be mixed in one answer,
              and a second burst of speech after a pause does not wipe the
              first. The separating space is added here rather than in the hook
              because only the field knows whether it is starting a sentence.
            */}
            <DictateButton
              disabled={mutation.isPending}
              onResult={(text) => {
                const current = form.getValues("description") ?? "";
                const next =
                  current.trim() === "" ? text : `${current.trimEnd()} ${text}`;
                form.setValue("description", next, { shouldValidate: true });
                setValues({ ...form.getValues(), description: next });
              }}
            />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            {/*
              SUBGRID, so the two dropdowns line up.

              Side by side, these are two independent stacks of label, control
              and hint. The budget question wraps onto two lines in German and
              the timeline question does not, so the two triggers sat at
              different heights and the hints below them did too: the row read
              as broken rather than as two fields. Subgrid makes both columns
              share the SAME three rows, so the labels can be any height they
              like and the controls still meet.
            */}
            <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2 sm:grid-rows-[auto_auto_auto]">
              <SelectField
                control={form.control}
                name="budget"
                label={t("inquiry.fields.budget.label")}
                optional
                optionalLabel={t("inquiry.flow.optional")}
                description={t("inquiry.fields.budget.hint")}
                placeholder={t("inquiry.fields.budget.placeholder")}
                options={BUDGETS.map((option) => ({
                  value: option.id,
                  label: t(option.labelKey satisfies MessageKey),
                }))}
                disabled={mutation.isPending}
                className="gap-2 sm:row-span-3 sm:grid sm:grid-rows-subgrid"
              />
              <SelectField
                control={form.control}
                name="timeline"
                label={t("inquiry.fields.timeline.label")}
                optional
                optionalLabel={t("inquiry.flow.optional")}
                description={t("inquiry.fields.timeline.hint")}
                placeholder={t("inquiry.fields.timeline.placeholder")}
                options={TIMELINES.map((option) => ({
                  value: option.id,
                  label: t(option.labelKey satisfies MessageKey),
                }))}
                disabled={mutation.isPending}
                className="gap-2 sm:row-span-3 sm:grid sm:grid-rows-subgrid"
              />
            </div>
            <TextareaField
              control={form.control}
              name="anythingElse"
              label={t("inquiry.fields.anythingElse.label")}
              optional
              optionalLabel={t("inquiry.flow.optional")}
              description={t("inquiry.fields.anythingElse.hint")}
              placeholder={t("inquiry.fields.anythingElse.placeholder")}
              rows={2}
              disabled={mutation.isPending}
            />
            <AttachmentField
              files={attachments}
              onChange={setAttachments}
              disabled={mutation.isPending}
            />
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <TextField
              control={form.control}
              name="name"
              label={t("inquiry.fields.name.label")}
              description={t("inquiry.fields.name.hint")}
              placeholder={t("inquiry.fields.name.placeholder")}
              autoComplete="name"
              disabled={mutation.isPending}
            />
            <TextField
              control={form.control}
              name="email"
              type="email"
              label={t("inquiry.fields.email.label")}
              description={t("inquiry.fields.email.hint")}
              placeholder={t("inquiry.fields.email.placeholder")}
              autoComplete="email"
              inputMode="email"
              disabled={mutation.isPending}
            />
            <TextField
              control={form.control}
              name="phone"
              type="tel"
              label={t("inquiry.fields.phone.label")}
              optional
              optionalLabel={t("inquiry.flow.optional")}
              description={t("inquiry.fields.phone.hint")}
              placeholder={t("inquiry.fields.phone.placeholder")}
              autoComplete="tel"
              inputMode="tel"
              disabled={mutation.isPending}
            />
          </div>
        )}
      </div>

      {mutation.isError && (
        <p
          role="alert"
          className="border-danger-border bg-danger-subtle text-danger-subtle-foreground flex items-start gap-2.5 rounded-lg border p-3 text-sm"
        >
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>
            {t("inquiry.error.title")} {errorMessage(mutation.error)}
          </span>
        </p>
      )}

      <div className="flex flex-col gap-3.5">
        <div className="flex items-center gap-3">
          {step > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={back}
              disabled={mutation.isPending}
              className="shrink-0 gap-1.5 rounded-full px-4"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              {t("inquiry.actions.back")}
            </Button>
          )}

          {/*
            Shown on step one only once an answer exists: before that there is
            nothing to continue to, and a disabled button is just a control
            that looks broken. After that it is the keyboard path forward, and
            the way out for anyone who came back to a saved draft.
          */}
          {!isLastStep && (step > 0 || selectedStage !== undefined) && (
            <Button
              type="button"
              size="lg"
              onClick={() => void next()}
              disabled={mutation.isPending}
              className="press flex-1 rounded-full"
            >
              {t("inquiry.actions.next")}
            </Button>
          )}

          {isLastStep && (
            <Button
              type="submit"
              size="lg"
              disabled={mutation.isPending}
              data-origin={origin}
              className="press flex-1 gap-2 rounded-full"
            >
              <CalendarCheck aria-hidden="true" className="size-4" />
              {mutation.isPending
                ? t("inquiry.actions.submitting")
                : /*
                    The label names the NEXT screen, not this one. "Send" would
                    be a lie about where the button goes when a calendar is
                    about to open, and a promise we cannot keep when it is not,
                    so it tracks whether the embed is actually ready.
                  */
                  booking.isReady
                  ? t("inquiry.actions.continueToBooking")
                  : t("inquiry.actions.submit")}
            </Button>
          )}
        </div>

        {/*
          The optional step says so and offers one click past all four of its
          fields. Hiding optional questions behind a disclosure means nobody
          answers them; demanding them means people leave. Asking plainly, with
          the exit in plain sight, is the version that gets answers from the
          people who have them.
        */}
        {step === SKIPPABLE_STEP && (
          <button
            type="button"
            onClick={() => goTo(step + 1, "forward")}
            disabled={mutation.isPending}
            className="tap-target text-muted-foreground hover:text-foreground focus-visible:outline-ring mx-auto rounded-sm text-sm underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {t("inquiry.actions.skip")}
          </button>
        )}

        {isLastStep && <ConfidentialityNote />}
      </div>
    </form>
  );
}

/**
 * The brief, flattened into the booking's notes field.
 *
 * Cal.com takes one free-text field, so this is the only way the answers reach
 * the calendar entry itself rather than only our own endpoint. Deliberately
 * unlabelled by locale: it is read by us, not by the visitor.
 */
function briefNotes(values: InquiryValues): string {
  return [
    values.description,
    `Stage: ${values.projectStage}`,
    values.budget ? `Budget: ${values.budget}` : null,
    values.timeline ? `Timeline: ${values.timeline}` : null,
    values.phone ? `Phone: ${values.phone}` : null,
    values.anythingElse ? `Also: ${values.anythingElse}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
