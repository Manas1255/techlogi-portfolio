"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Toggles `data-onstage` on an element while it is anywhere near the viewport.
 *
 * This is the twin of `useRevealOnScroll`, and deliberately NOT the same thing.
 * A reveal fires once and stays fired, which is right for an entrance. A
 * looping animation needs the opposite: something that turns back OFF, so six
 * capability diagrams are not compositing forever while the reader is three
 * screens away. CSS pauses on the attribute rather than JS stopping anything,
 * so the cost of being offstage is zero.
 *
 * One shared observer for the whole document, created lazily, with a generous
 * margin so nothing is caught mid-start as it scrolls in.
 */

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.toggleAttribute("data-onstage", entry.isIntersecting);
      }
    },
    { rootMargin: "20% 0px 20% 0px", threshold: 0 },
  );
  return observer;
}

export function useOnstage<T extends HTMLElement>(): (node: T | null) => void {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(
    () => () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    },
    [],
  );

  return useCallback((node: T | null) => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (node === null) return;

    const active = getObserver();
    if (active === null) {
      // No observer available: leave the animation running rather than
      // shipping a diagram frozen mid-entrance.
      node.toggleAttribute("data-onstage", true);
      return;
    }
    active.observe(node);
    cleanupRef.current = () => active.unobserve(node);
  }, []);
}
