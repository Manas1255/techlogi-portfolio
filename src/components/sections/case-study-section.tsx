import { HairlineList, Reveal } from "@/components/marketing";
import { MediaFrame } from "@/components/media";
import type { CaseStudySection as CaseStudySectionData } from "@/content";

const LABELS: Record<CaseStudySectionData["kind"], string> = {
  problem: "The problem",
  approach: "The approach",
  design: "Design",
  build: "Build",
  result: "Result",
};

export interface CaseStudySectionProps {
  section: CaseStudySectionData;
  index: number;
}

/**
 * ONE case-study block, rendered from data.
 *
 * Every case study is the same five-block arc, problem, approach, design,
 * build, result, so adding a new one is a data edit plus media, never a
 * bespoke page. The block decides its own composition from what it was given:
 * with media it goes two-column, without it stays a reading column, which is
 * what keeps a text-heavy section from looking like a broken one.
 */
export function CaseStudySection({ section, index }: CaseStudySectionProps) {
  const hasMedia = section.media !== null;

  return (
    <Reveal
      as="section"
      variant="lift"
      className="border-hairline grid gap-8 border-t pt-10 md:grid-cols-[10rem_1fr] md:gap-12 md:pt-12"
      aria-labelledby={`case-${section.kind}`}
    >
      <div className="flex items-baseline gap-3 md:flex-col md:gap-2">
        <span className="text-mono-label text-primary" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="text-eyebrow text-muted-foreground">
          {LABELS[section.kind]}
        </p>
      </div>

      <div className="flex flex-col gap-7">
        <h2
          id={`case-${section.kind}`}
          className="text-display-2 max-w-3xl text-balance"
        >
          {section.title}
        </h2>

        <div className={hasMedia ? "grid gap-10 lg:grid-cols-2" : ""}>
          <div className="flex flex-col gap-5">
            {section.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-marketing-body text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
            {section.points.length > 0 && (
              <HairlineList items={section.points} className="mt-2" />
            )}
          </div>

          {section.media !== null && (
            <div className="lg:pt-1">
              <MediaFrame
                media={section.media}
                sizes="(min-width: 1024px) 42vw, 92vw"
              />
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}
