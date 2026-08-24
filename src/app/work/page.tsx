import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkScreen } from "@/features/work/components/work-screen";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected product engineering work by Techlogi: SaaS platforms, web applications, mobile apps, data platforms and AI systems, with the problem and approach behind each one.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: `Work · ${siteConfig.name}`,
    description:
      "Selected product engineering work: SaaS platforms, web applications, mobile apps, data platforms and AI systems.",
    url: `${siteConfig.url}/work`,
  },
};

export default function WorkPage() {
  // The index reads its filter from the URL, which makes it a dynamic
  // subtree — the Suspense boundary keeps the rest of the page static.
  return (
    <Suspense>
      <WorkScreen />
    </Suspense>
  );
}
