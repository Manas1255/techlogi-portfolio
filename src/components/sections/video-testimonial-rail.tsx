"use client";

import { Play, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import type { Testimonial } from "@/content";
import { useTranslations } from "@/i18n";
import { cn } from "@/lib/utils";

type WithVideo = Testimonial & { video: NonNullable<Testimonial["video"]> };

/**
 * VERTICAL VIDEO TESTIMONIALS.
 *
 * Portrait, because that is what a client can actually film. The reason most
 * agency sites have no video proof at all is that the ask is a booked shoot
 * with a crew; the ask here is thirty seconds on the phone already in their
 * hand, which is a thing a busy person says yes to.
 *
 * Sound is the whole point of a testimonial and also the thing that must never
 * start on its own, so the two are separated: a clip autoplays MUTED when it
 * is on screen, exactly like the interface videos elsewhere on the site, and
 * unmuting is a deliberate press. Pressing unmute on one clip mutes every
 * other, because two people talking over each other is the failure mode of
 * every video rail ever built.
 *
 * A native scroll rail with snap points, not a carousel with arrows. It works
 * on touch without any JavaScript at all, it never traps a swipe, and it
 * cannot desynchronise from its own index, which is the bug every hand-rolled
 * carousel eventually ships.
 */
export function VideoTestimonialRail({ items }: { items: WithVideo[] }) {
  const t = useTranslations();
  const [activeId, setActiveId] = useState<string | null>(null);
  const refs = useRef(new Map<string, HTMLVideoElement>());

  const toggleSound = (id: string) => {
    const next = activeId === id ? null : id;
    setActiveId(next);
    for (const [key, element] of refs.current) {
      element.muted = key !== next;
      if (key === next) void element.play().catch(() => undefined);
    }
  };

  return (
    <ul className="rail-snap -mx-5 flex gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
      {items.map((testimonial) => {
        const id = `${testimonial.person}-${testimonial.company}`;
        const isUnmuted = activeId === id;
        return (
          <li key={id} className="w-[16rem] shrink-0 sm:w-[17.5rem]">
            <figure className="border-hairline bg-sunken relative flex aspect-[9/16] flex-col justify-end overflow-hidden rounded-3xl border">
              <video
                ref={(node) => {
                  if (node === null) refs.current.delete(id);
                  else refs.current.set(id, node);
                }}
                poster={testimonial.video.poster}
                muted
                loop
                playsInline
                autoPlay
                preload="none"
                className="absolute inset-0 size-full object-cover"
              >
                {testimonial.video.sources.map((source) => (
                  <source
                    key={source.src}
                    src={source.src}
                    type={source.type}
                  />
                ))}
              </video>

              {/* A scrim, so the caption is readable whatever the frame is. */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 to-transparent"
              />

              <button
                type="button"
                onClick={() => toggleSound(id)}
                aria-pressed={isUnmuted}
                className="focus-visible:outline-ring absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {isUnmuted ? (
                  <Volume2 aria-hidden="true" className="size-4" />
                ) : (
                  <VolumeX aria-hidden="true" className="size-4" />
                )}
                <span className="sr-only">
                  {isUnmuted
                    ? t("proof.mute", { person: testimonial.person })
                    : t("proof.unmute", { person: testimonial.person })}
                </span>
              </button>

              <figcaption className="relative z-10 flex flex-col gap-1 p-4 text-white">
                <span className="text-[0.9375rem] leading-tight font-medium">
                  {testimonial.person}
                </span>
                <span className="text-[0.75rem] leading-snug text-white/75">
                  {testimonial.role}, {testimonial.company}
                </span>
              </figcaption>
            </figure>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * The empty state, and it is a designed one rather than a hidden section.
 *
 * No client has filmed a clip yet. The honest options were to omit the section
 * entirely, to fabricate testimonials, or to show the shape of the thing and
 * say plainly that it is empty. The second is out on principle and the first
 * throws away the structure, so this is the third: three portrait frames at
 * the exact ratio a real clip will occupy, so the day one arrives it is a
 * content edit and the layout does not move.
 *
 * It also does something the omitted version could not, which is state the
 * publishing rule out loud. "We publish a quote when a named person has
 * approved it" is itself a trust signal, and a stronger one than two invented
 * quotes from PLACEHOLDER, Company.
 */
export function VideoTestimonialPlaceholder() {
  const t = useTranslations();

  return (
    <ul
      aria-hidden="true"
      className="rail-snap -mx-5 flex gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0"
    >
      {[0, 1, 2].map((index) => (
        <li
          key={index}
          className={cn(
            "shrink-0 sm:w-[17.5rem]",
            /*
              ONE PANEL ON A PHONE, NOT THREE.

              The frames below are drawn at the exact 9:16 a real clip will
              occupy, which is right on a desktop where the rail sits in a
              narrow column beside the comparison. Translated literally to a
              phone it became three 256x455 boxes, about 1,300px of dashed
              nothing, and the reader had to scroll through a screen and a half
              of it to reach the argument underneath. An empty state should
              cost a glance, not a journey.

              Nothing is being hidden or softened here: the panel says the same
              sentence, and the note beneath it still states the publishing
              rule out loud. It just stops spending a screen and a half saying
              a thing there is currently none of.

              The full-size rail is what a REAL clip gets, from `sm` up and on
              a phone alike, so the day one lands it arrives at the size the
              format deserves.
            */
            index === 0 ? "w-full" : "w-[16rem] max-sm:hidden",
          )}
        >
          <div
            className={cn(
              "border-hairline bg-sunken flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed max-sm:aspect-[16/7] sm:aspect-[9/16]",
              index > 0 && "opacity-60",
              index > 1 && "opacity-35",
            )}
          >
            <span className="border-hairline text-muted-foreground flex size-11 items-center justify-center rounded-full border">
              <Play className="size-4" />
            </span>
            <span className="text-mono-label text-muted-foreground">
              {t("proof.awaitingClip")}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
