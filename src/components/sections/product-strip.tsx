import { Container } from "@/components/marketing";
import { getContent } from "@/content";
import { getLocale, getTranslations } from "@/i18n/server";
import { ProductMarquee } from "./product-marquee";

/**
 * PRODUCTS WE HAVE SHIPPED.
 *
 * Directly under the hero, because it is the only section on the page a
 * visitor believes without reading. Everything above it is a claim; this is
 * eight marks they can recognise, six of which they can click into a written
 * case study.
 *
 * These are the REAL app icons, taken from each product's own Flutter
 * repository at the size the stores publish. That constraint is the section:
 * a fabricated mark is indistinguishable from a real one to a visitor and
 * instantly obvious to anyone who knows the client, and one invented logo
 * makes the other seven worthless. See `content/products.ts`.
 *
 * Drawn as APP ICONS rather than as a greyscale logo wall, which is the usual
 * treatment and the wrong one here. A logo wall says "these companies are our
 * clients"; these are products we built, and a squircle tile is the form a
 * person already reads as "an app that exists and is installed on phones".
 * Greyscaling them would also throw away the one thing they have in common,
 * which is the brass and gold this site's whole palette was drawn from.
 *
 * Subtle by construction: the tiles are 56px, the row is quiet, and the names
 * sit in the same mono as every other piece of metadata. It is proof, not a
 * trophy cabinet.
 *
 * The row MOVES, which is the one place on the site a continuous loop earns
 * its cost. Six logos in a static row read as everything the studio has ever
 * done; the same six sliding past read as a sample of something longer, which
 * is both the better impression and the true one. See `product-marquee.tsx`
 * for the seam, the pause and the onstage gate.
 */
export async function ProductStrip() {
  const t = await getTranslations();
  const { shippedProducts } = getContent(await getLocale());

  return (
    <section
      data-surface="slab"
      /*
        No `overflow-hidden` here. The marquee clips itself, and a second
        clip on the section reports the track's full width as content the
        visitor cannot reach, which the layout sweep correctly fails.
      */
      className="border-hairline relative border-t py-12 md:py-16"
      aria-labelledby="shipped-products"
    >
      <Container width="wide">
        <div className="flex flex-col gap-6">
          <h2
            id="shipped-products"
            className="text-eyebrow text-muted-foreground text-center"
          >
            {t("products.heading")}
          </h2>

          {/* A capsule inside the measure, not a full-bleed band. Edge to edge
              the rail read as page furniture; contained and rounded it reads
              as one object holding the products, which is the claim. */}
          <ProductMarquee
            products={shippedProducts}
            viewLabel={t("products.viewCaseStudy")}
          />
        </div>
      </Container>
    </section>
  );
}
