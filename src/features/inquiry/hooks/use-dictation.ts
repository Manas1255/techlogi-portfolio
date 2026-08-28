"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useLocale } from "@/i18n";
import { reportError } from "@/lib/reporting";

/*
  MINIMAL TYPES FOR THE WEB SPEECH API.

  `SpeechRecognition` is not in `lib.dom`, because it has never left draft, so
  the alternative to declaring the slice we use is `any`, which is a lint error
  here and would also hide the exact shape this depends on. Only the members
  actually used are declared, so anything else is still a type error.
*/
interface SpeechAlternative {
  readonly transcript: string;
}
interface SpeechResult {
  readonly isFinal: boolean;
  readonly length: number;
  readonly [index: number]: SpeechAlternative;
}
interface SpeechResultList {
  readonly length: number;
  readonly [index: number]: SpeechResult;
}
interface SpeechResultEvent {
  readonly resultIndex: number;
  readonly results: SpeechResultList;
}
interface SpeechErrorEvent {
  readonly error: string;
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: ((event: SpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

/** Both spellings, because Safari and Chrome still disagree about the prefix. */
function getConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  /*
    `as` on a browser global that TypeScript does not know about. This is the
    exception the house rule allows for: the shape is asserted once, here,
    against the interface above, rather than at every call site.
  */
  const candidate = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return (
    candidate.SpeechRecognition ?? candidate.webkitSpeechRecognition ?? null
  );
}

/** BCP-47 tags, because the recogniser needs a region, not just a language. */
const RECOGNITION_LANG: Record<string, string> = {
  de: "de-DE",
  en: "en-US",
};

/** Everything except support, which is a fact about the browser, not a state. */
type RuntimeState = "idle" | "listening" | "denied" | "error";

/** A store that never emits: support cannot change within a page's life. */
const NO_SUBSCRIBE = () => () => {};

export type DictationStatus =
  | { state: "unsupported" }
  | { state: "idle" }
  | { state: "listening" }
  | { state: "denied" }
  | { state: "error" };

export interface UseDictationOptions {
  /** Called with each finalised chunk of speech, already trimmed. */
  onResult: (text: string) => void;
}

/**
 * SPEAK INSTEAD OF TYPING, for the one field that asks for prose.
 *
 * The brief's second step asks a person to describe their idea, which is the
 * single highest-effort thing the site asks for and the step most likely to be
 * abandoned on a phone. Talking for thirty seconds is far easier than thumbing
 * three sentences, and people describe a project better out loud than they
 * write it, so the answers get better as well as more numerous.
 *
 * It recognises in the language of the PAGE, not the language of the browser
 * or the OS: someone reading the German site is going to speak German into it,
 * and a recogniser set to `en-US` would return confident nonsense rather than
 * an error, which is the worst possible failure for this feature.
 *
 * SUPPORT IS CHECKED AFTER MOUNT, deliberately. The API does not exist on the
 * server or in Firefox, so deciding during render would either mismatch
 * hydration or make the button flicker away after paint. `unsupported` is the
 * initial state and the caller renders nothing at all until it changes: an
 * offer to speak that does nothing when pressed is worse than never offering.
 *
 * Interim results are requested but never emitted upward. They rewrite
 * themselves as the recogniser changes its mind, and watching a textarea churn
 * through half-guesses reads as a bug; only finalised chunks are appended.
 */
export function useDictation({ onResult }: UseDictationOptions): {
  status: DictationStatus;
  isListening: boolean;
  toggle: () => void;
  stop: () => void;
} {
  const locale = useLocale();
  /*
    `useSyncExternalStore` rather than a state set from an effect. Support is a
    client-only fact that never changes, and this is the API built for exactly
    that: the server snapshot is `false`, the client snapshot is the real
    answer, and React reconciles them at hydration with no mismatch and no
    extra render pass. Setting it in an effect instead is a cascading render,
    which the compiler correctly refuses.
  */
  const isSupported = useSyncExternalStore(
    NO_SUBSCRIBE,
    () => getConstructor() !== null,
    () => false,
  );
  const [runtime, setRuntime] = useState<RuntimeState>("idle");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  /*
    The callback is held in a ref so the recogniser effect never re-runs when
    the caller passes a new closure. Rebuilding it mid-sentence would silently
    drop whatever had been said so far. Written in an EFFECT, not during
    render: a render can be thrown away, and a ref written by a discarded
    render is a stale callback that survives it.
  */
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    const Recognition = getConstructor();
    if (Recognition === null) return;

    const recognition = new Recognition();
    recognition.lang = RECOGNITION_LANG[locale] ?? RECOGNITION_LANG.en;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) finalText += result[0].transcript;
      }
      const trimmed = finalText.trim();
      if (trimmed !== "") onResultRef.current(trimmed);
    };

    recognition.onerror = (event) => {
      /*
        `no-speech` and `aborted` are ordinary: someone pressed the button and
        said nothing, or pressed it again to stop. Neither is worth a report or
        an error state, and showing one for silence would be actively rude.
      */
      if (event.error === "no-speech" || event.error === "aborted") {
        setRuntime("idle");
        return;
      }
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        setRuntime("denied");
        return;
      }
      setRuntime("error");
      reportError(new Error(`Speech recognition failed: ${event.error}`), {
        scope: "dictation",
      });
    };

    recognition.onend = () => {
      setRuntime((current) => (current === "listening" ? "idle" : current));
    };

    recognitionRef.current = recognition;
    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [locale]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setRuntime((current) => (current === "listening" ? "idle" : current));
  }, []);

  const toggle = useCallback(() => {
    const recognition = recognitionRef.current;
    if (recognition === null) return;
    if (runtime === "listening") {
      recognition.stop();
      setRuntime("idle");
      return;
    }
    try {
      recognition.start();
      setRuntime("listening");
    } catch (error) {
      /*
        `start()` throws if it is already running, which happens when a click
        lands between `onend` firing and state settling. Recovering silently is
        correct; the recogniser is running either way.
      */
      reportError(error, { scope: "dictation.start" });
      setRuntime("listening");
    }
  }, [runtime]);

  const status: DictationStatus = isSupported
    ? { state: runtime }
    : { state: "unsupported" };

  return {
    status,
    isListening: status.state === "listening",
    toggle,
    stop,
  };
}
