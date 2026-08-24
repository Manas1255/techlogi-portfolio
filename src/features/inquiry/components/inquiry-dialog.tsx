"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CircleAlert,
  CircleCheck,
  Globe,
  HelpCircle,
  LayoutDashboard,
  Repeat,
  Send,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { ChoiceCards } from "@/components/marketing";
import { TextField, TextareaField } from "@/components/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { buildTypes } from "@/content";
import type { BuildTypeId } from "@/content/schemas";
import { siteConfig } from "@/config/site";
import { useTranslations } from "@/i18n";
import { errorMessage } from "@/lib/mutations";
import { useInquiryStore } from "@/features/inquiry/inquiry-store";
import { useSubmitInquiry } from "@/features/inquiry/services/use-submit-inquiry";
import {
  BUDGETS,
  STEP_COUNT,
  STEP_FIELDS,
  TIMELINES,
  inquirySchema,
  type InquiryFormValues,
  type InquiryValues,
} from "@/features/inquiry/validations/inquiry.schema";
import { AttachmentField } from "./attachment-field";
import { InquiryProgress } from "./inquiry-progress";

/**
 * THE PROJECT INQUIRY.
 *
 * A centred dialog, mounted once, opened from anywhere via the store — so
 * "Start a Project" is reachable from the header, the hero, every section CTA
 * and the footer without any of them owning the form.
 *
 * Why a dialog rather than the side dialog it replaced: a dialog is a good
 * pattern for a task you dip into beside your work. This is not that — it is
 * the one thing the visitor came to do, and it deserves the centre of the
 * screen with the page dimmed behind it. The side panel also put the form in a
 * narrow column, which forced every choice into a cramped two-up grid.
 *
 * WHO THIS IS FOR. The person filling it in is usually not technical. Every
 * decision below follows from that:
 *
 *  - Three steps, not four. The scope questions merged into the brief, because
 *    both are optional and a screen that can be skipped entirely doesn't earn
 *    one.
 *  - Plain language throughout, in the content layer. "Multi-tenant" and
 *    "LLM" ask the reader to already know the answer.
 *  - Every question after the first is optional except a description and a way
 *    to reply. Budget in particular says so out loud.
 *  - The choice made on step one stays visible in the header afterwards, so
 *    nobody loses their place.
 *  - Progress reads "Step 2 of 3", not "02 / 03".
 *
 * Accessibility comes from Radix's Dialog underneath: focus trapped while open,
 * Escape closes, focus returns to whatever opened it, the page behind inert and
 * scroll-locked. What is added here is the rest of the contract — one form
 * instance so going back never loses input, per-step validation so a field you
 * haven't seen can't block you, a live region announcing each step, and
 * designed loading, error and success states.
 *
 * The layout is a three-row grid — header, scrolling body, footer — so the
 * body scrolls WITHIN the dialog and the heading can never slide under the
 * header, which is exactly what the previous panel did.
 */

/** Icons make an eight-option grid scannable without reading every label. */
const BUILD_TYPE_ICONS: Record<
  BuildTypeId,
  React.ComponentType<{ className?: string }>
> = {
  "web-app": LayoutDashboard,
  "mobile-app": Smartphone,
  "saas-platform": Sparkles,
  "ai-product": Bot,
  website: Globe,
  "improve-existing": Repeat,
  "dedicated-team": Users,
  "something-else": HelpCircle,
};

export function InquiryDialog() {
  const t = useTranslations();
  const isOpen = useInquiryStore((state) => state.isOpen);
  const step = useInquiryStore((state) => state.step);
  const storedValues = useInquiryStore((state) => state.values);
  const close = useInquiryStore((state) => state.close);
  const setStep = useInquiryStore((state) => state.setStep);
  const setValues = useInquiryStore((state) => state.setValues);
  const clearDraft = useInquiryStore((state) => state.clearDraft);

  // A File can't be serialized, so the attachment lives here rather than in the
  // persisted store — losing it silently on rehydrate would be worse.
  const [attachment, setAttachment] = useState<File | null>(null);
  const headingRef = useRef<HTMLParagraphElement>(null);

  const mutation = useSubmitInquiry();
  const form = useForm<InquiryFormValues, unknown, InquiryValues>({
    resolver: zodResolver(inquirySchema),
    mode: "onTouched",
    defaultValues: {
      buildType: undefined,
      description: "",
      services: [],
      timeline: undefined,
      budget: undefined,
      name: "",
      company: "",
      email: "",
      phone: "",
      ...storedValues,
    },
  });

  // Restore the saved draft whenever the dialog opens: the visitor may have
  // closed it three sections ago, and this component never unmounts.
  useEffect(() => {
    if (!isOpen) return;
    form.reset({ ...form.getValues(), ...storedValues }, { keepErrors: true });
    // `storedValues` is intentionally read once per open — reacting to every
    // keystroke would fight the form for control of its own inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // `useWatch` rather than `form.watch`: watch returns a fresh function on
  // every render, which opts the component out of React Compiler memoization.
  const buildType = useWatch({ control: form.control, name: "buildType" });
  const timeline = useWatch({ control: form.control, name: "timeline" });
  const budget = useWatch({ control: form.control, name: "budget" });

  function persist() {
    setValues(form.getValues());
  }

  function handleClose() {
    // Closing a finished inquiry ends it: reopening should offer a fresh form,
    // not the success panel from five minutes ago.
    if (mutation.isSuccess) {
      mutation.reset();
      setStep(0);
      close();
      return;
    }
    persist();
    close();
  }

  async function goNext() {
    const isValid = await form.trigger(STEP_FIELDS[step], {
      shouldFocus: true,
    });
    if (!isValid) return;
    persist();

    const next = Math.min(step + 1, STEP_COUNT - 1);
    /*
      Clear the NEXT step's errors before showing it. The resolver validates the
      whole schema on every `trigger`, so arriving at the contact step would
      otherwise greet the visitor with "This field is required" under fields
      they have not been shown yet — which reads as having already failed, and
      is the exact opposite of the reassurance this form is trying to give.
    */
    form.clearErrors(STEP_FIELDS[next]);
    setStep(next);
    headingRef.current?.focus();
  }

  function goBack() {
    persist();
    setStep(Math.max(step - 1, 0));
    headingRef.current?.focus();
  }

  const onSubmit: SubmitHandler<InquiryValues> = (values) => {
    mutation.mutate(
      { ...values, attachment: attachment ?? undefined },
      {
        onSuccess: () => {
          // Clear the draft — a submitted inquiry shouldn't reappear
          // half-filled — but leave the dialog open, because the success state
          // is the whole point of having submitted.
          clearDraft();
          setAttachment(null);
          form.reset();
        },
      },
    );
  };

  const stepLabels = [
    t("inquiry.steps.build"),
    t("inquiry.steps.brief"),
    t("inquiry.steps.contact"),
  ] as const;

  const isLastStep = step === STEP_COUNT - 1;
  const isSubmitted = mutation.isSuccess;
  const chosen = buildTypes.find((type) => type.id === buildType);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        showCloseButton
        className="grid max-h-[calc(100dvh-2rem)] w-full grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-2xl"
      >
        <div className="border-hairline flex flex-col gap-3.5 border-b p-5 pr-14 sm:gap-4 sm:p-8 sm:pr-14">
          <div className="flex flex-col gap-1.5">
            <DialogTitle className="text-display-3">
              {isSubmitted ? t("inquiry.success.title") : t("inquiry.title")}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              {isSubmitted
                ? siteConfig.contact.responseTime
                : t("inquiry.subtitle")}
            </DialogDescription>
          </div>

          {!isSubmitted && (
            <>
              <InquiryProgress
                step={step}
                total={STEP_COUNT}
                labels={stepLabels}
              />
              {/* Keeps the visitor's own answer in front of them once they've
                  moved past it, so nobody loses their place mid-form. */}
              {chosen !== undefined && step > 0 && (
                <p className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
                  <span className="border-hairline bg-accent text-accent-foreground rounded-full border px-2.5 py-1 text-[0.8125rem] font-medium">
                    {chosen.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="focus-visible:outline-ring hover:text-foreground rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {t("inquiry.actions.change")}
                  </button>
                </p>
              )}
            </>
          )}
        </div>

        {isSubmitted ? (
          <SuccessPanel
            onClose={close}
            onAnother={() => {
              mutation.reset();
              setStep(0);
            }}
          />
        ) : (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="contents"
            noValidate
          >
            <div className="min-h-0 overflow-y-auto p-5 sm:p-8">
              <p
                ref={headingRef}
                tabIndex={-1}
                className="text-display-3 mb-2 outline-none"
              >
                {t(`inquiry.step${step + 1}.title` as "inquiry.step1.title")}
              </p>
              <p className="text-muted-foreground mb-6 text-sm">
                {t(`inquiry.step${step + 1}.lead` as "inquiry.step1.lead")}
              </p>

              {step === 0 && (
                <ChoiceCards
                  label={t("inquiry.step1.title")}
                  columns={2}
                  options={buildTypes.map((type) => ({
                    id: type.id,
                    label: type.label,
                    hint: type.hint,
                    Icon: BUILD_TYPE_ICONS[type.id],
                  }))}
                  value={buildType}
                  onChange={(value) => {
                    form.setValue("buildType", value as BuildTypeId, {
                      shouldValidate: true,
                    });
                    // A single low-effort choice should move the visitor on,
                    // not make them find a Next button for a decision they've
                    // already made.
                    setValues({ buildType: value as BuildTypeId });
                    setStep(1);
                  }}
                />
              )}

              {step === 1 && (
                <div className="flex flex-col gap-7">
                  <TextareaField
                    control={form.control}
                    name="description"
                    label={t("inquiry.fields.description.label")}
                    description={t("inquiry.fields.description.hint")}
                    placeholder={t("inquiry.fields.description.placeholder")}
                    rows={5}
                  />

                  <fieldset className="flex flex-col gap-2.5">
                    <legend className="text-label text-foreground mb-2.5">
                      {t("inquiry.fields.timeline.label")}
                    </legend>
                    <ChoiceCards
                      label={t("inquiry.fields.timeline.label")}
                      columns={2}
                      compact
                      options={TIMELINES.map((option) => ({ ...option }))}
                      value={timeline}
                      onChange={(value) =>
                        form.setValue(
                          "timeline",
                          value as InquiryFormValues["timeline"],
                          { shouldValidate: true },
                        )
                      }
                    />
                  </fieldset>

                  <fieldset className="flex flex-col gap-2.5">
                    <legend className="text-label text-foreground mb-2.5">
                      {t("inquiry.fields.budget.label")}
                    </legend>
                    <ChoiceCards
                      label={t("inquiry.fields.budget.label")}
                      columns={2}
                      compact
                      options={BUDGETS.map((option) => ({ ...option }))}
                      value={budget}
                      onChange={(value) =>
                        form.setValue(
                          "budget",
                          value as InquiryFormValues["budget"],
                          { shouldValidate: true },
                        )
                      }
                    />
                    <p className="text-caption text-muted-foreground">
                      {t("inquiry.fields.budget.hint")}
                    </p>
                  </fieldset>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField
                      control={form.control}
                      name="name"
                      label={t("inquiry.fields.name.label")}
                      autoComplete="name"
                    />
                    <TextField
                      control={form.control}
                      name="email"
                      type="email"
                      label={t("inquiry.fields.email.label")}
                      autoComplete="email"
                      inputMode="email"
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField
                      control={form.control}
                      name="company"
                      label={t("inquiry.fields.company.label")}
                      autoComplete="organization"
                    />
                    <TextField
                      control={form.control}
                      name="phone"
                      type="tel"
                      label={t("inquiry.fields.phone.label")}
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </div>
                  <AttachmentField
                    file={attachment}
                    onChange={setAttachment}
                    disabled={mutation.isPending}
                  />
                </div>
              )}
            </div>

            <div className="border-hairline bg-background flex flex-col gap-3.5 border-t p-5 sm:gap-4 sm:p-8">
              {mutation.isError && (
                <p
                  role="alert"
                  className="border-danger-border bg-danger-subtle text-danger-subtle-foreground flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm"
                >
                  <CircleAlert
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0"
                  />
                  <span>
                    {t("inquiry.error.title")} {errorMessage(mutation.error)}
                  </span>
                </p>
              )}

              <div className="flex items-center gap-3">
                {step > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={goBack}
                    disabled={mutation.isPending}
                    className="gap-2 rounded-full"
                  >
                    <ArrowLeft aria-hidden="true" className="size-4" />
                    {t("inquiry.actions.back")}
                  </Button>
                )}
                <div className="flex-1" />
                {isLastStep ? (
                  <Button
                    type="submit"
                    size="lg"
                    disabled={mutation.isPending}
                    className="press gap-2 rounded-full"
                  >
                    <Send aria-hidden="true" className="size-4" />
                    {mutation.isPending
                      ? t("inquiry.actions.submitting")
                      : t("inquiry.actions.submit")}
                  </Button>
                ) : (
                  step > 0 && (
                    <Button
                      type="button"
                      size="lg"
                      onClick={() => void goNext()}
                      className="press gap-2 rounded-full"
                    >
                      {t("inquiry.actions.next")}
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Button>
                  )
                )}
              </div>

              {/* The full reassurance lands on the step that actually asks
                  for personal details; earlier steps get the short form, which
                  on a phone is the difference between seeing three choices and
                  seeing five. */}
              <p className="text-caption text-muted-foreground">
                {isLastStep ? t("inquiry.privacy") : t("inquiry.privacyShort")}
              </p>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SuccessPanel({
  onClose,
  onAnother,
}: {
  onClose: () => void;
  onAnother: () => void;
}) {
  const t = useTranslations();
  return (
    <div className="row-span-2 flex flex-col justify-center gap-6 p-5 sm:p-8">
      <span className="border-success-border bg-success-subtle text-success-subtle-foreground flex size-12 items-center justify-center rounded-full border">
        <CircleCheck aria-hidden="true" className="size-6" />
      </span>
      <div className="flex flex-col gap-2">
        <p className="text-display-3">{t("inquiry.success.heading")}</p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {t("inquiry.success.body", { email: siteConfig.contact.email })}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onClose} size="lg" className="rounded-full">
          {t("inquiry.success.close")}
        </Button>
        <Button
          onClick={onAnother}
          variant="ghost"
          size="lg"
          className="rounded-full"
        >
          {t("inquiry.success.another")}
        </Button>
      </div>
    </div>
  );
}
