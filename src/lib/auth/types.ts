import { z } from "zod";
/**
 * The signed-in user, as the app needs them.
 *
 * A schema rather than a bare interface because this crosses a runtime
 * boundary, and it's the highest-stakes one in the app: an unvalidated auth
 * payload with a missing or unknown role produces a user object that every
 * `Record<Role, …>` lookup silently misses — which presents as a permissions
 * bug rather than a parsing one.
 */
export const authUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatarUrl: z.string().nullish(),
  /** Preferred language, synced with the locale store on sign-in. */
  language: z.string().nullish(),
});

export type AuthUser = z.infer<typeof authUserSchema>;

/** What `/api/session` returns to the browser. Note: NO refresh token — that
 *  stays in the httpOnly cookie and never reaches JavaScript. */
export interface SessionPayload {
  user: AuthUser;
  accessToken: string;
}

/**
 * Raw shape the backend returns from login/refresh (adjust to your API).
 *
 * `user` is optional because many backends return it on login but not on
 * refresh — the refresh route falls back to `/auth/me` when it's absent.
 */
export const backendAuthPayloadSchema = z.object({
  user: authUserSchema.optional(),
  tokens: z.object({
    token: z.string(),
    refreshToken: z.string(),
  }),
});

export type BackendAuthPayload = z.infer<typeof backendAuthPayloadSchema>;

export type SessionStatus =
  | "loading" // still resolving on first paint
  | "authenticated"
  | "unauthenticated";
