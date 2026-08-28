"use client";

import { useId, useMemo, useState } from "react";
import {
  useController,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/shared/combobox";
import {
  DEFAULT_DIAL_ISO,
  DIAL_CODES,
  joinDialCode,
  splitDialCode,
} from "@/constants/dial-codes";
import { useLocale } from "@/i18n";
import { FieldLabelRow } from "./field-label-row";
import { useFieldError } from "./use-field-error";

export interface PhoneFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends UseControllerProps<TFieldValues, TName> {
  label: string;
  optional?: boolean;
  optionalLabel?: string;
  description?: string;
  placeholder?: string;
  /** Accessible name for the country picker; it has no visible label. */
  countryLabel: string;
  countrySearchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * A phone number as a country and a number, stored as one string.
 *
 * A bare `tel` input quietly asks the visitor to answer a question they should
 * not have to: whether to write `0151…` the way they would say it at home, or
 * `+49 151…` the way it has to arrive. Most people write the first, and a
 * national number with no country is unreachable from anywhere else, which is
 * the entire point of collecting it.
 *
 * THE FORM VALUE IS STILL ONE STRING, `"+49 151 23456789"`, so nothing
 * downstream changed: the schema, the payload contract and the booking notes
 * all see what they saw before. The split is a presentation concern and it
 * stays inside this component, which is why an existing draft still restores
 * and why the endpoint needs no migration.
 *
 * Country NAMES come from `Intl.DisplayNames` in the page's language, not from
 * a translated table. The runtime already knows every country in German and in
 * English, and a hardcoded list would be seventy strings to keep in step, in
 * two languages, that a browser will hand over correctly for free. It also
 * means the list SORTS in the reading language: "Österreich" lands under Ö for
 * a German reader and "Austria" under A for an English one, which is the
 * difference between a picker you can scan and one you have to search.
 *
 * The picker is a combobox rather than a select, because seventy options is
 * past the point where scrolling beats typing three letters.
 */
export function PhoneField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  label,
  optional,
  optionalLabel,
  description,
  placeholder,
  countryLabel,
  countrySearchPlaceholder,
  disabled,
  className,
  ...controllerProps
}: PhoneFieldProps<TFieldValues, TName>) {
  const locale = useLocale();
  const { field, fieldState } = useController(controllerProps);
  const error = useFieldError(fieldState.error?.message);

  /*
    A DOM id must be unique in the document, and one derived from the field
    NAME is not: two forms on a page both holding a "phone" would bind every
    `label[for="phone"]` to whichever input the browser met first.
  */
  const fieldId = useId();
  const countryId = `${fieldId}-country`;
  const errorId = `${fieldId}-error`;
  const descriptionId = `${fieldId}-description`;

  const options = useMemo(() => {
    /*
      `Intl.DisplayNames` is in every browser this site supports, but it throws
      on an unknown locale rather than falling back, so a bad tag would take
      the whole form down. The ISO code is a poor label and a fine last resort.
    */
    let names: Intl.DisplayNames | null = null;
    try {
      names = new Intl.DisplayNames([locale], { type: "region" });
    } catch {
      names = null;
    }

    const labelled = DIAL_CODES.map((entry) => ({
      value: entry.iso,
      label: names?.of(entry.iso) ?? entry.iso,
      hint: entry.dial,
    }));

    // DACH stays pinned at the top; the rest sorts in the reading language.
    const pinned = labelled.slice(0, 3);
    const rest = labelled
      .slice(3)
      .sort((a, b) => a.label.localeCompare(b.label, locale));
    return [...pinned, ...rest];
  }, [locale]);

  /*
    THE COUNTRY HAS TO SURVIVE AN EMPTY NUMBER.

    The stored value is one combined string, so the country can only be read
    back out of it while there IS a number: `joinDialCode` returns "" when the
    number is blank, deliberately, because sending a bare "+49" as someone's
    phone number is worse than sending nothing. But that meant picking a
    country first, which is the natural left-to-right order, stored "", which
    re-parsed as the default, so the choice reverted to Germany the moment the
    visitor started typing. Selecting the UK and typing a London number
    produced "+49 20 7946 0958".

    So the choice is held here as well. The parsed value wins whenever there is
    one, which is what makes a restored draft show its own country; this only
    fills the gap while the number is still empty.
  */
  const rawValue = typeof field.value === "string" ? field.value : "";
  const [chosenIso, setChosenIso] = useState<string | null>(null);
  const parsed = splitDialCode(rawValue);
  const current = {
    iso: rawValue.trim() === "" ? (chosenIso ?? DEFAULT_DIAL_ISO) : parsed.iso,
    nationalNumber: parsed.nationalNumber,
  };
  const selectedDial =
    DIAL_CODES.find((entry) => entry.iso === current.iso)?.dial ??
    DIAL_CODES.find((entry) => entry.iso === DEFAULT_DIAL_ISO)?.dial ??
    "";

  const describedBy =
    [error ? errorId : null, description ? descriptionId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <Field data-invalid={!!error} className={className}>
      <FieldLabelRow
        htmlFor={fieldId}
        label={label}
        optional={optional}
        optionalLabel={optionalLabel}
      />
      {/*
        The picker takes its own width and the number takes the rest. A fixed
        `auto` column rather than a fraction, because the trigger's width is
        set by the longest country name in the current language and a
        fractional split would leave a German reader typing their number into
        a third of the row.
      */}
      <div className="grid grid-cols-[minmax(7rem,auto)_1fr] gap-2">
        <Combobox
          id={countryId}
          options={options}
          value={current.iso}
          onChange={(iso) => {
            setChosenIso(iso);
            field.onChange(joinDialCode(iso, current.nationalNumber));
          }}
          disabled={disabled ?? field.disabled}
          placeholder={selectedDial}
          searchPlaceholder={countrySearchPlaceholder}
          /*
            Named directly. The picker has no visible label of its own, and a
            combobox announced as just "Germany" tells a screen-reader user the
            answer without ever asking the question.
          */
          aria-label={countryLabel}
          aria-describedby={describedBy}
          className="min-w-0"
        />
        <Input
          /*
            SPREAD, rather than picking `name`, `ref` and `onBlur` off one by
            one. Naming `field.ref` in the render body reads to the React
            Compiler as a ref access during render and it refuses to compile
            the component; spreading hands the same ref over without ever
            mentioning it. The rest of the catalog does the same, for the same
            reason. `value` and `onChange` are overridden AFTER the spread,
            because this field stores a combined string and edits only half of
            it.
          */
          {...field}
          id={fieldId}
          /*
            The NATIONAL part only. Showing the dial code in here as well would
            put it on screen twice and invite someone to delete one of them.
          */
          value={current.nationalNumber}
          onChange={(event) => {
            field.onChange(joinDialCode(current.iso, event.target.value));
          }}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder={placeholder}
          disabled={disabled ?? field.disabled}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-label={label}
          className="min-w-0"
        />
      </div>
      {description ? (
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      ) : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </Field>
  );
}
