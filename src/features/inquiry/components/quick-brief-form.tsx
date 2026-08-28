"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck, CircleAlert, CircleCheck } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
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
} from "@/features/inquiry/validations/inquiry.schema";
import { cn } from "@/lib/utils";
import { AttachmentField } from "./attachment-field";

export interface QuickBriefFormProps {
  /** Where this instance sits, carried into the payload. */
  origin: string;
  /** `inline` sits on a page; `dialog` sits in the modal and gets its actions. */
  tone?: "inline" | "dialog";
  onSubmitted?: () => void;
  className?: string;
}

/**
 * THE BRIEF, and the step in front of the calendar.
 *
 * Every "book a call" control on the site opens this. It used to open Cal.com
 * directly, which worked and told us nothing: a slot appeared with a name, an
 * email, and no idea what the call was about, so the first ten minutes of
 * every booked call were spent finding out. Now the same click asks eight
 * questions, then hands off to the calendar with the answers attached and the
 * name and email already filled in. The visitor ends in the same place; we get
 * there having read the brief.
 *
 * The eight, in the order a person can answer them:
 *
 *   name · email · phone · the idea · where it has got to
 *   · budget · when · anything else
 *
 * Only five of those are required. Phone, budget, timeline and "anything else"
 * are the questions people abandon a form over, so they are asked plainly and
 * left optional, rather than being hidden behind a disclosure where nobody
 * answers them at all. Attachments stay behind their own control because a
 * file picker is a different kind of ask.
 *
 * If the calendar cannot open, because `calLink` is unset or the embed script
 * failed, the brief has still been sent and the success panel says so. The
 * hand-off is an upgrade on a complete interaction, never a dependency of one.
 *
 * One form instance is shared by the hero and the dialog, so there is a single
 * implementation of validation, a single success state and a single payload.
 * Two forms would drift, and the one that drifts is never the one you are
 * reading.
 */
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

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      // Persist on blur rather than on every keystroke: the draft only has to
      // survive closing the dialog, and writing to storage per character is a
      // lot of serialising for a value nobody reads until then.
      onBlur={() => setValues(form.getValues())}
      noValidate
      /*
        The inline card is PAPER, even on the ink hero, and that is a fix
        rather than a flourish. Radix portals a select popover to
        `document.body`, which is outside the `data-surface="slab"` subtree, so
        it always resolves the ROOT tokens and rendered as a large white sheet
        over a dark form. Chasing the portal is the wrong repair: the popover
        would still be one ground and the field that opened it another.

        Making the card itself paper settles it in one attribute. The inputs,
        the focus rings, the dropdown and the confidentiality note all land on
        the same ground, and a white card on graphite reads as deliberate,
        which the half-dark version never could.
      */
      data-surface={tone === "inline" ? "paper" : undefined}
      className={cn(
        "flex flex-col gap-4",
        tone === "inline" &&
          "border-hairline rounded-2xl border p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] sm:p-7",
        className,
      )}
    >
      {/* 1 and 2. Paired on a wide card, stacked on a phone. Both carry a
          hint, because these two are the ones a visitor hesitates over: they
          are being asked for a name and an address before they know what
          happens next, so each says what it is for. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          control={form.control}
          name="name"
          label={t("inquiry.fields.name.label")}
          description={t("inquiry.fields.name.hint")}
          autoComplete="name"
          disabled={mutation.isPending}
        />
        <TextField
          control={form.control}
          name="email"
          type="email"
          label={t("inquiry.fields.email.label")}
          description={t("inquiry.fields.email.hint")}
          autoComplete="email"
          inputMode="email"
          disabled={mutation.isPending}
        />
      </div>

      {/* 3. */}
      <TextField
        control={form.control}
        name="phone"
        type="tel"
        label={t("inquiry.fields.phone.label")}
        autoComplete="tel"
        inputMode="tel"
        disabled={mutation.isPending}
      />

      {/* 4. */}
      <TextareaField
        control={form.control}
        name="description"
        label={t("inquiry.fields.description.label")}
        description={t("inquiry.fields.description.hint")}
        placeholder={t("inquiry.fields.description.placeholder")}
        rows={3}
        disabled={mutation.isPending}
      />

      {/* 5. The qualifying question, and the only required select. */}
      <SelectField
        control={form.control}
        name="projectStage"
        label={t("inquiry.fields.stage.label")}
        placeholder={t("inquiry.fields.stage.placeholder")}
        options={PROJECT_STAGES.map((option) => ({
          value: option.id,
          label: t(option.labelKey satisfies MessageKey),
        }))}
        disabled={mutation.isPending}
      />

      {/* 6 and 7. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          control={form.control}
          name="budget"
          label={t("inquiry.fields.budget.label")}
          placeholder={t("inquiry.fields.budget.placeholder")}
          description={t("inquiry.fields.budget.hint")}
          options={BUDGETS.map((option) => ({
            value: option.id,
            label: t(option.labelKey satisfies MessageKey),
          }))}
          disabled={mutation.isPending}
        />
        <SelectField
          control={form.control}
          name="timeline"
          label={t("inquiry.fields.timeline.label")}
          placeholder={t("inquiry.fields.timeline.placeholder")}
          options={TIMELINES.map((option) => ({
            value: option.id,
            label: t(option.labelKey satisfies MessageKey),
          }))}
          disabled={mutation.isPending}
        />
      </div>

      {/* 8. */}
      <TextareaField
        control={form.control}
        name="anythingElse"
        label={t("inquiry.fields.anythingElse.label")}
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

      <div className="flex flex-col gap-3.5 pt-1">
        <Button
          type="submit"
          size="lg"
          disabled={mutation.isPending}
          data-origin={origin}
          className="press w-full gap-2 rounded-full"
        >
          <CalendarCheck aria-hidden="true" className="size-4" />
          {mutation.isPending
            ? t("inquiry.actions.submitting")
            : /*
                The label names the NEXT screen, not this one. "Send" would be
                a lie about where the button goes when a calendar is about to
                open, and a promise we cannot keep when it is not, so it tracks
                whether the embed is actually ready.
              */
              booking.isReady
              ? t("inquiry.actions.continueToBooking")
              : t("inquiry.actions.submit")}
        </Button>
        <ConfidentialityNote />
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
