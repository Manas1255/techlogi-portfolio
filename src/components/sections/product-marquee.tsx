"use client";

import Image from "next/image";
import { AppLink as Link } from "@/components/layout/app-link";
import { caseStudyPath } from "@/constants";
import { productLogoSrc, type ShippedProduct } from "@/content";
import { useOnstage } from "@/hooks/use-onstage";
import { cn } from "@/lib/utils";

/**
 * The product strip, moving.
 *
 * `COPIES` is four for a reason that is easy to get wrong: the loop only looks
 * seamless while each half of the track is at least as wide as the container,
 * because the animation resets by translating exactly `-50%`. Two copies is
 * the version everyone writes first and it shows a visible gap on anything
 * wider than a laptop. Four is enough here only because the rail now sits in a
 * capsule bounded by the wide container rather than running edge to edge; a
 * sweep test asserts the geometry, so widening the cells is safe and removing
 * a copy is not.
 *
 * Only the FIRST copy is real. The rest are `aria-hidden` with unfocusable
 * links, so a screen reader hears six products rather than thirty-six and the
 * tab order does not contain five identical traps. They still navigate on
 * click, because a visitor who clicks a logo means the logo they clicked.
 *
 * The animation itself, the pause-on-hover, the onstage gate and the
 * reduced-motion behaviour all live in `globals.css`; this only supplies the
 * ref that toggles `data-onstage` and enough repeats to fill the row.
 */
const COPIES = 4;

export function ProductMarquee({
  products,
  viewLabel,
}: {
  products: ShippedProduct[];
  /** Screen-reader-only text on each linked tile. */
  viewLabel: string;
}) {
  const onstage = useOnstage<HTMLDivElement>();

  return (
    <div
      ref={onstage}
      data-marquee=""
      className="marquee border-hairline bg-sunken rounded-[2.5rem] border py-5"
    >
      <ul className="marquee-track flex w-max items-center">
        {Array.from({ length: COPIES }).flatMap((_, copy) =>
          products.map((product) => {
            const isOriginal = copy === 0;
            /*
              A HORIZONTAL lockup, icon beside name, rather than the stacked
              tile this replaced. Stacked, each cell was as tall as three lines
              and as wide as its longest caption, which made the rail a row of
              cards; beside each other they read as a logo, which is what the
              band is for. It also halves the height, so the capsule is a band
              running through the page rather than a panel sitting on it.
            */
            const tile = (
              <>
                <span
                  className={cn(
                    // A definite size at every breakpoint. This wrapper centres
                    // its children, so it shrink-wraps, and an image sized
                    // `w-full` inside a shrink-wrapped parent collapses to zero.
                    "relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-[0.9rem] transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-expo)] group-hover/tile:-translate-y-0.5",
                    // An icon that already carries its own dark ground gets no
                    // tile behind it; one that does not gets a hairline and a
                    // raised surface so it is not floating on graphite.
                    product.hasOwnGround
                      ? "ring-hairline-strong ring-1 ring-inset"
                      : "border-hairline bg-raised border",
                  )}
                >
                  <Image
                    src={productLogoSrc(product)}
                    alt=""
                    width={product.width}
                    height={product.height}
                    sizes="44px"
                    className="size-full object-cover"
                  />
                </span>
                <span className="flex flex-col items-center gap-0.5 text-center whitespace-nowrap">
                  <span className="text-[0.875rem] leading-tight font-medium">
                    {product.name}
                  </span>
                  <span className="text-mono-label text-muted-foreground">
                    {product.kind}
                  </span>
                </span>
              </>
            );

            return (
              <li
                key={`${copy}-${product.id}`}
                aria-hidden={isOriginal ? undefined : "true"}
                className="flex w-44 shrink-0 justify-center"
              >
                {product.projectSlug === null ? (
                  <div className="group/tile flex flex-col items-center gap-3">
                    {tile}
                  </div>
                ) : (
                  <Link
                    href={caseStudyPath(product.projectSlug)}
                    tabIndex={isOriginal ? undefined : -1}
                    className="group/tile focus-visible:outline-ring flex flex-col items-center gap-3 rounded-2xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    {tile}
                    {isOriginal && <span className="sr-only">{viewLabel}</span>}
                  </Link>
                )}
              </li>
            );
          }),
        )}
      </ul>
    </div>
  );
}
