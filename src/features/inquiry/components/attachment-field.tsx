"use client";

import { FileUp, Paperclip, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { formatBytes } from "@/lib/format";
import { useTranslations } from "@/i18n";
import { cn } from "@/lib/utils";

export interface AttachmentFieldProps {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}

/**
 * PROJECT MATERIALS.
 *
 * Rewritten from a single-file picker that accepted four MIME types.
 *
 * Both limits were wrong. The type list — PDF, PNG, JPEG, .docx — greyed out
 * most of what people actually have: a Figma export, a zip of screenshots, a
 * Keynote deck, a screen recording of the thing they want replaced, a
 * spreadsheet of the data to migrate. The picker offers no explanation when it
 * does that, so the visitor reads it as "our material is not welcome" and
 * attaches nothing. And a whitelist in `accept` was never buying safety
 * anyway: it is a hint to a dialog that any client can ignore, so the server
 * has to validate regardless.
 *
 * Single-file was the same mistake in another form. Almost nobody has exactly
 * one relevant document; they have a brief and three screenshots.
 *
 * So: any format, up to five files, 25MB each. Drag and drop, because the
 * material is usually already sitting in a folder the visitor has open.
 *
 * Size is still checked here rather than server-side only, so someone hears
 * about a 90MB video immediately instead of after a failed upload, and the
 * message says what to do instead. Rejections are per-file: four good files
 * and one oversized one keeps the four, which is what a person expects and
 * what the old all-or-nothing check got wrong.
 */
export function AttachmentField({
  files,
  onChange,
  disabled = false,
}: AttachmentFieldProps) {
  const t = useTranslations();
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOver, setIsOver] = useState(false);

  const { maxAttachmentBytes, maxAttachments } = siteConfig.inquiry;

  function accept(incoming: File[]) {
    const problems: string[] = [];
    const room = maxAttachments - files.length;

    const sized = incoming.filter((file) => {
      if (file.size <= maxAttachmentBytes) return true;
      problems.push(
        t("inquiry.attachment.tooLarge", {
          name: file.name,
          max: formatBytes(maxAttachmentBytes),
        }),
      );
      return false;
    });

    if (sized.length > room) {
      problems.push(t("inquiry.attachment.tooMany", { max: maxAttachments }));
    }

    setError(problems.length === 0 ? null : problems.join(" "));
    if (sized.length === 0) return;
    onChange([...files, ...sized.slice(0, Math.max(room, 0))]);
  }

  function remove(target: File) {
    setError(null);
    onChange(files.filter((file) => file !== target));
    // Clearing the input lets the same file be re-picked after a removal;
    // without this the change event never fires the second time.
    if (inputRef.current !== null) inputRef.current.value = "";
  }

  const isFull = files.length >= maxAttachments;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={inputId} className="text-label text-foreground">
          {t("inquiry.attachment.label")}
        </label>
        {files.length > 0 && (
          <span className="text-mono-label text-muted-foreground">
            {t("inquiry.attachment.count", { count: files.length })}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        multiple
        className="sr-only"
        disabled={disabled || isFull}
        aria-describedby={error === null ? undefined : errorId}
        aria-invalid={error !== null}
        onChange={(event) => accept([...(event.target.files ?? [])])}
      />

      {!isFull && (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsOver(true);
          }}
          onDragLeave={() => setIsOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsOver(false);
            accept([...event.dataTransfer.files]);
          }}
          className={cn(
            "border-hairline flex flex-col items-center gap-2.5 rounded-xl border border-dashed px-4 py-6 text-center transition-colors duration-[var(--dur-base)]",
            isOver && "border-primary bg-primary/[0.06]",
          )}
        >
          <FileUp
            aria-hidden="true"
            className={cn(
              "size-5 transition-colors",
              isOver ? "text-primary" : "text-muted-foreground",
            )}
          />
          <p className="text-caption text-muted-foreground">
            <Button
              type="button"
              variant="link"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              className="h-auto p-0 text-[0.8125rem]"
            >
              {t("inquiry.attachment.choose")}
            </Button>{" "}
            {t("inquiry.attachment.drop")}
          </p>
        </div>
      )}

      {files.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {files.map((file) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}`}
              className="border-hairline bg-raised flex items-center gap-3 rounded-lg border px-3 py-2.5"
            >
              <Paperclip
                aria-hidden="true"
                className="text-primary size-4 shrink-0"
              />
              <span className="min-w-0 flex-1 truncate text-sm">
                {file.name}
              </span>
              <span className="text-mono-label text-muted-foreground shrink-0">
                {formatBytes(file.size)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onClick={() => remove(file)}
              >
                <X aria-hidden="true" className="size-4" />
                <span className="sr-only">
                  {t("inquiry.attachment.remove", { name: file.name })}
                </span>
              </Button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-caption text-muted-foreground">
        {t("inquiry.attachment.hint", {
          max: formatBytes(maxAttachmentBytes),
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
