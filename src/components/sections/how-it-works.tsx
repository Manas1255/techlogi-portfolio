import {
  Code,
  Compass,
  MessageCircle,
  PenTool,
  Repeat,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import {
  Section,
  SectionIntro,
  Stagger,
  StaggerItem,
} from "@/components/marketing";
import { getContent } from "@/content";
import type { ProcessStage } from "@/content";
import { BookCallButton } from "@/features/booking";
import { getLocale, getTranslations } from "@/i18n/server";

/**
 * HOW IT WORKS.
 *
 * The section this replaces was a vertical timeline: seven stages, alternating
 * either side of a drawn spine, each in a card carrying a paragraph and a
 * bulleted list of deliverables. Every part of that was defensible on its own
 * and the result was about two thousand pixels of scroll between "I understand
 * what they do" and "I want to talk to them", spent explaining a process to
 * someone who has not yet decided to buy one.
 *
 * So: five stages, one row, one line each. The point of this section is not to
 * document the engagement, it is to make starting one feel small. A visitor
 * should be able to read the whole thing in about eight seconds and come away
 * with "the first step is a thirty-minute call", which is the only fact here
 * they can act on today.
 *
 * The detail did not get deleted, it moved: `/services` still carries the full
 * treatment for someone who has decided to read.
 *
 * The rule and the numbered nodes give the row its direction. On a phone the
 * rule turns vertical and the cards stack, because a horizontal process on a
 * 320px screen is five cards you cannot see at once, which loses the sequence
 * that was the whole reason for drawing it as one.
 */

const ICONS: Record<ProcessStage["icon"], LucideIcon> = {
  "message-circle": MessageCircle,
  compass: Compass,
  "pen-tool": PenTool,
  code: Code,
  repeat: Repeat,
  rocket: Rocket,
};

export async function HowItWorks() {
  const t = await getTranslations();
  const { processStages } = getContent(await getLocale());

  return (
    <Section rhythm="base" id="process" divided>
      <SectionIntro
        index={1}
        eyebrow={t("howItWorks.eyebrow")}
        title={t("howItWorks.title")}
        lead={t("howItWorks.lead")}
        align="split"
        aside={<BookCallButton origin="how-it-works" size="md" />}
      />

      <Stagger
        as="ol"
        step={0.08}
        className="mt-12 grid gap-px md:mt-16 md:grid-cols-3 lg:grid-cols-5"
      >
        {processStages.map((stage, index) => {
          const Icon = ICONS[stage.icon];
          return (
            <StaggerItem
              as="li"
              key={stage.id}
              className="border-hairline relative flex flex-col gap-3.5 border-t pt-5 md:px-5 md:first:pl-0 md:last:pr-0"
            >
              <div className="flex items-center gap-3">
                <span className="border-hairline text-primary flex size-9 shrink-0 items-center justify-center rounded-xl border">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <span className="text-mono-label text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden="true"
                  className="bg-hairline-strong ml-auto hidden h-px flex-1 md:block"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <h3 className="text-[1.0625rem] leading-snug font-medium">
                  {stage.name}
                </h3>
                <p className="text-muted-foreground text-[0.8125rem] leading-relaxed">
                  {stage.what}
                </p>
              </div>

              <p className="border-hairline text-mono-label text-muted-foreground mt-auto border-t pt-3">
                <span className="text-primary">{t("howItWorks.youGet")}</span> ·{" "}
                {stage.receives}
              </p>

              <p className="text-mono-label text-muted-foreground/70">
                {stage.duration}
              </p>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
