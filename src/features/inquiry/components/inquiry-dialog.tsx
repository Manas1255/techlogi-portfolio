"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "@/i18n";
import { useInquiryStore } from "@/features/inquiry/inquiry-store";
import { QuickBriefForm } from "./quick-brief-form";

/**
 * THE PROJECT BRIEF, as a dialog.
 *
 * Mounted once, opened from anywhere via the store, so the brief is reachable
 * from the header, the hero, every section CTA and the footer without any of
 * them owning the form.
 *
 * There is almost nothing here any more, and that is the point. This used to
 * be a 526-line three-step wizard: a progress bar, a step machine, per-step
 * validation slices, a back button, a "change your answer" affordance, and
 * separate copy for each screen. All of it worked. All of it was friction on
 * the one interaction the site exists to make easy, and none of it survived
 * the question "what does this ask that a person would not just type?".
 *
 * The form itself is `QuickBriefForm`, shared with the hero, so the inline
 * version and the dialog version cannot drift: one schema, one success state,
 * one payload.
 *
 * Closing keeps the draft. `inquiry-store` persists answers to sessionStorage,
 * so "close it, read a case study, come back" loses nothing, which is the
 * whole reason a visitor is willing to start typing before they have decided.
 */
export function InquiryDialog() {
  const t = useTranslations();
  const isOpen = useInquiryStore((state) => state.isOpen);
  const close = useInquiryStore((state) => state.close);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent
        showCloseButton
        className="grid max-h-[calc(100dvh-2rem)] w-full grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-xl"
      >
        <div className="border-hairline flex flex-col gap-1.5 border-b p-5 pr-14 sm:p-7 sm:pr-14">
          <DialogTitle className="text-display-3">
            {t("inquiry.title")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {t("inquiry.subtitle")}
          </DialogDescription>
        </div>

        <div className="min-h-0 overflow-y-auto p-5 sm:p-7">
          <QuickBriefForm origin="dialog" tone="dialog" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
