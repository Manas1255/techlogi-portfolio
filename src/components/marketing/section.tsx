import { Container, type ContainerWidth } from "./container";
import { cn } from "@/lib/utils";

/**
 * `slab` and `paper` re-declare every colour token for the subtree, so a
 * section flips ground without any child knowing which one it landed on.
 * `inherit` leaves the surrounding ground alone, which, since the site is
 * light by default, is what most sections want.
 */
export type Surface = "paper" | "slab" | "inherit";

/**
 * Three steps, and only three. Restricting vertical rhythm to a fixed set is
 * what stops section spacing drifting component by component.
 */
export type Rhythm = "tight" | "base" | "loose" | "none";

const RHYTHM: Record<Rhythm, string> = {
  none: "",
  tight: "py-16 md:py-20",
  base: "py-20 md:py-28",
  loose: "py-24 md:py-36",
};

export interface SectionProps extends React.ComponentProps<"section"> {
  surface?: Surface;
  width?: ContainerWidth;
  rhythm?: Rhythm;
  /** Draw a hairline along the top edge, to close the section above. */
  divided?: boolean;
  /** Add the grain layer, ink grounds only, and sparingly. */
  grain?: boolean;
  /** Escape hatch for sections that manage their own container. */
  bare?: boolean;
}

/**
 * A page section: its ground, its vertical rhythm and its measure, decided in
 * one place. Everything on the site is composed from these.
 */
export function Section({
  surface = "inherit",
  width = "content",
  rhythm = "base",
  divided = false,
  grain = false,
  bare = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      data-surface={surface === "inherit" ? undefined : surface}
      className={cn(
        "relative isolate",
        RHYTHM[rhythm],
        divided && "border-hairline border-t",
        grain && "grain",
        className,
      )}
      {...props}
    >
      {bare ? children : <Container width={width}>{children}</Container>}
    </section>
  );
}
