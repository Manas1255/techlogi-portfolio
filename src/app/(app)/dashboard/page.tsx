"use client";

import { DashboardScreen } from "@/features/dashboard/components/dashboard-screen";

/**
 * This app has no roles, so the page renders its one surface directly.
 *
 * If roles arrive later, `jinn-web role <name>` migrates the project and
 * rewrites this into a `<RoleScreens>` dispatch.
 */
export default function DashboardPage() {
  return <DashboardScreen />;
}
