"use client";

import { useId } from "react";

import {
  useController,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFieldError } from "./use-field-error";

/**
 * A toggle row: label and description on the left, switch on the right.
 *
 * Use a switch when the change takes effect immediately, and a checkbox when it
 * applies on submit, that distinction is what users read from the control.
 */
export interface SwitchFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends UseControllerProps<TFieldValues, TName> {
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function SwitchField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  label,
  description,
  disabled,
  className,
  ...controllerProps
}: SwitchFieldProps<TFieldValues, TName>) {
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

  return (
    <Field data-invalid={!!error} className={className}>
      <div className="flex items-center justify-between gap-4">
        <div className="grid min-w-0 gap-1">
          <Label htmlFor={fieldId} className="font-normal">
            {label}
          </Label>
          {description ? (
            <FieldDescription>{description}</FieldDescription>
          ) : null}
        </div>
        <Switch
          id={fieldId}
          checked={Boolean(field.value)}
          onCheckedChange={field.onChange}
          disabled={disabled ?? field.disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="shrink-0"
        />
      </div>
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </Field>
  );
}
