import Link from "next/link";
import { ProjectPanel } from "@/components/sections";
import { APP_ROUTES } from "@/constants";
import {
  activeCategories,
  projectsByCategory,
  type ProjectCategory,
} from "@/content";
import { translate } from "@/i18n/translate";
import { SOURCE_LOCALE } from "@/i18n/locales";
import type { MessageKey } from "@/i18n/types";
import { cn } from "@/lib/utils";

/**
 * The work index, filterable by capability.
 *
 * A SERVER component, and the filter is a set of links rather than client
 * state. The previous version used `useQueryState`, which put a
 * `useSearchParams` consumer inside the page's Suspense boundary, and that
 * makes Next drop the ENTIRE boundary from the prerendered HTML. The
 * consequences were not subtle: `/work` shipped no `<h1>` and not one project
 * to a crawler, and refilling the page on hydration measured 0.56 CLS against
 * a 0.1 budget.
 *
 * Links fix all of it at once. Every project is in the HTML, there is no
 * hydration shift because nothing is added after paint, the filter still lives
 * in the URL so a filtered view can be shared and the back button works, and
 * the whole thing keeps working with JavaScript disabled. It costs a server
 * render per filter, which for five projects of static content is a few
 * milliseconds, and is the correct trade.
 *
 * `scroll={false}` keeps the viewport where it is: the reader is looking at
 * the filter row, and jumping them to the top of the document on every choice
 * would be its own bug.
 */
export function WorkFilters({
  category,
}: {
  category: ProjectCategory | null;
}) {
  const categories = activeCategories();
  const visible = projectsByCategory(category);
  const t = (key: string) => translate(SOURCE_LOCALE, key as MessageKey);

  return (
    <>
      <div className="border-hairline mt-12 flex flex-wrap items-center gap-2 border-t pt-6">
        <FilterChip
          href={APP_ROUTES.work}
          isActive={category === null}
          count={projectsByCategory(null).length}
        >
          {t("site.allWork")}
        </FilterChip>
        {categories.map((entry) => (
          <FilterChip
            key={entry.id}
            href={`${APP_ROUTES.work}?category=${entry.id}`}
            isActive={category === entry.id}
            count={entry.count}
          >
            {t(`site.categories.${entry.id}`)}
          </FilterChip>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} projects shown
      </p>

      <div className="mt-16 flex flex-col gap-24 md:mt-20 md:gap-32">
        {visible.map((project, index) => (
          <ProjectPanel
            key={project.slug}
            project={project}
            index={index}
            reversed={index % 2 === 1}
            fullBleed={index % 3 === 2}
            // On /work the panels sit directly under the page title, so their
            // names are the second level, not the third.
            headingLevel="h2"
          />
        ))}
      </div>
    </>
  );
}

function FilterChip({
  href,
  isActive,
  count,
  children,
}: {
  href: string;
  isActive: boolean;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "focus-visible:outline-ring inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-[var(--dur-base)] focus-visible:outline-2 focus-visible:outline-offset-2",
        isActive
          ? "border-primary bg-accent text-foreground"
          : "border-hairline text-muted-foreground hover:border-hairline-strong hover:text-foreground",
      )}
    >
      {children}
      <span className="text-mono-label text-muted-foreground">{count}</span>
    </Link>
  );
}
