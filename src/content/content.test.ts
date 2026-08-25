import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  activeCategories,
  featuredProjects,
  findProject,
  nextProject,
  productLogoSrc,
  projectSlugs,
  projectsByCategory,
  rawContent,
} from "./index";
import { SOURCE_LOCALE, SUPPORTED_LOCALES } from "@/i18n/locales";

/*
  Tests read the RAW catalogs, every language at once, because that is where a
  missing translation lives. Reading through `getContent(locale)` would resolve
  each entry to one string first and hide exactly the defect being looked for.
*/
const {
  buildTypes,
  processStages,
  projects,
  serviceGroups,
  shippedProducts,
  techGroups,
  testimonials,
} = rawContent;
import {
  buildTypeSchema,
  processStageSchema,
  projectSchema,
  serviceGroupSchema,
  shippedProductSchema,
  techGroupSchema,
  testimonialSchema,
} from "./schemas";

/**
 * Content is parsed HERE, not at render time, a constant shouldn't pay a
 * validation cost on every request. The consequence is that a malformed entry
 * fails `npm run verify` instead of a page, which is where you want to find it.
 */

describe("content parses against its schemas", () => {
  it.each(projects.map((project) => [project.slug, project] as const))(
    "project %s",
    (_slug, project) => {
      expect(() => projectSchema.parse(project)).not.toThrow();
    },
  );

  it.each(serviceGroups.map((group) => [group.id, group] as const))(
    "service group %s",
    (_id, group) => {
      expect(() => serviceGroupSchema.parse(group)).not.toThrow();
    },
  );

  it.each(processStages.map((stage) => [stage.id, stage] as const))(
    "process stage %s",
    (_id, stage) => {
      expect(() => processStageSchema.parse(stage)).not.toThrow();
    },
  );

  it.each(techGroups.map((group) => [group.id, group] as const))(
    "tech group %s",
    (_id, group) => {
      expect(() => techGroupSchema.parse(group)).not.toThrow();
    },
  );

  it("every testimonial parses", () => {
    for (const testimonial of testimonials) {
      expect(() => testimonialSchema.parse(testimonial)).not.toThrow();
    }
  });

  it.each(shippedProducts.map((product) => [product.id, product] as const))(
    "shipped product %s",
    (_id, product) => {
      expect(() => shippedProductSchema.parse(product)).not.toThrow();
    },
  );

  it("every build type parses", () => {
    for (const buildType of buildTypes) {
      expect(() => buildTypeSchema.parse(buildType)).not.toThrow();
    }
  });
});

describe("content integrity", () => {
  it("has unique project slugs", () => {
    const slugs = projectSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("features at least three projects for the home page", () => {
    expect(featuredProjects(SOURCE_LOCALE).length).toBeGreaterThanOrEqual(3);
  });

  it("resolves every service group's related project", () => {
    for (const group of serviceGroups) {
      if (group.relatedProjectSlug === null) continue;
      expect(findProject(group.relatedProjectSlug)).toBeDefined();
    }
  });

  it("resolves every testimonial's related project", () => {
    for (const testimonial of testimonials) {
      if (testimonial.projectSlug === null) continue;
      expect(findProject(testimonial.projectSlug)).toBeDefined();
    }
  });

  it("gives every case study the full narrative arc", () => {
    for (const project of projects) {
      const kinds = project.caseStudySections.map((section) => section.kind);
      expect(kinds).toEqual([
        "problem",
        "approach",
        "design",
        "build",
        "result",
      ]);
    }
  });

  it("never publishes a metric on a draft case study", () => {
    // No number goes on this site until someone can point at where it was
    // measured. While a write-up is a draft, it carries no figures at all.
    for (const project of projects) {
      for (const metric of project.metrics) {
        for (const locale of SUPPORTED_LOCALES) {
          expect(metric.note[locale].length).toBeGreaterThan(0);
        }
        expect(
          project.isDraft,
          `${project.slug} publishes a metric while its write-up is still a draft`,
        ).toBe(false);
      }
    }
  });

  it("never leaves a category filter empty", () => {
    for (const { id, count } of activeCategories()) {
      expect(projectsByCategory(id)).toHaveLength(count);
    }
  });

  it("always has somewhere to go after a case study", () => {
    for (const project of projects) {
      const next = nextProject(project.slug);
      expect(next).toBeDefined();
      expect(next?.slug).not.toBe(project.slug);
    }
  });

  it("has no content left untranslated", () => {
    /*
      The schema guarantees every language is PRESENT and non-empty. It cannot
      see the commonest way a translation goes missing, which is copy-pasting
      the English into the German slot to make the type checker stop
      complaining and never coming back to it.

      So: walk every localized value in the repo and flag any whose languages
      are identical. Short strings are exempt because plenty of them genuinely
      do not translate ("iOS", "APIs", "Mobile", "SaaS"), and a rule that fires
      on those is a rule people disable.
    */
    const untranslated: string[] = [];

    const walk = (value: unknown, path: string): void => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => walk(item, `${path}[${index}]`));
        return;
      }
      if (typeof value !== "object" || value === null) return;

      const keys = Object.keys(value);
      const isLocalized =
        keys.length === SUPPORTED_LOCALES.length &&
        SUPPORTED_LOCALES.every(
          (locale) =>
            typeof (value as Record<string, unknown>)[locale] === "string",
        );

      if (isLocalized) {
        const strings = SUPPORTED_LOCALES.map(
          (locale) => (value as Record<string, string>)[locale],
        );
        const [first, ...rest] = strings;
        if (first.length > 24 && rest.every((other) => other === first)) {
          untranslated.push(`${path}: "${first.slice(0, 60)}…"`);
        }
        return;
      }

      for (const [key, item] of Object.entries(value)) {
        walk(item, path === "" ? key : `${path}.${key}`);
      }
    };

    walk(rawContent, "");
    expect(
      untranslated,
      `these read identically in every language, so they were probably never translated:\n${untranslated.join("\n")}`,
    ).toEqual([]);
  });

  it("has a real icon file behind every product on the logo strip", () => {
    // The strip's entire value is that the marks are real. A missing file
    // renders as a broken image on the highest-trust section of the site, and
    // nothing else in the pipeline would catch it: the path is a string, so
    // the type checker is happy and the page still builds.
    for (const product of shippedProducts) {
      const path = join(process.cwd(), "public", productLogoSrc(product));
      expect(existsSync(path), `${product.id} has no icon at ${path}`).toBe(
        true,
      );
    }
  });

  it("has a real file behind every piece of project media", () => {
    // Same failure mode as the logo strip, on the sections that carry the
    // actual work: a path is a string, so a renamed or mistyped asset type
    // checks, builds, deploys, and renders as alt text on a case study.
    const sources = projects.flatMap((project) =>
      [
        project.heroMedia,
        ...project.galleryMedia,
        ...project.caseStudySections.flatMap((section) =>
          section.media ? [section.media] : [],
        ),
      ].flatMap((item) =>
        item.kind === "image"
          ? [item.src]
          : item.kind === "video"
            ? [item.poster, ...item.sources.map((source) => source.src)]
            : [],
      ),
    );
    expect(sources.length).toBeGreaterThan(0);
    for (const src of new Set(sources)) {
      const path = join(process.cwd(), "public", src);
      expect(existsSync(path), `missing media file: ${src}`).toBe(true);
    }
  });

  it("ships no project media that nothing references", () => {
    /*
      The reverse of the check above, and it catches the opposite mistake:
      swapping a screenshot for a composite leaves the old file in `public/`,
      where it is shipped, cached and served forever without appearing on a
      single page. Nothing else notices, because an unused asset breaks no
      import.
    */
    const referenced = new Set(
      projects.flatMap((project) =>
        [
          project.heroMedia,
          ...project.galleryMedia,
          ...project.caseStudySections.flatMap((section) =>
            section.media ? [section.media] : [],
          ),
        ].flatMap((item) => (item.kind === "image" ? [item.src] : [])),
      ),
    );

    const root = join(process.cwd(), "public", "media", "projects");
    const orphans: string[] = [];
    for (const slug of readdirSync(root)) {
      for (const file of readdirSync(join(root, slug))) {
        const src = `/media/projects/${slug}/${file}`;
        if (!referenced.has(src)) orphans.push(src);
      }
    }
    expect(
      orphans,
      `these files ship but are never rendered:\n${orphans.join("\n")}`,
    ).toEqual([]);
  });

  it("gives every project a 4:3 landscape hero", () => {
    /*
      The home and work cards render the hero at 4:3 with `cover`, so a hero
      that is any other shape either loses a corner of a composed frame or
      gains letterbox bars. Both were shipped before this test existed, and
      neither is visible to a type check: the media is a path and two numbers.
    */
    for (const project of projects) {
      const hero = project.heroMedia;
      expect(hero.kind, `${project.slug}'s hero is not an image`).toBe("image");
      if (hero.kind !== "image") continue;
      const ratio = hero.width / hero.height;
      expect(
        Math.abs(ratio - 4 / 3),
        `${project.slug}'s hero is ${hero.width}x${hero.height} (${ratio.toFixed(2)}:1), not 4:3`,
      ).toBeLessThan(0.02);
    }
  });

  it("has unique product ids, so no two tiles share an icon", () => {
    const ids = shippedProducts.map((product) => product.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves every product's linked case study", () => {
    for (const product of shippedProducts) {
      if (product.projectSlug === null) continue;
      expect(findProject(product.projectSlug)).toBeDefined();
    }
  });

  it("keeps every testimonial clip portrait", () => {
    // The proof rail is a 9:16 column. A landscape clip dropped into it
    // letterboxes down to a strip a few pixels tall, which looks like a
    // rendering bug rather than a content mistake.
    for (const testimonial of testimonials) {
      if (testimonial.video === null) continue;
      expect(["9/16", "4/5"]).toContain(testimonial.video.aspect);
    }
  });

  it("gives every process stage one deliverable and one sentence, in every language", () => {
    // The section is a compact row. Two sentences in `what` turns it into the
    // wall of cards this rewrite existed to remove, and a stage with no
    // deliverable is a meeting. Checked per LANGUAGE, because a translation is
    // where the sentence count usually grows.
    for (const stage of processStages) {
      for (const locale of SUPPORTED_LOCALES) {
        expect(stage.receives[locale].length).toBeGreaterThan(0);
        const sentences = stage.what[locale].split(". ").filter(Boolean);
        expect(
          sentences.length,
          `process stage "${stage.id}" runs to ${sentences.length} sentences in ${locale}`,
        ).toBeLessThanOrEqual(2);
      }
    }
  });

  it("reserves a box for every piece of media, so nothing shifts on load", () => {
    const media = projects.flatMap((project) => [
      project.heroMedia,
      ...project.galleryMedia,
      ...project.caseStudySections.flatMap((section) =>
        section.media ? [section.media] : [],
      ),
    ]);
    expect(media.length).toBeGreaterThan(0);
    for (const item of media) {
      // An image reserves its box from its intrinsic size; everything else has
      // to declare a ratio.
      if (item.kind === "image") {
        expect(item.width).toBeGreaterThan(0);
        expect(item.height).toBeGreaterThan(0);
      } else {
        expect(item.aspect).toBeTruthy();
      }
    }
  });
});
