"use client";

import { useId } from "react";

import {
  useController,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useFieldError } from "./use-field-error";

export interface TextareaFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends UseControllerProps<TFieldValues, TName> {
  label: string;
  description?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
}

export function TextareaField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  label,
  description,
  placeholder,
  rows = 4,
  disabled,
  className,
  ...controllerProps
}: TextareaFieldProps<TFieldValues, TName>) {
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
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <Textarea
        {...field}
        id={fieldId}
        value={field.value ?? ""}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled ?? field.disabled}
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
