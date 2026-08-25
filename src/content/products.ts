import { l } from "./localized";
import type { RawShippedProduct } from "./schemas";

/**
 * SHIPPED PRODUCTS, the proof strip under the hero.
 *
 * This is the highest-value section on the page per pixel, because it is the
 * only one a visitor believes without reading. It earns that by being real:
 * every icon below was lifted from the product's own Flutter repository, at
 * the size the stores actually publish it. None of them was drawn for this
 * website, and none of them may be.
 *
 * That rule is not fussiness. A fabricated mark on a strip like this is
 * indistinguishable from a real one to a visitor and instantly recognisable to
 * anyone who knows the client, and the moment one is invented the other six
 * stop counting. If a product cannot be named publicly yet, it stays off the
 * strip rather than appearing as a grey placeholder.
 *
 * Order is deliberate: the four with written case studies lead, so the first
 * things a visitor can click through to are the ones with evidence behind
 * them. The remaining two carry the strip's width and say, correctly, that the
 * portfolio is larger than the four we have written up.
 *
 * ONE TILE PER PRODUCT, not one per repository. "Yusuf" and OurUmmah are the
 * same app under two names, and shipping both put the same product on the
 * strip twice, which inflates the portfolio in exactly the way this file
 * exists to prevent. When two repositories look like one product, check whose
 * mark appears in the marketing composites and keep that one.
 */
export const shippedProducts: RawShippedProduct[] = [
  {
    id: "zyuela",
    name: "Zyuela",
    kind: l("AI coaching", "KI-Coaching"),
    width: 256,
    height: 256,
    hasOwnGround: true,
    projectSlug: "zyuela",
  },
  {
    id: "orthotrack",
    name: "OrthoTrack",
    kind: l("Clinical care", "Medizinische Betreuung"),
    width: 256,
    height: 256,
    hasOwnGround: true,
    projectSlug: "orthotrack",
  },
  {
    id: "soulmate-society",
    name: "Soulmate Society",
    kind: l("Matchmaking", "Partnervermittlung"),
    width: 256,
    height: 256,
    hasOwnGround: true,
    projectSlug: "soulmate-society",
  },
  {
    /*
      The icon here is the one shipped as `yusuf_app_logo.png`: OurUmmah and
      "Yusuf" are the SAME product under two names, and the gold mark is the
      one that ships. It also matches the logo in every OurUmmah composite in
      `public/media/projects/`, which is the check that settled it. They were
      briefly two tiles on this strip, which quietly doubled the portfolio.
    */
    id: "our-ummah",
    name: "OurUmmah",
    kind: l("Community giving", "Gemeindespenden"),
    width: 256,
    height: 256,
    hasOwnGround: false,
    projectSlug: "our-ummah",
  },
  {
    id: "sma",
    name: "SMA",
    kind: l("Sports management", "Sportverwaltung"),
    width: 256,
    height: 256,
    hasOwnGround: true,
    projectSlug: null,
  },
  {
    id: "whispering-clouds",
    name: "Whispering Clouds",
    kind: l("Hospitality", "Gastgewerbe"),
    width: 256,
    height: 256,
    hasOwnGround: true,
    projectSlug: null,
  },
];

/** The icon path for a product. One place, so the convention cannot drift. */
export function productLogoSrc(product: { id: string }): string {
  return `/media/logos/${product.id}.png`;
}
