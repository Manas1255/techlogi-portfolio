import type { Metadata } from "next";
import { ServicesScreen } from "@/features/services/components/services-screen";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Product strategy, design systems, web and SaaS engineering, mobile apps, AI integration and product modernization — with what you receive at each stage.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: `Services · ${siteConfig.name}`,
    description:
      "Product strategy, design, engineering, mobile, AI and product modernization.",
    url: `${siteConfig.url}/services`,
  },
};

export default function ServicesPage() {
  return <ServicesScreen />;
}
