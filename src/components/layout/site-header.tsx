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
 * At the top of the page it is an ordinary full-bleed bar sitting on the warm
 * wash. Past the fold it DETACHES: the outer padding opens, the bar contracts
 * to a centred capsule of warm glass, and the row loses height. One continuous
 * morph rather than a bar that swaps itself for a different bar — every
 * property that changes lives on the same element, so the browser interpolates
 * instead of cutting.
 *
 * `fixed`, not `sticky`, on purpose: the whole point of the glass is that the
 * page slides underneath it. A sticky header reserves its own strip of layout
 * and nothing ever passes behind it.
 *
 * It never hides on scroll-down. "Start a Project" has to be reachable at every
 * moment, which is the entire point of a persistent control.
 *
 * The morph is CSS transitions, so `motion-reduce:transition-none` is what
 * turns it off — the state still changes, it just cuts instead of animating.
 *
 * The inquiry drawer is mounted here, once, for the whole site.
 */
export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const { isScrolled } = useScrollPosition();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* The outer padding is what lets the capsule pull away from the
            window edges as it detaches. */}
        <div
          className={cn(
            "transition-[padding] duration-500 ease-out motion-reduce:transition-none",
            isScrolled ? "px-3 pt-3 sm:px-6 sm:pt-4" : "px-0 pt-0",
          )}
        >
          <div
            className={cn(
              "relative mx-auto transition-[max-width,border-radius,background-color,border-color] duration-500 ease-out motion-reduce:transition-none",
              isScrolled
                ? "capsule-glass max-w-3xl rounded-full border-transparent"
                : "max-w-full rounded-none border-transparent bg-transparent",
            )}
          >
            <div
              className={cn(
                "mx-auto flex items-center gap-3 transition-[height,padding] duration-500 ease-out motion-reduce:transition-none",
                isScrolled
                  ? "h-14 px-4 sm:px-5"
                  : "max-w-content h-20 px-5 sm:px-8 lg:px-10",
              )}
            >
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
                            "focus-visible:outline-ring relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-[var(--dur-fast)] focus-visible:outline-2 focus-visible:outline-offset-2",
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {t(item.labelKey as MessageKey)}
                          {isActive && (
                            <span
                              aria-hidden="true"
                              className="bg-primary absolute inset-x-3.5 bottom-1 h-px"
                            />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="ml-auto flex items-center gap-2 lg:ml-3">
                {/* Never hidden: "always-reachable" has to hold on a phone,
                    where burying the primary action behind a hamburger costs a
                    tap at the exact moment intent is highest. */}
                <InquiryTrigger
                  origin="header"
                  size={isScrolled ? "sm" : "default"}
                  className="rounded-full max-sm:h-9 max-sm:px-3.5 max-sm:text-[0.8125rem]"
                />
                <MobileNav />
              </div>
            </div>
          </div>
        </div>
      </header>
      <InquiryDrawer />
    </>
  );
}
