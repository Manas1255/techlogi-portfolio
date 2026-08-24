import type { Metadata } from "next";
import { AboutScreen } from "@/features/about/components/about-screen";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "How Techlogi works: written plans, validation at every boundary, every UI state designed, and a team that stays on after launch.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About · ${siteConfig.name}`,
    description:
      "How Techlogi works — the operating principles behind the engagements.",
    url: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  return <AboutScreen />;
}
