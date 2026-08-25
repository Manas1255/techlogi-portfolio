import { AppLink as Link } from "@/components/layout/app-link";
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
        /*
          `whitespace-nowrap` and `shrink-0` are load-bearing on a phone. The
          wordmark shares a flex row with the primary CTA, and German runs
          about 30% longer than English: "Gespräch buchen" squeezed the logo
          until "GA Studio." wrapped onto two lines. A translated interface
          breaks layouts the source language never touches, so the fix belongs
          on the element that must never wrap rather than on the label that
          happened to grow.
        */
        "font-display inline-flex shrink-0 items-baseline text-[1.375rem] leading-none font-semibold tracking-[-0.03em] whitespace-nowrap",
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
      className="tap-target focus-visible:outline-ring rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
      aria-label={`${siteConfig.name}, home`}
    >
      {mark}
    </Link>
  );
}
