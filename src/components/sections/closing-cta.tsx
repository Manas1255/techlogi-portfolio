import { Container, Eyebrow, Reveal } from "@/components/marketing";
import { siteConfig } from "@/config/site";
import { InquiryLauncher } from "@/features/inquiry";

export interface ClosingCtaProps {
  /** Where on the site this instance sits — carried into the inquiry payload. */
  origin: string;
  title?: string;
  lead?: string;
}

/**
 * THE CLOSE.
 *
 * Not "Ready to get started?" and not a link to a contact page — the close IS
 * the first question of the inquiry, inline. Choosing here opens the drawer
 * already on step two, so the visitor never answers the same question twice.
 *
 * That is the difference between ending a page with an interaction and ending
 * it with a request.
 */
export function ClosingCta({
  origin,
  title = "Tell us what you're building.",
  lead = "One question to start. Four short steps in total, and a person reads every one.",
}: ClosingCtaProps) {
  return (
    <section
      data-surface="ink"
      className="grain border-hairline relative overflow-hidden border-t py-24 md:py-36"
    >
      <Container>
        <div className="flex flex-col gap-10">
          <Reveal className="flex flex-col gap-5">
            <Eyebrow>Start a project</Eyebrow>
            <h2 className="text-display-1 max-w-4xl text-balance">{title}</h2>
            <p className="text-lead text-muted-foreground">{lead}</p>
          </Reveal>

          <Reveal variant="fade" delay={80}>
            <InquiryLauncher origin={origin} columns={4} />
          </Reveal>

          <Reveal variant="fade" delay={140}>
            <p className="text-mono-label text-muted-foreground">
              {siteConfig.contact.responseTime} Or email us directly at{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-foreground hover:text-primary underline underline-offset-4 transition-colors"
              >
                {siteConfig.contact.email}
              </a>
              .
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
