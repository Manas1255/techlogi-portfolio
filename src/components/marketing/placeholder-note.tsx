import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PlaceholderNoteProps extends React.ComponentProps<"p"> {
  children: React.ReactNode;
  /** `inline` for a footnote under a figure; `panel` for a case-study header. */
  tone?: "inline" | "panel";
}

/**
 * The honesty marker.
 *
 * Unverified claims — illustrative metrics, unapproved quotes, sample case
 * studies — say so here rather than being implied as fact. It is deliberately
 * quiet but never hidden: a site that labels which figures are placeholders
 * reads more credible than one asserting "300% growth" with no source.
 *
 * When real, cleared content replaces the placeholders, set
 * `isPlaceholder: false` on the entry and this disappears on its own.
 */
export function PlaceholderNote({
  children,
  tone = "inline",
  className,
  ...props
}: PlaceholderNoteProps) {
  if (tone === "panel") {
    return (
      <p
        className={cn(
          "border-hairline bg-muted/60 text-muted-foreground flex items-start gap-3 rounded-md border px-4 py-3 text-sm",
          className,
        )}
        {...props}
      >
        <Info
          aria-hidden="true"
          className="text-primary mt-0.5 size-4 shrink-0"
        />
        <span>{children}</span>
      </p>
    );
  }
  return (
    <p
      className={cn("text-mono-label text-muted-foreground/80", className)}
      {...props}
    >
      {children}
    </p>
  );
}
