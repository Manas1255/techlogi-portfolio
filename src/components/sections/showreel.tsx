"use client";

import { useEffect, useState } from "react";
import { Container, Eyebrow } from "@/components/marketing";
import { MediaFrame } from "@/components/media";
import { projects } from "@/content";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const CLIPS = projects.slice(0, 5).map((project) => ({
  slug: project.slug,
  name: project.name,
  productType: project.productType,
  industry: project.industry,
  media: project.heroMedia,
}));

const INTERVAL_MS = 4200;

/**
 * THE SHOWREEL — a sequence of real product surfaces, not a corporate video.
 *
 * It advances on its own, but every clip is also directly reachable: the labels
 * beneath are real buttons with a roving selection, so this works on a keyboard
 * and on touch, where a hover preview would be dead. That is the designed
 * alternative the brief asks for, not a disabled desktop interaction.
 *
 * Under `prefers-reduced-motion` the rotation stops entirely and the reel
 * becomes a static composition the visitor drives — still complete, not broken.
 * Interaction also stops the timer for good: once someone has chosen, taking
 * the choice away four seconds later is hostile.
 */
export function Showreel() {
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [isAuto, setIsAuto] = useState(true);

  useEffect(() => {
    if (!isAuto || prefersReducedMotion) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % CLIPS.length),
      INTERVAL_MS,
    );
    return () => window.clearInterval(timer);
  }, [isAuto, prefersReducedMotion]);

  return (
    <section
      data-surface="ink"
      className="border-hairline overflow-hidden border-t py-16 md:py-24"
      aria-roledescription="carousel"
      aria-label="Selected product interfaces"
    >
      <Container width="wide">
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Eyebrow index={1}>Interfaces we&apos;ve shipped</Eyebrow>
            <p className="text-mono-label text-muted-foreground">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(CLIPS.length).padStart(2, "0")}
            </p>
          </div>

          <div className="relative">
            {CLIPS.map((item, index) => (
              <div
                key={item.slug}
                aria-hidden={index !== active}
                className={cn(
                  "transition-opacity duration-[var(--dur-slow)] ease-[var(--ease-out-expo)]",
                  index === active
                    ? "opacity-100"
                    : "pointer-events-none absolute inset-0 opacity-0",
                )}
              >
                <MediaFrame
                  media={item.media}
                  sizes="(min-width: 1280px) 1560px, 96vw"
                />
              </div>
            ))}
          </div>

          <ul className="border-hairline grid gap-px border-t sm:grid-cols-5">
            {CLIPS.map((item, index) => (
              <li key={item.slug}>
                <button
                  type="button"
                  aria-current={index === active ? "true" : undefined}
                  onClick={() => {
                    setActive(index);
                    setIsAuto(false);
                  }}
                  className={cn(
                    "focus-visible:outline-ring group/clip flex w-full flex-col gap-1.5 py-4 pr-4 text-left transition-colors duration-[var(--dur-base)] focus-visible:outline-2 focus-visible:-outline-offset-2",
                    index === active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-px w-full origin-left transition-transform duration-[var(--dur-base)]",
                      index === active
                        ? "bg-primary scale-x-100"
                        : "bg-hairline-strong group-hover/clip:bg-foreground/40 scale-x-100",
                    )}
                  />
                  <span className="pt-2 text-[0.9375rem] font-medium">
                    {item.name}
                  </span>
                  <span className="text-mono-label text-muted-foreground">
                    {item.productType} · {item.industry}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
