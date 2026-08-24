"use client";

import { useSessionStore } from "./session-store";
import type { AuthUser, SessionStatus } from "./types";

/**
 * Session selectors.
 *
 * Always subscribe with a SELECTOR (as these do) rather than reading the whole
 * store — a whole-store subscription re-renders on every unrelated change.
 */

export function useCurrentUser(): AuthUser | null {
  return useSessionStore((state) => state.user);
}

export function useSessionStatus(): SessionStatus {
  return useSessionStore((state) => state.status);
}

export function useIsAuthenticated(): boolean {
  return useSessionStore((state) => state.status === "authenticated");
}
