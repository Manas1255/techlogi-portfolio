"use client";

import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import { cn } from "@/lib/utils";

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  /** `up` 12px, `lift` 28px for larger blocks, `fade` for media. */
  variant?: "up" | "lift" | "fade";
  /** Stagger, in ms. Keep it under ~60ms a step or it reads as lag. */
  delay?: number;
  /**
   * The rendered element. A reveal wrapper must never break the structure it
   * sits in, a `<div>` inside an `<ol>` is invalid, and screen readers stop
   * announcing the list.
   */
  as?: "div" | "li" | "article" | "section" | "figure" | "span";
}

/**
 * The scroll entrance, as a component.
 *
 * It is a client component, but its `children` are not: passing server-rendered
 * children through a client wrapper keeps them server components. Wrapping a
 * whole section in one of these costs nothing on the client beyond a ref.
 *
 * The element is chosen by an explicit switch rather than a polymorphic
 * `ElementType`. That keeps the props honestly typed as `HTMLAttributes`,
 * which every one of these tags accepts, instead of collapsing to the
 * intersection of five element interfaces, which is uninhabited.
 */
export function Reveal({
  variant = "up",
  delay = 0,
  as = "div",
  className,
  ...props
}: RevealProps) {
  const ref = useRevealOnScroll<HTMLElement>(variant, delay);
  const shared = { ref, className: cn(className), ...props };

  switch (as) {
    case "li":
      return <li {...shared} />;
    case "article":
      return <article {...shared} />;
    case "section":
      return <section {...shared} />;
    case "figure":
      return <figure {...shared} />;
    case "span":
      return <span {...shared} />;
    default:
      return <div {...shared} />;
  }
}
