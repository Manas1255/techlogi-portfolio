import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The design-system page is an internal reference, not a landing page.
      disallow: ["/design-system"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
