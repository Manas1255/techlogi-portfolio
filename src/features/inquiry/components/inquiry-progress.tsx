import { cn } from "@/lib/utils";

export interface InquiryProgressProps {
  step: number;
  total: number;
  labels: readonly string[];
}

/**
 * Step indication.
 *
 * The bar is `aria-hidden` and the real announcement is a live region, because
 * four coloured segments tell a screen-reader user nothing. `aria-live="polite"`
 * rather than assertive: moving between steps is not an interruption.
 */
export function InquiryProgress({ step, total, labels }: InquiryProgressProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-mono-label text-muted-foreground" aria-hidden="true">
          <span className="text-primary">
            {String(step + 1).padStart(2, "0")}
          </span>
          <span className="mx-1.5 opacity-40">/</span>
          {String(total).padStart(2, "0")}
        </p>
        <p className="text-mono-label text-muted-foreground truncate">
          {labels[step]}
        </p>
      </div>
      <div className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-0.5 flex-1 rounded-full transition-colors duration-[var(--dur-base)]",
              index <= step ? "bg-primary" : "bg-hairline-strong",
            )}
          />
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Step {step + 1} of {total}: {labels[step]}
      </p>
    </div>
  );
}
