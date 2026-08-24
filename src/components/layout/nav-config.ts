import { LayoutDashboard, Settings, type LucideIcon } from "lucide-react";
import { APP_ROUTES } from "@/constants";
import type { MessageKey } from "@/i18n";

/**
 * The navigation table — one declarative source for the sidebar, the command
 * menu, and breadcrumbs.
 *
 * This app has no roles, so every item is shown to everyone signed in.
 * `jinn-web role <name>` adds role filtering here if that changes.
 */
export interface NavItem {
  href: string;
  labelKey: MessageKey;
  icon: LucideIcon;
}

/** `jinn-web domain` appends new items to this array. */
export const NAV_ITEMS: readonly NavItem[] = [
  {
    href: APP_ROUTES.dashboard,
    labelKey: "nav.dashboard",
    icon: LayoutDashboard,
  },
  {
    href: APP_ROUTES.settings,
    labelKey: "nav.settings",
    icon: Settings,
  },
];

/** Every nav item — this app has no roles to filter by. */
export function navItems(): readonly NavItem[] {
  return NAV_ITEMS;
}
