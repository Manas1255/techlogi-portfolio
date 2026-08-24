import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { BuildTypeId } from "@/content/schemas";
import type { InquiryFormValues } from "./validations/inquiry.schema";

/**
 * Open/closed state and the visitor's in-progress answers.
 *
 * Persisted to **sessionStorage**, which is what makes "close the drawer, read
 * a case study, come back" keep everything they typed — the brief's requirement
 * — without leaving a stale draft on a shared machine next week. `isOpen` is
 * deliberately NOT persisted: a drawer that reopens itself on the next page
 * load is a popup.
 *
 * The attachment stays in component state: a `File` can't be serialized, and
 * silently dropping it on rehydrate would be worse than not persisting it.
 */
interface InquiryState {
  isOpen: boolean;
  step: number;
  values: Partial<InquiryFormValues>;
  /** Where the drawer was opened from, for reporting. */
  origin: string | null;
  open: (options?: { buildType?: BuildTypeId; origin?: string }) => void;
  close: () => void;
  setStep: (step: number) => void;
  setValues: (values: Partial<InquiryFormValues>) => void;
  /**
   * Clear the saved draft WITHOUT closing. Used after a successful submit: the
   * answers shouldn't come back half-filled, but the visitor still has to see
   * that it worked.
   */
  clearDraft: () => void;
  reset: () => void;
}

const EMPTY: Pick<InquiryState, "step" | "values"> = { step: 0, values: {} };

export const useInquiryStore = create<InquiryState>()(
  persist(
    (set) => ({
      ...EMPTY,
      isOpen: false,
      origin: null,
      open: (options) =>
        set((state) => {
          const buildType = options?.buildType;
          // Opening from a specific choice answers step one, so the visitor
          // lands on step two rather than re-picking what they just clicked.
          if (buildType !== undefined) {
            return {
              isOpen: true,
              origin: options?.origin ?? null,
              step: Math.max(state.step, 1),
              values: { ...state.values, buildType },
            };
          }
          return { isOpen: true, origin: options?.origin ?? null };
        }),
      close: () => set({ isOpen: false }),
      setStep: (step) => set({ step }),
      setValues: (values) =>
        set((state) => ({ values: { ...state.values, ...values } })),
      clearDraft: () => set({ ...EMPTY }),
      reset: () => set({ ...EMPTY, isOpen: false }),
    }),
    {
      name: "techlogi-inquiry",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ step: state.step, values: state.values }),
    },
  ),
);

/** Open the inquiry from anywhere, including non-React code. */
export function openInquiry(options?: {
  buildType?: BuildTypeId;
  origin?: string;
}): void {
  useInquiryStore.getState().open(options);
}
