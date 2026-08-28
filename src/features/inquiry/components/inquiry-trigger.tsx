"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "@/i18n";
import { useInquiryStore } from "@/features/inquiry/inquiry-store";

export interface InquiryTriggerProps extends Omit<
  React.ComponentProps<typeof Button>,
  "onClick"
> {
  /** Where this trigger lives, e.g. "header", recorded with the inquiry. */
  origin: string;
  children?: React.ReactNode;
}

/**
 * "Start a Project", wherever it appears.
 *
 * Every instance opens the same dialog with the same preserved draft, so the
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
    <Button
      onClick={() => open({ origin })}
      /*
        `tap-target` because this is usually rendered as a link-style button in
        a run of prose, where it measured 20px tall on a phone. The utility
        expands the HIT AREA with a transparent pseudo-element on a coarse
        pointer only, so nothing moves in the layout and a mouse never gets an
        invisible band swallowing clicks around it.
      */
      className="press tap-target"
      {...props}
    >
      {children ?? t("inquiry.trigger")}
    </Button>
  );
}
