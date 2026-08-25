import { Section, SectionIntro } from "@/components/marketing";
import { getContent } from "@/content";
import { getLocale, getTranslations } from "@/i18n/server";

/**
 * TECHNOLOGY, grouped and argued, never a logo wall.
 *
 * Each group leads with WHY those choices; the names follow in a monospace
 * list. Technology is secondary to outcomes, so this is the one section on the
 * page that is deliberately a card grid, a grid is genuinely the right form
 * for six parallel, equal-weight groups, and using it exactly once is what
 * keeps it from being the site's default answer.
 */
export async function TechnologiesSection() {
  const t = await getTranslations();
  const { techGroups } = getContent(await getLocale());

  return (
    <Section rhythm="base" divided>
      <SectionIntro
        index={5}
        eyebrow={t("stack.eyebrow")}
        title={t("stack.title")}
        lead={t("stack.lead")}
      />

      <ul className="mt-12 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
        {techGroups.map((group) => (
          <li
            key={group.id}
            className="border-hairline flex flex-col gap-4 border-t py-7 pr-6"
          >
            <h3 className="text-display-3">{group.name}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {group.rationale}
            </p>
            <ul className="mt-auto flex flex-wrap gap-x-2 gap-y-2 pt-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="text-mono-label text-muted-foreground border-hairline rounded border px-2 py-1"
                >
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}
