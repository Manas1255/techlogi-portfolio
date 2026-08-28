"use client";

import { cn } from "@/lib/utils";

export interface BriefProgressProps {
  /** Zero-based index of the current step. */
  current: number;
  total: number;
  /** Already-formatted "Step 2 of 4". */
  label: string;
  className?: string;
}

/**
 * HOW MUCH IS LEFT, as a segmented rule.
 *
 * A form only feels short if the end is visible, so this is the one piece of
 * chrome the flow keeps. It is a row of hairline segments that fill with brass
 * as the visitor advances, not the rounded track a progress bar usually gets:
 * the site's whole structural vocabulary is hairlines and mono metadata, and a
 * pill-shaped bar with a percentage would be the first thing on the page
 * borrowed from somewhere else.
 *
 * Segments rather than a continuous bar because the count IS the reassurance.
 * Four discrete marks say "four questions" at a glance; a bar at 50% says
 * "halfway through something of unknown length", which is the anxiety this is
 * supposed to remove.
 *
 * The visual is `aria-hidden` and the real announcement is the text beside it,
 * so a screen reader hears "Step 2 of 4" rather than four unlabelled boxes.
 */
export function BriefProgress({
  current,
  total,
  label,
  className,
}: BriefProgressProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex flex-1 items-center gap-1.5" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-0.5 flex-1 rounded-full transition-colors duration-[var(--dur-base)] ease-[var(--ease-out-expo)]",
              index <= current ? "bg-primary" : "bg-hairline-strong",
            )}
          />
        ))}
      </div>
      <p className="text-mono-label text-muted-foreground shrink-0 tabular-nums">
        {label}
      </p>
    </div>
  );
}
