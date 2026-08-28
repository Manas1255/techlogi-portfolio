"use client";

import { FieldLabel } from "@/components/ui/field";

export interface FieldLabelRowProps {
  htmlFor: string;
  label: string;
  /** Renders the "Optional" marker beside the label. */
  optional?: boolean;
  optionalLabel?: string;
}

/**
 * A field's label, with an explicit OPTIONAL marker.
 *
 * Most forms mark the required fields and leave the rest to inference, which
 * gets the emphasis backwards: a visitor scanning a form is deciding how much
 * work it is, and the useful signal is which questions they can ignore. On a
 * step that is entirely optional, marking each one is the difference between a
 * screen that looks like four more obligations and one that reads as an offer.
 *
 * A marker rather than a parenthetical inside the label text, because the
 * label is also the accessible name: "Phone or WhatsApp (optional)" is fine to
 * read and clumsy to hear. This keeps the name clean and puts the marker
 * beside it, where it is announced as its own thing.
 */
export function FieldLabelRow({
  htmlFor,
  label,
  optional = false,
  optionalLabel,
}: FieldLabelRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {optional && optionalLabel ? (
        <span className="text-eyebrow text-muted-foreground border-hairline rounded-full border px-2 py-0.5 leading-none">
          {optionalLabel}
        </span>
      ) : null}
    </div>
  );
}
