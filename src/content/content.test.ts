import { describe, expect, it } from "vitest";
import {
  activeCategories,
  buildTypes,
  featuredProjects,
  findProject,
  nextProject,
  processStages,
  projects,
  projectSlugs,
  projectsByCategory,
  serviceGroups,
  techGroups,
  testimonials,
} from "./index";
import {
  buildTypeSchema,
  processStageSchema,
  projectSchema,
  serviceGroupSchema,
  techGroupSchema,
  testimonialSchema,
} from "./schemas";

/**
 * Content is parsed HERE, not at render time — a constant shouldn't pay a
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
    expect(featuredProjects().length).toBeGreaterThanOrEqual(3);
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

  it("marks every unverified metric with a note", () => {
    for (const project of projects) {
      for (const metric of project.metrics) {
        expect(metric.note.length).toBeGreaterThan(0);
        if (project.isPlaceholder) {
          expect(metric.note).toContain("PLACEHOLDER");
        }
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

  it("reserves an aspect ratio for every piece of media", () => {
    const media = projects.flatMap((project) => [
      project.heroMedia,
      ...project.galleryMedia,
      ...project.caseStudySections.flatMap((section) =>
        section.media ? [section.media] : [],
      ),
    ]);
    expect(media.length).toBeGreaterThan(0);
    for (const item of media) {
      expect(item.aspect).toBeTruthy();
    }
  });
});
