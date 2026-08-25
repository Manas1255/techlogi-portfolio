import type { Metadata } from "next";
import { WorkScreen } from "@/features/work/components/work-screen";
import { pageMetadata } from "@/lib/page-metadata";
import { getTranslations } from "@/i18n/server";
import { activeCategories, type ProjectCategory } from "@/content";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/work">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();
  return pageMetadata({
    locale,
    route: "/work",
    title: t("seo.workTitle"),
    description: t("seo.workDescription"),
  });
}

/**
 * The filter is read on the SERVER from the query string, which makes this
 * route dynamic. That is deliberate: rendering it on the client instead put a
 * `useSearchParams` consumer inside a Suspense boundary, and Next then drops
 * the whole boundary from the prerendered HTML, `/work` shipped no heading
 * and not one project to a crawler, and refilled on hydration for 0.56 CLS.
 *
 * A server render of five projects' worth of static content costs a few
 * milliseconds and is the right price for a page that is entirely indexable
 * and never shifts.
 */
export default async function WorkPage({
  searchParams,
}: PageProps<"/[locale]/work">) {
  const { category } = await searchParams;
  const known = activeCategories().some((entry) => entry.id === category);
  return <WorkScreen category={known ? (category as ProjectCategory) : null} />;
}
