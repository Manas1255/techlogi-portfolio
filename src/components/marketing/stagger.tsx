"use client";

import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * STAGGERED ENTRANCES, for a set of siblings that should arrive in sequence.
 *
 * The site has two motion systems now, and the split is deliberate rather than
 * accidental. `Reveal` is CSS plus one shared IntersectionObserver: it costs a
 * ref, it works on server-rendered children, and it is right for the ~90% of
 * entrances that are "one block fades up". It stays.
 *
 * This is for the other case: a ROW of things that has to arrive as a row,
 * where each item's delay depends on its position among its siblings. Doing
 * that in CSS means threading an index into a custom property at every call
 * site, which is what `--chip-index` was, and it stops scaling the moment a
 * list is filtered or reordered. Here the parent owns the rhythm and children
 * know nothing, which is what a stagger actually is.
 *
 * Reduced motion is handled by returning `false` from `initial`, so the item
 * renders in its final state and no transition ever runs. Setting duration to
 * zero would still mount an animation; this mounts none.
 *
 * It reads the preference through THIS REPO's `useReducedMotion`, not Motion's
 * own. Motion's is `useState` plus an effect, so its first render reports
 * `null`, and `null` takes the not-reduced branch: every item mounts hidden,
 * and an item below the fold has nothing to trigger `whileInView`, so it stays
 * at opacity 0 until the visitor scrolls to it. For someone who asked for less
 * motion that is not a slower entrance, it is missing content. The repo's hook
 * is `useSyncExternalStore` over the media query, correct on the first client
 * render, which is what makes the branch below safe.
 *
 * That hook alone is still not enough, and this is the part that cost a sweep
 * failure to find. The page is SERVER RENDERED, and the server cannot know the
 * preference: `getServerSnapshot` has to assume motion is allowed, so Motion
 * writes `opacity: 0` into the HTML for everyone. A reduced-motion visitor
 * then hydrates with `initial={false}`, which correctly makes Motion animate
 * nothing, including that inline zero, which it therefore never clears. The
 * items below the fold stay invisible permanently.
 *
 * So the real guarantee lives in CSS, exactly where the rest of this site's
 * motion guarantees live. Every element here carries `data-stagger-item`, and
 * `globals.css` forces it back to full opacity under the media query. CSS with
 * `!important` outranks an inline style, it applies on the first paint with no
 * hydration involved, and it holds whether or not the JavaScript ever runs.
 * The hook stays because it also stops the animation being scheduled at all.
 *
 * `[data-reveal]` is handled by the same block. On this site, reduced motion
 * means nothing is ever hidden, in either system.
 *
 * `whileInView` with `once`, matching `Reveal`: an entrance that replays on
 * every scroll past is motion drawing attention to itself.
 */
const CONTAINER: Variants = {
  hidden: {},
  shown: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const ITEM: Variants = {
  hidden: { opacity: 0, y: 14 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * The element is chosen by an explicit switch rather than by assigning
 * `motion.ul` to a variable, for the same reason `Reveal` does it: a shared
 * `Comp` collapses the props to the INTERSECTION of every element's handler
 * types, and `ClipboardEventHandler<HTMLDivElement>` and
 * `ClipboardEventHandler<HTMLOListElement>` have no common inhabitant, so the
 * whole thing stops type-checking. Writing each branch out keeps every one
 * honestly typed against its own tag.
 */
export interface StaggerProps {
  /** Rendered element. A stagger wrapper must not break the structure it sits in. */
  as?: "div" | "ul" | "ol";
  /** Seconds between siblings. Past ~0.1 a long row reads as lag, not rhythm. */
  step?: number;
  className?: string;
  children?: React.ReactNode;
}

export function Stagger({
  as = "div",
  step = 0.07,
  className,
  children,
}: StaggerProps) {
  const prefersReducedMotion = useReducedMotion();
  const shared = {
    initial: prefersReducedMotion ? false : ("hidden" as const),
    whileInView: "shown",
    viewport: { once: true, margin: "0px 0px -12% 0px" },
    variants: {
      ...CONTAINER,
      shown: { transition: { staggerChildren: step, delayChildren: 0.04 } },
    },
    className: cn(className),
    children,
    "data-stagger": "",
  };

  switch (as) {
    case "ul":
      return <motion.ul {...shared} />;
    case "ol":
      return <motion.ol {...shared} />;
    default:
      return <motion.div {...shared} />;
  }
}

export interface StaggerItemProps {
  as?: "div" | "li" | "article" | "figure";
  className?: string;
  children?: React.ReactNode;
}

export function StaggerItem({
  as = "div",
  className,
  children,
}: StaggerItemProps) {
  const shared = {
    variants: ITEM,
    className: cn(className),
    children,
    "data-stagger-item": "",
  };

  switch (as) {
    case "li":
      return <motion.li {...shared} />;
    case "article":
      return <motion.article {...shared} />;
    case "figure":
      return <motion.figure {...shared} />;
    default:
      return <motion.div {...shared} />;
  }
}
