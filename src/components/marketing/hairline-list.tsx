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
          <span
            className="text-mono-label text-primary mt-1 shrink-0"
            aria-hidden="true"
          >
            {numbered ? String(index + 1).padStart(2, "0") : ", "}
          </span>
          <span className="text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}
