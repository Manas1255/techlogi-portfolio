import { Check, X } from "lucide-react";
import {
  PlaceholderNote,
  Reveal,
  Section,
  SectionIntro,
} from "@/components/marketing";
import { getContent, videoTestimonials } from "@/content";
import { getLocale, getTranslations } from "@/i18n/server";
import {
  VideoTestimonialPlaceholder,
  VideoTestimonialRail,
} from "./video-testimonial-rail";

/**
 * PROOF, in two halves that answer two different doubts.
 *
 * The left half is client video, because a named person saying it on camera is
 * close to the strongest evidence a site like this can carry. Right now there
 * is none, and rather than invent some, the rail renders as three empty
 * portrait frames and the section says so on the page. That is not a
 * compromise: "we publish a quote when a named person has approved it in
 * writing" is itself a trust signal, and a better one than two quotes
 * attributed to PLACEHOLDER, Company.
 *
 * The right half is what carries the section until the clips exist, and it is
 * why merging these two into one band was the right call rather than shipping
 * a thin, obviously-empty testimonial section on its own. Each line pairs the
 * thing a client is usually worried about with what we actually do, and every
 * answer is checkable elsewhere on this site, which was the test each one had
 * to pass to be here. It is about US on both sides and never about a named
 * competitor: "other agencies do X" is unfalsifiable and reads as insecurity.
 *
 * Semantically a definition list, because that is the relationship being
 * drawn. A table would imply a comparison across two subjects and there is
 * only one subject.
 */
export async function ProofSection() {
  const t = await getTranslations();
  const locale = await getLocale();
  const { differences } = getContent(locale);
  const videos = videoTestimonials(locale);
  const hasVideos = videos.length > 0;

  return (
    <Section surface="tint" rhythm="base">
      <SectionIntro
        index={4}
        eyebrow={t("proof.eyebrow")}
        title={t("proof.title")}
        lead={t("proof.lead")}
      />

      <div className="mt-12 grid gap-10 md:mt-14 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-14">
        <Reveal
          variant="lift"
          className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start"
        >
          <h3 className="text-eyebrow text-muted-foreground">
            {t("proof.inTheirWords")}
          </h3>

          {hasVideos ? (
            <VideoTestimonialRail
              items={videos.filter(
                (
                  testimonial,
                ): testimonial is typeof testimonial & {
                  video: NonNullable<typeof testimonial.video>;
                } => testimonial.video !== null,
              )}
            />
          ) : (
            <>
              <VideoTestimonialPlaceholder />
              <PlaceholderNote tone="panel">
                {t("proof.noQuotesYet")}
              </PlaceholderNote>
            </>
          )}
        </Reveal>

        <Reveal variant="fade" delay={80}>
          {/*
            TWO COLUMNS ON A PHONE IS ONE COLUMN, and that broke the argument.

            This is a comparison: the left half is how it usually goes, the
            right half is how we work, and the whole point is reading one
            against the other. Below `sm` the grid collapsed to a single
            column, which stacked the two HEADINGS at the top and then ran all
            twelve cells underneath as one flat list. A reader on a phone saw
            neither side as a side: the labels were detached from the items
            they labelled, and an X and a tick alternated down the page with
            nothing saying which was which.

            So the mobile layout is a different layout, not a narrower one.
            Each concern and its answer are GROUPED into one bordered pair, so
            the contrast reads vertically, item by item, which is the same
            argument turned ninety degrees. The two headings become a single
            legend that maps each mark to its side once, rather than two
            column headers with no columns under them.
          */}
          <div className="border-hairline overflow-hidden rounded-2xl border">
            {/* Phone: one legend line, because there are no columns to head. */}
            <div className="border-hairline text-eyebrow flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b px-5 py-3.5 sm:hidden">
              <span className="text-muted-foreground flex items-center gap-2">
                <X aria-hidden="true" className="size-3.5 shrink-0" />
                {t("proof.usualExperience")}
              </span>
              <span className="text-primary flex items-center gap-2">
                <Check aria-hidden="true" className="size-3.5 shrink-0" />
                {t("proof.howWeWork")}
              </span>
            </div>

            {/* Tablet and up: real column headers over real columns. */}
            <div className="border-hairline hidden border-b sm:grid sm:grid-cols-2">
              <p className="text-eyebrow text-muted-foreground border-hairline px-5 py-3.5 sm:border-r">
                {t("proof.usualExperience")}
              </p>
              <p className="text-eyebrow text-primary px-5 py-3.5">
                {t("proof.howWeWork")}
              </p>
            </div>

            <dl className="sm:grid sm:grid-cols-2">
              {differences.map((item, index) => (
                <div
                  key={item.concern}
                  /*
                    `contents` dissolves this wrapper so dt and dd land in the
                    grid directly. On a phone there is no grid, so the wrapper
                    stays a real box and becomes the thing that groups a pair.
                  */
                  className={[
                    "border-hairline sm:contents",
                    index < differences.length - 1 ? "max-sm:border-b" : "",
                  ].join(" ")}
                >
                  <dt
                    className={[
                      "border-hairline text-muted-foreground flex items-start gap-2.5 px-5 pt-4 text-[0.875rem] leading-snug max-sm:pb-2 sm:border-r sm:py-4",
                      index < differences.length - 1 ? "sm:border-b" : "",
                    ].join(" ")}
                  >
                    <X
                      aria-hidden="true"
                      className="text-muted-foreground/60 mt-0.5 size-3.5 shrink-0"
                    />
                    <span>{item.concern}</span>
                  </dt>
                  <dd
                    className={[
                      "border-hairline flex items-start gap-2.5 px-5 pb-4 text-[0.875rem] leading-snug max-sm:pt-0 sm:py-4",
                      index < differences.length - 1 ? "sm:border-b" : "",
                    ].join(" ")}
                  >
                    <Check
                      aria-hidden="true"
                      className="text-primary mt-0.5 size-3.5 shrink-0"
                    />
                    <span>{item.answer}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
