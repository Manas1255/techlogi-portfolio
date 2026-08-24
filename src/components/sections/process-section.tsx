import { Reveal, Section, SectionIntro } from "@/components/marketing";
import { processStages } from "@/content";

/**
 * PROCESS — what happens, and what the client receives.
 *
 * Not a numbered train track. Each stage is a row in a hairline table: the
 * stage, what actually happens, and the deliverables — because "what do I get
 * at the end of this phase" is the question a buyer is really asking, and a
 * stage with no answer to it is a meeting.
 *
 * Rows are ordered and semantic (`<ol>`), and the stage index is decoration
 * rather than content, so a screen reader hears the list structure rather than
 * a stream of numbers.
 */
export function ProcessSection() {
  return (
    <Section rhythm="loose" divided id="process">
      <SectionIntro
        index={4}
        eyebrow="How we work"
        title="From a conversation to something running in production."
        lead="Seven stages. Each one ends in something you can hold — a document, a prototype, a deployment — rather than a status update."
      />

      <ol className="border-hairline mt-14 flex flex-col border-t">
        {processStages.map((stage, index) => (
          <Reveal
            key={stage.id}
            as="li"
            delay={Math.min(index * 40, 160)}
            className="border-hairline grid gap-5 border-b py-8 md:grid-cols-[8rem_1fr_1fr] md:gap-10 md:py-10"
          >
            <div className="flex items-baseline gap-3 md:flex-col md:gap-2">
              <span className="text-mono-label text-primary" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-display-3">{stage.name}</h3>
              <span className="text-mono-label text-muted-foreground md:mt-1">
                {stage.duration}
              </span>
            </div>

            <p className="text-marketing-body text-muted-foreground">
              {stage.what}
            </p>

            <div className="flex flex-col gap-2.5">
              <p className="text-eyebrow text-muted-foreground">You receive</p>
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
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
