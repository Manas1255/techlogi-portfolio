import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyScreen } from "@/features/work/components/case-study-screen";
import { siteConfig } from "@/config/site";
import { findProject, projectSlugs } from "@/content";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

/** Every case study is known at build time, so all of them prerender. */
export function generateStaticParams(): { slug: string }[] {
  return projectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (project === undefined) return {};

  const title = `${project.name} — ${project.tagline}`;
  return {
    title: project.name,
    description: project.summary.slice(0, 200),
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${title} · ${siteConfig.name}`,
      description: project.summary.slice(0, 200),
      url: `${siteConfig.url}/work/${project.slug}`,
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = findProject(slug);
  if (project === undefined) notFound();

  return <CaseStudyScreen project={project} />;
}
