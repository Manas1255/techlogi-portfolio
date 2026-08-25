import {
  Container,
  Eyebrow,
  HairlineList,
  Reveal,
} from "@/components/marketing";
import { publishedLocations, siteConfig } from "@/config/site";
import {
  BookCallButton,
  ConfidentialityNote,
  OfferCountdown,
} from "@/features/booking";
import { InquiryLauncher } from "@/features/inquiry";
import { getTranslations } from "@/i18n/server";

/**
 * `/contact`, which now leads with the calendar.
 *
 * The page used to open on the inquiry's first question, which made it a
 * second front door into the same three-step form. It still is one, further
 * down, because some people would rather write than talk. But the heading and
 * the first control are the call: this is the route someone lands on when they
 * have already decided to make contact, and it is the worst possible place to
 * hand them a form and a wait.
 *
 * The brief's launcher is kept below it, unchanged. A duplicate contact form
 * would mean two implementations of validation, two success states, and one of
 * them rotting.
 *
 * Everything in the right column answers the questions people actually have
 * before getting in touch: who reads this, how fast do they reply, and what
 * should I say.
 */
export async function ContactScreen() {
  const t = await getTranslations();
  const locations = publishedLocations();

  return (
    <>
      <section
        data-surface="slab"
        className="wash-slab grain pt-32 pb-20 md:pt-40 md:pb-28"
      >
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
            <div className="flex flex-col gap-8">
              <Reveal variant="fade">
                <Eyebrow>{t("pages.contact.eyebrow")}</Eyebrow>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="text-display-1 text-balance">
                  {t("pages.contact.title")}
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="text-lead text-muted-foreground">
                  {t("pages.contact.lead")}
                </p>
              </Reveal>
              <Reveal
                variant="fade"
                delay={160}
                className="flex flex-col gap-4"
              >
                <BookCallButton
                  origin="contact-page"
                  size="lg"
                  className="w-fit"
                />
                <OfferCountdown autoStart />
              </Reveal>
              <Reveal variant="fade" delay={200}>
                <ConfidentialityNote />
              </Reveal>

              <Reveal
                variant="fade"
                delay={240}
                className="border-hairline flex flex-col gap-5 border-t pt-8"
              >
                <div className="flex flex-col gap-2">
                  <h2 className="text-display-3">
                    {t("pages.contact.orBriefTitle")}
                  </h2>
                  <p className="text-muted-foreground text-[0.9375rem] leading-relaxed">
                    {t("pages.contact.orBriefLead")}
                  </p>
                </div>
                <InquiryLauncher origin="contact-page" columns={2} />
              </Reveal>
            </div>

            <Reveal delay={120} className="flex flex-col gap-10">
              <div className="border-hairline flex flex-col gap-4 border-t pt-6">
                <h2 className="text-eyebrow text-muted-foreground">
                  {t("pages.contact.preferEmail")}
                </h2>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="tap-target text-display-3 hover:text-primary focus-visible:outline-ring w-fit rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  {siteConfig.contact.email}
                </a>
                {siteConfig.contact.phone !== null && (
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="tap-target text-muted-foreground hover:text-foreground w-fit text-sm transition-colors"
                  >
                    {siteConfig.contact.phone}
                  </a>
                )}
                <p className="text-muted-foreground text-sm">
                  {t("contact.responseTime")}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-eyebrow text-muted-foreground">
                  {t("pages.contact.whatHelps")}
                </h2>
                <HairlineList
                  items={[
                    t("pages.contact.whatHelps1"),
                    t("pages.contact.whatHelps2"),
                    t("pages.contact.whatHelps3"),
                    t("pages.contact.whatHelps4"),
                  ]}
                />
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-eyebrow text-muted-foreground">
                  {t("pages.contact.whatNext")}
                </h2>
                <HairlineList
                  numbered
                  items={[
                    t("pages.contact.whatNext1"),
                    t("pages.contact.whatNext2"),
                    t("pages.contact.whatNext3"),
                    t("pages.contact.whatNext4"),
                  ]}
                />
              </div>

              {locations.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-eyebrow text-muted-foreground">
                    {t("pages.contact.whereWeAre")}
                  </h2>
                  <ul className="flex flex-col gap-3">
                    {locations.map((location) => (
                      <li key={location.label} className="flex flex-col gap-1">
                        <span className="text-[0.9375rem]">
                          {location.label}
                        </span>
                        {location.address !== null && (
                          <span className="text-muted-foreground text-sm">
                            {location.address}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
