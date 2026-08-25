import { Clock3, MessageSquareText, Repeat2 } from "lucide-react";
import { Container, Reveal } from "@/components/marketing";
import { BookCallButton, OfferCountdown } from "@/features/booking";
import { QuickBriefForm } from "@/features/inquiry";
import { getTranslations } from "@/i18n/server";

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
 *   · The inline form is still HERE, in the right-hand column, because the
 *     people who will write but will not commit to a slot at first contact
 *     are worth keeping. What changed is that it is four fields on one screen
 *     rather than the entrance to a three-step wizard.
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
            THE BRIEF, back above the fold and back on one screen.

            It was removed in favour of a booking-only hero, and that lost the
            people who will type but will not commit to a slot at first
            contact. It came back as four fields rather than the wizard,
            because the wizard is what made the written path feel like the
            long way round. Booking is still the primary action, in brass,
            first in the reading order; this is the alternative sitting beside
            it rather than a step behind a button.

            Sticky on desktop so it stays with the reader as the copy column
            settles beside it.
          */}
          <Reveal variant="lift" delay={100} className="lg:sticky lg:top-28">
            <QuickBriefForm origin="hero" />
          </Reveal>
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
