import { AppLink as Link } from "@/components/layout/app-link";
import { ArrowUpRight } from "lucide-react";
import { MediaFrame } from "@/components/media";
import { caseStudyPath } from "@/constants";
import type { Project } from "@/content";
import { cn } from "@/lib/utils";

export interface ProjectCardProps {
  project: Project;
  className?: string;
}

/**
 * A project at a glance, for the home page.
 *
 * The editorial `ProjectPanel` is the right artefact for `/work`, where someone
 * has chosen to browse the portfolio and wants enough to evaluate each entry
 * without opening it. On the home page it was the wrong one: four panels ran to
 * four full screens, a quarter of the entire page, and readers reported the
 * work section as endless. The home page's job is to prove the work exists and
 * send people to `/work`, not to be `/work`.
 *
 * So this carries only what a decision to click needs: the media, the name, the
 * one-line tagline, and what kind of product it is. Everything else lives one
 * click away.
 *
 * The whole card is the target, via a positioned overlay on the title's link
 * rather than a wrapping anchor. That keeps the accessible name to the project
 * name alone, instead of a screen reader reading out the tagline, the chips and
 * the media alt as one enormous link label.
 */
export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <article
      className={cn(
        "group border-hairline bg-raised hover:border-hairline-strong relative flex flex-col overflow-hidden rounded-2xl border transition-colors duration-[var(--dur-base)]",
        className,
      )}
    >
      {/*
        One ratio and one frame for every card, whatever its media is.
        Portfolio media ranges from 4:3 composites to 9:16 phone captures, so
        letting each card size itself leaves the grid ragged. The frame
        override matters just as much: a device-framed project keeps the phone
        shell's own max width and renders at half the card's, which is what
        made rows differ by 191px.

        4:3 AND `cover`, which between them mean nothing is ever cropped and
        nothing is ever letterboxed. That only works because every hero IS 4:3:
        a content test enforces it, and the alternative was worse in both
        directions. `cover` on a mismatched ratio sliced the wordmark off
        Zyuela and the top band off OurUmmah, because these are composed
        frames where the logo sits in one corner and the device in the other,
        so any crop takes something placed deliberately. `contain` avoided that
        and left pale letterbox bars down the sides instead, which read as a
        rendering fault rather than as a margin.

        So the ratio moved to the media rather than the media to the ratio:
        Zyuela's frame was cropped to 4:3 once, at the source, where a human
        could see what was being lost.
      */}
      <div className="bg-sunken overflow-hidden">
        <MediaFrame
          media={project.heroMedia}
          aspectOverride="4/3"
          frameOverride="bare"
          sizes="(min-width: 1024px) 44vw, 92vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-display-3">
            <Link
              href={caseStudyPath(project.slug)}
              className="focus-visible:outline-ring rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              {/* Covers the card, so the whole thing is clickable while the
                  link's accessible name stays just the project name. */}
              <span className="absolute inset-0 z-10" aria-hidden="true" />
              {project.name}
            </Link>
          </h3>
          <ArrowUpRight
            aria-hidden="true"
            className="text-muted-foreground group-hover:text-primary mt-1 size-5 shrink-0 transition-[color,transform] duration-[var(--dur-base)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>

        <p className="text-muted-foreground text-[0.9375rem] leading-snug">
          {project.tagline}
        </p>

        <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {[project.productType, project.industry].map((item) => (
            <li
              key={item}
              className="border-hairline text-mono-label text-muted-foreground rounded-full border px-2.5 py-1"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
