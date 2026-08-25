"use client";

import { useEffect, useSyncExternalStore } from "react";
import { siteConfig } from "@/config/site";
import { useOfferStore } from "@/features/booking/offer-store";

/**
 * The offer window, as a state machine rather than a pair of booleans.
 *
 * `{ status: "idle" } | { status: "running"; … } | { status: "expired" }` and
 * not `{ isRunning, isExpired, secondsLeft }`: the boolean version makes
 * "expired and running" and "neither" representable, and both of those ship a
 * countdown reading -00:12.
 *
 * `idle` is the state that matters and the one a naive version skips. The
 * window's start time lives in localStorage, which the server cannot read and
 * the first client render has not rehydrated yet. Anything that renders a
 * number in that gap either prints 05:00 to a visitor whose window closed
 * yesterday, or shifts the layout the moment Zustand rehydrates. So the hook
 * reports `idle` until it genuinely knows, and callers render nothing.
 *
 * BOTH of the moving parts are read with `useSyncExternalStore`, because both
 * genuinely are external stores and neither belongs in an effect:
 *
 *   · the clock. A wall clock is the textbook external source: it changes
 *     without React, it has to be subscribed to, and it needs a distinct
 *     server snapshot. Holding it in state and assigning `Date.now()` inside
 *     an effect is the cascading-render pattern the lint rule exists to catch,
 *     and it also tears on hydration.
 *   · the persist rehydration flag, which Zustand exposes as exactly the
 *     subscribe/getSnapshot pair this API wants.
 *
 * The clock ticks only while something is subscribed, and React unsubscribes
 * as soon as the last consumer unmounts, so an expired offer costs nothing.
 */
export type OfferStatus =
  | { status: "disabled" }
  | { status: "idle" }
  | { status: "running"; secondsLeft: number; label: string }
  | { status: "expired" };

/** Whole seconds since the epoch. Coarse on purpose: a finer snapshot would
 *  re-render every consumer on every tick for a digit that cannot change. */
function subscribeToClock(onChange: () => void): () => void {
  const timer = window.setInterval(onChange, 500);
  return () => window.clearInterval(timer);
}
const clockSnapshot = () => Math.floor(Date.now() / 1000);
/** A stable server snapshot: the countdown never renders on the server. */
const clockServerSnapshot = () => 0;

const persistApi = useOfferStore.persist;
const subscribeToHydration = (onChange: () => void) =>
  persistApi.onFinishHydration(onChange);
const hydrationSnapshot = () => persistApi.hasHydrated();
const hydrationServerSnapshot = () => false;

function format(secondsLeft: number): string {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export interface UseOfferCountdownOptions {
  /**
   * Start the window on mount. TRUE only where the visitor has actually
   * reached a booking surface: a countdown that begins on page load is timing
   * the wrong thing and will have expired before it is ever seen.
   */
  autoStart?: boolean;
}

export function useOfferCountdown({
  autoStart = false,
}: UseOfferCountdownOptions = {}): OfferStatus {
  const { enabled, windowSeconds } = siteConfig.offer;
  const startedAt = useOfferStore((state) => state.startedAt);
  const start = useOfferStore((state) => state.start);

  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    hydrationSnapshot,
    hydrationServerSnapshot,
  );
  const nowSeconds = useSyncExternalStore(
    subscribeToClock,
    clockSnapshot,
    clockServerSnapshot,
  );

  // Updating an external store from an effect is what effects are for; the
  // store is the system being synchronised, not a copy of React state.
  useEffect(() => {
    if (!enabled || !autoStart || !isHydrated) return;
    start();
  }, [autoStart, enabled, isHydrated, start]);

  if (!enabled) return { status: "disabled" };
  if (!isHydrated || startedAt === null || nowSeconds === 0) {
    return { status: "idle" };
  }

  const elapsed = nowSeconds - Math.floor(startedAt / 1000);
  const secondsLeft = windowSeconds - elapsed;
  if (secondsLeft <= 0) return { status: "expired" };

  return { status: "running", secondsLeft, label: format(secondsLeft) };
}
