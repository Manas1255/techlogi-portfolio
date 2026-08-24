import { cn } from "@/lib/utils";

export interface EyebrowProps extends React.ComponentProps<"p"> {
  /** A two-digit index, drawn before the label in the accent colour. */
  index?: number;
}

/**
 * The monospace section label. Small, tracked, and the site's main engineering
 * signal, which is why there are no code screenshots anywhere.
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
        "text-eyebrow text-muted-foreground flex items-center gap-2.5",
        className,
      )}
      {...props}
    >
      {index !== undefined && (
        <span className="text-primary tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
      )}
      <span
        className="bg-hairline-strong h-px w-6 shrink-0"
        aria-hidden="true"
      />
      {children}
    </p>
  );
}
