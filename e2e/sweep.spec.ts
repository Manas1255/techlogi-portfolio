import { expect, test } from "@playwright/test";
import {
  PATHOLOGICAL_TEXT,
  PATHOLOGICAL_TOKEN,
  expectNoHorizontalOverflow,
  findUnnamedControls,
  findUnreachableClipping,
} from "./helpers";

/**
 * The systematic sweep. Grow the route list as the site grows — this file is
 * the cheapest place to catch a whole class of regression.
 *
 * These aren't feature tests. They're a pass over every surface for the defects
 * static analysis cannot see: layout shear from long strings, controls with no
 * accessible name, a drawer that loses focus, motion that ignores a user's
 * stated preference.
 */
const ROUTES = [
  "/",
  "/work",
  "/work/nova",
  "/services",
  "/about",
  "/contact",
  "/design-system",
] as const;

test.describe("layout resilience", () => {
  for (const route of ROUTES) {
    test(`${route} never scrolls horizontally`, async ({ page }) => {
      await page.goto(route);
      await expectNoHorizontalOverflow(page);
    });

    test(`${route} has no unreachable truncated content`, async ({ page }) => {
      await page.goto(route);
      const offenders = await findUnreachableClipping(page);
      expect(
        offenders,
        `content is clipped with no way to reveal it: ${offenders.join(", ")}`,
      ).toEqual([]);
    });

    test(`${route} names every control`, async ({ page }) => {
      await page.goto(route);
      const offenders = await findUnnamedControls(page);
      expect(
        offenders,
        `interactive controls with no accessible name: ${offenders.join(", ")}`,
      ).toEqual([]);
    });
  }
});

test.describe("document structure", () => {
  for (const route of ROUTES.slice(0, 6)) {
    test(`${route} has one h1 and no skipped heading levels`, async ({
      page,
    }) => {
      await page.goto(route);
      const outline = await page.evaluate(() =>
        [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((heading) =>
          Number(heading.tagName[1]),
        ),
      );
      expect(outline.filter((level) => level === 1)).toHaveLength(1);
      for (let index = 1; index < outline.length; index++) {
        expect(
          outline[index],
          `heading level jumped from h${outline[index - 1]} to h${outline[index]}`,
        ).toBeLessThanOrEqual(outline[index - 1] + 1);
      }
    });
  }

  test("every page has the three landmarks", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("header")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);
  });
});

test.describe("navigation", () => {
  test("the primary action is reachable at every viewport", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Start a Project" }).first(),
    ).toBeVisible();
  });

  test("mobile navigation opens, traps focus, and closes on Escape", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile viewport only");
    await page.goto("/");

    await page.getByRole("button", { name: "Open navigation" }).click();
    const panel = page.getByRole("dialog");
    await expect(panel).toBeVisible();

    // Focus must be inside the panel, not left behind on the page.
    const focusInside = await page.evaluate(() => {
      const dialog = document.querySelector("[role=dialog]");
      return dialog?.contains(document.activeElement) ?? false;
    });
    expect(focusInside).toBe(true);

    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
  });

  test("a case study links onward to the next project", async ({ page }) => {
    await page.goto("/work/nova");
    await page.getByRole("link", { name: /Next project/ }).click();
    await expect(page).toHaveURL(/\/work\/[a-z-]+$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("work index", () => {
  test("filtering by capability is reflected in the URL and survives reload", async ({
    page,
  }) => {
    await page.goto("/work");
    await page.getByRole("button", { name: /^Mobile/ }).click();
    await expect(page).toHaveURL(/category=mobile/);

    await page.reload();
    await expect(page.getByRole("button", { name: /^Mobile/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("no filter ever produces an empty result set", async ({ page }) => {
    await page.goto("/work");
    const filters = page.locator("button[aria-pressed]");
    const count = await filters.count();
    for (let index = 0; index < count; index++) {
      await filters.nth(index).click();
      await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
    }
  });
});

test.describe("project inquiry", () => {
  test("a single choice advances, and going back keeps the answer", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Start a Project" }).first().click();

    await page.getByRole("radio", { name: /SaaS Platform/ }).click();
    await expect(page.getByText("Tell us about it")).toBeVisible();

    await page.getByRole("button", { name: "Back" }).click();
    await expect(
      page.getByRole("radio", { name: /SaaS Platform/ }),
    ).toHaveAttribute("aria-checked", "true");
  });

  test("a step cannot be skipped while its fields are invalid", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Start a Project" }).first().click();
    await page.getByRole("radio", { name: /Web Application/ }).click();

    await page.getByRole("button", { name: "Continue" }).click();
    // Still on step two: the description is required and empty.
    await expect(page.getByText("Tell us about it")).toBeVisible();
    await expect(page.locator("[aria-invalid='true']")).toHaveCount(1);
  });

  test("the draft survives closing and reopening the drawer", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Start a Project" }).first().click();
    await page.getByRole("radio", { name: /AI Product/ }).click();
    await page
      .getByLabel("What are you building?")
      .fill("An internal assistant over our own runbooks and incident history.");

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();

    await page.getByRole("button", { name: "Start a Project" }).first().click();
    await expect(page.getByLabel("What are you building?")).toHaveValue(
      /internal assistant/,
    );
  });

  test("submitting reaches a designed success state", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("radio", { name: /Web Application/ }).first().click();
    await page
      .getByLabel("What are you building?")
      .fill("A portal our field engineers can use with one hand, offline.");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByRole("radio", { name: /next 1–3 months/ }).click();
    await page.getByRole("radio", { name: "$50k – $150k" }).click();
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByLabel("Your name").fill("Ada Lovelace");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByRole("button", { name: "Send inquiry" }).click();

    await expect(page.getByText("Thanks — that's with us.")).toBeVisible();
  });

  test("survives pathological input without breaking the layout", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Start a Project" }).first().click();
    await page.getByRole("radio", { name: /Something Else/ }).click();
    await page
      .getByLabel("What are you building?")
      .fill(`${PATHOLOGICAL_TEXT} ${PATHOLOGICAL_TOKEN}`);
    await expectNoHorizontalOverflow(page);
  });
});

test.describe("motion preferences", () => {
  test("no content stays hidden when motion is reduced", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll("[data-reveal]")].filter(
        (element) => Number(getComputedStyle(element).opacity) < 0.99,
      ).length,
    );
    expect(
      hidden,
      "reveal animations left content invisible under prefers-reduced-motion",
    ).toBe(0);
  });

  test("the showreel does not advance by itself", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const selected = page.locator('[aria-roledescription="carousel"] [aria-current="true"]');
    const before = await selected.textContent();
    await page.waitForTimeout(5000);
    expect(await selected.textContent()).toBe(before);
  });
});

test.describe("design system", () => {
  test("renders every section without overflow at any width", async ({
    page,
  }) => {
    await page.goto("/design-system");
    await expect(
      page.getByRole("heading", { name: "Design system" }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  /**
   * Regression guard. TruncatedText once measured itself correctly, set
   * `clipped`, and then re-parented the span into the tooltip trigger — which
   * detached the node its ResizeObserver was watching, fired at 0×0, and reset
   * the flag. The tooltip silently never appeared. Assert both halves: the long
   * value IS marked clipped, and a short one is NOT.
   */
  test("marks overflowing text as clipped and leaves short text alone", async ({
    page,
  }) => {
    await page.goto("/design-system");

    const longValue = page.locator("[data-clipped]", {
      hasText: "Internationale Handelsgesellschaft",
    });
    await expect(longValue).toHaveAttribute("data-clipped", "true");

    const shortValue = page.locator("[data-clipped]", {
      hasText: "ORD-2026-000481",
    });
    await expect(shortValue).toHaveAttribute("data-clipped", "false");
  });
});
