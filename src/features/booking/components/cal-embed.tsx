"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { CalendarClock, Mail } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { CAL_UI_CONFIG } from "@/features/booking/cal-theme";
import { InquiryTrigger } from "@/features/inquiry";
import { useTranslations } from "@/i18n";
import { reportError } from "@/lib/reporting";
import { cn } from "@/lib/utils";

/** Shared by the element and the `ui` call, which must address the same embed. */
const CAL_NAMESPACE = "closing";

/*
  THE HEIGHT THE EMBED WILL TURN OUT TO BE, reserved before it loads.

  Cal resizes its own iframe to fit its content, so this is not a constraint on
  the embed: it is a guess at the outcome, and a wrong guess drags the footer
  out from under whoever is reading it. The previous 26/30rem was off by up to
  46rem.

  Measured against the live booker, iframe width against rendered height:

      390px ->  57rem      900px -> 34rem
      640px ->  69rem     1024px -> 35rem
      768px ->  76rem     1280px -> 36rem

  The cliff is Cal's own: at roughly 768px of IFRAME width it opens from the
  mobile stack into the three-pane view, which is a third of the height. That
  lands at ~840px of viewport once the container's gutters are taken off, and
  no Tailwind breakpoint sits there, hence the arbitrary one. `md` (768) is on
  the wrong side of it and would reserve 36rem for a 76rem stack.

  The stacked heights can only ever be close: below the cliff the height is
  driven by the number of slots that day, which is availability, not layout.
*/
const CAL_RESERVED_HEIGHT =
  "h-[58rem] sm:h-[70rem] md:h-[76rem] min-[840px]:h-[36rem]";

/**
 * THE SCHEDULER, embedded in the closing section.
 *
 * Embedding is the right call HERE and nowhere else on the site. Everywhere
 * above, booking is a control that opens Cal.com's overlay; at the end of the
 * page the visitor has finished reading and has nothing left to do, and making
 * them click once more to see a calendar is a step that only loses people.
 *
 * Two things stop the embed from being the mistake it usually is:
 *
 *   1. It MOUNTS LAZILY. The Cal.com bundle is a third-party iframe with its
 *      own scripts, and loading it on every page view to serve the fraction of
 *      visitors who scroll this far is a real cost paid by everyone. It
 *      mounts once, when it is nearly in view, and stays mounted.
 *   2. It reserves its own height at both breakpoints. An iframe that resizes
 *      itself after load, at the very bottom of a long page, drags the footer
 *      out from under whoever is reading it.
 *
 * With no `calLink` configured this renders a designed panel with the two
 * paths that DO work: the written brief and the inbox. That is the shipped
 * default, so the section is complete and honest before the Cal.com account
 * exists, and turning it on is one line in `siteConfig`.
 */
export interface CalEmbedProps {
  className?: string;
  /**
   * Drop the card's own border and radius, for nesting inside one.
   * The closing section stacks the scheduler, the three expectations and the
   * trust note into a SINGLE card divided by hairlines; four separate bordered
   * boxes floating on the ink read as a dashboard rather than as a close.
   */
  bare?: boolean;
}

export function CalEmbed({ className, bare = false }: CalEmbedProps) {
  const t = useTranslations();
  const { calLink } = siteConfig.booking;
  const [isNear, setIsNear] = useState(false);

  /*
    A ref callback rather than an effect, matching `useOnstage`. The observer
    is attached during commit, when the node genuinely exists, so there is no
    render pass spent with a ref that is still null, and the no-observer
    fallback can flip the state directly without being a setState cascading out
    of an effect body. React 19 runs the returned function as the ref cleanup.
  */
  const attach = useCallback(
    (node: HTMLDivElement | null) => {
      if (node === null || calLink === null) return;
      if (typeof IntersectionObserver === "undefined") {
        // No observer: mount it rather than leaving a permanent empty box.
        setIsNear(true);
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          setIsNear(true);
          observer.disconnect();
        },
        { rootMargin: "400px 0px" },
      );
      observer.observe(node);
      return () => observer.disconnect();
    },
    [calLink],
  );

  /*
    Cal's own UI config, applied once the embed is actually mounting. It is
    deliberately NOT applied earlier: `getCalApi` injects Cal's script, so
    calling it on render would load the third party for every visitor and undo
    the lazy mount above.
  */
  useEffect(() => {
    if (!isNear || calLink === null) return;
    let isStale = false;
    getCalApi({ namespace: CAL_NAMESPACE })
      .then((cal) => {
        if (isStale) return;
        cal("ui", { ...CAL_UI_CONFIG });
      })
      .catch((error: unknown) => {
        // The embed still renders, in Cal's default skin. Worth knowing about.
        reportError(error, { scope: "cal-embed-ui" });
      });
    return () => {
      isStale = true;
    };
  }, [isNear, calLink]);

  if (calLink === null) {
    return (
      <div
        className={cn(
          "flex flex-col items-start gap-5 p-7 sm:p-8",
          !bare && "border-hairline bg-raised rounded-3xl border",
          className,
        )}
      >
        <span className="border-hairline text-primary flex size-11 items-center justify-center rounded-2xl border">
          <CalendarClock aria-hidden="true" className="size-5" />
        </span>
        <div className="flex flex-col gap-2.5">
          <h3 className="text-display-3">{t("bookACall.scheduler.title")}</h3>
          <p className="text-muted-foreground max-w-md text-[0.9375rem] leading-relaxed">
            {t("bookACall.scheduler.body")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
          <InquiryTrigger
            origin="cal-fallback"
            size="lg"
            className="rounded-full"
          />
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="tap-target text-muted-foreground hover:text-foreground focus-visible:outline-ring inline-flex items-center gap-2 rounded-sm text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <Mail aria-hidden="true" className="size-4" />
            {siteConfig.contact.email}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={attach}
      className={cn(
        "overflow-hidden",
        !bare && "border-hairline bg-raised rounded-3xl border",
        className,
      )}
    >
      {isNear ? (
        <Cal
          namespace={CAL_NAMESPACE}
          calLink={calLink}
          config={{ layout: "month_view", theme: "dark" }}
          // Cal's own element needs a definite height; a percentage here
          // collapses because the parent is content-sized.
          style={{ width: "100%", height: "100%", overflow: "scroll" }}
          className={cn(CAL_RESERVED_HEIGHT, "w-full")}
        />
      ) : (
        <div
          aria-hidden="true"
          className={cn(
            CAL_RESERVED_HEIGHT,
            "text-muted-foreground flex w-full items-center justify-center gap-2.5 text-sm",
          )}
        >
          <CalendarClock className="size-4" />
          {t("bookACall.scheduler.loading", {
            duration: t("booking.duration"),
          })}
        </div>
      )}
    </div>
  );
}
