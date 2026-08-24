"use client";

import { ChoiceCards } from "@/components/marketing";
import { buildTypes } from "@/content";
import { useTranslations } from "@/i18n";
import { useInquiryStore } from "@/features/inquiry/inquiry-store";
import type { BuildTypeId } from "@/content/schemas";

export interface InquiryLauncherProps {
  origin: string;
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * Step one, inline on the page.
 *
 * The closing section shouldn't be a link to a form, it should BE the form's
 * first question. Choosing here opens the dialog already on step two, so the
 * visitor never answers the same question twice.
 */
export function InquiryLauncher({
  origin,
  columns = 4,
  className,
}: InquiryLauncherProps) {
  const t = useTranslations();
  const open = useInquiryStore((state) => state.open);
  const buildType = useInquiryStore((state) => state.values.buildType);

  return (
    <ChoiceCards
      label={t("inquiry.step1.title")}
      columns={columns}
      className={className}
      options={buildTypes.map((type) => ({
        id: type.id,
        label: type.label,
        hint: type.hint,
      }))}
      value={buildType}
      onChange={(value) => open({ buildType: value as BuildTypeId, origin })}
    />
  );
}
