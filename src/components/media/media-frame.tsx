import Image from "next/image";
import type { Media } from "@/content/schemas";
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
  /** Hero media only — everything else stays lazy. */
  priority?: boolean;
  /** Hairline caption under the frame. */
  caption?: string;
}

const ASPECT: Record<Media["aspect"], string> = {
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
 * and the synthetic interface compositions — behind one API, so a section never
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
}: MediaFrameProps) {
  const content = (
    <MediaContent media={media} sizes={sizes} priority={priority} />
  );
  const ratio = ASPECT[media.aspect];

  if (media.frame === "browser") {
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
            className="relative overflow-hidden"
          >
            {content}
          </div>
        </div>
        {caption !== undefined && <FrameCaption>{caption}</FrameCaption>}
      </figure>
    );
  }

  if (media.frame === "device") {
    return (
      <figure
        className={cn("flex min-w-0 flex-col items-center gap-3", className)}
      >
        <div className="border-hairline-strong bg-raised media-lift relative overflow-hidden rounded-[2rem] border-[6px] p-0 shadow-[0_0_0_1px_var(--hairline)]">
          <span
            aria-hidden="true"
            className="bg-sunken absolute top-2 left-1/2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full"
          />
          <div
            style={{ aspectRatio: ratio }}
            className="relative w-full overflow-hidden rounded-[1.6rem]"
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
        className="border-hairline bg-raised media-lift rounded-frame relative overflow-hidden border"
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
}: {
  media: Media;
  sizes?: string;
  priority: boolean;
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
        className="size-full object-cover"
      />
    );
  }

  if (media.kind === "video") {
    return <AutoVideo media={media} />;
  }

  return (
    <div
      className="size-full"
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
