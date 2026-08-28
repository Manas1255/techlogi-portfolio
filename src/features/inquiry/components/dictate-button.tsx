"use client";

import { Mic, Square } from "lucide-react";
import { useTranslations } from "@/i18n";
import { cn } from "@/lib/utils";
import {
  useDictation,
  type DictationStatus,
} from "@/features/inquiry/hooks/use-dictation";

export interface DictateButtonProps {
  /** Receives each finalised chunk of speech. */
  onResult: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * "Or just say it." The speak-instead-of-type control for the idea step.
 *
 * Renders NOTHING where the browser has no recogniser, rather than a disabled
 * button with a tooltip. A control that is visible and dead is a worse
 * experience than a feature that was never advertised, and Firefox is the
 * common case here, not an edge one.
 *
 * The offer states itself in one short line beside the button, because a bare
 * microphone icon on a form is ambiguous: people read it as "attach a voice
 * note", which is a different and much bigger commitment than "we will type
 * this out for you". Saying what it does is the whole reason anyone presses it.
 *
 * While listening it is the only moving thing on the screen, and the movement
 * is a slow pulse on the dot rather than the button, so the target does not
 * shift under a finger mid-sentence. `aria-live` announces the change of state
 * for anyone who cannot see the pulse.
 */
export function DictateButton({
  onResult,
  disabled = false,
  className,
}: DictateButtonProps) {
  const t = useTranslations();
  const { status, isListening, toggle } = useDictation({ onResult });

  if (status.state === "unsupported") return null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <button
          type="button"
          onClick={toggle}
          disabled={disabled}
          aria-pressed={isListening}
          className={cn(
            "focus-visible:outline-ring inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors duration-[var(--dur-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            isListening
              ? "border-primary bg-primary/10 text-foreground"
              : "border-hairline text-muted-foreground hover:border-hairline-strong hover:text-foreground",
          )}
        >
          {isListening ? (
            <>
              {/* A dot, not a spinner: this is a state, not a wait. */}
              <span className="relative flex size-2.5 shrink-0">
                <span className="bg-primary absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:hidden" />
                <span className="bg-primary relative inline-flex size-2.5 rounded-full" />
              </span>
              {t("inquiry.dictate.stop")}
              <Square aria-hidden="true" className="size-3 fill-current" />
            </>
          ) : (
            <>
              <Mic aria-hidden="true" className="size-4" />
              {t("inquiry.dictate.start")}
            </>
          )}
        </button>

        <p className="text-muted-foreground text-[0.8125rem] leading-snug">
          {isListening
            ? t("inquiry.dictate.listening")
            : t("inquiry.dictate.hint")}
        </p>
      </div>

      {/* Announced, never merely shown. */}
      <p aria-live="polite" className="sr-only">
        {isListening ? t("inquiry.dictate.listening") : ""}
      </p>

      <DictationProblem status={status} />
    </div>
  );
}

/**
 * Only two failures are worth a visible message, and neither is the model's
 * fault to explain away: the microphone was refused, or the service broke.
 * Both name the cause and the way out, rather than apologising.
 */
function DictationProblem({ status }: { status: DictationStatus }) {
  const t = useTranslations();
  if (status.state !== "denied" && status.state !== "error") return null;

  return (
    <p
      role="alert"
      className="text-muted-foreground border-hairline rounded-lg border px-3 py-2 text-[0.8125rem] leading-snug"
    >
      {status.state === "denied"
        ? t("inquiry.dictate.denied")
        : t("inquiry.dictate.failed")}
    </p>
  );
}
