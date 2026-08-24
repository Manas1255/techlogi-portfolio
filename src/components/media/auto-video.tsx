"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { Media } from "@/content/schemas";

type VideoMedia = Extract<Media, { kind: "video" }>;

export interface AutoVideoProps {
  media: VideoMedia;
  className?: string;
}

/**
 * Interface video, behaving the way video on a marketing site should.
 *
 *  - always `muted` and `playsinline`, audio that starts by itself is hostile
 *  - lazy: `preload="none"` until it approaches the viewport
 *  - paused when substantially out of view, so a long page isn't decoding six
 *    videos it can't see
 *  - a `poster` is required by the schema, so the frame is painted before the
 *    first byte of video arrives and nothing shifts
 *  - under `prefers-reduced-motion`, the poster is ALL that renders, a still
 *    frame of the same composition, not a broken-looking gap
 *  - if the sources fail, it falls back to the poster rather than a black box
 */
export function AutoVideo({ media, className }: AutoVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    const element = videoRef.current;
    if (element === null || prefersReducedMotion) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // A rejected play() is normal (a background tab, a data-saver
            // setting). The poster stays up, which is the correct outcome.
            void element.play().catch(() => undefined);
          } else if (!element.paused) {
            element.pause();
          }
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  // Reduced motion, or a source that failed: the poster is the experience.
  if (prefersReducedMotion || hasFailed) {
    // `fill` is safe here: `MediaFrame` always renders media inside a
    // positioned, aspect-ratio-reserved box.
    return (
      <Image
        src={media.poster}
        alt={media.alt}
        fill
        sizes="100vw"
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className={cn("size-full object-cover", className)}
      poster={media.poster}
      muted
      playsInline
      loop={media.loop}
      preload="none"
      // Decorative media carries an empty alt; a described video gets a label.
      aria-label={media.alt === "" ? undefined : media.alt}
      aria-hidden={media.alt === "" ? true : undefined}
      onError={() => setHasFailed(true)}
    >
      {media.sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}
