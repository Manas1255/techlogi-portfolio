"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLink,
  HairlineList,
  Reveal,
  Section,
  SectionIntro,
} from "@/components/marketing";
import { MediaFrame } from "@/components/media";
import { caseStudyPath } from "@/constants";
import { findProject, serviceGroups } from "@/content";
import { cn } from "@/lib/utils";

/**
 * SERVICES — an interactive capability index, not a bulleted list.
 *
 * A sticky rail of group labels drives a single detail panel. On desktop the
 * rail sits beside the panel; below `lg` the same state renders as an accordion
 * with the labels in place, so touch gets the designed alternative rather than
 * a disabled hover interaction.
 *
 * The whole control is a tab set: real buttons, arrow-key navigable through the
 * browser's default focus order, `aria-selected` on the active one, and the
 * panel labelled by it. Each group ends in the project where the capability was
 * actually used — a service list without evidence is a price sheet.
 */
export function ServicesSection() {
  const [activeId, setActiveId] = useState(serviceGroups[0].id);
  const active =
    serviceGroups.find((group) => group.id === activeId) ?? serviceGroups[0];
  const related =
    active.relatedProjectSlug === null
      ? undefined
      : findProject(active.relatedProjectSlug);

  return (
    <Section surface="slab" rhythm="loose" id="services" className="wash-slab">
      <SectionIntro
        index={3}
        eyebrow="Capabilities"
        title="Six groups of work, one team."
        lead="Most engagements use several of these at once. They are listed separately because it should be obvious what you would actually be buying."
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
        {/* Rail */}
        <div
          role="tablist"
          aria-label="Capability groups"
          aria-orientation="vertical"
          // Below `lg` the rail becomes a horizontal snap row rather than a
          // six-item vertical list, so the panel it controls is on screen at
          // the moment you tap — same DOM, same semantics, different form.
          className="rail-snap border-hairline -mx-5 flex overflow-x-auto border-t px-5 sm:-mx-8 sm:px-8 lg:sticky lg:top-28 lg:mx-0 lg:flex-col lg:self-start lg:overflow-visible lg:px-0"
        >
          {serviceGroups.map((group, index) => {
            const isActive = group.id === activeId;
            return (
              <button
                key={group.id}
                type="button"
                role="tab"
                id={`service-tab-${group.id}`}
                aria-selected={isActive}
                aria-controls={`service-panel-${group.id}`}
                onClick={() => setActiveId(group.id)}
                className={cn(
                  "focus-visible:outline-ring group/tab flex shrink-0 items-baseline gap-2.5 border-b-2 py-4 pr-6 text-left whitespace-nowrap transition-colors duration-[var(--dur-base)] focus-visible:outline-2 focus-visible:-outline-offset-2",
                  "lg:border-hairline lg:w-full lg:gap-4 lg:border-b lg:pr-0",
                  isActive
                    ? "border-primary text-foreground lg:border-hairline"
                    : "text-muted-foreground hover:text-foreground border-transparent",
                )}
              >
                <span
                  className={cn(
                    "text-mono-label w-6 shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-display-3">{group.name}</span>
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div
          role="tabpanel"
          id={`service-panel-${active.id}`}
          aria-labelledby={`service-tab-${active.id}`}
          tabIndex={0}
          className="focus-visible:outline-ring flex flex-col gap-8 focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <p className="text-lead text-muted-foreground">{active.summary}</p>

          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {active.capabilities.map((capability) => (
              <div key={capability.name} className="flex flex-col gap-1.5">
                <h3 className="text-[0.9375rem] font-medium">
                  {capability.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {capability.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-eyebrow text-muted-foreground">
              What you receive
            </h3>
            <HairlineList items={active.deliverables} />
          </div>

          {related !== undefined && (
            <Reveal
              variant="fade"
              className="border-hairline bg-raised rounded-frame flex flex-col gap-5 border p-5 sm:flex-row sm:items-center sm:gap-6"
            >
              <div className="w-full shrink-0 sm:w-56">
                <MediaFrame
                  media={related.heroMedia}
                  sizes="(min-width: 640px) 224px, 90vw"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-eyebrow text-muted-foreground">
                  Where we used it
                </p>
                <p className="text-display-3">
                  <Link
                    href={caseStudyPath(related.slug)}
                    className="focus-visible:outline-ring rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    {related.name}
                  </Link>
                </p>
                <p className="text-muted-foreground text-sm">
                  {related.tagline}
                </p>
                <ArrowLink href={caseStudyPath(related.slug)} size="sm">
                  View case study
                  <span className="sr-only"> — {related.name}</span>
                </ArrowLink>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  );
}
