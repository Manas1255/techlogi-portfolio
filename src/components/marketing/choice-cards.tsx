"use client";

import { Check } from "lucide-react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export interface Choice {
  id: string;
  label: string;
  /** A short clarifier under the label. */
  hint?: string;
}

interface BaseProps {
  options: readonly Choice[];
  /** Accessible name for the group — required, never a visual label alone. */
  label: string;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  disabled?: boolean;
}

export interface SingleChoiceProps extends BaseProps {
  multiple?: false;
  value: string | undefined;
  onChange: (value: string) => void;
}

export interface MultiChoiceProps extends BaseProps {
  multiple: true;
  value: readonly string[];
  onChange: (value: string[]) => void;
}

export type ChoiceCardsProps = SingleChoiceProps | MultiChoiceProps;

const COLUMNS = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
} as const;

const CARD =
  "group/choice relative flex min-h-16 cursor-pointer flex-col justify-center gap-1 rounded-lg border border-hairline bg-raised px-4 py-3.5 text-left transition-colors duration-[var(--dur-base)] hover:border-hairline-strong focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const SELECTED = "border-primary bg-primary/10 hover:border-primary";

/**
 * The site's low-effort choice control: a grid of cards, one tap each.
 *
 * Single-select is a real Radix radio group, so arrow keys move between
 * options and a screen reader announces "3 of 8" without any ARIA written by
 * hand. Multi-select uses toggle buttons with `aria-pressed`, which is the
 * honest semantic for "this one is on" — a checkbox group implies a form field
 * per option, which these are not.
 *
 * Used by the inquiry's first step, its timeline and budget steps, and the
 * inline launcher in the closing section — one control, so the interaction is
 * learned once.
 */
export function ChoiceCards(props: ChoiceCardsProps) {
  const { options, label, columns = 2, className, disabled = false } = props;

  if (props.multiple === true) {
    const selected = new Set(props.value);
    return (
      <div
        role="group"
        aria-label={label}
        className={cn("grid gap-2.5", COLUMNS[columns], className)}
      >
        {options.map((option) => {
          const isSelected = selected.has(option.id);
          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              aria-pressed={isSelected}
              onClick={() => {
                const next = new Set(selected);
                if (isSelected) next.delete(option.id);
                else next.add(option.id);
                props.onChange([...next]);
              }}
              className={cn(CARD, isSelected && SELECTED)}
            >
              <ChoiceBody option={option} isSelected={isSelected} />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <RadioGroupPrimitive.Root
      aria-label={label}
      value={props.value ?? ""}
      onValueChange={props.onChange}
      disabled={disabled}
      className={cn("grid gap-2.5", COLUMNS[columns], className)}
    >
      {options.map((option) => (
        <RadioGroupPrimitive.Item
          key={option.id}
          value={option.id}
          className={cn(CARD, props.value === option.id && SELECTED)}
        >
          <ChoiceBody option={option} isSelected={props.value === option.id} />
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
}

function ChoiceBody({
  option,
  isSelected,
}: {
  option: Choice;
  isSelected: boolean;
}) {
  return (
    <>
      <span className="flex items-center justify-between gap-3">
        <span className="text-[0.9375rem] leading-tight font-medium">
          {option.label}
        </span>
        <Check
          aria-hidden="true"
          className={cn(
            "text-primary size-4 shrink-0 transition-opacity duration-[var(--dur-fast)]",
            isSelected ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
      {option.hint !== undefined && (
        <span className="text-muted-foreground text-xs leading-snug">
          {option.hint}
        </span>
      )}
    </>
  );
}
