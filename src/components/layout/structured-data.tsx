import { publishedSocials, siteConfig } from "@/config/site";

/**
 * Organization structured data.
 *
 * One block, on the home page only, describing what GA Studio is. Deliberately
 * minimal: `aggregateRating`, `review` and `award` markup would be fabricated
 * here, and search engines treat invented structured data far less kindly than
 * its absence.
 */
export function OrganizationSchema() {
  const socials = publishedSocials();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    ...(socials.length > 0
      ? { sameAs: socials.map((social) => social.href) }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      // Serialized JSON with no user input; `</script>` is escaped so a future
      // content edit can't break out of the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/**
 * Case-study structured data. `CreativeWork` rather than `Article`: these are
 * project records, not journalism, and claiming otherwise is the kind of
 * over-marking that gets a site's rich results dropped.
 */
export function CaseStudySchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url,
    creator: {
      "@type": "Organization",
      name: siteConfig.legalName,
      url: siteConfig.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
