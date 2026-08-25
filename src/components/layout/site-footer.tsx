import { AppLink as Link } from "@/components/layout/app-link";
import { APP_ROUTES, NAV_ITEMS, caseStudyPath } from "@/constants";
import { Container } from "@/components/marketing";
import { getContent } from "@/content";
import {
  publishedLegal,
  publishedLocations,
  publishedSocials,
  siteConfig,
} from "@/config/site";
import { BookCallButton } from "@/features/booking";
import { getLocale, getTranslations } from "@/i18n/server";
import type { MessageKey } from "@/i18n/types";
import { Logo } from "./logo";

/**
 * The footer, designed rather than defaulted.
 *
 * It closes the page with the same offer the header opens it with, then gives
 * every route a second, calmer entry point. Locations and social links render
 * only when they're real, an empty "Follow us" row or a placeholder office
 * address is worse than their absence.
 *
 * Labels resolve through `getTranslations()` rather than the client hook, so
 * the footer stays a Server Component: it is on every page, it renders a
 * navigation tree derived from content, and dragging it across the client
 * boundary for a handful of strings would ship all of that to the browser.
 */
export async function SiteFooter() {
  const t = await getTranslations();
  const { projects, serviceGroups } = getContent(await getLocale());
  const year = new Date().getFullYear();
  const socials = publishedSocials();
  const locations = publishedLocations();
  const selectedWork = projects.slice(0, 4);
  const legal = publishedLegal();

  return (
    <footer data-surface="slab" className="border-hairline border-t">
      <Container className="py-16 md:py-20">
        <div className="flex flex-col gap-14">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_2.2fr]">
            <div className="flex max-w-sm flex-col gap-5">
              <Logo />
              <p className="text-muted-foreground text-[0.9375rem] leading-relaxed">
                {t("site.description")}
              </p>
              <div className="flex flex-col gap-3 pt-1">
                <BookCallButton
                  origin="footer"
                  size="md"
                  className="self-start"
                />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="tap-target text-mono-label text-muted-foreground hover:text-foreground w-fit transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
                {siteConfig.contact.phone !== null && (
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="tap-target text-mono-label text-muted-foreground hover:text-foreground w-fit transition-colors"
                  >
                    {siteConfig.contact.phone}
                  </a>
                )}
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              <FooterColumn title={t("site.footer.navigation")}>
                {NAV_ITEMS.map((item) => (
                  <FooterLink key={item.href} href={item.href}>
                    {t(item.labelKey as MessageKey)}
                  </FooterLink>
                ))}
              </FooterColumn>

              <FooterColumn title={t("site.footer.capabilities")}>
                {serviceGroups.map((group) => (
                  <FooterLink
                    key={group.id}
                    href={`${APP_ROUTES.services}#${group.id}`}
                  >
                    {group.name}
                  </FooterLink>
                ))}
              </FooterColumn>

              <FooterColumn title={t("site.footer.selectedWork")}>
                {selectedWork.map((project) => (
                  <FooterLink
                    key={project.slug}
                    href={caseStudyPath(project.slug)}
                  >
                    {project.name}
                  </FooterLink>
                ))}
                <FooterLink href={APP_ROUTES.work}>
                  {t("site.allWork")}
                </FooterLink>
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
                        className="tap-target text-mono-label text-muted-foreground hover:text-foreground transition-colors"
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
              © {year} {siteConfig.legalName}. {t("site.footer.rights")}
            </p>
            <ul className="flex flex-wrap gap-6">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="tap-target text-mono-label text-muted-foreground hover:text-foreground transition-colors"
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
        className="tap-target text-muted-foreground hover:text-foreground focus-visible:outline-ring rounded-sm text-[0.9375rem] transition-colors duration-[var(--dur-fast)] focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        {children}
      </Link>
    </li>
  );
}
