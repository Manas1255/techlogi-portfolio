import { cn } from "@/lib/utils";

export interface EyebrowProps extends React.ComponentProps<"p"> {
  /** A two-digit index, drawn before the label in the accent colour. */
  index?: number;
}

/**
 * The section marker: a monospace pill that opens each band.
 *
 * It used to be a bare label beside a hairline rule, which was too quiet to do
 * the job. Readers reported the page as one undifferentiated scroll, and a
 * marker that does not announce a new chapter is half the reason. A bordered
 * pill on the section's own raised surface reads as a badge stuck to the band,
 * and because it uses semantic tokens it carries its own contrast on paper,
 * tint and slab alike.
 */
export function Eyebrow({
  index,
  className,
  children,
  ...props
}: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-eyebrow text-muted-foreground border-hairline bg-raised inline-flex w-fit items-center gap-2.5 rounded-full border py-2 pr-4",
        index === undefined ? "pl-4" : "pl-3",
        className,
      )}
      {...props}
    >
      {/* The divider separates the index from the label, so with no index
          there is nothing to separate and it was rendering as a stray tick
          floating before the first word. */}
      {index !== undefined && (
        <>
          <span className="text-primary tabular-nums">
            {String(index).padStart(2, "0")}
          </span>
          <span
            className="bg-hairline-strong h-3 w-px shrink-0"
            aria-hidden="true"
          />
        </>
      )}
      {children}
    </p>
  );
}
