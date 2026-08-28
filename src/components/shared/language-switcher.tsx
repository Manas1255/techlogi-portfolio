"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { swapLocale } from "@/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LOCALE_NAMES,
  SUPPORTED_LOCALES,
  toLocale,
  type Locale,
} from "@/i18n/locales";
import { useTranslations } from "@/i18n";
import { cn } from "@/lib/utils";

/**
 * The language switcher.
 *
 * It NAVIGATES rather than setting state, because the URL is the source of
 * truth: `/de/work` is a different document from `/work`, server-rendered in
 * German, and flipping a store while staying on the English URL would leave a
 * German interface on a page a crawler still reads as English.
 *
 * It also keeps the reader where they are. Someone three quarters of the way
 * down the OrthoTrack case study who picks Deutsch wants the German OrthoTrack
 * case study, not the German home page; dropping them at `/de` is the
 * commonest bug in a language switcher and the most annoying one.
 *
 * The choice is written to a cookie so `proxy.ts` honours it on the next
 * visit, when the browser's `Accept-Language` will still say English. An
 * explicit choice has to outrank a header, or the switcher appears not to have
 * worked.
 *
 * Language names are shown in their OWN language (Deutsch, not German): that
 * is the one string a reader who cannot read the current interface must be
 * able to recognise.
 */
/**
 * Remembers the choice for `proxy.ts`, at module scope rather than inside the
 * component. `document.cookie` is a global write, and the React compiler
 * rightly refuses to see one in a render-adjacent closure; hoisting it makes
 * it what it actually is, a side effect on the document rather than on
 * anything React owns.
 */
function rememberLocale(locale: Locale): void {
  // A year, path-wide, and `lax` so it survives an inbound link from search.
  document.cookie = `locale=${locale};path=/;max-age=31536000;samesite=lax`;
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const active = toLocale(pathname.split("/").filter(Boolean)[0]);

  if (SUPPORTED_LOCALES.length < 2) return null;

  const choose = (locale: Locale) => {
    rememberLocale(locale);
    router.push(swapLocale(pathname, locale));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("common.language")}
        className={cn(
          /*
            `tap-target` grows the hit area DOWN THE BLOCK AXIS ONLY: its
            pseudo-element is `inset-inline: 0`, so it fixes height and leaves
            width exactly as drawn. That is the right trade for an inline link
            in a sentence, where widening the strip would swallow taps meant
            for the words either side of it.

            It is the wrong trade here. Below 380px the header hides this
            control's label to make room, which leaves a bare icon measuring
            36x36, under the floor in BOTH axes, and `tap-target` was only ever
            covering one of them. `min-w-11` on a coarse pointer squares it off
            to 44 without touching the mouse-driven layout, where the label is
            present and the control is already wide enough.
          */
          "tap-target text-muted-foreground hover:text-foreground focus-visible:outline-ring inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-2.5 text-[0.8125rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 pointer-coarse:min-w-11",
          className,
        )}
      >
        <Languages className="size-4" aria-hidden="true" />
        <span className="uppercase">{active}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SUPPORTED_LOCALES.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onSelect={() => choose(locale)}
            aria-current={locale === active ? "true" : undefined}
            className={locale === active ? "font-medium" : undefined}
          >
            {LOCALE_NAMES[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
