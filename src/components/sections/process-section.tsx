import { Reveal, Section, SectionIntro } from "@/components/marketing";
import { processStages } from "@/content";

/**
 * PROCESS.
 *
 * A spine with numbered nodes, stages alternating either side of it. The
 * previous version was a three-column table, which read as a specification
 * rather than as a sequence: a buyer wants to see that this has a shape and a
 * direction, and a table has neither.
 *
 * Each stage still leads with what the client RECEIVES, because that is the
 * part being evaluated. A stage with no deliverable is a meeting, and the
 * commonest failure of a process section is listing seven of them.
 *
 * The alternation is decorative and desktop-only. Below `lg` everything sits in
 * one column to the right of the spine, because a zig-zag on a phone is just a
 * column with wasted margins and a longer scroll.
 *
 * Semantically an ordered list, so the sequence survives without the spine: the
 * numbers are drawn as decoration and hidden from assistive technology, which
 * announces the position from the list itself.
 */
export function ProcessSection() {
  return (
    <Section rhythm="loose" id="process">
      <SectionIntro
        index={6}
        eyebrow="How we work"
        title="From a conversation to something running in production."
        lead="Seven stages. Each one ends in something you can hold, a document, a prototype, a deployment, rather than a status update."
      />

      <ol className="relative mt-16 flex flex-col gap-10 md:mt-20 md:gap-14">
        {/* The spine. Left-aligned on small screens, centred from lg. It draws
            downward as the section arrives; see the reveal rules in globals. */}
        <Reveal
          as="span"
          variant="fade"
          data-spine=""
          aria-hidden="true"
          className="bg-hairline-strong absolute inset-y-0 left-[15px] w-px lg:left-1/2 lg:-translate-x-1/2"
        />

        {processStages.map((stage, index) => {
          const isRight = index % 2 === 1;
          return (
            <Reveal
              as="li"
              key={stage.id}
              variant="fade"
              data-stage=""
              // Each stage slides in from the side it lives on, so the
              // sequence reads as a direction rather than a stack.
              style={
                {
                  "--stage-from": isRight ? "28px" : "-28px",
                } as React.CSSProperties
              }
              className="relative grid grid-cols-[2rem_1fr] gap-x-5 lg:grid-cols-2 lg:gap-x-16"
            >
              {/* The node. Sits on the spine at both breakpoints. */}
              <span
                data-stage-node=""
                aria-hidden="true"
                className="bg-primary text-primary-foreground text-mono-label z-10 flex size-8 items-center justify-center rounded-lg font-medium lg:absolute lg:left-1/2 lg:-translate-x-1/2"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div
                data-stage-card=""
                className={[
                  "border-hairline bg-raised flex flex-col gap-4 rounded-2xl border p-6 sm:p-7",
                  isRight ? "lg:col-start-2 lg:ml-8" : "lg:col-start-1 lg:mr-8",
                ].join(" ")}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-display-3">{stage.name}</h3>
                  <span className="text-mono-label text-muted-foreground">
                    {stage.duration}
                  </span>
                </div>

                <p className="text-muted-foreground text-[0.9375rem] leading-relaxed">
                  {stage.what}
                </p>

                <div className="border-hairline flex flex-col gap-2.5 border-t pt-4">
                  <p className="text-eyebrow text-muted-foreground">
                    You receive
                  </p>
                  <ul className="flex flex-col gap-2">
                    {stage.receives.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-[0.9375rem] leading-snug"
                      >
                        <span
                          aria-hidden="true"
                          className="bg-primary mt-2 size-1 shrink-0 rounded-full"
                        />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
