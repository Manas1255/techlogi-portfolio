import type { Metadata } from "next";
import { ContactScreen } from "@/features/contact/components/contact-screen";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Techlogi. One question to begin, four short steps, and a person replies within one business day.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact · ${siteConfig.name}`,
    description:
      "Start a project with Techlogi. A person reads and answers every inquiry.",
    url: `${siteConfig.url}/contact`,
  },
};

export default function ContactPage() {
  return <ContactScreen />;
}
