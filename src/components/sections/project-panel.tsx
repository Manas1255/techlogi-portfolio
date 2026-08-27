import { AppLink as Link } from "@/components/layout/app-link";
import { ArrowLink, Reveal } from "@/components/marketing";
import { MediaFrame } from "@/components/media";
import { caseStudyPath } from "@/constants";
import type { Media, Project } from "@/content";
import { getTranslations } from "@/i18n/server";
import { cn } from "@/lib/utils";

export interface ProjectPanelProps {
  project: Project;
  index: number;
  /** Alternating composition, the caller decides, so a page can vary rhythm. */
  reversed?: boolean;
  /** Media spans the full measure with metadata beneath, for emphasis. */
  fullBleed?: boolean;
  /**
   * Show a different frame than the project's hero. Used where the hero media
   * already appears earlier on the same page, repeating one composition three
   * times reads as a template, however good the composition is.
   */
  media?: Media;
  /**
   * Heading level for the project name. The panel sits under a section heading
   * on the home page (h2 → h3) but directly under the page title on `/work`
   * (h1 → h2); hardcoding either one skips a level on the other page.
   */
  headingLevel?: "h2" | "h3";
}

/**
 * One project, as an editorial panel.
 *
 * The whole panel is a link, but the accessible name comes from a single
 * anchor around the title, with the media marked decorative, so a screen reader
 * hears "Nova, AI-assisted operations platform" once rather than the same
 * destination announced three times.
 *
 * Metadata is deliberately dense: name, industry, product type, what we did,
 * outcome, services and platforms. A project the reader can't evaluate is a
 * thumbnail, and a grid of thumbnails is the failure state this section exists
 * to avoid.
 */
export async function ProjectPanel({
  project,
  index,
  reversed = false,
  fullBleed = false,
  media: mediaOverride,
  headingLevel: Heading = "h3",
}: ProjectPanelProps) {
  const t = await getTranslations();
  const frameMedia = mediaOverride ?? project.heroMedia;
  const media = (
    <Link
      href={caseStudyPath(project.slug)}
      tabIndex={-1}
      aria-hidden="true"
      className={cn(
        "rounded-frame block",
        /*
          The emphasis panel used to take the whole measure. That was drawn
          when heroes were 16:9; every hero is now a 4:3 composite, enforced by
          a content test, and 4:3 across 1240px is a 930px-tall picture, taller
          than the viewport it lands in. The reader met one project and had to
          scroll past it to learn its name.

          So the emphasis is capped rather than removed: still visibly wider
          than the two-column panels around it (about 900px against 655px),
          but a height a screen can hold. Do NOT fix this by cropping the
          composite to a wider ratio instead: the wordmark sits in one corner
          of these frames and the device in the other, and a 16:9 crop takes
          one of them off.
        */
        fullBleed && "mx-auto w-full max-w-[900px]",
      )}
    >
      <MediaFrame
        media={frameMedia}
        sizes={
          fullBleed
            ? "(min-width: 1024px) 900px, 92vw"
            : "(min-width: 1024px) 56vw, 92vw"
        }
      />
    </Link>
  );

  const meta = (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-mono-label text-muted-foreground flex items-center gap-3">
          <span className="text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="bg-hairline-strong h-px w-8" aria-hidden="true" />
          {project.industry}
        </p>
        <Heading className="text-display-2">
          <Link
            href={caseStudyPath(project.slug)}
            className="focus-visible:outline-ring rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {project.name}
            <span className="sr-only">, {project.tagline}</span>
          </Link>
        </Heading>
        <p className="text-muted-foreground text-lg leading-snug">
          {project.tagline}
        </p>
      </div>

      <p className="text-marketing-body text-muted-foreground">
        {project.summary}
      </p>

      <dl className="border-hairline grid gap-x-8 gap-y-4 border-t pt-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <dt className="text-eyebrow text-muted-foreground">
            {t("site.whatWeDid")}
          </dt>
          <dd className="text-[0.9375rem] leading-snug">{project.whatWeDid}</dd>
        </div>
        <div className="flex flex-col gap-1.5">
          <dt className="text-eyebrow text-muted-foreground">
            {t("site.outcome")}
          </dt>
          <dd className="text-[0.9375rem] leading-snug">{project.outcome}</dd>
        </div>
      </dl>

      <ul className="flex flex-wrap gap-x-2 gap-y-2">
        {[...project.services, ...project.platforms].map((item) => (
          <li
            key={item}
            className="border-hairline text-mono-label text-muted-foreground rounded-full border px-3 py-1.5"
          >
            {item}
          </li>
        ))}
      </ul>

      <ArrowLink href={caseStudyPath(project.slug)}>
        View case study
        <span className="sr-only">, {project.name}</span>
      </ArrowLink>
    </div>
  );

  if (fullBleed) {
    return (
      <Reveal variant="lift" className="group flex flex-col gap-10">
        {media}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-3">
            <p className="text-mono-label text-muted-foreground flex items-center gap-3">
              <span className="text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className="bg-hairline-strong h-px w-8"
                aria-hidden="true"
              />
              {project.industry} · {project.productType}
            </p>
            <Heading className="text-display-1">
              <Link
                href={caseStudyPath(project.slug)}
                className="focus-visible:outline-ring rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {project.name}
                <span className="sr-only">, {project.tagline}</span>
              </Link>
            </Heading>
            <p className="text-muted-foreground text-lg leading-snug">
              {project.tagline}
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-marketing-body text-muted-foreground">
              {project.summary}
            </p>
            <ul className="flex flex-wrap gap-2">
              {[...project.services, ...project.platforms].map((item) => (
                <li
                  key={item}
                  className="border-hairline text-mono-label text-muted-foreground rounded-full border px-3 py-1.5"
                >
                  {item}
                </li>
              ))}
            </ul>
            <ArrowLink href={caseStudyPath(project.slug)}>
              View case study
              <span className="sr-only">, {project.name}</span>
            </ArrowLink>
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal
      variant="lift"
      className={cn(
        "group grid items-center gap-10 lg:gap-14",
        "lg:grid-cols-[1.25fr_1fr]",
      )}
    >
      <div className={cn(reversed && "lg:order-2")}>{media}</div>
      <div className={cn(reversed && "lg:order-1")}>{meta}</div>
    </Reveal>
  );
}
