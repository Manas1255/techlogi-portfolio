import type { Metadata } from "next";
import { ContactScreen } from "@/features/contact/components/contact-screen";
import { pageMetadata } from "@/lib/page-metadata";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();
  return pageMetadata({
    locale,
    route: "/contact",
    title: t("seo.contactTitle"),
    description: t("seo.contactDescription"),
  });
}

export default function ContactPage() {
  return <ContactScreen />;
}
