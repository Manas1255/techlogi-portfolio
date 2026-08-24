import { ClosingCta } from "@/components/sections";
import {
  Container,
  Eyebrow,
  PlaceholderNote,
  Reveal,
} from "@/components/marketing";
import { hasDraftCaseStudies, projects } from "@/content";
import { WorkFilters } from "./work-filters";

/**
 * `/work` — the portfolio index.
 *
 * The same editorial panels as the home page, at full length and filterable.
 * A grid of identical cards would be the easy answer and the wrong one: the
 * point of this page is that each project can be evaluated without opening it.
 */
export function WorkScreen() {
  return (
    <>
      <section className="wash-warm grain pt-32 pb-8 md:pt-40 md:pb-12">
        <Container>
          <div className="flex flex-col gap-6">
            <Reveal variant="fade">
              <Eyebrow>Selected work</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="text-display-1 max-w-4xl text-balance">
                {projects.length} products, built end to end and still running.
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-lead text-muted-foreground">
                Each case study covers the problem, the approach and the
                trade-offs — including the decisions we would make differently.
              </p>
            </Reveal>
            {hasDraftCaseStudies() && (
              <Reveal variant="fade" delay={180} className="max-w-2xl pt-2">
                <PlaceholderNote tone="panel">
                  These case studies are illustrative placeholders. The
                  structure, media and metrics are real components awaiting
                  real, cleared client work.
                </PlaceholderNote>
              </Reveal>
            )}
          </div>
        </Container>
      </section>

      <section className="pb-24 md:pb-32">
        <Container>
          <WorkFilters />
        </Container>
      </section>

      <ClosingCta
        origin="work-close"
        title="Your product could be the next one here."
        lead="Tell us what you're building. One question to start."
      />
    </>
  );
}
