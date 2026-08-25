import type { Metadata } from "next";
import { HomeScreen } from "@/features/home/components/home-screen";
import { pageMetadata } from "@/lib/page-metadata";
import { getTranslations } from "@/i18n/server";
import { siteConfig } from "@/config/site";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();
  return pageMetadata({
    locale,
    route: "/",
    title: `${siteConfig.name} · ${t("site.role")}`,
    description: t("seo.homeDescription"),
  });
}

export default function HomePage() {
  return <HomeScreen />;
}
