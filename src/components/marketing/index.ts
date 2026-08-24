/**
 * Marketing presentation primitives.
 *
 * These are pure: they take content and render it. They never reach into
 * `features/`, the lint boundary enforces that, so a section can be composed
 * on the server and stay there.
 */
export {
  Container,
  type ContainerProps,
  type ContainerWidth,
} from "./container";
export {
  Section,
  type SectionProps,
  type Surface,
  type Rhythm,
} from "./section";
export { Reveal, type RevealProps } from "./reveal";
export { Eyebrow, type EyebrowProps } from "./eyebrow";
export { SectionIntro, type SectionIntroProps } from "./section-intro";
export { ArrowLink, type ArrowLinkProps } from "./arrow-link";
export { HairlineList, type HairlineListProps } from "./hairline-list";
export { PlaceholderNote, type PlaceholderNoteProps } from "./placeholder-note";
export {
  ChoiceCards,
  type Choice,
  type ChoiceCardsProps,
} from "./choice-cards";
