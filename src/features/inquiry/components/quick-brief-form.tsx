"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, CircleAlert, CircleCheck, Send } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { SelectField, TextField, TextareaField } from "@/components/form";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useContent } from "@/content/use-content";
import type { BuildTypeId } from "@/content/schemas";
import { ConfidentialityNote } from "@/features/booking";
import { useTranslations } from "@/i18n";
import { errorMessage } from "@/lib/mutations";
import { useInquiryStore } from "@/features/inquiry/inquiry-store";
import { useSubmitInquiry } from "@/features/inquiry/services/use-submit-inquiry";
import {
  BUDGETS,
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
 * THE PROJECT BRIEF, on one screen.
 *
 * This replaces a three-step wizard, and the wizard was the problem. It asked
 * eight questions across three screens with a progress bar on top, which is a
 * good design for an application form and the wrong one for a first contact:
 * every screen is another place to stop, and a visitor who has decided to get
 * in touch is not looking for a process, they are looking for a send button.
 *
 * Four fields, all visible at once, and nothing else is required:
 *
 *   what you're building · a couple of sentences · your name · your email
 *
 * Budget, timeline and files are behind one optional disclosure. They are the
 * questions people abandon a form over, and they are genuinely useful, so they
 * are offered rather than demanded: someone who wants to be thorough opens it,
 * and everyone else never sees it. `<details>` rather than a hand-rolled
 * toggle, so it keeps keyboard operation, the correct announcement and
 * find-in-page on the collapsed content for free.
 *
 * The whole thing is one form instance shared by the hero and the dialog, so
 * there is a single implementation of validation, a single success state and a
 * single payload. Two forms would drift, and the one that drifts is never the
 * one you are reading.
 */
export function QuickBriefForm({
  origin,
  tone = "inline",
  onSubmitted,
  className,
}: QuickBriefFormProps) {
  const t = useTranslations();
  const { buildTypes } = useContent();
  const values = useInquiryStore((state) => state.values);
  const setValues = useInquiryStore((state) => state.setValues);
  const clearDraft = useInquiryStore((state) => state.clearDraft);

  // A File cannot be serialized, so attachments stay in component state rather
  // than the persisted draft. Losing them silently on rehydrate would be worse
  // than not persisting them.
  const [attachments, setAttachments] = useState<File[]>([]);
  const mutation = useSubmitInquiry();

  const form = useForm<InquiryFormValues, unknown, InquiryValues>({
    resolver: zodResolver(inquirySchema),
    mode: "onBlur",
    defaultValues: {
      buildType: values.buildType ?? undefined,
      description: values.description ?? "",
      services: [],
      timeline: values.timeline,
      budget: values.budget,
      name: values.name ?? "",
      company: "",
      email: values.email ?? "",
      phone: "",
    },
  });

  const onSubmit: SubmitHandler<InquiryValues> = (submitted) => {
    mutation.mutate(
      { ...submitted, attachments },
      {
        onSuccess: () => {
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
            {t("inquiry.success.body", { email: siteConfig.contact.email })}
          </p>
        </div>
        <Button
          onClick={() => mutation.reset()}
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
      <SelectField
        control={form.control}
        name="buildType"
        label={t("inquiry.fields.buildType.label")}
        placeholder={t("inquiry.fields.buildType.placeholder")}
        /*
          Labels only. Every option carrying its hint made eight entries into
          sixteen lines of prose, and a menu you have to READ is slower than
          one you scan. The hints still exist and still earn their place in the
          launcher on `/contact`, where the choices are cards with room for
          them; here the labels were rewritten to stand on their own, which is
          what "A website" and "A web platform" were for.
        */
        options={buildTypes.map((type) => ({
          value: type.id satisfies BuildTypeId,
          label: type.label,
        }))}
        disabled={mutation.isPending}
      />

      <TextareaField
        control={form.control}
        name="description"
        label={t("inquiry.fields.description.label")}
        placeholder={t("inquiry.fields.description.placeholder")}
        rows={3}
        disabled={mutation.isPending}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          control={form.control}
          name="name"
          label={t("inquiry.fields.name.label")}
          autoComplete="name"
          disabled={mutation.isPending}
        />
        <TextField
          control={form.control}
          name="email"
          type="email"
          label={t("inquiry.fields.email.label")}
          autoComplete="email"
          inputMode="email"
          disabled={mutation.isPending}
        />
      </div>

      <details className="group/more border-hairline rounded-xl border">
        <summary className="focus-visible:outline-ring text-muted-foreground hover:text-foreground flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[0.8125rem] transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 [&::-webkit-details-marker]:hidden">
          {t("inquiry.more")}
          <ChevronDown
            aria-hidden="true"
            className="size-4 shrink-0 transition-transform duration-[var(--dur-base)] group-open/more:rotate-180"
          />
        </summary>
        <div className="border-hairline flex flex-col gap-4 border-t p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              control={form.control}
              name="timeline"
              label={t("inquiry.fields.timeline.label")}
              placeholder={t("inquiry.fields.timeline.placeholder")}
              options={TIMELINES.map((option) => ({
                value: option.id,
                label: option.label,
              }))}
              disabled={mutation.isPending}
            />
            <SelectField
              control={form.control}
              name="budget"
              label={t("inquiry.fields.budget.label")}
              placeholder={t("inquiry.fields.budget.placeholder")}
              options={BUDGETS.map((option) => ({
                value: option.id,
                label: option.label,
              }))}
              disabled={mutation.isPending}
            />
          </div>
          <AttachmentField
            files={attachments}
            onChange={setAttachments}
            disabled={mutation.isPending}
          />
        </div>
      </details>

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
          <Send aria-hidden="true" className="size-4" />
          {mutation.isPending
            ? t("inquiry.actions.submitting")
            : t("inquiry.actions.submit")}
        </Button>
        <ConfidentialityNote />
      </div>
    </form>
  );
}
