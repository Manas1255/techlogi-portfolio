"use client";

import { Timer } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { siteConfig } from "@/config/site";
import { useTranslations } from "@/i18n";
import { cn } from "@/lib/utils";
import { useOfferCountdown } from "@/features/booking/hooks/use-offer-countdown";

export interface OfferCountdownProps {
  /**
   * Start the window here. True on the surfaces a visitor actually arrives at
   * ready to book; false everywhere the badge is only reporting a window that
   * something else began.
   */
  autoStart?: boolean;
  /** `inline` sits in a row of metadata; `panel` is the standalone block. */
  tone?: "inline" | "panel";
  className?: string;
}

/**
 * THE OPENING-WINDOW OFFER.
 *
 * 25% off if you book inside the window, and it is real: anyone who books in
 * the window gets it, quoting the code shown.
 *
 * This pattern is nearly always a lie, so the design is mostly a list of
 * things it refuses to do. It does not flash. It is not red. It does not say
 * HURRY or ONLY 3 SPOTS LEFT. It is set in the same brass and the same mono as
 * the section indices and the project metadata, because the moment it looks
 * like an ad it reads as one, and a visitor who distrusts this badge has no
 * reason to trust the case studies above it.
 *
 * The refusal that matters most is in `offer-store.ts`: the clock starts once
 * per visitor and is never restarted. When it runs out this says so and offers
 * nothing in its place. An expired offer that quietly resets to 05:00 is the
 * tell, and the visitor who spots it is gone.
 *
 * The seconds are `tabular-nums` and the box has a fixed minimum width, so
 * ticking from 1:00 to 0:59 does not reflow the row it sits in.
 *
 * `panel` is a slim pill rather than a bordered block, and the EXPIRED state
 * carries no chrome at all. A rectangle drawn around one line of grey text
 * reads as an empty container that failed to load, which is a poor last
 * impression to leave at the bottom of the page.
 */
export function OfferCountdown({
  autoStart = false,
  tone = "inline",
  className,
}: OfferCountdownProps) {
  const t = useTranslations();
  const offer = useOfferCountdown({ autoStart });
  const prefersReducedMotion = useReducedMotion();
  const { discountPercent, code } = siteConfig.offer;

  // `idle` covers both "offer switched off" and "we do not yet know", and both
  // render nothing. A countdown that appears mid-scroll is worse than one that
  // was there all along.
  if (offer.status === "disabled" || offer.status === "idle") return null;

  const isPanel = tone === "panel";

  if (offer.status === "expired") {
    return (
      <p
        className={cn(
          "text-mono-label text-muted-foreground flex items-center gap-2",
          className,
        )}
      >
        <Timer aria-hidden="true" className="size-3.5 opacity-60" />
        {t("offer.expired", { percent: discountPercent })}
      </p>
    );
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1.5",
        isPanel &&
          "border-primary/25 bg-primary/[0.07] w-fit rounded-2xl border px-4 py-3",
        className,
      )}
    >
      <span className="text-primary flex items-center gap-2 text-sm font-medium">
        <Timer aria-hidden="true" className="size-4" />
        {t("offer.percentOff", { percent: discountPercent })}
      </span>

      <span className="text-mono-label text-muted-foreground">
        {t("offer.ifYouBookWithin")}{" "}
        <span
          // Announced as one unit when it changes, rather than one digit at a
          // time. `polite`, never `assertive`: this must not interrupt anyone.
          role="timer"
          aria-live="polite"
          aria-label={t("offer.secondsLeft", {
            seconds: offer.secondsLeft,
            percent: discountPercent,
          })}
          className="text-foreground inline-block min-w-[3.25rem] text-center font-medium tabular-nums"
        >
          {offer.label}
        </span>
      </span>

      {isPanel && (
        <span className="text-mono-label text-muted-foreground/85 basis-full pt-0.5">
          {t("offer.quote")}{" "}
          <span className="text-foreground font-medium tracking-wide">
            {code}
          </span>{" "}
          {t("offer.onTheCall", { appliesTo: t("offer.appliesTo") })}
        </span>
      )}
    </motion.div>
  );
}
