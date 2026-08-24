"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FullPageLoader } from "@/components/shared/full-page-loader";
import { DEFAULT_AUTHED_ROUTE, DEFAULT_GUEST_ROUTE } from "@/constants";
import { useSessionStatus } from "./hooks";

/**
 * Route guards.
 *
 * ⚠️ These are UX, NOT SECURITY. They decide what to render; the BACKEND is the
 * authorization boundary and re-checks every request. Never rely on a guard to
 * protect data — it only stops a user from staring at a broken screen.
 *
 * `proxy.ts` (Next 16's renamed Middleware) does the optimistic cookie-level
 * redirect before this even mounts; these handle the authoritative,
 * post-session-resolution case.
 */

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const status = useSessionStatus();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace(DEFAULT_GUEST_ROUTE);
  }, [status, router]);

  if (status !== "authenticated") return <FullPageLoader />;
  return <>{children}</>;
}

/**
 * For auth screens: bounce an already-signed-in user to the app.
 *
 * Note it renders children WHILE the session is still resolving, unlike
 * `RequireAuth`. Proxy already redirected anyone carrying a session cookie, so
 * reaching this screen is strong evidence there's no session — blocking on
 * `loading` would show every signed-out visitor a spinner before the login form
 * for no benefit. If a session does resolve, the effect below still redirects.
 */
export function RequireGuest({ children }: { children: React.ReactNode }) {
  const status = useSessionStatus();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.replace(DEFAULT_AUTHED_ROUTE);
  }, [status, router]);

  if (status === "authenticated") return <FullPageLoader />;
  return <>{children}</>;
}
