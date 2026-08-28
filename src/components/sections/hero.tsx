import { Clock3, MessageSquareText, Repeat2 } from "lucide-react";
import { AppLink as Link } from "@/components/layout/app-link";
import { ArrowLink, Container, Reveal } from "@/components/marketing";
import { MediaFrame } from "@/components/media";
import { caseStudyPath } from "@/constants";
import { findProject } from "@/content";
import { BookCallButton, OfferCountdown } from "@/features/booking";
import { getLocale, getTranslations } from "@/i18n/server";

/** The product the hero leads with. A data edit, not a layout one. */
const SHOWCASE_SLUG = "tatunow";

/**
 * THE HERO.
 *
 * Rewritten around one decision: the visitor's next action is booking a call,
 * not filling in a form. The old hero put a four-field inquiry above the fold,
 * which was a good answer to the wrong question. A form asks someone to
 * compose a message and then wait; the wait is the part that loses them, and
 * no amount of form design shortens it. A calendar does.
 *
 * What went, and why:
 *
 *   · The "Product engineering studio" chip. It spent the most valuable line
 *     on the page describing our category to someone who has not yet been told
 *     what we make. The headline now does both jobs.
 *   · Three sentences of subhead, down to one. The previous lead listed four
 *     product types and two guarantees before the first full stop, which is
 *     the paragraph you write when you have not decided what matters.
 *   · THE FORM, which used to sit in the right-hand column. A form in the
 *     first screen answers a question nobody has asked yet. Before a visitor
 *     knows what we make, a row of empty fields reads as "we want something
 *     from you", and the three seconds it takes to decide that are the three
 *     seconds available. The brief still exists and is still one click away
 *     behind every booking control; it is just no longer the first thing on
 *     the page.
 *
 *     What took its place is the work itself. Shipped product, on a phone, in
 *     the same instant the headline claims we build them: the claim and its
 *     evidence in one glance, which is the fastest thing a page can do. It
 *     links into the case study, so curiosity has somewhere to go that is not
 *     a form.
 *   · The lead project frame, a full-measure shot of one case study sitting
 *     under the copy. It was doing the product strip's job one band early and
 *     doing it worse: the strip below shows six real products in a fifth of
 *     the height, and the frame pushed the three answers most of a screen
 *     further down for a second look at something the visitor sees again in
 *     Selected Work. Proof belongs to the strip; the hero states the offer.
 *
 * The section sits on the SLAB. The site is otherwise light-first, and this is
 * one of the two dark bands the rhythm allows: opening on graphite makes the
 * app icons in the strip below it glow rather than sit, and it is what buys
 * the page its premium register in the first second, before a word is read.
 *
 * Three answers under the fold, not four. Each names a mechanism rather than a
 * virtue, because "we're reliable" is what everyone writes and "a running
 * build every second week" is checkable.
 */

const ANSWERS = [
  { icon: Clock3, key: "talk" },
  { icon: Repeat2, key: "ship" },
  { icon: MessageSquareText, key: "straight" },
] as const;

export async function Hero() {
  const t = await getTranslations();
  const locale = await getLocale();
  /*
    Resolved rather than assumed, and `undefined` is handled rather than
    asserted away. If the slug above is ever renamed or the project retired,
    the column simply collapses and the hero keeps working, instead of the
    home page throwing on a missing case study.
  */
  const showcase = findProject(SHOWCASE_SLUG, locale);

  return (
    <section
      data-surface="slab"
      className="wash-slab grain relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20"
    >
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-16">
          <div className="flex flex-col gap-7">
            <Reveal>
              <h1 className="text-hero text-balance">
                <span className="mask-line">
                  <span>{t("hero.line1")}</span>
                </span>
                <span className="mask-line">
                  <span>
                    {t("hero.line2")}{" "}
                    <span className="text-primary">{t("hero.accent")}</span>.
                  </span>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={60}>
              <p className="text-lead text-muted-foreground">
                {t("hero.lead")}
              </p>
            </Reveal>

            <Reveal delay={120} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <BookCallButton origin="hero" size="lg" />
              </div>
              {/* Starts the offer window: this is the first booking surface a
                  visitor reaches, and the clock should time their decision
                  rather than their reading. */}
              <OfferCountdown autoStart />
            </Reveal>
          </div>

          {/*
            THE WORK, where the form used to be.

            TatuNow deliberately, and not only because it is recent: its own
            brand is black and brass, which is this site's palette, so it
            lands on the graphite band looking placed rather than pasted. A
            composite whose colours fought the ground would read as a
            screenshot dropped into a design; this one reads as the design.

            The whole thing is one link into the case study. Someone who has
            just been told we build apps and is looking at one has exactly one
            question, and the answer is a case study, not a text field.
          */}
          {showcase !== undefined && (
            <Reveal variant="lift" delay={100} className="flex flex-col gap-4">
              {/*
                `aria-hidden` and out of the tab order, with the named link
                below carrying the destination. Both go to the same case
                study, and the site's convention (see `ProjectPanel`) is that a
                picture and its title never announce the same href twice. A
                link wrapping only an image is also how you end up with a
                control whose accessible name is nothing at all, which is what
                the sweep caught here.
              */}
              <Link
                href={caseStudyPath(showcase.slug)}
                tabIndex={-1}
                aria-hidden="true"
                className="group/showcase focus-visible:outline-ring rounded-frame block focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {/*
                  A brass wash behind the frame, so a light composite on a dark
                  band has something to sit in rather than floating as a bright
                  rectangle. `-z-10`, so it never intercepts the click that
                  belongs to the link.

                  `inset-0`, NOT a negative inset. A box bleeding 24px past its
                  parent is 48px of layout the hero's `overflow-hidden` then
                  clips, which the sweep correctly reports as content with no
                  way to reveal it. The blur spreads the glow outward on its
                  own without the box ever leaving the frame.
                */}
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="bg-primary/25 absolute inset-0 -z-10 rounded-[3rem] blur-3xl"
                  />
                  <MediaFrame
                    media={showcase.heroMedia}
                    sizes="(min-width: 1024px) 44vw, 92vw"
                    priority
                    className="transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out-expo)] group-hover/showcase:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover/showcase:translate-y-0"
                  />
                </div>
              </Link>

              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="text-mono-label text-muted-foreground">
                  {t("hero.showcase")}
                </p>
                <ArrowLink href={caseStudyPath(showcase.slug)} size="sm">
                  {showcase.name}
                </ArrowLink>
              </div>
            </Reveal>
          )}
        </div>

        <Reveal
          variant="fade"
          delay={220}
          className="border-hairline mt-14 border-t pt-7 md:mt-20"
        >
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-3">
            {ANSWERS.map(({ icon: Icon, key }) => (
              <div key={key} className="flex items-start gap-3">
                <Icon
                  aria-hidden="true"
                  className="text-primary mt-0.5 size-4 shrink-0"
                />
                <div className="flex flex-col gap-0.5">
                  <dt className="text-[0.9375rem] font-medium">
                    {t(
                      `hero.answers.${key}.label` as "hero.answers.talk.label",
                    )}
                  </dt>
                  <dd className="text-muted-foreground text-[0.8125rem] leading-snug">
                    {t(
                      `hero.answers.${key}.detail` as "hero.answers.talk.detail",
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
