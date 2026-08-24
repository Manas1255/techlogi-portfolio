"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * The scroll-reveal system: ONE shared IntersectionObserver for the whole
 * document, not one per element.
 *
 * An element registers a ref, gets `data-reveal` (which the CSS in
 * `globals.css` uses to hide it), and gets `data-revealed` the first time it
 * intersects — then it is unobserved. Reveals happen once; re-animating on the
 * way back up is the kind of motion that draws attention to itself.
 *
 * The observer is created lazily on first use and lives for the session, which
 * is cheaper than the alternative and matches how the page is composed.
 */

type RevealVariant = "up" | "lift" | "fade";

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-revealed", "");
        observer?.unobserve(entry.target);
      }
    },
    {
      // Start the reveal slightly before the element reaches the fold, so it
      // finishes as it arrives rather than beginning there.
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.01,
    },
  );
  return observer;
}

/**
 * Returns a ref callback. Attach it to the element that should reveal.
 *
 * `delay` staggers siblings — keep it under ~60ms per step, past which a
 * stagger stops reading as rhythm and starts reading as lag.
 */
export function useRevealOnScroll<T extends HTMLElement>(
  variant: RevealVariant = "up",
  delay = 0,
): (node: T | null) => void {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  return useCallback(
    (node: T | null) => {
      cleanupRef.current?.();
      cleanupRef.current = null;
      if (node === null) return;

      node.setAttribute("data-reveal", variant === "up" ? "" : variant);
      if (delay > 0) node.style.setProperty("--reveal-delay", `${delay}ms`);

      const activeObserver = getObserver();
      if (activeObserver === null) {
        // No IntersectionObserver (very old browser, or a test environment):
        // show the content rather than leaving it hidden forever.
        node.setAttribute("data-revealed", "");
        return;
      }

      activeObserver.observe(node);
      cleanupRef.current = () => activeObserver.unobserve(node);
    },
    [variant, delay],
  );
}
