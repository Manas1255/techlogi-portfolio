import { Eyebrow } from "./eyebrow";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

export interface SectionIntroProps {
  eyebrow: string;
  index?: number;
  /** The section's headline. Kept short — the lead does the explaining. */
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** A CTA or filter row, aligned to the intro's baseline on wide screens. */
  aside?: React.ReactNode;
  align?: "start" | "split";
  className?: string;
  /** Heading level, so the document outline never skips. */
  as?: "h2" | "h3";
}

/**
 * The section opener: eyebrow, headline, lead, and an optional aside.
 *
 * `split` puts the aside opposite the intro on wide screens, which is what
 * keeps a section from being "heading, subhead, three cards" for the third
 * time in a row.
 */
export function SectionIntro({
  eyebrow,
  index,
  title,
  lead,
  aside,
  align = "start",
  className,
  as: Heading = "h2",
}: SectionIntroProps) {
  return (
    <Reveal
      className={cn(
        align === "split"
          ? "flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          : "flex flex-col gap-6",
        className,
      )}
    >
      <div className="flex flex-col gap-5">
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
        <Heading className="text-display-2 max-w-3xl text-balance">
          {title}
        </Heading>
        {lead !== undefined && (
          <p className="text-lead text-muted-foreground">{lead}</p>
        )}
      </div>
      {aside !== undefined && <div className="shrink-0">{aside}</div>}
    </Reveal>
  );
}
