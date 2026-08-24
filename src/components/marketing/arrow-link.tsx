import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ArrowLinkProps extends Omit<
  React.ComponentProps<typeof Link>,
  "children"
> {
  children: React.ReactNode;
  /** Aligns the underline and arrow to a heading's baseline. */
  size?: "sm" | "base";
}

/**
 * The site's tertiary action: a labelled link whose underline draws in and
 * whose arrow steps forward on hover.
 *
 * The underline is a pseudo-element scaled on the X axis rather than a
 * `border-bottom` — animating a layout property here would reflow the line.
 */
export function ArrowLink({
  children,
  className,
  size = "base",
  ...props
}: ArrowLinkProps) {
  return (
    <Link
      className={cn(
        "group/link text-foreground inline-flex items-center gap-2 font-medium",
        "focus-visible:outline-ring rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4",
        size === "sm" ? "text-sm" : "text-base",
        className,
      )}
      {...props}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden="true"
          className="bg-primary absolute right-0 -bottom-0.5 left-0 h-px origin-right scale-x-0 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-expo)] group-hover/link:origin-left group-hover/link:scale-x-100 group-focus-visible/link:origin-left group-focus-visible/link:scale-x-100"
        />
      </span>
      <ArrowRight
        aria-hidden="true"
        className="text-primary size-4 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-expo)] group-hover/link:translate-x-1"
      />
    </Link>
  );
}
