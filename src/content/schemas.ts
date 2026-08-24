import { z } from "zod";

/**
 * CONTENT SCHEMAS — the shape of everything authored for this site.
 *
 * The scaffold's convention is that `features/*​/models` holds *wire* shapes
 * (what a backend returns) and Zod is the source of truth for their types.
 * Portfolio and services copy isn't wire data — it's authored content — so it
 * gets its own cross-cutting layer, but keeps the same rule: the schema is
 * declared once and every type is `z.infer`, never a hand-written interface
 * beside it.
 *
 * Nothing parses at render time (that would be a per-request cost for a
 * constant). `content.test.ts` parses every entry instead, so a malformed
 * project fails `npm run verify` rather than a page.
 */

/* ─── Media ──────────────────────────────────────────────────────────────── */

/**
 * How a piece of media is framed. `browser` draws chrome with a URL, `device`
 * a phone shell, `bare` a hairline-only frame for full-bleed interface art.
 */
export const mediaFrameSchema = z.enum(["browser", "device", "bare"]);

/**
 * Synthetic interface compositions — real DOM, token-coloured, rendered by
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
  /** Shown in browser chrome. Cosmetic — never a link. */
  chromeUrl: z.string().nullable().default(null),
  /**
   * Empty string marks the media decorative, which is correct when the caption
   * beside it already carries the meaning.
   */
  alt: z.string(),
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

export type Media = z.infer<typeof mediaSchema>;
export type MediaFrameKind = z.infer<typeof mediaFrameSchema>;
export type Aspect = z.infer<typeof aspectSchema>;
export type Composition = z.infer<typeof compositionSchema>;

/* ─── Projects ───────────────────────────────────────────────────────────── */

/**
 * A quantitative claim. PLACEHOLDER ONLY until
 * `siteConfig.hasVerifiedClientResults` is true — while it is false the UI
 * prints an honest footnote next to these instead of implying measurement.
 */
export const metricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  note: z.string().min(1),
});

export const caseStudySectionSchema = z.object({
  kind: z.enum(["problem", "approach", "design", "build", "result"]),
  title: z.string().min(1),
  /** Paragraphs, not a blob — the renderer sets its own measure and rhythm. */
  body: z.array(z.string().min(1)).min(1),
  /** Optional supporting points, rendered as a hairline list. */
  points: z.array(z.string().min(1)).default([]),
  media: mediaSchema.nullable().default(null),
});

export const testimonialSchema = z.object({
  quote: z.string().min(1),
  person: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
  /** Slug of the related project, or null. */
  projectSlug: z.string().nullable().default(null),
  portrait: z.string().nullable().default(null),
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
  name: z.string().min(1),
  /** One line under the name. Sentence case, no period. */
  tagline: z.string().min(1),
  /** Two or three sentences on the business problem. */
  summary: z.string().min(1),
  industry: z.string().min(1),
  productType: z.string().min(1),
  /** What Techlogi actually did, in one sentence. */
  whatWeDid: z.string().min(1),
  /** Qualitative and placeholder-safe — no numbers here. */
  outcome: z.string().min(1),
  metrics: z.array(metricSchema).default([]),
  services: z.array(z.string().min(1)).min(1),
  platforms: z.array(z.string().min(1)).min(1),
  technologies: z.array(z.string().min(1)).default([]),
  categories: z.array(projectCategorySchema).min(1),
  /** Engagement year, or a range. Display string. */
  period: z.string().min(1),
  heroMedia: mediaSchema,
  galleryMedia: z.array(mediaSchema).default([]),
  /** A dedicated demo reel, once one exists. */
  video: videoMediaSchema.nullable().default(null),
  testimonial: testimonialSchema.nullable().default(null),
  caseStudySections: z.array(caseStudySectionSchema).min(1),
  /** Controls selection on the home page. */
  featured: z.boolean(),
  /**
   * True while the written case study is a DRAFT — the product and the screens
   * are real, but the narrative has not been checked by the people who did the
   * work or cleared with the client. The case-study page says so plainly rather
   * than presenting an unverified account as fact.
   */
  isDraft: z.boolean(),
});

export type Project = z.infer<typeof projectSchema>;
export type Metric = z.infer<typeof metricSchema>;
export type CaseStudySection = z.infer<typeof caseStudySectionSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type ProjectCategory = z.infer<typeof projectCategorySchema>;

/* ─── Services ───────────────────────────────────────────────────────────── */

export const capabilitySchema = z.object({
  name: z.string().min(1),
  /** One sentence. What it is, not why it's great. */
  description: z.string().min(1),
});

export const serviceGroupSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  /** The group's argument, in one or two sentences. */
  summary: z.string().min(1),
  /** What a client receives from this group of work. */
  deliverables: z.array(z.string().min(1)).min(1),
  capabilities: z.array(capabilitySchema).min(1),
  /** Connects a capability group to real work. */
  relatedProjectSlug: z.string().nullable().default(null),
});

export type ServiceGroup = z.infer<typeof serviceGroupSchema>;
export type Capability = z.infer<typeof capabilitySchema>;

/* ─── Process ────────────────────────────────────────────────────────────── */

export const processStageSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  /** What actually happens. */
  what: z.string().min(1),
  /** What the client receives — the part buyers care about. */
  receives: z.array(z.string().min(1)).min(1),
  /** Typical duration, hedged honestly. */
  duration: z.string().min(1),
});

export type ProcessStage = z.infer<typeof processStageSchema>;

/* ─── Technologies ───────────────────────────────────────────────────────── */

export const techGroupSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  /** Why these, in one sentence — technology stays secondary to outcomes. */
  rationale: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

export type TechGroup = z.infer<typeof techGroupSchema>;

/* ─── What we build (inquiry step one, and the hero's proof rail) ─────────── */

export const buildTypeSchema = z.object({
  /** Stable id — it is submitted with the inquiry, so don't rename casually. */
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
  label: z.string().min(1),
  /** Shown under the label in the inquiry's first step. */
  hint: z.string().min(1),
});

export type BuildType = z.infer<typeof buildTypeSchema>;
export type BuildTypeId = BuildType["id"];
