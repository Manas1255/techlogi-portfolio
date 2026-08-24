import { Check, X } from "lucide-react";
import { Reveal, Section, SectionIntro } from "@/components/marketing";
import { differences } from "@/content";

/**
 * HOW WE ARE DIFFERENT.
 *
 * Side by side: the thing a client is usually worried about, against what we
 * actually do about it. It is about US on both sides and never about a named
 * competitor, because "other agencies do X" is unfalsifiable and reads as
 * insecurity rather than confidence.
 *
 * Every right-hand claim is checkable elsewhere on this site. That was the test
 * each line had to pass to be here, and it is what stops the section becoming
 * the usual wall of adjectives.
 *
 * Semantically a definition list: each concern is the term and each answer its
 * description, which is exactly the relationship being drawn. A table would
 * imply a comparison across two subjects, and there is only one subject here.
 */
export function DifferenceSection() {
  return (
    <Section surface="slab" rhythm="loose" className="wash-slab">
      <SectionIntro
        index={5}
        eyebrow="Why us"
        title="The parts of hiring a studio that usually go wrong."
        lead="Not a list of adjectives. Each of these is something you can check against the rest of this site before you talk to us."
      />

      <Reveal
        variant="lift"
        className="border-hairline mt-14 overflow-hidden rounded-2xl border"
      >
        <div className="border-hairline grid grid-cols-1 border-b sm:grid-cols-2">
          <p className="text-eyebrow text-muted-foreground border-hairline px-5 py-4 max-sm:border-b sm:border-r sm:px-7">
            The usual experience
          </p>
          <p className="text-eyebrow text-primary px-5 py-4 sm:px-7">
            How we work
          </p>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2">
          {differences.map((item, index) => (
            <div key={item.concern} className="contents">
              <dt
                className={[
                  "border-hairline text-muted-foreground flex items-start gap-3 px-5 py-5 text-[0.9375rem] leading-snug sm:border-r sm:px-7",
                  index < differences.length - 1 ? "border-b" : "",
                  "max-sm:border-b",
                ].join(" ")}
              >
                <X
                  aria-hidden="true"
                  className="text-muted-foreground/70 mt-0.5 size-4 shrink-0"
                />
                <span>{item.concern}</span>
              </dt>
              <dd
                className={[
                  "border-hairline flex items-start gap-3 px-5 py-5 text-[0.9375rem] leading-snug sm:px-7",
                  index < differences.length - 1 ? "border-b" : "",
                ].join(" ")}
              >
                <Check
                  aria-hidden="true"
                  className="text-primary mt-0.5 size-4 shrink-0"
                />
                <span>{item.answer}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
