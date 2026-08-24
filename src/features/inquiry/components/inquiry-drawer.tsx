"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  CircleCheck,
  Send,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { ChoiceCards } from "@/components/marketing";
import { TextField, TextareaField } from "@/components/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { buildTypes, serviceGroups } from "@/content";
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
 * Mounted once, globally, and opened from anywhere via the store — so "Start a
 * Project" is reachable from the header, the hero, every section CTA and the
 * footer without any of them owning the form.
 *
 * Why a drawer over a page: the visitor keeps their place. Closing it returns
 * them to the paragraph they were reading, and because progress lives in
 * sessionStorage, reopening it later in the session resumes exactly where they
 * left off — the difference between a form and a conversation you can pause.
 *
 * Accessibility comes from Radix's Dialog underneath: focus is trapped while
 * open, Escape closes, focus returns to whatever opened it, and the page behind
 * is inert and scroll-locked. What is added here is the rest of the contract —
 * one form instance so going back never loses input, per-step validation so a
 * field you haven't seen can't block you, a live region announcing each step,
 * and designed loading, error and success states.
 */
export function InquiryDrawer() {
  const t = useTranslations();
  const isOpen = useInquiryStore((state) => state.isOpen);
  const step = useInquiryStore((state) => state.step);
  const storedValues = useInquiryStore((state) => state.values);
  const close = useInquiryStore((state) => state.close);
  const setStep = useInquiryStore((state) => state.setStep);
  const setValues = useInquiryStore((state) => state.setValues);
  const reset = useInquiryStore((state) => state.reset);

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

  // Restore the saved draft whenever the drawer opens: the visitor may have
  // closed it three sections ago, and this component never unmounts.
  useEffect(() => {
    if (!isOpen) return;
    form.reset({ ...form.getValues(), ...storedValues }, { keepErrors: true });
    // `storedValues` is intentionally read once per open — reacting to every
    // keystroke would fight the form for control of its own inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function persist() {
    setValues(form.getValues());
  }

  function handleClose() {
    persist();
    close();
  }

  async function goNext() {
    const isValid = await form.trigger(STEP_FIELDS[step], {
      shouldFocus: true,
    });
    if (!isValid) return;
    persist();
    setStep(Math.min(step + 1, STEP_COUNT - 1));
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
          // Clear the draft: a submitted inquiry shouldn't reappear half-filled.
          reset();
          setAttachment(null);
          form.reset();
        },
      },
    );
  };

  // `useWatch` rather than `form.watch`: watch returns a fresh function on
  // every render, which opts the component out of React Compiler memoization.
  const buildType = useWatch({ control: form.control, name: "buildType" });
  const services = useWatch({ control: form.control, name: "services" });
  const timeline = useWatch({ control: form.control, name: "timeline" });
  const budget = useWatch({ control: form.control, name: "budget" });

  const stepLabels = [
    t("inquiry.steps.build"),
    t("inquiry.steps.brief"),
    t("inquiry.steps.scope"),
    t("inquiry.steps.contact"),
  ] as const;

  const isLastStep = step === STEP_COUNT - 1;
  const isSubmitted = mutation.isSuccess;

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <SheetContent
        side="right"
        className="border-hairline flex w-full flex-col gap-0 p-0 sm:max-w-xl"
        aria-label={t("inquiry.title")}
      >
        <SheetHeader className="border-hairline gap-4 border-b p-6 sm:p-8">
          <div className="flex flex-col gap-1.5">
            <SheetTitle className="text-display-3">
              {isSubmitted ? t("inquiry.success.title") : t("inquiry.title")}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground text-sm">
              {isSubmitted
                ? siteConfig.contact.responseTime
                : t("inquiry.subtitle")}
            </SheetDescription>
          </div>
          {!isSubmitted && (
            <InquiryProgress
              step={step}
              total={STEP_COUNT}
              labels={stepLabels}
            />
          )}
        </SheetHeader>

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
            className="flex min-h-0 flex-1 flex-col"
            noValidate
          >
            <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
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
                  }))}
                  value={buildType}
                  onChange={(value) => {
                    form.setValue(
                      "buildType",
                      value as InquiryFormValues["buildType"],
                      { shouldValidate: true },
                    );
                    // A single low-effort choice should move the visitor on,
                    // not make them find a Next button for a decision they've
                    // already made.
                    setValues({
                      buildType: value as InquiryFormValues["buildType"],
                    });
                    setStep(1);
                  }}
                />
              )}

              {step === 1 && (
                <div className="flex flex-col gap-6">
                  <TextareaField
                    control={form.control}
                    name="description"
                    label={t("inquiry.fields.description.label")}
                    description={t("inquiry.fields.description.hint")}
                    placeholder={t("inquiry.fields.description.placeholder")}
                    rows={6}
                  />
                  <div className="flex flex-col gap-2.5">
                    <p className="text-label text-foreground">
                      {t("inquiry.fields.services.label")}
                    </p>
                    <ChoiceCards
                      multiple
                      label={t("inquiry.fields.services.label")}
                      columns={2}
                      options={serviceGroups.map((group) => ({
                        id: group.id,
                        label: group.name,
                      }))}
                      value={services ?? []}
                      onChange={(value) =>
                        form.setValue("services", value, {
                          shouldValidate: true,
                        })
                      }
                    />
                    <p className="text-caption text-muted-foreground">
                      {t("inquiry.fields.services.hint")}
                    </p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-7">
                  <div className="flex flex-col gap-2.5">
                    <p className="text-label text-foreground">
                      {t("inquiry.fields.timeline.label")}
                    </p>
                    <ChoiceCards
                      label={t("inquiry.fields.timeline.label")}
                      columns={2}
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
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <p className="text-label text-foreground">
                      {t("inquiry.fields.budget.label")}
                    </p>
                    <ChoiceCards
                      label={t("inquiry.fields.budget.label")}
                      columns={2}
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
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-5">
                  <TextField
                    control={form.control}
                    name="name"
                    label={t("inquiry.fields.name.label")}
                    autoComplete="name"
                  />
                  <TextField
                    control={form.control}
                    name="company"
                    label={t("inquiry.fields.company.label")}
                    autoComplete="organization"
                  />
                  <TextField
                    control={form.control}
                    name="email"
                    type="email"
                    label={t("inquiry.fields.email.label")}
                    autoComplete="email"
                    inputMode="email"
                  />
                  <TextField
                    control={form.control}
                    name="phone"
                    type="tel"
                    label={t("inquiry.fields.phone.label")}
                    autoComplete="tel"
                    inputMode="tel"
                  />
                  <AttachmentField
                    file={attachment}
                    onChange={setAttachment}
                    disabled={mutation.isPending}
                  />
                </div>
              )}
            </div>

            <div className="border-hairline bg-background flex flex-col gap-4 border-t p-6 sm:p-8">
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
                    className="gap-2"
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
                    className="gap-2"
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
                      className="gap-2"
                    >
                      {t("inquiry.actions.next")}
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Button>
                  )
                )}
              </div>

              <p className="text-caption text-muted-foreground">
                {t("inquiry.privacy")}
              </p>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
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
    <div className="flex min-h-0 flex-1 flex-col justify-center gap-6 p-6 sm:p-8">
      <span className="border-success-border bg-success-subtle text-success flex size-12 items-center justify-center rounded-full border">
        <CircleCheck aria-hidden="true" className="size-6" />
      </span>
      <div className="flex flex-col gap-2">
        <p className="text-display-3">{t("inquiry.success.heading")}</p>
        <p className="text-muted-foreground text-sm">
          {t("inquiry.success.body", { email: siteConfig.contact.email })}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onClose} size="lg">
          {t("inquiry.success.close")}
        </Button>
        <Button onClick={onAnother} variant="ghost" size="lg">
          {t("inquiry.success.another")}
        </Button>
      </div>
    </div>
  );
}
