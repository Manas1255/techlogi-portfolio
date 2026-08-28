"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Reveal, Section, SectionIntro } from "@/components/marketing";
import { useContent } from "@/content/use-content";
import { siteConfig } from "@/config/site";
import { BookCallButton } from "@/features/booking";
import { useTranslations } from "@/i18n";
import { cn } from "@/lib/utils";

/**
 * FAQ, sat immediately before the closing inquiry.
 *
 * Trust signals work hardest next to the moment of doubt, and this is that
 * moment: the visitor has read the work and is deciding whether to book.
 * The first question is price, answered with real numbers, because across the
 * information types a B2B buyer looks for, price ranks highest by a wide margin
 * and most studio sites withhold it entirely.
 *
 * Built on <details>/<summary> rather than a hand-rolled accordion. That buys
 * the whole interaction contract for free: keyboard operation, the correct
 * expanded/collapsed announcement, and find-in-page working on collapsed
 * answers, which a div-based accordion silently breaks. React state only
 * mirrors the open set so the icon can rotate.
 */
export function FaqSection() {
  const t = useTranslations();
  const { faqs } = useContent();
  const [open, setOpen] = useState<Set<number>>(new Set());

  return (
    <Section rhythm="loose" id="faq">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionIntro
            index={5}
            eyebrow={t("faq.eyebrow")}
            title={t("faq.title")}
            lead={t("faq.lead")}
          />
          <Reveal
            variant="fade"
            delay={80}
            className="mt-8 flex flex-col gap-4"
          >
            <BookCallButton origin="faq" size="md" className="w-fit" />
            <p className="text-mono-label text-muted-foreground">
              {t("faq.orEmail")}{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="tap-target text-foreground hover:text-primary underline underline-offset-4 transition-colors"
              >
                {siteConfig.contact.email}
              </a>
            </p>
          </Reveal>
        </div>

        <Reveal variant="lift" className="border-hairline border-t">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="disclosure border-hairline group/faq border-b"
              onToggle={(event) => {
                // Read the element BEFORE calling setOpen. A state updater runs
                // during a later render, by which point React has cleared
                // `currentTarget` and reading `.open` off it throws, taking the
                // whole page to the error boundary on the first click.
                const isOpen = event.currentTarget.open;
                setOpen((current) => {
                  const next = new Set(current);
                  if (isOpen) next.add(index);
                  else next.delete(index);
                  return next;
                });
              }}
            >
              <summary className="focus-visible:outline-ring flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 [&::-webkit-details-marker]:hidden">
                <span className="text-[1.0625rem] leading-snug font-medium">
                  {faq.question}
                </span>
                <Plus
                  aria-hidden="true"
                  className={cn(
                    "text-primary mt-0.5 size-5 shrink-0 transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-expo)]",
                    open.has(index) && "rotate-45",
                  )}
                />
              </summary>
              <p className="text-muted-foreground max-w-[62ch] pb-6 text-[0.9375rem] leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
