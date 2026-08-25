import { cn } from "@/lib/utils";

export interface HairlineListProps extends React.ComponentProps<"ul"> {
  items: readonly string[];
  /** Mono numbering, for ordered points in a case study. */
  numbered?: boolean;
}

/**
 * A list separated by hairlines rather than bullets, the site's default for
 * supporting points. Structure comes from rules, not from dots.
 */
export function HairlineList({
  items,
  numbered = false,
  className,
  ...props
}: HairlineListProps) {
  return (
    <ul className={cn("border-hairline border-t", className)} {...props}>
      {items.map((item, index) => (
        <li
          key={item}
          className="border-hairline flex gap-4 border-b py-3.5 text-[0.9375rem] leading-relaxed"
        >
          {numbered ? (
            <span
              className="text-mono-label text-primary mt-1 shrink-0"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : (
            /* A short rule, not a glyph. An unnumbered marker used to be the
               string ", ", which rendered as a stray comma hanging under every
               line: it read as a typo in the copy rather than as a bullet, and
               it is the kind of thing a type check can never see. A rule is
               also the right mark for a list whose whole idea is that
               structure comes from rules rather than dots. */
            <span
              className="bg-primary/70 mt-[0.7rem] h-px w-3 shrink-0"
              aria-hidden="true"
            />
          )}
          <span className="text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}
