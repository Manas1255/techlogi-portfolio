"use client";

import { useId } from "react";

import {
  useController,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FieldLabelRow } from "./field-label-row";
import { useFieldError } from "./use-field-error";

/**
 * A labelled text input wired to react-hook-form.
 *
 * Everything a correct field needs is here so no screen has to remember it:
 * the label is associated with the input, the error is announced via
 * `aria-invalid` + `aria-describedby`, and the message is resolved through i18n.
 *
 * Hand-assembling label + input + error markup per form is how apps end up with
 * inconsistent spacing and unlabelled inputs, use this instead.
 */
export interface TextFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends UseControllerProps<TFieldValues, TName> {
  label: string;
  /** Renders an "Optional" marker beside the label. */
  optional?: boolean;
  optionalLabel?: string;
  description?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  inputMode?: React.ComponentProps<"input">["inputMode"];
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function TextField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  label,
  optional,
  optionalLabel,
  description,
  placeholder,
  type = "text",
  autoComplete,
  inputMode,
  disabled,
  autoFocus,
  className,
  ...controllerProps
}: TextFieldProps<TFieldValues, TName>) {
  const { field, fieldState } = useController(controllerProps);
  const error = useFieldError(fieldState.error?.message);

  /*
    A DOM id must be unique in the document, and a field id derived from the
    field NAME is not: the moment two forms on one page both have a
    "description", the browser binds every `label[for="description"]` to
    whichever input it met first, so a label in one form starts operating a
    control in the other. `useId` scopes the id to this instance; the field
    name stays the form's identifier, which is what it is actually for.
  */
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const descriptionId = `${fieldId}-description`;

  return (
    <Field data-invalid={!!error} className={className}>
      <FieldLabelRow
        htmlFor={fieldId}
        label={label}
        optional={optional}
        optionalLabel={optionalLabel}
      />
      <Input
        {...field}
        id={fieldId}
        // A controlled input must never receive undefined, or React switches it
        // to uncontrolled mid-edit and the user loses what they typed.
        value={field.value ?? ""}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        disabled={disabled ?? field.disabled}
        autoFocus={autoFocus}
        aria-invalid={!!error}
        aria-describedby={
          [error ? errorId : null, description ? descriptionId : null]
            .filter(Boolean)
            .join(" ") || undefined
        }
      />
      {description ? (
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      ) : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </Field>
  );
}
