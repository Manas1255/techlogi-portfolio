"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "@/i18n";
import { useInquiryStore } from "@/features/inquiry/inquiry-store";

export interface InquiryTriggerProps extends Omit<
  React.ComponentProps<typeof Button>,
  "onClick"
> {
  /** Where this trigger lives, e.g. "header" — recorded with the inquiry. */
  origin: string;
  children?: React.ReactNode;
}

/**
 * "Start a Project", wherever it appears.
 *
 * Every instance opens the same drawer with the same preserved draft, so the
 * control is always available and never duplicates state. `origin` is carried
 * through to the payload, which is how you find out which placement actually
 * converts.
 */
export function InquiryTrigger({
  origin,
  children,
  ...props
}: InquiryTriggerProps) {
  const t = useTranslations();
  const open = useInquiryStore((state) => state.open);
  return (
    <Button onClick={() => open({ origin })} className="press" {...props}>
      {children ?? t("inquiry.trigger")}
    </Button>
  );
}
