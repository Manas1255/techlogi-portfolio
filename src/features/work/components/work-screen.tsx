import { BookACall } from "@/components/sections";
import {
  Container,
  Eyebrow,
  PlaceholderNote,
  Reveal,
} from "@/components/marketing";
import { getContent, hasDraftCaseStudies } from "@/content";
import type { ProjectCategory } from "@/content";
import { getLocale, getTranslations } from "@/i18n/server";
import { WorkFilters } from "./work-filters";

/**
 * `/work`, the portfolio index.
 *
 * The same editorial panels as the home page, at full length and filterable.
 * A grid of identical cards would be the easy answer and the wrong one: the
 * point of this page is that each project can be evaluated without opening it.
 */
export async function WorkScreen({
  category,
}: {
  category: ProjectCategory | null;
}) {
  const t = await getTranslations();
  const { projects } = getContent(await getLocale());

  return (
    <>
      <section
        data-surface="slab"
        className="wash-slab grain pt-32 pb-8 md:pt-40 md:pb-12"
      >
        <Container>
          <div className="flex flex-col gap-6">
            <Reveal variant="fade">
              <Eyebrow>{t("pages.work.eyebrow")}</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="text-display-1 max-w-4xl text-balance">
                {t("pages.work.title", { count: projects.length })}
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-lead text-muted-foreground">
                {t("pages.work.lead")}
              </p>
            </Reveal>
            {hasDraftCaseStudies() && (
              <Reveal variant="fade" delay={180} className="max-w-2xl pt-2">
                <PlaceholderNote tone="panel">
                  {t("pages.work.draftNote")}
                </PlaceholderNote>
              </Reveal>
            )}
          </div>
        </Container>
      </section>

      <section className="pb-24 md:pb-32">
        <Container>
          <WorkFilters category={category} />
        </Container>
      </section>

      <BookACall
        origin="work-close"
        title={t("pages.work.closeTitle")}
        lead={t("pages.work.closeLead")}
      />
    </>
  );
}
