"use client";

import { Paperclip, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { formatBytes } from "@/lib/format";
import { useTranslations } from "@/i18n";

export interface AttachmentFieldProps {
  file: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

/**
 * The optional attachment.
 *
 * Size and type are checked here, against `siteConfig.inquiry`, so a visitor
 * hears about a 40MB file immediately instead of after a failed upload. The
 * error is tied to the input with `aria-describedby`, like every other field on
 * the site.
 */
export function AttachmentField({
  file,
  onChange,
  disabled = false,
}: AttachmentFieldProps) {
  const t = useTranslations();
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSelect(selected: File | null) {
    setError(null);
    if (selected === null) {
      onChange(null);
      return;
    }
    if (selected.size > siteConfig.inquiry.maxAttachmentBytes) {
      setError(
        t("inquiry.attachment.tooLarge", {
          max: formatBytes(siteConfig.inquiry.maxAttachmentBytes),
        }),
      );
      return;
    }
    onChange(selected);
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-label text-foreground">
        {t("inquiry.attachment.label")}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className="sr-only"
        accept={siteConfig.inquiry.acceptedAttachmentTypes.join(",")}
        disabled={disabled}
        aria-describedby={error === null ? undefined : errorId}
        aria-invalid={error !== null}
        onChange={(event) => handleSelect(event.target.files?.[0] ?? null)}
      />
      {file === null ? (
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="justify-start gap-2"
        >
          <Paperclip aria-hidden="true" className="size-4" />
          {t("inquiry.attachment.choose")}
        </Button>
      ) : (
        <div className="border-hairline bg-raised flex items-center gap-3 rounded-lg border px-3 py-2.5">
          <Paperclip
            aria-hidden="true"
            className="text-primary size-4 shrink-0"
          />
          <span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
          <span className="text-mono-label text-muted-foreground shrink-0">
            {formatBytes(file.size)}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            onClick={() => {
              handleSelect(null);
              if (inputRef.current !== null) inputRef.current.value = "";
            }}
          >
            <X aria-hidden="true" className="size-4" />
            <span className="sr-only">
              {t("inquiry.attachment.remove", { name: file.name })}
            </span>
          </Button>
        </div>
      )}
      <p className="text-caption text-muted-foreground">
        {t("inquiry.attachment.hint", {
          max: formatBytes(siteConfig.inquiry.maxAttachmentBytes),
        })}
      </p>
      {error !== null && (
        <p id={errorId} role="alert" className="text-danger text-caption">
          {error}
        </p>
      )}
    </div>
  );
}
