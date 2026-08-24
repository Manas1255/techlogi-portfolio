import type { Metadata } from "next";
import { WorkScreen } from "@/features/work/components/work-screen";
import { siteConfig } from "@/config/site";
import { activeCategories, type ProjectCategory } from "@/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected product engineering work by GA Studio: SaaS platforms, web applications, mobile apps, data platforms and AI systems, with the problem and approach behind each one.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: `Work · ${siteConfig.name}`,
    description:
      "Selected product engineering work: SaaS platforms, web applications, mobile apps, data platforms and AI systems.",
    url: `${siteConfig.url}/work`,
  },
};

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
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const known = activeCategories().some((entry) => entry.id === category);
  return <WorkScreen category={known ? (category as ProjectCategory) : null} />;
}
