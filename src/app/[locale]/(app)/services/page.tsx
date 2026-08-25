import type { Metadata } from "next";
import { ServicesScreen } from "@/features/services/components/services-screen";
import { pageMetadata } from "@/lib/page-metadata";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();
  return pageMetadata({
    locale,
    route: "/services",
    title: t("seo.servicesTitle"),
    description: t("seo.servicesDescription"),
  });
}

export default function ServicesPage() {
  return <ServicesScreen />;
}
