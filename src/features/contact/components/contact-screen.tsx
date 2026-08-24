import {
  Container,
  Eyebrow,
  HairlineList,
  Reveal,
} from "@/components/marketing";
import { publishedLocations, siteConfig } from "@/config/site";
import { InquiryLauncher } from "@/features/inquiry";

/**
 * `/contact` — the inquiry, given a page of its own.
 *
 * It is the same interaction as everywhere else: the first question inline,
 * then the dialog. A duplicate contact form would mean two implementations of
 * validation, two success states, and one of them rotting.
 *
 * Everything beside it answers the questions people actually have before
 * writing in: who reads this, how fast do they reply, and what should I say.
 */
export function ContactScreen() {
  const locations = publishedLocations();

  return (
    <>
      <section className="wash-warm grain pt-32 pb-20 md:pt-40 md:pb-28">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
            <div className="flex flex-col gap-8">
              <Reveal variant="fade">
                <Eyebrow>Start a project</Eyebrow>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="text-display-1 text-balance">
                  Tell us what you&apos;re building.
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="text-lead text-muted-foreground">
                  Start with one question. Four short steps in total — and you
                  can close it and come back without losing anything.
                </p>
              </Reveal>
              <Reveal variant="fade" delay={180}>
                <InquiryLauncher origin="contact-page" columns={2} />
              </Reveal>
            </div>

            <Reveal delay={120} className="flex flex-col gap-10">
              <div className="border-hairline flex flex-col gap-4 border-t pt-6">
                <h2 className="text-eyebrow text-muted-foreground">
                  Prefer email
                </h2>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-display-3 hover:text-primary focus-visible:outline-ring w-fit rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  {siteConfig.contact.email}
                </a>
                {siteConfig.contact.phone !== null && (
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="text-muted-foreground hover:text-foreground w-fit text-sm transition-colors"
                  >
                    {siteConfig.contact.phone}
                  </a>
                )}
                <p className="text-muted-foreground text-sm">
                  {siteConfig.contact.responseTime}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-eyebrow text-muted-foreground">
                  What helps us reply usefully
                </h2>
                <HairlineList
                  items={[
                    "The problem, before the feature list",
                    "What exists today — a system, a spreadsheet, or nothing yet",
                    "Who uses it, and where they are when they do",
                    "Any date that actually matters, and why",
                  ]}
                />
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-eyebrow text-muted-foreground">
                  What happens next
                </h2>
                <HairlineList
                  numbered
                  items={[
                    "A person reads it — no auto-responder, no sequence",
                    "We reply within one business day, usually with questions",
                    "A 30-minute call if it looks like a fit, no deck",
                    "A written scope and estimate, with the assumptions attached",
                  ]}
                />
              </div>

              {locations.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-eyebrow text-muted-foreground">
                    Where we are
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
