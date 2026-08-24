"use client";

import { useEffect, useState } from "react";

export interface ScrollState {
  /** Past the threshold, the header condenses on this. */
  isScrolled: boolean;
  /** Scrolling up reveals the header again after it has hidden. */
  isScrollingUp: boolean;
}

/**
 * Scroll state for the header, read through `requestAnimationFrame` so a fast
 * scroll can't queue a re-render per event.
 *
 * A passive listener, one rAF in flight at a time, and state that only changes
 * on a threshold crossing, so this re-renders a handful of times per page,
 * not once per pixel.
 */
export function useScrollPosition(threshold = 24): ScrollState {
  const [state, setState] = useState<ScrollState>({
    isScrolled: false,
    isScrollingUp: false,
  });

  useEffect(() => {
    let previous = window.scrollY;
    let frame = 0;

    const read = () => {
      frame = 0;
      const current = window.scrollY;
      const isScrolled = current > threshold;
      // Ignore sub-pixel jitter and rubber-banding at the top.
      const delta = current - previous;
      const isScrollingUp = delta < -4 || current <= threshold;
      previous = current;
      setState((existing) =>
        existing.isScrolled === isScrolled &&
        existing.isScrollingUp === isScrollingUp
          ? existing
          : { isScrolled, isScrollingUp },
      );
    };

    const onScroll = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return state;
}
