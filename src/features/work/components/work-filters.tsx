"use client";

import { parseAsString, useQueryState } from "nuqs";
import { ProjectPanel } from "@/components/sections";
import { activeCategories, projects, type ProjectCategory } from "@/content";
import { useTranslations, type MessageKey } from "@/i18n";
import { cn } from "@/lib/utils";

/**
 * The work index, filterable by capability.
 *
 * The filter lives in the URL (`/work?category=ai`) via nuqs, so a filtered
 * view survives a refresh, can be linked, and gives the back button something
 * sensible to do. Categories are derived from the content, so a filter can
 * never lead to an empty state — a filter that yields nothing is a design bug,
 * not a feature.
 *
 * The results region is a live region: filtering with the keyboard otherwise
 * changes the page silently.
 */
export function WorkFilters() {
  const t = useTranslations();
  const [category, setCategory] = useQueryState(
    "category",
    parseAsString
      .withDefault("all")
      .withOptions({ history: "push", shallow: true }),
  );

  const categories = activeCategories();
  const isKnown = categories.some((entry) => entry.id === category);
  const active = isKnown ? (category as ProjectCategory) : null;
  const visible =
    active === null
      ? projects
      : projects.filter((project) => project.categories.includes(active));

  return (
    <>
      <div className="border-hairline mt-12 flex flex-wrap items-center gap-2 border-t pt-6">
        <FilterChip
          isActive={active === null}
          onClick={() => void setCategory(null)}
          count={projects.length}
        >
          {t("site.allWork")}
        </FilterChip>
        {categories.map((entry) => (
          <FilterChip
            key={entry.id}
            isActive={active === entry.id}
            onClick={() => void setCategory(entry.id)}
            count={entry.count}
          >
            {t(`site.categories.${entry.id}` as MessageKey)}
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
          />
        ))}
      </div>
    </>
  );
}

function FilterChip({
  isActive,
  onClick,
  count,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        "focus-visible:outline-ring inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-[var(--dur-base)] focus-visible:outline-2 focus-visible:outline-offset-2",
        isActive
          ? "border-primary bg-primary/10 text-foreground"
          : "border-hairline text-muted-foreground hover:border-hairline-strong hover:text-foreground",
      )}
    >
      {children}
      <span className="text-mono-label text-muted-foreground">{count}</span>
    </button>
  );
}
