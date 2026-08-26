import { z } from "zod";
import { localizedSchema, type Resolved } from "./localized";

/**
 * CONTENT SCHEMAS, the shape of everything authored for this site.
 *
 * The scaffold's convention is that `features/*​/models` holds *wire* shapes
 * (what a backend returns) and Zod is the source of truth for their types.
 * Portfolio and services copy isn't wire data, it's authored content, so it
 * gets its own cross-cutting layer, but keeps the same rule: the schema is
 * declared once and every type is `z.infer`, never a hand-written interface
 * beside it.
 *
 * Nothing parses at render time (that would be a per-request cost for a
 * constant). `content.test.ts` parses every entry instead, so a malformed
 * project fails `npm run verify` rather than a page.
 *
 * TWO SHAPES PER ENTITY, and the distinction is load-bearing:
 *
 *   `RawProject`  as AUTHORED. Every prose field is a `Localized` object
 *                 holding all languages at once, so a case study and its
 *                 translation live on the same line and cannot drift apart.
 *   `Project`     as RENDERED. The same shape with every prose field already
 *                 flattened to a plain string for one locale.
 *
 * Components only ever see the second, which is why localising the content
 * layer changed almost no component: `project.tagline` is still a string.
 * `content/index.ts` holds the resolvers that turn one into the other.
 */

/* ─── Media ──────────────────────────────────────────────────────────────── */

/**
 * How a piece of media is framed. `browser` draws chrome with a URL, `device`
 * a phone shell, `bare` a hairline-only frame for full-bleed interface art.
 */
export const mediaFrameSchema = z.enum(["browser", "device", "bare"]);

/**
 * Synthetic interface compositions, real DOM, token-coloured, rendered by
 * `src/components/media/compositions`. They exist so the site can show software
 * behaving like software before a single client asset is cleared for publication,
 * and they adapt to the ink/bone surface they land on, which a screenshot cannot.
 *
 * Swapping in real media is a data edit: change `kind` to "image" or "video"
 * and point `src` at `public/media/projects/<slug>/…`.
 */
export const compositionSchema = z.enum([
  "analytics",
  "agent-console",
  "ops-board",
  "data-pipeline",
  "commerce",
  "mobile-field",
]);

/**
 * Ratios for media that has no intrinsic size of its own. An IMAGE does not
 * appear here: it declares `width` and `height`, and the frame reserves the box
 * from those. Making an author restate an image's ratio is just a chance to get
 * it wrong, and a wrong one letterboxes or crops the picture.
 */
export const aspectSchema = z.enum([
  "16/9",
  "16/10",
  "4/3",
  "3/2",
  "1/1",
  "9/16",
  "4/5",
]);

const mediaBase = z.object({
  /** Frame treatment. */
  frame: mediaFrameSchema.default("bare"),
  /** Shown in browser chrome. Cosmetic, never a link. */
  chromeUrl: z.string().nullable().default(null),
  /**
   * Alt text is LOCALIZED: it is read aloud, so it has to be in the language
   * of the page it is on. An empty string in both marks the media decorative,
   * which is correct when the caption beside it already carries the meaning.
   */
  alt: localizedSchema,
});

export const imageMediaSchema = mediaBase.extend({
  kind: z.literal("image"),
  src: z.string().min(1),
  /** Intrinsic pixel size. The frame reserves its box from these two. */
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  /** Responsive `sizes`. Get this wrong and the browser downloads the wrong file. */
  sizes: z.string().default("100vw"),
  priority: z.boolean().default(false),
});

export const videoMediaSchema = mediaBase.extend({
  kind: z.literal("video"),
  aspect: aspectSchema,
  /** At least one source. `.webm` first, `.mp4` as the fallback. */
  sources: z
    .array(
      z.object({
        src: z.string().min(1),
        type: z.enum(["video/webm", "video/mp4"]),
      }),
    )
    .min(1),
  /** Required, always: a video with no poster is a layout shift with audio. */
  poster: z.string().min(1),
  loop: z.boolean().default(true),
  /** Autoplay is always muted and always `playsinline`; this only gates play. */
  autoplay: z.boolean().default(true),
});

export const syntheticMediaSchema = mediaBase.extend({
  kind: z.literal("synthetic"),
  aspect: aspectSchema,
  composition: compositionSchema,
  /** Drives the composition's own subtle motion; `false` keeps it still. */
  animate: z.boolean().default(true),
});

export const mediaSchema = z.discriminatedUnion("kind", [
  imageMediaSchema,
  videoMediaSchema,
  syntheticMediaSchema,
]);

/** As AUTHORED: `alt` still holds every language. */
export type RawMedia = z.infer<typeof mediaSchema>;
/** As RENDERED, for one locale. This is what components receive. */
export type Media = Resolved<RawMedia>;
export type MediaFrameKind = z.infer<typeof mediaFrameSchema>;
export type Aspect = z.infer<typeof aspectSchema>;
export type Composition = z.infer<typeof compositionSchema>;

/* ─── Projects ───────────────────────────────────────────────────────────── */

/**
 * A quantitative claim. PLACEHOLDER ONLY until
 * `siteConfig.hasVerifiedClientResults` is true, while it is false the UI
 * prints an honest footnote next to these instead of implying measurement.
 */
export const metricSchema = z.object({
  label: localizedSchema,
  value: z.string().min(1),
  note: localizedSchema,
});

export const caseStudySectionSchema = z.object({
  kind: z.enum(["problem", "approach", "design", "build", "result"]),
  title: localizedSchema,
  /** Paragraphs, not a blob, the renderer sets its own measure and rhythm. */
  body: z.array(localizedSchema).min(1),
  /** Optional supporting points, rendered as a hairline list. */
  points: z.array(localizedSchema).default([]),
  media: mediaSchema.nullable().default(null),
});

export const testimonialSchema = z.object({
  quote: localizedSchema,
  /** A person's name and their employer are not translated. */
  person: z.string().min(1),
  role: localizedSchema,
  company: z.string().min(1),
  /** Slug of the related project, or null. */
  projectSlug: z.string().nullable().default(null),
  portrait: z.string().nullable().default(null),
  /**
   * A PORTRAIT clip of the client saying this, once one is filmed and cleared.
   * The proof section is built around vertical video because that is what a
   * client can actually record on the phone in their hand; a booked studio
   * shoot is the reason most agency sites have no video at all.
   *
   * Null renders the slot as an honest, designed empty state rather than a
   * broken player. Aspect must be `9/16` or `4/5`; `content.test.ts` enforces
   * it, because a landscape clip in a portrait rail letterboxes to nothing.
   */
  video: videoMediaSchema.nullable().default(null),
  /** A measurable outcome, if one is cleared for publication. */
  outcome: z.string().nullable().default(null),
  /** False only once a real person has approved a real quote. */
  isPlaceholder: z.boolean(),
});

/** Filter categories on `/work`. */
export const projectCategorySchema = z.enum([
  "saas",
  "web-app",
  "mobile",
  "ai",
  "commerce",
  "data",
]);

export const projectSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be kebab-case."),
  /** The product's own name. Never translated. */
  name: z.string().min(1),
  /** One line under the name. Sentence case, no period. */
  tagline: localizedSchema,
  /** Two or three sentences on the business problem. */
  summary: localizedSchema,
  industry: localizedSchema,
  productType: localizedSchema,
  /** What GA Code actually did, in one sentence. */
  whatWeDid: localizedSchema,
  /** Qualitative and placeholder-safe, no numbers here. */
  outcome: localizedSchema,
  metrics: z.array(metricSchema).default([]),
  services: z.array(localizedSchema).min(1),
  /** Platform names are proper nouns: iOS, Android, API. Not translated. */
  platforms: z.array(z.string().min(1)).min(1),
  /** Technology names are proper nouns. Not translated. */
  technologies: z.array(z.string().min(1)).default([]),
  categories: z.array(projectCategorySchema).min(1),
  /** Engagement period. Localized, because month names are. */
  period: localizedSchema,
  heroMedia: mediaSchema,
  galleryMedia: z.array(mediaSchema).default([]),
  /** A dedicated demo reel, once one exists. */
  video: videoMediaSchema.nullable().default(null),
  testimonial: testimonialSchema.nullable().default(null),
  caseStudySections: z.array(caseStudySectionSchema).min(1),
  /** Controls selection on the home page. */
  featured: z.boolean(),
  /**
   * True while the written case study is a DRAFT, the product and the screens
   * are real, but the narrative has not been checked by the people who did the
   * work or cleared with the client. The case-study page says so plainly rather
   * than presenting an unverified account as fact.
   */
  isDraft: z.boolean(),
});

export type RawProject = z.infer<typeof projectSchema>;
export type Project = Resolved<RawProject>;
export type RawMetric = z.infer<typeof metricSchema>;
export type Metric = Resolved<RawMetric>;
export type RawCaseStudySection = z.infer<typeof caseStudySectionSchema>;
export type CaseStudySection = Resolved<RawCaseStudySection>;
export type RawTestimonial = z.infer<typeof testimonialSchema>;
export type Testimonial = Resolved<RawTestimonial>;
export type ProjectCategory = z.infer<typeof projectCategorySchema>;

/* ─── Services ───────────────────────────────────────────────────────────── */

export const capabilitySchema = z.object({
  name: localizedSchema,
  /** One sentence. What it is, not why it's great. */
  description: localizedSchema,
});

/** A named technology on a capability card. Shipped, never aspirational. */
export const techChipSchema = z.object({
  label: z.string().min(1),
});

/**
 * A capability card on the home page: what we can build, evidenced by the
 * technology we actually shipped it with and a link to where.
 *
 * Compact by construction. `description` is one or two short sentences because
 * eight of these sit in a grid, and the version that carried a drawn diagram
 * per card turned the section into eight screens of illustration in front of
 * the thing the page is actually asking for.
 */
export const homeCapabilitySchema = z.object({
  id: z.string().min(1),
  name: localizedSchema,
  description: localizedSchema,
  icon: z.enum([
    "smartphone",
    "server",
    "sparkles",
    "monitor",
    "radio",
    "palette",
    "globe",
    "layout-dashboard",
    "credit-card",
    "wrench",
    "rocket",
    "shield",
  ]),
  /** The lead technology or headline fact, set apart from the chips. */
  focus: localizedSchema,
  chips: z.array(techChipSchema).min(2),
  /** Where this was shipped. Null when the evidence is this site itself. */
  projectSlug: z.string().nullable(),
});

export const serviceGroupSchema = z.object({
  id: z.string().min(1),
  name: localizedSchema,
  /** The group's argument, in one or two sentences. */
  summary: localizedSchema,
  /** What a client receives from this group of work. */
  deliverables: z.array(localizedSchema).min(1),
  capabilities: z.array(capabilitySchema).min(1),
  /** Connects a capability group to real work. */
  relatedProjectSlug: z.string().nullable().default(null),
});

export type RawServiceGroup = z.infer<typeof serviceGroupSchema>;
export type ServiceGroup = Resolved<RawServiceGroup>;
export type RawServiceCapability = z.infer<typeof capabilitySchema>;
export type ServiceCapability = Resolved<RawServiceCapability>;
export type TechChip = z.infer<typeof techChipSchema>;
export type RawCapability = z.infer<typeof homeCapabilitySchema>;
export type Capability = Resolved<RawCapability>;

/* ─── Process ────────────────────────────────────────────────────────────── */

export const processStageSchema = z.object({
  id: z.string().min(1),
  name: localizedSchema,
  /** What actually happens. ONE sentence: this renders in a compact card. */
  what: localizedSchema,
  /**
   * What the client receives. The part a buyer is actually evaluating, and the
   * test each stage has to pass to be here: a stage with no deliverable is a
   * meeting, and the commonest failure of a process section is listing seven.
   */
  receives: localizedSchema,
  /** Typical duration, hedged honestly. */
  duration: localizedSchema,
  icon: z.enum([
    "message-circle",
    "compass",
    "pen-tool",
    "code",
    "repeat",
    "rocket",
  ]),
});

export type RawProcessStage = z.infer<typeof processStageSchema>;
export type ProcessStage = Resolved<RawProcessStage>;

/* ─── Shipped products (the logo strip) ──────────────────────────────────── */

/**
 * A product GA Code has shipped, for the proof strip under the hero.
 *
 * Every `logo` here is the REAL app icon, lifted from that product's own
 * Flutter repository (`ios/…/AppIcon.appiconset`, `assets/images/app_icon`, or
 * the Play Store icon). Nothing on this strip was drawn for this website, and
 * nothing may be: a logo wall is the single easiest thing on an agency site to
 * fabricate, and the moment one mark is invented the other six stop counting.
 *
 * Adding a product is a data edit plus the icon at `public/media/logos/`.
 * Where the product also has a written case study, `projectSlug` links the
 * tile to it, which is what separates this from decoration.
 */
export const shippedProductSchema = z.object({
  /** Kebab-case. Matches the icon filename at `public/media/logos/<id>.png`. */
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Product id must be kebab-case."),
  /** The product's own name. Never translated. */
  name: z.string().min(1),
  /** Two or three words. What it is, not what it promises. */
  kind: localizedSchema,
  /** Intrinsic size of the icon file, so the tile reserves its own box. */
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  /**
   * True when the icon already carries its own dark ground, so the tile must
   * NOT paint one behind it. Getting this wrong is what puts a navy square
   * inside a white square inside a dark section.
   */
  hasOwnGround: z.boolean(),
  /** Links the tile to a case study, where one exists. */
  projectSlug: z.string().nullable().default(null),
});

export type RawShippedProduct = z.infer<typeof shippedProductSchema>;
export type ShippedProduct = Resolved<RawShippedProduct>;

/* ─── Technologies ───────────────────────────────────────────────────────── */

export const techGroupSchema = z.object({
  id: z.string().min(1),
  name: localizedSchema,
  /** Why these, in one sentence, technology stays secondary to outcomes. */
  rationale: localizedSchema,
  /** Technology names are proper nouns. Not translated. */
  items: z.array(z.string().min(1)).min(1),
});

export type RawTechGroup = z.infer<typeof techGroupSchema>;
export type TechGroup = Resolved<RawTechGroup>;

/* ─── What we build (inquiry step one, and the hero's proof rail) ─────────── */

export const buildTypeSchema = z.object({
  /** Stable id, it is submitted with the inquiry, so don't rename casually. */
  id: z.enum([
    "web-app",
    "mobile-app",
    "saas-platform",
    "ai-product",
    "website",
    "improve-existing",
    "dedicated-team",
    "something-else",
  ]),
  label: localizedSchema,
  /** Shown under the label, in the words a buyer would use. */
  hint: localizedSchema,
});

export type RawBuildType = z.infer<typeof buildTypeSchema>;
export type BuildType = Resolved<RawBuildType>;
export type BuildTypeId = RawBuildType["id"];
