"use client";

import { getCalApi } from "@calcom/embed-react";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { useEffect } from "react";
import {
  CtaButton,
  type CtaButtonProps,
} from "@/components/marketing/cta-button";
import { siteConfig } from "@/config/site";
import { useInquiryStore } from "@/features/inquiry/inquiry-store";
import { CAL_UI_CONFIG } from "@/features/booking/cal-theme";
import { useTranslations } from "@/i18n";
import { reportError } from "@/lib/reporting";
import { useOfferStore } from "@/features/booking/offer-store";

export interface BookCallButtonProps extends Omit<
  CtaButtonProps,
  "children" | "onClick"
> {
  /** Where this control lives, e.g. "hero". Carried into the booking payload. */
  origin: string;
  children?: React.ReactNode;
  /** Hide the calendar icon where the surrounding block already carries one. */
  withIcon?: boolean;
}

/**
 * BOOK A CALL, wherever it appears. The primary action of the entire site.
 *
 * It replaces "Send inquiry", and the difference is not wording. An inquiry
 * ends with the visitor waiting for someone else to act; a booked slot ends
 * with a meeting in both calendars. Everything else on the page is arranged to
 * get someone to this control.
 *
 * IT OPENS THE BRIEF, not the calendar, and that is the whole flow:
 *
 *     book a call → eight questions → Cal.com, prefilled → booked
 *
 * It used to bind Cal.com's overlay directly to this button, which worked and
 * told us nothing. A slot arrived with a name, an email and no idea what the
 * call was about, so the first ten minutes of every booked call went on
 * finding out. One screen in front of the calendar buys that back, and it is
 * the cheapest possible qualification: someone unwilling to answer eight
 * questions was not going to be a fit for the call either.
 *
 * `QuickBriefForm` owns the hand-off (see `useBookingHandoff`), so the
 * calendar opens from the same place whatever opened the brief: this button,
 * the hero, a choice card, or the header. When `calLink` is unset the brief is
 * simply the whole interaction and its success panel says we will reply. The
 * control is never dead and never points at a 404, which is still what makes
 * this safe to deploy independently of the Cal.com account.
 *
 * Mounting one of these also STARTS the offer window, because a button is the
 * first booking surface a visitor reaches. Starting it on page load instead
 * would time the wrong thing: the clock would run while they read the case
 * studies and be gone by the time they were ready.
 */
export function BookCallButton({
  origin,
  children,
  withIcon = true,
  variant = "primary",
  size = "lg",
  ...props
}: BookCallButtonProps) {
  const t = useTranslations();
  const { calLink } = siteConfig.booking;
  const openBrief = useInquiryStore((state) => state.open);
  const startOffer = useOfferStore((state) => state.start);

  useEffect(() => {
    startOffer();
  }, [startOffer]);

  /*
    PRELOAD ONLY. This button no longer opens the calendar, `QuickBriefForm`
    does, but the form is inside a dialog that Radix does not mount until it is
    opened. Warming the embed here, from a control that is already on the page,
    means the script is in memory by the time the brief is submitted, so the
    hand-off is instant rather than a network round trip at the exact moment a
    visitor is deciding whether this was worth it.
  */
  useEffect(() => {
    if (calLink === null) return;
    let isActive = true;
    getCalApi({ namespace: "book" })
      .then((cal) => {
        if (!isActive) return;
        // The SAME config the inline scheduler uses. A `ui` call reaches only
        // the namespace it names, so the overlay needs its own copy of it.
        cal("ui", { ...CAL_UI_CONFIG });
      })
      // Never swallowed: if the embed script fails to load, the click handler
      // below still opens the brief, but we want to know it happened.
      .catch((error: unknown) =>
        reportError(error, { scope: "cal-embed-init" }),
      );
    return () => {
      isActive = false;
    };
  }, [calLink]);

  return (
    <CtaButton
      variant={variant}
      size={size}
      /*
        No `data-cal-link` any more. Those attributes made Cal.com hijack the
        click before React saw it, which is exactly the behaviour being
        replaced: the brief has to come first, and the calendar opens from its
        success path with the answers in hand.
      */
      onClick={() => openBrief({ origin })}
      {...props}
    >
      {withIcon && (
        <CalendarCheck aria-hidden="true" className="size-[1.15em]" />
      )}
      {children ?? t("booking.trigger")}
      <ArrowRight
        aria-hidden="true"
        className="size-[1em] transition-transform duration-[var(--dur-base)] group-hover/cta:translate-x-0.5"
      />
    </CtaButton>
  );
}
