import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * WHEN THE VISITOR'S OFFER WINDOW STARTED.
 *
 * One number, persisted, and the honesty of the whole countdown rests on it.
 *
 * It is written ONCE, the first time a visitor reaches a booking surface, and
 * never rewritten. Not on a reload, not on a route change, not on a second
 * visit tomorrow. That is the entire design: a countdown that restarts
 * whenever it would otherwise expire is the single most recognisable dark
 * pattern on the web, and a visitor who catches it stops believing the case
 * studies too. The cost of doing it honestly is that some visitors see an
 * expired offer, which is correct, because it did expire.
 *
 * **localStorage, not sessionStorage.** The inquiry draft is session-scoped so
 * a shared machine doesn't leak it next week, but this has to outlive the tab
 * for the opposite reason: session scope would silently hand every returning
 * visitor a fresh window, which is the restart this exists to prevent.
 * The stored value is a timestamp and nothing else.
 *
 * Nothing here reads the clock during render. `startedAt` is state; the
 * remaining seconds are derived by `useOfferCountdown` on a ticking interval,
 * so the server and the first client paint agree and hydration stays quiet.
 */
interface OfferState {
  /** Epoch ms of the first booking surface this visitor reached, or null. */
  startedAt: number | null;
  /**
   * Begin the window, if it has not begun already. Idempotent by design: every
   * booking surface on the page calls it on mount, and only the first one wins.
   */
  start: () => void;
}

export const useOfferStore = create<OfferState>()(
  persist(
    (set, get) => ({
      startedAt: null,
      start: () => {
        if (get().startedAt !== null) return;
        set({ startedAt: Date.now() });
      },
    }),
    {
      name: "ga-studio-offer",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
