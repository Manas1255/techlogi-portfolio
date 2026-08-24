"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CircleAlert, CircleCheck } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { SelectField, TextField, TextareaField } from "@/components/form";
import { Button } from "@/components/ui/button";
import { buildTypes } from "@/content";
import { siteConfig } from "@/config/site";
import { useTranslations } from "@/i18n";
import { errorMessage } from "@/lib/mutations";
import { useSubmitQuickInquiry } from "@/features/inquiry/services/use-submit-inquiry";
import {
  quickInquirySchema,
  type QuickInquiryFormValues,
  type QuickInquiryValues,
} from "@/features/inquiry/validations/inquiry.schema";

/**
 * THE HERO FORM.
 *
 * A landing visitor is at their most willing in the first few seconds and
 * least willing to be routed somewhere else, so the primary conversion path is
 * ON the hero rather than behind a button. Four fields, one optional, enough
 * to reply properly, short enough to finish.
 *
 * It is not a second implementation of the inquiry: it validates with the same
 * field primitives, submits through the same repository, and lands in the same
 * place. The four-step dialog still exists for a visitor who wants to brief
 * properly, and "Start a Project" in the header still opens it.
 *
 * Everything a correct form needs comes from the shared field components:
 * real labels, errors tied to inputs with `aria-describedby`, and a disabled
 * submit while pending. The success state replaces the form in place rather
 * than toasting, because the confirmation belongs where the attention is.
 */
export function HeroInquiryForm() {
  const t = useTranslations();
  const mutation = useSubmitQuickInquiry();

  const form = useForm<QuickInquiryFormValues, unknown, QuickInquiryValues>({
    resolver: zodResolver(quickInquirySchema),
    mode: "onTouched",
    defaultValues: {
      buildType: undefined,
      name: "",
      email: "",
      description: "",
    },
  });

  const onSubmit: SubmitHandler<QuickInquiryValues> = (values) => {
    mutation.mutate(values, { onSuccess: () => form.reset() });
  };

  if (mutation.isSuccess) {
    return (
      <div className="border-hairline bg-card rounded-2xl border p-6 shadow-[0_2px_4px_-2px_color-mix(in_oklab,var(--brand-950)_10%,transparent),0_28px_64px_-28px_color-mix(in_oklab,var(--brand-950)_22%,transparent)] sm:p-8">
        <div className="flex flex-col gap-5">
          <span className="border-success-border bg-success-subtle text-success-subtle-foreground flex size-11 items-center justify-center rounded-full border">
            <CircleCheck aria-hidden="true" className="size-5" />
          </span>
          <div className="flex flex-col gap-2">
            <p className="text-display-3">{t("inquiry.quick.successTitle")}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("inquiry.quick.successBody", {
                email: siteConfig.contact.email,
              })}
            </p>
          </div>
          <Button
            variant="outline"
            className="self-start rounded-full"
            onClick={() => mutation.reset()}
          >
            {t("inquiry.success.another")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      aria-label={t("inquiry.quick.title")}
      className="border-hairline bg-card rounded-2xl border p-6 shadow-[0_2px_4px_-2px_color-mix(in_oklab,var(--brand-950)_10%,transparent),0_28px_64px_-28px_color-mix(in_oklab,var(--brand-950)_22%,transparent)] sm:p-8"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <p className="text-display-3">{t("inquiry.quick.title")}</p>
          <p className="text-muted-foreground text-sm">
            {t("inquiry.quick.lead")}
          </p>
        </div>

        <SelectField
          control={form.control}
          name="buildType"
          label={t("inquiry.quick.buildTypeLabel")}
          placeholder={t("inquiry.quick.buildTypePlaceholder")}
          options={buildTypes.map((type) => ({
            value: type.id,
            label: type.label,
          }))}
        />

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

        <TextareaField
          control={form.control}
          name="description"
          label={t("inquiry.quick.messageLabel")}
          placeholder={t("inquiry.quick.messagePlaceholder")}
          rows={3}
        />

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

        <Button
          type="submit"
          size="lg"
          disabled={mutation.isPending}
          className="press w-full gap-2 rounded-full"
        >
          {mutation.isPending
            ? t("inquiry.quick.submitting")
            : t("inquiry.quick.submit")}
          {!mutation.isPending && (
            <ArrowRight aria-hidden="true" className="size-4" />
          )}
        </Button>

        <p className="text-caption text-muted-foreground">
          {t("inquiry.quick.privacy")}
        </p>
      </div>
    </form>
  );
}
