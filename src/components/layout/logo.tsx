import Image from "next/image";
import { AppLink as Link } from "@/components/layout/app-link";
import { HOME_ROUTE } from "@/constants";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The wordmark.
 *
 * The GA monogram, then the name set in the display face. The name stays TYPE
 * rather than becoming part of the picture: the face is already loaded, so it
 * costs nothing extra, stays crisp at any size, and inherits the surface it
 * lands on, none of which a raster does. The dot is the brand's only
 * decorative element.
 *
 * The monogram is the top half of the supplied lockup, cropped to the solid
 * letterforms rather than to the glow around them: cropped to the glow it
 * arrives as a small mark inside a large transparent box and looks a third of
 * the size it was given. The "GA CODE / APPS INNOVATION SUCCESS" half of that
 * lockup is deliberately NOT here, because at a 28px header it is unreadable.
 *
 * THE MONOGRAM SUPPLIES THE "GA", so the type must not supply it again. The
 * first version set the mark beside the whole name and the header read
 * "GA GA Code." The two halves are one lockup, not a mark next to a wordmark.
 *
 * The remainder is derived rather than written as "Code", so the name stays
 * defined in exactly one place: `siteConfig.name`, from the environment. If it
 * ever stops starting with the monogram's letters the full name is printed
 * instead, which is merely redundant rather than wrong. The accessible name is
 * always the whole thing, because a screen reader gets nothing from the image.
 */
export function Logo({
  className,
  asLink = true,
}: {
  className?: string;
  asLink?: boolean;
}) {
  /*
    The letters the PICTURE already says. Not a config value and not copy: it
    is a property of the image file sitting next to this line, so it belongs
    here rather than in `siteConfig` or a catalog.
  */
  const MONOGRAM = "GA";
  const rest = siteConfig.name.startsWith(`${MONOGRAM} `)
    ? siteConfig.name.slice(MONOGRAM.length + 1)
    : siteConfig.name;

  const mark = (
    <span
      className={cn(
        /*
          `whitespace-nowrap` and `shrink-0` are load-bearing on a phone. The
          wordmark shares a flex row with the primary CTA, and German runs
          about 30% longer than English: "Gespräch buchen" squeezed the logo
          until "GA Code." wrapped onto two lines. A translated interface
          breaks layouts the source language never touches, so the fix belongs
          on the element that must never wrap rather than on the label that
          happened to grow.
        */
        /*
          `items-center`, not `items-baseline`. Baseline alignment sits the
          picture's BOTTOM EDGE on the type's baseline, so the mark hangs low
          and the two halves of the lockup read as two separate things that
          happen to be adjacent. The mark is a square with its own padding; it
          has no baseline to share, so it is centred on the row instead.
        */
        "font-display inline-flex shrink-0 items-center text-[1.375rem] leading-none font-semibold tracking-[-0.03em] whitespace-nowrap",
        className,
      )}
    >
      <Image
        src="/media/brand/ga-code-mark.png"
        alt=""
        aria-hidden="true"
        width={512}
        height={512}
        priority
        className="mr-2 size-7"
      />
      {/* One text run, so the dot keeps the name's baseline whatever the row
          alignment above does. */}
      <span>
        {rest}
        <span aria-hidden="true" className="text-primary">
          .
        </span>
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
