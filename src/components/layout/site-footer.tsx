import Link from "next/link";
import { APP_ROUTES, NAV_ITEMS, caseStudyPath } from "@/constants";
import { Container } from "@/components/marketing";
import { projects, serviceGroups } from "@/content";
import {
  publishedLocations,
  publishedSocials,
  siteConfig,
} from "@/config/site";
import { InquiryTrigger } from "@/features/inquiry";
import { SOURCE_LOCALE } from "@/i18n/locales";
import { translate } from "@/i18n/translate";
import type { MessageKey } from "@/i18n/types";
import { Logo } from "./logo";

/**
 * The footer, designed rather than defaulted.
 *
 * It closes the page with the same offer the header opens it with, then gives
 * every route a second, calmer entry point. Locations and social links render
 * only when they're real — an empty "Follow us" row or a placeholder office
 * address is worse than their absence.
 *
 * A Server Component: nothing here needs the client except the inquiry trigger.
 * Labels resolve through `translate(SOURCE_LOCALE, …)` rather than the client
 * `useTranslations` hook — a server component renders the source locale, and
 * the catalog is the single source of truth for the string either way.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const socials = publishedSocials();
  const locations = publishedLocations();
  const selectedWork = projects.slice(0, 4);

  return (
    <footer data-surface="slab" className="border-hairline border-t">
      <Container className="py-16 md:py-20">
        <div className="flex flex-col gap-14">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_2.2fr]">
            <div className="flex max-w-sm flex-col gap-5">
              <Logo />
              <p className="text-muted-foreground text-[0.9375rem] leading-relaxed">
                {siteConfig.tagline}
              </p>
              <div className="flex flex-col gap-3 pt-1">
                <InquiryTrigger origin="footer" className="self-start" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-mono-label text-muted-foreground hover:text-foreground w-fit transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
                {siteConfig.contact.phone !== null && (
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="text-mono-label text-muted-foreground hover:text-foreground w-fit transition-colors"
                  >
                    {siteConfig.contact.phone}
                  </a>
                )}
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              <FooterColumn title="Navigation">
                {NAV_ITEMS.map((item) => (
                  <FooterLink key={item.href} href={item.href}>
                    {translate(SOURCE_LOCALE, item.labelKey as MessageKey)}
                  </FooterLink>
                ))}
              </FooterColumn>

              <FooterColumn title="Capabilities">
                {serviceGroups.map((group) => (
                  <FooterLink
                    key={group.id}
                    href={`${APP_ROUTES.services}#${group.id}`}
                  >
                    {group.name}
                  </FooterLink>
                ))}
              </FooterColumn>

              <FooterColumn title="Selected work">
                {selectedWork.map((project) => (
                  <FooterLink
                    key={project.slug}
                    href={caseStudyPath(project.slug)}
                  >
                    {project.name}
                  </FooterLink>
                ))}
                <FooterLink href={APP_ROUTES.work}>All work</FooterLink>
              </FooterColumn>
            </div>
          </div>

          {(socials.length > 0 || locations.length > 0) && (
            <div className="border-hairline flex flex-wrap items-start justify-between gap-8 border-t pt-8">
              {locations.length > 0 && (
                <ul className="flex flex-wrap gap-x-10 gap-y-3">
                  {locations.map((location) => (
                    <li key={location.label} className="flex flex-col gap-1">
                      <span className="text-mono-label text-foreground">
                        {location.label}
                      </span>
                      {location.address !== null && (
                        <span className="text-muted-foreground text-xs">
                          {location.address}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {socials.length > 0 && (
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-mono-label text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="border-hairline flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-mono-label text-muted-foreground">
              © {year} {siteConfig.legalName}. All rights reserved.
            </p>
            <ul className="flex flex-wrap gap-6">
              {siteConfig.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-mono-label text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-eyebrow text-muted-foreground">{title}</h2>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-muted-foreground hover:text-foreground focus-visible:outline-ring rounded-sm text-[0.9375rem] transition-colors duration-[var(--dur-fast)] focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        {children}
      </Link>
    </li>
  );
}
