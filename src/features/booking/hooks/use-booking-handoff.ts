"use client";

import { getCalApi } from "@calcom/embed-react";
import { useCallback, useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { CAL_UI_CONFIG } from "@/features/booking/cal-theme";
import { reportError } from "@/lib/reporting";

/** What the brief already knows, handed to Cal.com so nothing is typed twice. */
export interface BookingPrefill {
  name: string;
  email: string;
  /** Goes into the booking's notes, so the call starts with the brief in it. */
  notes?: string;
}

/** The namespace the overlay binds to. A `ui` call reaches only its own. */
const NAMESPACE = "book";

/**
 * OPEN THE CALENDAR, once the brief has been answered.
 *
 * The site used to send a visitor straight to Cal.com from every "book a call"
 * control, which worked and told us nothing: a slot appeared in the calendar
 * with a name, an email and no idea what the call was about. The form is now
 * the step in front of it, so the same click ends in the same booked slot, and
 * the meeting starts with eight answers already read.
 *
 * `isReady` is what makes that safe to promise. The embed script is loaded on
 * mount rather than at the moment of the hand-off, because a visitor who has
 * just pressed submit will not wait for a network round trip to find out
 * whether a calendar is coming. When `calLink` is unset, or the script failed,
 * `open()` returns false and the caller keeps its own success state: the
 * booking step degrades to the brief we already have rather than to a dead end.
 */
export function useBookingHandoff(): {
  isReady: boolean;
  open: (prefill: BookingPrefill) => boolean;
} {
  const { calLink } = siteConfig.booking;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (calLink === null) return;
    let isActive = true;
    getCalApi({ namespace: NAMESPACE })
      .then((cal) => {
        if (!isActive) return;
        cal("ui", { ...CAL_UI_CONFIG });
        setIsReady(true);
      })
      /*
        Never swallowed. A failed embed script is invisible to the visitor,
        because `open()` returning false lands them on the brief's own success
        panel, which is a correct outcome. It is still the thing we would want
        to know had happened.
      */
      .catch((error: unknown) => {
        reportError(error, { scope: "booking-handoff-init" });
      });
    return () => {
      isActive = false;
    };
  }, [calLink]);

  const open = useCallback(
    (prefill: BookingPrefill): boolean => {
      if (calLink === null || !isReady) return false;
      getCalApi({ namespace: NAMESPACE })
        .then((cal) => {
          cal("modal", {
            calLink,
            config: {
              layout: "month_view",
              name: prefill.name,
              email: prefill.email,
              ...(prefill.notes ? { notes: prefill.notes } : {}),
            },
          });
        })
        .catch((error: unknown) => {
          reportError(error, { scope: "booking-handoff-open" });
        });
      return true;
    },
    [calLink, isReady],
  );

  return { isReady, open };
}
