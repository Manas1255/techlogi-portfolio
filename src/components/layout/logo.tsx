import Link from "next/link";
import { HOME_ROUTE } from "@/constants";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The wordmark.
 *
 * Drawn in type rather than shipped as an SVG: the display face is already
 * loaded, so the mark costs nothing extra, stays crisp at any size, and inherits
 * the surface it lands on. The dot is the brand's only decorative element.
 */
export function Logo({
  className,
  asLink = true,
}: {
  className?: string;
  asLink?: boolean;
}) {
  const mark = (
    <span
      className={cn(
        "font-display inline-flex items-baseline text-[1.375rem] leading-none font-semibold tracking-[-0.03em]",
        className,
      )}
    >
      {siteConfig.name}
      <span aria-hidden="true" className="text-primary">
        .
      </span>
    </span>
  );

  if (!asLink) return mark;

  return (
    <Link
      href={HOME_ROUTE}
      className="focus-visible:outline-ring rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
      aria-label={`${siteConfig.name} — home`}
    >
      {mark}
    </Link>
  );
}
