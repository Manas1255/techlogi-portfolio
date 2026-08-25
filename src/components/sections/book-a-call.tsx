import { CalendarCheck, FileUp, Mail, MessagesSquare } from "lucide-react";
import { Container, Eyebrow, Reveal } from "@/components/marketing";
import { isBookingLive, siteConfig } from "@/config/site";
import {
  BookCallButton,
  CalEmbed,
  ConfidentialityNote,
  OfferCountdown,
} from "@/features/booking";
import { InquiryTrigger } from "@/features/inquiry";
import { getTranslations } from "@/i18n/server";

const WHAT_HAPPENS = [
  { icon: CalendarCheck, key: "slot" },
  { icon: MessagesSquare, key: "prepared" },
  { icon: FileUp, key: "bring" },
] as const;

export interface BookACallProps {
  /** Where on the site this instance sits, carried into the booking payload. */
  origin: string;
  title?: string;
  lead?: string;
  /**
   * Mount the scheduler itself. True on the home page, where this is the end
   * of the argument and the visitor has nothing left to do. False on the
   * sub-pages, where a second full calendar per route is weight paid by
   * everyone to serve the few who reach the bottom of `/about`.
   */
  withScheduler?: boolean;
}

/**
 * THE CLOSE.
 *
 * Not "Ready to get started?", not a contact form, and no longer "Tell us what
 * you're building" over four dialog steps. The close is the calendar itself:
 * the visitor has read the work, read the process and read the proof, and the
 * only thing left is to pick a time.
 *
 * That is the difference between ending a page with an appointment and ending
 * it with a request. Every version of this section before now finished by
 * asking the visitor to compose something and then wait, which put the slowest
 * possible step at the exact moment they were most willing.
 *
 * Everything around the scheduler is there to remove a specific reason not to
 * press it, and nothing else is:
 *
 *   · the countdown, because a real 25% is worth naming, and it is `panel`
 *     here so the code and what it applies to are both stated
 *   · confidentiality, because "they'll steal my idea" is the objection nobody
 *     says out loud and the one that stops the most people
 *   · the brief, because some people would genuinely rather write than talk,
 *     and losing them to a calendar-only page is a worse trade than one extra
 *     link
 *
 * The scheduler is lazy and reserves its own height; see `CalEmbed`.
 */
export async function BookACall({
  origin,
  title,
  lead,
  withScheduler = false,
}: BookACallProps) {
  const t = await getTranslations();
  // The unconfigured embed already offers the brief and the inbox in its own
  // panel, so repeating both underneath would be the same two links twice.
  const showWrittenPath = isBookingLive() || !withScheduler;

  return (
    <section
      data-surface="slab"
      className="wash-slab grain relative overflow-hidden py-20 md:py-28"
      id="book"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
          {/*
            The left column is deliberately SHORT and sticky: the offer, and
            nothing else. Everything that answers "what happens if I press it"
            moved right, into the card, because it all belongs to the same
            question and splitting it across two columns is what left the
            band with a tall stack on one side and a dead quadrant on the
            other.
          */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
            <Reveal className="flex flex-col gap-5">
              <Eyebrow index={6}>{t("bookACall.eyebrow")}</Eyebrow>
              <h2 className="text-display-1 text-balance">
                {title ?? t("bookACall.title")}
              </h2>
              <p className="text-lead text-muted-foreground">
                {lead ?? t("bookACall.lead")}
              </p>
            </Reveal>

            <Reveal variant="fade" delay={60}>
              {/* Not `autoStart`: by the time someone reaches the bottom of the
                  page their window began long ago, in the hero. Starting it
                  again here is exactly the reset the whole design refuses. */}
              <OfferCountdown tone="panel" />
            </Reveal>
          </div>

          {/*
            ONE card, divided by hairlines. It was four separate bordered
            boxes floating on the ink, each a slightly different size, which
            read as a dashboard rather than as the end of an argument.
          */}
          <Reveal
            variant="lift"
            delay={80}
            className="border-hairline bg-raised overflow-hidden rounded-3xl border"
          >
            {/*
              The scheduler MOUNTS ON THE HOME PAGE ONLY. Cal.com's embed is a
              third-party iframe with its own scripts, and loading one at the
              foot of every route to serve the fraction of visitors who reach
              it is weight paid by everyone. Elsewhere the same slot is a
              control, which is one click and no third party.
            */}
            {withScheduler ? (
              <CalEmbed bare />
            ) : (
              <div className="flex flex-col items-start gap-5 p-7 sm:p-8">
                <span className="border-hairline text-primary flex size-11 items-center justify-center rounded-2xl border">
                  <CalendarCheck aria-hidden="true" className="size-5" />
                </span>
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-display-3">{t("bookACall.title")}</h3>
                  <p className="text-muted-foreground max-w-md text-[0.9375rem] leading-relaxed">
                    {t("bookACall.lead")}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
                  <BookCallButton origin={origin} size="md" />
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="tap-target text-muted-foreground hover:text-foreground focus-visible:outline-ring inline-flex items-center gap-2 rounded-sm text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    <Mail aria-hidden="true" className="size-4" />
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>
            )}

            <ul className="border-hairline grid gap-7 border-t p-7 sm:grid-cols-3 sm:p-8">
              {WHAT_HAPPENS.map(({ icon: Icon, key }) => (
                <li key={key} className="flex flex-col gap-2.5">
                  <span className="border-hairline text-primary flex size-9 items-center justify-center rounded-xl border">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                  <span className="text-[0.9375rem] font-medium">
                    {t(
                      `bookACall.whatHappens.${key}.title` as "bookACall.whatHappens.slot.title",
                    )}
                  </span>
                  <span className="text-muted-foreground text-[0.8125rem] leading-relaxed">
                    {t(
                      `bookACall.whatHappens.${key}.body` as "bookACall.whatHappens.slot.body",
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-hairline flex flex-col gap-5 border-t p-7 sm:p-8">
              <ConfidentialityNote tone="panel" />

              <div className="border-hairline flex flex-col gap-2.5 border-t pt-5">
                <p className="text-mono-label text-muted-foreground flex items-start gap-2.5">
                  <MessagesSquare
                    aria-hidden="true"
                    className="text-primary mt-px size-3.5 shrink-0"
                  />
                  {t("contact.responseTime")}
                </p>
                {showWrittenPath && (
                  <p className="text-mono-label text-muted-foreground">
                    {t("bookACall.preferToWrite")}{" "}
                    <InquiryTrigger
                      origin={`${origin}-brief`}
                      variant="link"
                      size="sm"
                      className="text-foreground hover:text-primary h-auto p-0 text-[0.75rem] font-normal underline underline-offset-4"
                    >
                      {t("inquiry.trigger")}
                    </InquiryTrigger>{" "}
                    {t("bookACall.withYourFiles")}{" "}
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="tap-target text-foreground hover:text-primary underline underline-offset-4 transition-colors"
                    >
                      {siteConfig.contact.email}
                    </a>
                    .
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
