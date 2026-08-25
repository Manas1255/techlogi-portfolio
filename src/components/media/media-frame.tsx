import Image from "next/image";
import type { Aspect, Media, MediaFrameKind } from "@/content/schemas";
import { cn } from "@/lib/utils";
import { AutoVideo } from "./auto-video";
import { SyntheticComposition } from "./compositions";

export interface MediaFrameProps {
  media: Media;
  className?: string;
  /**
   * Overrides the media's own `sizes`. Get this wrong and the browser fetches
   * a 2400px image for a 400px slot.
   */
  sizes?: string;
  /** Hero media only, everything else stays lazy. */
  priority?: boolean;
  /** Hairline caption under the frame. */
  caption?: string;
  /**
   * Impose a ratio on the frame regardless of the media's own, letting the
   * picture cover it. For bands that hold DIFFERENT media in the same box,
   * the showreel, where a jumping block height between clips reads as a bug.
   * Everywhere else, leave it alone: the media's own ratio is the honest one.
   */
  aspectOverride?: Aspect;
  /**
   * Impose a frame treatment, ignoring the media's own.
   *
   * For contexts where the frame is the container's decision rather than the
   * media's: a compact card wants a uniform banner, and a phone shell inside a
   * 16:10 letterbox is both wrong and capped at the shell's own max width, so
   * a device-framed project renders at half the card's width.
   */
  frameOverride?: MediaFrameKind;
  /**
   * How the picture fills an overridden ratio.
   *
   * `cover` is right when the media is already near the box's shape. It is
   * badly wrong when it is not: a 9:16 phone capture forced to cover a 16:10
   * card keeps a horizontal strip about a fifth of the screen tall, which on
   * these captures is the status bar and the notch. Four cards on the home
   * page were showing a black pill and half a greeting.
   *
   * `contain` shows the whole screen, scaled to the box's height and centred.
   * Narrower, and honest: it reads as a product shot rather than a rendering
   * fault. Only meaningful alongside `aspectOverride`.
   */
  fit?: "cover" | "contain";
}

const ASPECT: Record<string, string> = {
  "16/9": "16 / 9",
  "16/10": "16 / 10",
  "4/3": "4 / 3",
  "3/2": "3 / 2",
  "1/1": "1 / 1",
  "9/16": "9 / 16",
  "4/5": "4 / 5",
};

/**
 * ONE component for every piece of media on the site: images, `.mp4`/`.webm`,
 * and the synthetic interface compositions, behind one API, so a section never
 * branches on what kind of media it was given.
 *
 * What it guarantees regardless of kind:
 *   - the aspect ratio is reserved in CSS, so nothing shifts on load
 *   - the frame treatment (browser chrome, device shell, bare hairline) is a
 *     data decision, not a markup decision
 *   - overflow is clipped at the frame, so a composition can't escape it
 *
 * Frames are decorative: their chrome is `aria-hidden`, and the accessible name
 * comes from the media's own `alt`.
 */
export function MediaFrame({
  media,
  className,
  sizes,
  priority = false,
  caption,
  aspectOverride,
  frameOverride,
  fit = "cover",
}: MediaFrameProps) {
  const frame = frameOverride ?? media.frame;

  /*
    Where to anchor the crop when the box is a different shape from the media.

    `object-fit: cover` centres by default, which for a tall phone capture in a
    wide banner picks whatever happened to be halfway down the screen: a
    progress row, a random card, the middle of a list. An app's identity lives
    at the TOP of its screen, in the header and the first block of content, so
    anchor there whenever a portrait image is being shown in a landscape box.
  */
  const isPortraitMedia =
    media.kind === "image"
      ? media.height > media.width
      : media.aspect === "9/16" || media.aspect === "4/5";
  const isLandscapeBox =
    aspectOverride !== undefined &&
    aspectOverride !== "9/16" &&
    aspectOverride !== "4/5" &&
    aspectOverride !== "1/1";
  const objectPosition = isPortraitMedia && isLandscapeBox ? "top" : undefined;

  const content = (
    <MediaContent
      media={media}
      sizes={sizes}
      priority={priority}
      objectPosition={objectPosition}
      fit={fit}
    />
  );
  // An image knows its own proportions; only synthetic and video media have to
  // declare one. Reserving the box from the intrinsic size means a picture can
  // never be letterboxed by a mistyped ratio.
  const ratio =
    aspectOverride !== undefined
      ? ASPECT[aspectOverride]
      : media.kind === "image"
        ? `${media.width} / ${media.height}`
        : ASPECT[media.aspect];

  if (frame === "browser") {
    return (
      <figure className={cn("flex min-w-0 flex-col gap-3", className)}>
        <div className="border-hairline bg-raised media-lift rounded-frame overflow-hidden border">
          <div
            aria-hidden="true"
            className="border-hairline flex items-center gap-3 border-b px-3 py-2.5 sm:px-4"
          >
            <span className="flex shrink-0 gap-1.5">
              <span className="bg-foreground/20 size-2 rounded-full" />
              <span className="bg-foreground/20 size-2 rounded-full" />
              <span className="bg-foreground/20 size-2 rounded-full" />
            </span>
            {media.chromeUrl !== null && (
              <span className="bg-muted/60 text-muted-foreground text-mono-label mx-auto max-w-[70%] truncate rounded-full px-3 py-1">
                {media.chromeUrl}
              </span>
            )}
          </div>
          <div
            style={{ aspectRatio: ratio }}
            className="synth-frame relative overflow-hidden"
          >
            {content}
          </div>
        </div>
        {caption !== undefined && <FrameCaption>{caption}</FrameCaption>}
      </figure>
    );
  }

  if (frame === "device") {
    return (
      <figure
        className={cn("flex min-w-0 flex-col items-center gap-3", className)}
      >
        {/* A definite width is required, not optional: the figure centres its
            children, which shrink-wraps this box, and a shrink-wrapped parent
            gives the `w-full` screen inside it a width of zero. */}
        <div className="border-hairline-strong bg-raised media-lift relative w-full max-w-[17rem] overflow-hidden rounded-[2rem] border-[6px] p-0 shadow-[0_0_0_1px_var(--hairline)]">
          {/*
            No drawn notch. Every device-framed image on this site is a real
            device capture that already contains its own Dynamic Island, so a
            second one was always redundant, and once the palette went
            light-first, `bg-sunken` resolved to near-white and it rendered as
            a white bar across the top of the phone. The shell is a bezel; the
            screen supplies its own hardware.
          */}
          <div
            style={{ aspectRatio: ratio }}
            className="synth-frame relative w-full overflow-hidden rounded-[1.6rem]"
          >
            {content}
          </div>
        </div>
        {caption !== undefined && <FrameCaption>{caption}</FrameCaption>}
      </figure>
    );
  }

  return (
    <figure className={cn("flex min-w-0 flex-col gap-3", className)}>
      <div
        style={{ aspectRatio: ratio }}
        className="border-hairline bg-raised media-lift rounded-frame synth-frame relative overflow-hidden border"
      >
        {content}
      </div>
      {caption !== undefined && <FrameCaption>{caption}</FrameCaption>}
    </figure>
  );
}

function FrameCaption({ children }: { children: React.ReactNode }) {
  return (
    <figcaption className="text-mono-label text-muted-foreground">
      {children}
    </figcaption>
  );
}

function MediaContent({
  media,
  sizes,
  priority,
  objectPosition,
  fit = "cover",
}: {
  media: Media;
  sizes?: string;
  priority: boolean;
  objectPosition?: "top";
  fit?: "cover" | "contain";
}) {
  if (media.kind === "image") {
    return (
      <Image
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        sizes={sizes ?? media.sizes}
        priority={priority || media.priority}
        loading={priority || media.priority ? undefined : "lazy"}
        className={cn(
          "size-full",
          fit === "contain" ? "object-contain" : "object-cover",
          objectPosition === "top" && fit !== "contain" && "object-top",
        )}
      />
    );
  }

  if (media.kind === "video") {
    return <AutoVideo media={media} />;
  }

  // A desktop interface scaled down to a 350px phone frame is a smear: its
  // labels land at three or four pixels. So below ~900px the composition keeps
  // rendering at its design width and the frame CROPS it, the visitor sees a
  // legible detail of real software instead of an illegible whole, which is
  // also how a real desktop app looks on a phone. Portrait compositions are
  // designed for narrow frames already and are left alone.
  const isPortrait = media.aspect === "9/16" || media.aspect === "4/5";

  return (
    <div
      // Marks this as a deliberately cropped picture rather than a truncated
      // value, so the layout sweep's unreachable-clipping check doesn't read a
      // framed interface as unreadable data. See `e2e/helpers.ts`.
      data-media-crop=""
      className={isPortrait ? "h-full w-full" : "synth-fill h-full"}
      // The composition is decorative chrome around content the caption and
      // surrounding copy already carry; `alt` is the accessible description
      // where one is warranted.
      role={media.alt === "" ? "presentation" : "img"}
      aria-label={media.alt === "" ? undefined : media.alt}
    >
      <SyntheticComposition
        composition={media.composition}
        animate={media.animate}
      />
    </div>
  );
}
