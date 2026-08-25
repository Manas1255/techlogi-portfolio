import { AppLink as Link } from "@/components/layout/app-link";
import {
  CreditCard,
  Globe,
  LayoutDashboard,
  Monitor,
  Palette,
  Radio,
  Rocket,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import {
  Section,
  SectionIntro,
  Stagger,
  StaggerItem,
} from "@/components/marketing";
import { caseStudyPath } from "@/constants";
import { findProject, getContent } from "@/content";
import type { Capability } from "@/content";
import { BookCallButton } from "@/features/booking";
import { getLocale, getTranslations } from "@/i18n/server";

/**
 * WHAT WE BUILD.
 *
 * The portfolio proves we finished things. This answers the question that
 * comes before it: can these people build MY thing? A visitor whose project
 * does not resemble anything in the portfolio needs somewhere to recognise
 * themselves, and a grid of case studies is not it.
 *
 * Rewritten in the buyer's vocabulary rather than the studio's. The set used
 * to open with "Backends and APIs", which is a true description of the work
 * and not a thing anyone arrives looking for; a founder who needs an MVP built
 * does not see themselves in a card about data modelling. So: Websites. Mobile
 * apps. MVPs. Internal tools. The words people actually type.
 *
 * Eight cards where there were six, and each is roughly a third the height.
 * The previous version gave every card a drawn, animated diagram, which was
 * genuinely nice work and turned this into eight screens of illustration
 * standing between the visitor and the thing the page is asking them to do.
 * The diagrams are gone; the icons carry the same job at a twentieth of the
 * scroll.
 *
 * What has NOT changed is the constraint that makes the section worth
 * anything: every chip names a technology actually shipped, and every card
 * that can point at where it was shipped does. A card with no receipt stays
 * silent rather than borrowing another project's credibility, which is why two
 * of these eight carry no link.
 */

const ICONS: Record<Capability["icon"], LucideIcon> = {
  smartphone: Smartphone,
  server: Server,
  sparkles: Sparkles,
  monitor: Monitor,
  radio: Radio,
  palette: Palette,
  globe: Globe,
  "layout-dashboard": LayoutDashboard,
  "credit-card": CreditCard,
  wrench: Wrench,
  rocket: Rocket,
  shield: Shield,
};

export async function WhatWeBuild() {
  const t = await getTranslations();
  const locale = await getLocale();
  const { capabilities } = getContent(locale);

  return (
    <Section surface="tint" rhythm="base" id="capabilities">
      <SectionIntro
        index={2}
        eyebrow={t("whatWeBuild.eyebrow")}
        title={t("whatWeBuild.title")}
        lead={t("whatWeBuild.lead")}
        align="split"
        aside={
          <BookCallButton origin="what-we-build" size="md" variant="outline">
            {t("whatWeBuild.cta")}
          </BookCallButton>
        }
      />

      <Stagger
        as="ul"
        step={0.05}
        className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-4"
      >
        {capabilities.map((capability) => {
          const Icon = ICONS[capability.icon];
          const project =
            capability.projectSlug === null
              ? undefined
              : findProject(capability.projectSlug, locale);

          return (
            <StaggerItem
              as="li"
              key={capability.id}
              className="border-hairline bg-raised hover:border-hairline-strong flex flex-col gap-3.5 rounded-2xl border p-5 transition-colors duration-[var(--dur-base)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="border-hairline text-primary flex size-9 items-center justify-center rounded-xl border">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <span className="text-mono-label text-primary">
                  {capability.focus}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <h3 className="text-[1.0625rem] leading-snug font-medium">
                  {capability.name}
                </h3>
                <p className="text-muted-foreground text-[0.8125rem] leading-relaxed">
                  {capability.description}
                </p>
              </div>

              <ul className="flex flex-wrap gap-1.5 pt-1">
                {capability.chips.map((chip) => (
                  <li
                    key={chip.label}
                    className="border-hairline text-mono-label text-muted-foreground rounded-full border px-2 py-0.5"
                  >
                    {chip.label}
                  </li>
                ))}
              </ul>

              {project !== undefined && (
                <Link
                  href={caseStudyPath(project.slug)}
                  className="tap-target text-mono-label text-muted-foreground hover:text-foreground focus-visible:outline-ring border-hairline mt-auto w-full rounded-sm border-t pt-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  {t("whatWeBuild.shippedIn", { project: project.name })} →
                </Link>
              )}
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
