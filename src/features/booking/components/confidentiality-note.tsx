"use client";

import { ShieldCheck } from "lucide-react";
import { useTranslations } from "@/i18n";
import { cn } from "@/lib/utils";

export interface ConfidentialityNoteProps {
  /** `line` is the one-sentence version; `panel` lists every commitment. */
  tone?: "line" | "panel";
  className?: string;
}

/**
 * "YOUR IDEA STAYS YOURS."
 *
 * The commonest unspoken reason a founder will not describe their product is
 * that they think it will be taken. It is almost never said out loud, which is
 * exactly why an agency site has to answer it without being asked: the visitor
 * who is worried simply writes three vague sentences, or writes nothing.
 *
 * The tone is the difference between this working and backfiring. Protesting
 * at length sounds like someone who has been accused, so the panel is three
 * short lines and stops. And every one of them is something the studio can
 * stand behind with nothing signed: no certification is claimed, no encryption
 * standard, no legal guarantee. "Happy to sign your NDA" is the strongest item
 * on the list precisely because it is a concrete offer rather than a promise
 * about our own conduct.
 *
 * A shield, not a padlock. A padlock reads as data security, which is a claim
 * about infrastructure this copy is careful not to make.
 */
export function ConfidentialityNote({
  tone = "line",
  className,
}: ConfidentialityNoteProps) {
  const t = useTranslations();
  const headline = t("confidentiality.headline");
  /* Three fixed keys rather than an array: the catalog is a typed object, so
     a loop over indexes would need a cast at every lookup and would stop the
     type checker noticing a missing translation. */
  const points = [
    t("confidentiality.point1"),
    t("confidentiality.point2"),
    t("confidentiality.point3"),
  ];

  if (tone === "line") {
    return (
      <p
        className={cn(
          "text-muted-foreground flex items-start gap-2.5 text-[0.8125rem] leading-snug",
          className,
        )}
      >
        <ShieldCheck
          aria-hidden="true"
          className="text-primary mt-px size-4 shrink-0"
        />
        <span>
          <span className="text-foreground font-medium">{headline}.</span>{" "}
          {t("confidentiality.line")}
        </span>
      </p>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="flex items-center gap-2.5 text-[0.9375rem] font-medium">
        <ShieldCheck aria-hidden="true" className="text-primary size-4.5" />
        {headline}
      </p>
      <ul className="flex flex-col gap-2">
        {points.map((point) => (
          <li
            key={point}
            className="text-muted-foreground flex gap-2.5 text-[0.8125rem] leading-snug"
          >
            <span
              aria-hidden="true"
              className="bg-primary/60 mt-[0.45rem] size-1 shrink-0 rounded-full"
            />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
