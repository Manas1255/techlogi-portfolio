import type { Metadata } from "next";
import { AboutScreen } from "@/features/about/components/about-screen";
import { pageMetadata } from "@/lib/page-metadata";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();
  return pageMetadata({
    locale,
    route: "/about",
    title: t("seo.aboutTitle"),
    description: t("seo.aboutDescription"),
  });
}

export default function AboutPage() {
  return <AboutScreen />;
}
