"use client";

import { Menu, X } from "lucide-react";
import { AppLink as Link } from "@/components/layout/app-link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { NAV_ITEMS } from "@/constants";
import { siteConfig } from "@/config/site";
import { BookCallButton } from "@/features/booking";
import { InquiryTrigger } from "@/features/inquiry";
import { useTranslations, type MessageKey } from "@/i18n";
import { Logo } from "./logo";

/**
 * Mobile navigation, designed as its own experience, not a stacked desktop bar.
 *
 * Full-height, oversized type, one item per line, with the primary action
 * anchored at the bottom where a thumb is. Radix's Dialog underneath handles
 * the parts that are easy to get wrong by hand: focus trapped while open,
 * Escape to close, focus returned to the trigger, the page behind inert, and
 * scroll position preserved rather than reset to the top on close.
 */
export function MobileNav() {
  const t = useTranslations();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // The menu closes when a destination is chosen, rather than in an effect
  // watching the pathname: navigation is the event, and reacting to the route
  // AFTER it changes means a render with the panel still over the new page.

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <Menu aria-hidden="true" className="size-5" />
        <span className="sr-only">{t("nav.openMenu")}</span>
      </Button>

      <SheetContent
        side="right"
        className="border-hairline flex w-full flex-col gap-0 p-0 sm:max-w-full"
      >
        <SheetHeader className="border-hairline flex-row items-center justify-between gap-4 border-b p-5">
          <SheetTitle className="sr-only">{t("nav.primary")}</SheetTitle>
          <Logo />
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X aria-hidden="true" className="size-5" />
            <span className="sr-only">{t("nav.closeMenu")}</span>
          </Button>
        </SheetHeader>

        <nav
          aria-label={t("nav.primary")}
          className="flex-1 overflow-y-auto p-5"
        >
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item, index) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.href} className="border-hairline border-b">
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                    className="group/nav flex items-baseline gap-4 py-5 focus-visible:outline-none"
                  >
                    <span className="text-mono-label text-muted-foreground w-6 shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={
                        isActive
                          ? "text-display-2 text-primary"
                          : "text-display-2 group-focus-visible/nav:text-primary"
                      }
                    >
                      {t(item.labelKey as MessageKey)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-hairline flex flex-col gap-4 border-t p-5">
          <BookCallButton
            origin="mobile-nav"
            size="lg"
            className="w-full"
            onClickCapture={() => setIsOpen(false)}
          />
          <InquiryTrigger
            origin="mobile-nav-brief"
            variant="ghost"
            size="lg"
            className="w-full rounded-full"
            onClickCapture={() => setIsOpen(false)}
          />
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="tap-target text-mono-label text-muted-foreground hover:text-foreground transition-colors"
          >
            {siteConfig.contact.email}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
