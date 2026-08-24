"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/constants";
import { InquiryDrawer, InquiryTrigger } from "@/features/inquiry";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { useTranslations, type MessageKey } from "@/i18n";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";

/**
 * The site header.
 *
 * Scroll behaviour is a decision, not a default: at the top it sits on the page
 * with no border and generous height; past 24px it condenses, gains a hairline
 * and a blurred ground, so it separates from content without ever hiding. It
 * does NOT hide-on-scroll-down — "Start a Project" has to be reachable at every
 * moment, which is the whole point of a persistent control.
 *
 * Both animated properties (height, background) are cheap here because the
 * header is a fixed, isolated layer — nothing below it reflows.
 *
 * The inquiry drawer is mounted here, once, for the whole site.
 */
export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const { isScrolled } = useScrollPosition();

  return (
    <>
      <header
        data-surface="ink"
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[height,background-color,border-color] duration-[var(--dur-base)] ease-[var(--ease-in-out-quart)]",
          isScrolled
            ? "border-hairline h-16 border-b bg-[color-mix(in_oklab,var(--background)_86%,transparent)] backdrop-blur-md"
            : "h-20 border-b border-transparent bg-transparent",
        )}
      >
        <div className="max-w-content mx-auto flex h-full items-center gap-6 px-5 sm:px-8 lg:px-10">
          <Logo />

          <nav
            aria-label={t("nav.primary")}
            className="ml-auto hidden lg:block"
          >
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "focus-visible:outline-ring relative rounded-md px-3.5 py-2 text-sm transition-colors duration-[var(--dur-fast)] focus-visible:outline-2 focus-visible:outline-offset-2",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {t(item.labelKey as MessageKey)}
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="bg-primary absolute inset-x-3.5 -bottom-0.5 h-px"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <InquiryTrigger
              origin="header"
              size={isScrolled ? "sm" : "default"}
              className="hidden sm:inline-flex"
            />
            <MobileNav />
          </div>
        </div>
      </header>
      <InquiryDrawer />
    </>
  );
}
