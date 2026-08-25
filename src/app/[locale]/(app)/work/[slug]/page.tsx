import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyScreen } from "@/features/work/components/case-study-screen";
import { caseStudyPath } from "@/constants";
import { findProject, projectSlugs } from "@/content";
import { toLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/page-metadata";

/**
 * Every case study is known at build time, so all of them prerender, in every
 * language. The locale comes from the parent segment's own static params, so
 * this only enumerates slugs.
 */
export function generateStaticParams(): { slug: string }[] {
  return projectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = findProject(slug, toLocale(locale));
  if (project === undefined) return {};

  return pageMetadata({
    locale,
    route: caseStudyPath(slug),
    title: `${project.name}, ${project.tagline}`,
    description: project.summary.slice(0, 200),
    type: "article",
  });
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/[locale]/work/[slug]">) {
  const { locale, slug } = await params;
  const project = findProject(slug, toLocale(locale));
  if (project === undefined) notFound();

  return <CaseStudyScreen project={project} />;
}
