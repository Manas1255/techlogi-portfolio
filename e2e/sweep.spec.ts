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
  "/work/zyuela",
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

  /*
    Regression guard. Both the hero's short form and the drawer's long form
    have a "description" field, and the field components used to derive the
    input's DOM id from the field NAME — so the page carried two
    id="description" nodes and every `label[for="description"]` bound to
    whichever the browser met first. A label in one form silently operated a
    control in the other, which typing into the page proves and no type check
    ever will.
  */
  for (const route of ["/", "/contact"] as const) {
    test(`${route} has no duplicate DOM ids`, async ({ page }) => {
      await page.goto(route);
      await page.getByRole("button", { name: "Start a Project" }).first().click();
      await expect(page.getByRole("dialog")).toBeVisible();

      const duplicates = await page.evaluate(() => {
        const seen = new Map<string, number>();
        for (const node of document.querySelectorAll("[id]")) {
          const id = node.id;
          if (id === "") continue;
          seen.set(id, (seen.get(id) ?? 0) + 1);
        }
        return [...seen.entries()]
          .filter(([, count]) => count > 1)
          .map(([id, count]) => `${id} x${count}`);
      });

      expect(
        duplicates,
        `duplicate DOM ids break label/for association: ${duplicates.join(", ")}`,
      ).toEqual([]);
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
    await page.goto("/work/zyuela");
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
    // Scoped by href: the footer's capability list also links to "Mobile".
    const mobileFilter = page.locator('a[href="/work?category=mobile"]');
    await mobileFilter.click();
    await expect(page).toHaveURL(/category=mobile/);

    await page.reload();
    await expect(mobileFilter).toHaveAttribute("aria-current", "true");
  });

  test("no filter ever produces an empty result set", async ({ page }) => {
    await page.goto("/work");
    const hrefs = await page
      .locator('a[href^="/work?category="]')
      .evaluateAll((links) => links.map((l) => l.getAttribute("href") ?? ""));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      await page.goto(href);
      await expect(
        page.getByRole("heading", { level: 2 }).first(),
        `${href} rendered no projects`,
      ).toBeVisible();
    }
  });

  /*
    Regression guard for the worst defect the audit found. `/work` used
    `useQueryState` for its filter, which put a `useSearchParams` consumer
    inside the page's Suspense boundary — and Next then drops that whole
    boundary from the prerendered HTML. The page shipped no heading and not one
    project to a crawler, and refilled on hydration for 0.56 CLS against a 0.1
    budget. Both symptoms are invisible to every other check in this suite.
  */
  test("/work ships its content in the HTML, not on hydration", async ({
    request,
  }) => {
    const html = await (await request.get("/work")).text();
    expect(html, "no <h1> in the served HTML").toContain("<h1");
    // Assert on project NAMES rather than a sentence of copy: copy gets
    // rewritten, and a regression guard that fails on an ordinary edit is a
    // guard people delete.
    expect(
      html,
      "project names are missing from the served HTML, so the page is client-only",
    ).toContain("OrthoTrack");
    expect(html).toContain("Soulmate Society");
  });
});

test.describe("project inquiry", () => {
  test("a single choice advances, and going back keeps the answer", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Start a Project" }).first().click();

    await page.getByRole("radio", { name: /A product I sell to customers/ }).click();
    await expect(page.getByText("Tell us about it")).toBeVisible();

    await page.getByRole("button", { name: "Back" }).click();
    await expect(
      page.getByRole("radio", { name: /A product I sell to customers/ }),
    ).toHaveAttribute("aria-checked", "true");
  });

  test("a step cannot be skipped while its fields are invalid", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Start a Project" }).first().click();
    await page.getByRole("radio", { name: /A web app/ }).click();

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
    await page.getByRole("radio", { name: /Something with AI in it/ }).click();
    await page
      .getByLabel("The project, in your words")
      .fill("An internal assistant over our own runbooks and incident history.");

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();

    await page.getByRole("button", { name: "Start a Project" }).first().click();
    await expect(page.getByLabel("The project, in your words")).toHaveValue(
      /internal assistant/,
    );
  });

  test("submitting reaches a designed success state", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("radio", { name: /A web app/ }).first().click();
    await page
      .getByLabel("The project, in your words")
      .fill("A portal our field engineers can use with one hand, offline.");
    await page.getByRole("radio", { name: /In the next few months/ }).click();
    await page.getByRole("radio", { name: "$50k – $150k" }).click();
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByLabel("Your name").fill("Ada Lovelace");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByRole("button", { name: "Send it" }).click();

    await expect(page.getByText("Thanks, that's with us.")).toBeVisible();
  });

  test("survives pathological input without breaking the layout", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Start a Project" }).first().click();
    await page.getByRole("radio", { name: /I'm not sure yet/ }).first().click();
    await page
      .getByLabel("The project, in your words")
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
  /*
    The reference page is `notFound()` in production on purpose, and this suite
    now runs against a production build. Skip rather than fail: the page is a
    development tool, and asserting it exists in production would be asserting
    the opposite of what we want.
  */
  test.beforeEach(async ({ page }) => {
    await page.goto("/design-system");
    // Next serves its not-found page with a 200 here, so the status is not a
    // reliable signal. Detect the rendered page instead.
    const isPresent = await page
      .getByRole("heading", { name: "Design system" })
      .isVisible()
      .catch(() => false);
    test.skip(!isPresent, "design system is development-only, as intended");
  });

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
