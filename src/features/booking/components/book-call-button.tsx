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
 * Two behaviours, one component:
 *
 *   · `calLink` set → Cal.com's overlay opens in place. Not a new tab: sending
 *     someone to another origin at the exact moment they decided to act is how
 *     you lose the half who then get distracted by their inbox.
 *   · `calLink` unset → the project brief opens instead. This is the shipped
 *     default, and it is why the redesign is safe to deploy before the Cal.com
 *     account exists. The control is never dead and never points at a 404.
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

  useEffect(() => {
    if (calLink === null) return;
    let isActive = true;
    getCalApi({ namespace: "book" })
      .then((cal) => {
        if (!isActive) return;
        cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
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

  const isLive = calLink !== null;

  return (
    <CtaButton
      variant={variant}
      size={size}
      // Cal.com binds its overlay to these attributes once `getCalApi` has run.
      data-cal-namespace={isLive ? "book" : undefined}
      data-cal-link={isLive ? calLink : undefined}
      data-cal-config={
        isLive ? JSON.stringify({ layout: "month_view" }) : undefined
      }
      onClick={isLive ? undefined : () => openBrief({ origin })}
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
