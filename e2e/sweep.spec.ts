import { expect, test } from "@playwright/test";
import {
  PATHOLOGICAL_TEXT,
  PATHOLOGICAL_TOKEN,
  expectNoHorizontalOverflow,
  findContentPastViewport,
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
/*
  Every route is locale-prefixed now: `/work` is a 307 to `/en/work`, not a
  page. Tests navigate to the prefixed URL directly rather than leaning on the
  redirect, so a broken proxy shows up as its own failure instead of quietly
  making every other test slower and still green.
*/
const ROUTES = [
  "/en",
  "/en/work",
  "/en/work/zyuela",
  "/en/services",
  "/en/about",
  "/en/contact",
  "/en/design-system",
  /*
    German is checked for layout too, and not as a formality: it runs roughly
    30% longer than English, so it is the language that overflows first. The
    header wordmark wrapped onto two lines at 390px and the CTA ran off the
    edge at 320px, and neither was visible in English at any width.
  */
  "/de",
  "/de/work",
  "/de/work/zyuela",
  "/de/services",
  "/de/about",
  "/de/contact",
] as const;

test.describe("layout resilience", () => {
  for (const route of ROUTES) {
    test(`${route} never scrolls horizontally`, async ({ page }) => {
      await page.goto(route);
      await expectNoHorizontalOverflow(page);
    });

    test(`${route} keeps its content inside the viewport`, async ({ page }) => {
      await page.goto(route);
      const offenders = await findContentPastViewport(page);
      expect(
        offenders,
        `content extends past the viewport and is clipped away by the root, with no scrollbar to reveal it: ${offenders.join(", ")}`,
      ).toEqual([]);
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
  for (const route of ["/en", "/en/contact"] as const) {
    test(`${route} has no duplicate DOM ids`, async ({ page }) => {
      await page.goto(route);
      /*
        The two routes open the brief differently, and both have to be checked
        with it OPEN, because the bug this guards is two forms on one page.
        The home page offers a plain trigger; `/contact` leads with the
        launcher, whose choice cards answer step one and open the dialog on
        step two.
      */
      const trigger = page.getByRole("button", {
        name: /send a project brief/i,
      });
      if ((await trigger.count()) > 0) {
        await trigger.first().click();
      } else {
        await page
          .getByRole("radio", { name: /A web platform/ })
          .first()
          .click();
      }
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
    await page.goto("/en");
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("header")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);
  });
});

test.describe("navigation", () => {
  test("booking is the primary action, and the inquiry is not", async ({
    page,
  }) => {
    /*
      The redesign's whole thesis. "Send inquiry" ends with the visitor waiting
      for someone else to act; a booked slot ends with a meeting. If a primary
      brass CTA labelled as an inquiry ever comes back to the header or the
      hero, the page has quietly reverted to asking rather than closing.
    */
    await page.goto("/en");
    await expect(
      page.getByRole("banner").getByRole("button", { name: /book a call/i }),
    ).toBeVisible();

    const hero = page.locator("main section").first();
    await expect(
      hero.getByRole("button", { name: /book a call/i }).first(),
    ).toBeVisible();

    const primaries = await hero
      .locator('[data-slot="cta"][class*="bg-primary"]')
      .allTextContents();
    for (const label of primaries) {
      expect(
        label.toLowerCase(),
        `a primary hero CTA still reads "${label}"`,
      ).not.toContain("inquiry");
    }
  });

  test("the primary action is reachable at every viewport", async ({
    page,
  }) => {
    await page.goto("/en");
    await expect(
      page.getByRole("button", { name: /book a call/i }).first(),
    ).toBeVisible();
  });

  test("mobile navigation opens, traps focus, and closes on Escape", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile viewport only");
    await page.goto("/en");

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
    await page.goto("/en/work/zyuela");
    await page.getByRole("link", { name: /Next project/ }).click();
    await expect(page).toHaveURL(/\/work\/[a-z-]+$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("work index", () => {
  test("filtering by capability is reflected in the URL and survives reload", async ({
    page,
  }) => {
    await page.goto("/en/work");
    // Scoped by href: the footer's capability list also links to "Mobile".
    const mobileFilter = page.locator('a[href="/en/work?category=mobile"]');
    await mobileFilter.click();
    await expect(page).toHaveURL(/category=mobile/);

    await page.reload();
    await expect(mobileFilter).toHaveAttribute("aria-current", "true");
  });

  test("no filter ever produces an empty result set", async ({ page }) => {
    await page.goto("/en/work");
    const hrefs = await page
      .locator('a[href^="/en/work?category="]')
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
  test("/en/work ships its content in the HTML, not on hydration", async ({
    request,
  }) => {
    const html = await (await request.get("/en/work")).text();
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

test.describe("project brief", () => {
  /*
    The brief is FOUR SCREENS in front of the calendar. It asks eight
    questions, which is more than fits on one screen without the length itself
    becoming the thing a visitor evaluates, so it asks them a step at a time.

    These tests assert the properties of the flow, not the fields of any one
    step, and never a sentence of copy: labels are matched loosely and
    controls are addressed through their accessible names.
  */

  /*
    The brief LIVES IN THE DIALOG NOW. It used to sit inline in the hero as
    well, and that was removed on the argument that a form in the first screen
    reads as "we want something from you" before a visitor knows what we make.
    So every test opens it the way a visitor does.
  */
  const openBrief = async (page: import("@playwright/test").Page) => {
    await page.goto("/en");
    await page
      .getByRole("button", { name: /book a call/i })
      .first()
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    return page.getByRole("dialog");
  };

  /** Step one is a single tap, and choosing it advances the flow. */
  const chooseStage = async (form: import("@playwright/test").Locator) => {
    await form.getByRole("radio").first().click();
  };

  test("opens on a step that needs no typing", async ({ page }) => {
    /*
      The first screen is one tap. A visitor is a quarter done before deciding
      whether to commit, which is the entire reason the flow opens here rather
      than on "what is your name".
    */
    const form = await openBrief(page);
    await expect(form.getByRole("radio").first()).toBeVisible();
    expect(
      await form.locator("input[type='text'], textarea").count(),
      "the first step asks for typing, which is the friction the flow removes",
    ).toBe(0);
  });

  test("choosing on the first step advances without a second click", async ({
    page,
  }) => {
    const form = await openBrief(page);
    await expect(form.getByLabel(/describe your idea/i)).toBeHidden();
    await chooseStage(form);
    await expect(form.getByLabel(/describe your idea/i)).toBeVisible();
  });

  test("shows how much is left, and back returns the answer intact", async ({
    page,
  }) => {
    const form = await openBrief(page);

    await expect(form.getByText(/step 1 of 4/i)).toBeVisible();
    await chooseStage(form);
    await expect(form.getByText(/step 2 of 4/i)).toBeVisible();

    await form.getByRole("button", { name: /back/i }).click();
    await expect(form.getByText(/step 1 of 4/i)).toBeVisible();
    await expect(
      form.getByRole("radio").first(),
      "going back lost the answer, so back is a punishment rather than an undo",
    ).toBeChecked();
  });

  test("a step will not advance past an unanswered required field", async ({
    page,
  }) => {
    const form = await openBrief(page);
    await chooseStage(form);

    // Step two is the description, and it is required.
    await form.getByRole("button", { name: /^continue$/i }).click();
    await expect(form.locator("[aria-invalid='true']").first()).toBeVisible();
    await expect(
      form.getByText(/step 2 of 4/i),
      "an empty required field advanced the flow anyway",
    ).toBeVisible();
  });

  test("the optional step can be skipped in one click", async ({ page }) => {
    const form = await openBrief(page);
    await chooseStage(form);
    await form
      .getByLabel(/describe your idea/i)
      .fill("A portal our field engineers can use with one hand, offline.");
    await form.getByRole("button", { name: /^continue$/i }).click();

    await expect(form.getByText(/step 3 of 4/i)).toBeVisible();
    await form.getByRole("button", { name: /skip/i }).click();
    await expect(form.getByText(/step 4 of 4/i)).toBeVisible();
  });

  test("every field carries a hint, not just a label", async ({ page }) => {
    /*
      A label names a field; a hint says why it is being asked, which is the
      question a person is actually holding when a form appears. Asserted
      through `aria-describedby`, so it also proves the hint is announced
      rather than merely printed.
    */
    const form = await openBrief(page);
    await chooseStage(form);
    await form
      .getByLabel(/describe your idea/i)
      .fill("A portal our field engineers can use with one hand, offline.");
    await form.getByRole("button", { name: /^continue$/i }).click();
    await form.getByRole("button", { name: /skip/i }).click();

    const undescribed = await page.evaluate(() => {
      const scope = document.querySelector("form:has([data-step-panel])");
      if (scope === null) return ["no brief form found"];
      return [...scope.querySelectorAll("input, textarea")]
        .filter((el) => el.getAttribute("type") !== "file")
        .filter((el) => {
          const ids = (el.getAttribute("aria-describedby") ?? "").split(" ");
          return !ids.some((id) => document.getElementById(id)?.textContent);
        })
        .map((el) => el.getAttribute("name") ?? el.id);
    });
    expect(undescribed, "these fields have no hint text").toEqual([]);
  });

  test("completing the flow reaches a designed success state", async ({
    page,
  }) => {
    const form = await openBrief(page);

    await chooseStage(form);
    await form
      .getByLabel(/describe your idea/i)
      .fill("A portal our field engineers can use with one hand, offline.");
    await form.getByRole("button", { name: /^continue$/i }).click();
    await form.getByRole("button", { name: /skip/i }).click();
    await form.getByLabel(/first and last name/i).fill("Ada Lovelace");
    await form.getByLabel(/email address/i).fill("ada@example.com");
    await form
      .getByRole("button", { name: /pick a time|send the brief/i })
      .click();

    await expect(page.getByText(/thanks, that's with us/i)).toBeVisible();
  });

  test("the draft survives closing and reopening the dialog", async ({
    page,
  }) => {
    await page.goto("/en");
    await page
      .getByRole("button", { name: /book a call/i })
      .first()
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const dialog = page.getByRole("dialog");
    await dialog.getByRole("radio").first().click();
    const field = dialog.getByLabel(/describe your idea/i);
    await field.fill(
      "An internal assistant over our own runbooks and incident history.",
    );
    // The draft is persisted on blur, not per keystroke.
    await field.blur();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();

    await page
      .getByRole("button", { name: /book a call/i })
      .first()
      .click();
    /*
      The saved answer comes back SELECTED, so tapping it again is not a
      change and correctly does not advance: Continue is the way on. Tapping
      your own answer and watching nothing happen was a real dead end here
      before the flow grew this button.
    */
    await expect(dialog.getByRole("radio").first()).toBeChecked();
    await dialog.getByRole("button", { name: /^continue$/i }).click();
    await expect(dialog.getByLabel(/describe your idea/i)).toHaveValue(
      /internal assistant/,
    );
  });

  test("every booking control opens the brief before the calendar", async ({
    page,
  }) => {
    /*
      The flow is: book a call -> four screens -> Cal.com, prefilled. A control
      that still bound Cal.com's overlay directly would skip the brief, and the
      symptom is silent: a slot arrives with no context and the site looks like
      it worked. Cal binds through `data-cal-link`, and those attributes hijack
      the click before React sees it, so their absence IS the assertion.
    */
    await page.goto("/en");
    expect(
      await page.locator("[data-cal-link]").count(),
      "a booking control still opens Cal.com directly, skipping the brief",
    ).toBe(0);

    await page
      .getByRole("button", { name: /book a call/i })
      .first()
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("dialog").getByRole("radio").first(),
    ).toBeVisible();
  });

  test("survives pathological input without breaking the layout", async ({
    page,
  }) => {
    const form = await openBrief(page);
    await chooseStage(form);
    await form
      .getByLabel(/describe your idea/i)
      .fill(`${PATHOLOGICAL_TEXT} ${PATHOLOGICAL_TOKEN}`);
    await expectNoHorizontalOverflow(page);
  });
});

test.describe("product marquee", () => {
  const track = ".marquee-track";
  const offset = (page: import("@playwright/test").Page) =>
    page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (element === null) return null;
      return new DOMMatrix(getComputedStyle(element).transform).m41;
    }, track);

  test("moves, and by enough to be seen", async ({ page }) => {
    /*
      The capability diagrams once drifted 4.93px over seven seconds, which
      reads as completely static: motion nobody can perceive is just battery.
      A screenshot cannot show a loop, so measure the actual travel.
    */
    await page.goto("/en");
    await page.evaluate(() =>
      document
        .querySelector("[data-marquee]")
        ?.scrollIntoView({ block: "center" }),
    );
    await page.waitForTimeout(600);

    const before = await offset(page);
    await page.waitForTimeout(2000);
    const after = await offset(page);
    expect(before, "no marquee track on the page").not.toBeNull();
    const travelled = Math.abs((after ?? 0) - (before ?? 0));
    expect(
      travelled,
      `the marquee moved ${travelled.toFixed(1)}px in two seconds, which reads as static`,
    ).toBeGreaterThan(40);
  });

  test("loops without a seam at any width", async ({ page }) => {
    /*
      The reset translates the track by exactly -50%, so the loop is only
      seamless while HALF the track is at least as wide as the container.
      Two copies is the version everyone writes first and it shows a gap on
      anything wider than a laptop.
    */
    await page.goto("/en");
    const geometry = await page.evaluate(() => {
      const box = document.querySelector("[data-marquee]");
      const rail = document.querySelector(".marquee-track");
      if (box === null || rail === null) return null;
      return { container: box.clientWidth, half: rail.scrollWidth / 2 };
    });
    if (geometry === null) throw new Error("no marquee track on the page");
    const { half, container } = geometry;
    expect(
      half,
      `half the track is ${half}px against a ${container}px container, so the loop will show a gap`,
    ).toBeGreaterThanOrEqual(container);
  });

  test("stops when it scrolls out of view", async ({ page }) => {
    /*
      The OFF direction, asserted specifically: a marquee composites a 3000px
      layer forever, and the ON direction failing is visible while the OFF
      direction failing is not.
    */
    await page.goto("/en");
    await page.evaluate(() =>
      document
        .querySelector("[data-marquee]")
        ?.scrollIntoView({ block: "center" }),
    );
    await page.waitForTimeout(600);
    expect(
      await page.evaluate(
        () => document.querySelectorAll("[data-marquee][data-onstage]").length,
      ),
    ).toBe(1);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(900);
    expect(
      await page.evaluate(
        () => document.querySelectorAll("[data-marquee][data-onstage]").length,
      ),
      "the marquee kept animating after leaving the viewport",
    ).toBe(0);
  });

  test("holds still, and stays reachable, under reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await page.evaluate(() =>
      document
        .querySelector("[data-marquee]")
        ?.scrollIntoView({ block: "center" }),
    );
    await page.waitForTimeout(600);

    const before = await offset(page);
    await page.waitForTimeout(1500);
    expect(await offset(page), "the marquee moved under reduced motion").toBe(
      before,
    );

    // Stopped is only acceptable because the row can still be dragged.
    expect(
      await page.evaluate(() => {
        const box = document.querySelector("[data-marquee]");
        return box === null ? "" : getComputedStyle(box).overflowX;
      }),
      "a stopped marquee that cannot scroll is content nobody can reach",
    ).toBe("auto");
  });

  test("announces six products, not thirty-six", async ({ page }) => {
    await page.goto("/en");
    const focusable = await page.evaluate(
      () =>
        [...document.querySelectorAll("[data-marquee] a")].filter(
          (link) => (link as HTMLAnchorElement).tabIndex !== -1,
        ).length,
    );
    // The repeats exist to fill the row; only the first set is real.
    expect(
      focusable,
      "duplicated tiles are in the tab order, so keyboard users meet the same links five times",
    ).toBeLessThanOrEqual(6);
  });
});

test.describe("localisation", () => {
  /*
    The point of routing the locale rather than toggling it is that `/de` is a
    real German DOCUMENT: server-rendered, correctly tagged, and indexable.
    Every assertion here is something a client-side toggle would fail, and
    every one of them is invisible to a type check.
  */
  test("/de is a German document, not an English one with swapped strings", async ({
    request,
  }) => {
    const html = await (await request.get("/de")).text();
    expect(html, "the document is not tagged German").toContain(
      '<html lang="de"',
    );

    /*
      Detect the LANGUAGE, not a sentence. This assertion used to name the hero
      headline, and rewriting that headline failed a test that had nothing to
      do with the change: a regression guard that breaks on ordinary copy edits
      is a guard people delete. Function words and umlauts survive any rewrite
      while still being impossible in an English document.

      Server-rendered, not hydrated in: a crawler never runs the JS.
    */
    const markers = html.match(
      /\b(und|Sie|Ihre|nicht|werden|einem?)\b|[äöüß]/g,
    );
    expect(
      markers?.length ?? 0,
      "the served HTML reads as English, so the page is English to a crawler",
    ).toBeGreaterThan(40);
  });

  test("a German page never links back into English", async ({ page }) => {
    /*
      The failure this catches is silent and total: an unprefixed `href="/work"`
      still resolves, because the proxy redirects it, so nothing 404s and
      nothing fails to build. The only symptom is that half the site changes
      language when someone clicks. See `components/layout/app-link.tsx`.
    */
    await page.goto("/de");
    const leaks = await page.evaluate(() =>
      [...document.querySelectorAll("a[href]")]
        .map((link) => link.getAttribute("href") ?? "")
        .filter(
          (href) =>
            href.startsWith("/") &&
            !href.startsWith("//") &&
            !href.startsWith("/de"),
        ),
    );
    expect(
      leaks,
      `these links drop a German reader into English: ${leaks.join(", ")}`,
    ).toEqual([]);
  });

  test("no English leaks into the German HTML", async ({ request }) => {
    /*
      The failure this catches was invisible in the browser and fatal to the
      point of the exercise. `useTranslations` used to read the locale from the
      Zustand store, which an effect fills AFTER hydration, so every Client
      Component on `/de` rendered ENGLISH into the prerendered HTML and swapped
      to German once JavaScript ran. A visitor saw a flash. A crawler saw an
      English page at a German URL.

      Asserting on the SERVED markup rather than the rendered page is the whole
      point: `page.getByText` would have passed throughout.
    */
    const marks = [
      "Book a call",
      "Send a project brief",
      "All work",
      "What we did",
      "Outcome",
      "Selected work",
      "How it works",
    ];
    for (const route of ["/de", "/de/work", "/de/work/zyuela", "/de/about"]) {
      const html = await (await request.get(route)).text();
      const found = marks.filter((mark) => html.includes(`>${mark}<`));
      expect(found, `${route} serves English: ${found.join(", ")}`).toEqual([]);
    }
  });

  test("both languages are declared to each other", async ({ request }) => {
    // Without hreflang the two translations compete as near-duplicates and a
    // crawler is entitled to drop one of them.
    const html = await (await request.get("/de")).text();
    expect(html).toContain('hrefLang="en"');
    expect(html).toContain('hrefLang="de"');
    expect(html).toContain('hrefLang="x-default"');
    expect(html).toContain('rel="canonical" href="https://gastudio.com/de"');
  });

  test("an unprefixed URL lands on German, whatever the browser asks for", async ({
    request,
  }) => {
    /*
      German is served unconditionally. `Accept-Language` is deliberately not
      consulted: nearly every browser ships `en-US` whatever its owner reads,
      so honouring it sent most visitors, German ones included, to the English
      site. This asserts the header is ignored, because reinstating
      negotiation is a one-line change that looks harmless.
    */
    for (const header of ["en-GB,en;q=0.9", "de-DE,de;q=0.9", ""]) {
      const response = await request.get("/work", {
        maxRedirects: 0,
        headers: { "accept-language": header },
      });
      // 307, never 308: the target depends on a cookie, so a cache must not
      // pin one visitor's language onto everyone behind the same key.
      expect(response.status(), `accept-language: "${header}"`).toBe(307);
      expect(
        response.headers()["location"],
        `accept-language: "${header}" did not land on German`,
      ).toContain("/de/work");
    }
  });

  test("an explicit choice outranks the default", async ({ request }) => {
    /*
      The cookie is the switcher's memory, and the only signal that is a
      DECISION rather than a setting. If the default ever outranks it, the
      switcher appears not to work: you pick English, come back tomorrow, and
      the site is German again.
    */
    const response = await request.get("/work", {
      maxRedirects: 0,
      headers: { cookie: "locale=en", "accept-language": "de-DE,de;q=0.9" },
    });
    expect(response.status()).toBe(307);
    expect(response.headers()["location"]).toContain("/en/work");
  });

  test("a shared link is never redirected out of its language", async ({
    request,
  }) => {
    // Someone sent this URL on purpose; the default has no business overriding
    // it, and neither does the recipient's cookie.
    const response = await request.get("/en/work", {
      maxRedirects: 0,
      headers: { cookie: "locale=de" },
    });
    expect(response.status()).toBe(200);
  });

  test("every page ships a complete Open Graph card", async ({ request }) => {
    /*
      Next merges top-level metadata down the tree but REPLACES `openGraph`
      wholesale, so the moment a page declared its own openGraph it dropped the
      layout's `images` and every route shipped a card with no picture. Nothing
      failed: the pages built, rendered and passed every other test, and the
      only symptom was a blank preview when someone pasted a link into Slack.

      Absolute URLs, not relative: without `metadataBase` a relative image
      resolves against localhost at build time, which ships a preview pointing
      at the machine that built it.
    */
    for (const route of ["/de", "/en", "/de/services", "/en/work/zyuela"]) {
      const html = await (await request.get(route)).text();
      const image = html.match(/property="og:image" content="([^"]*)"/)?.[1];
      expect(image, `${route} ships no og:image`).toBeTruthy();
      expect(
        image,
        `${route} ships a relative og:image, so the preview points nowhere`,
      ).toMatch(/^https:\/\//);
      expect(
        html.match(/property="og:title" content="([^"]*)"/)?.[1],
        `${route} ships no og:title`,
      ).toBeTruthy();
    }
  });

  test("x-default points at German", async ({ request }) => {
    const html = await (await request.get("/de")).text();
    expect(html).toContain(
      '<link rel="alternate" hrefLang="x-default" href="https://gastudio.com/de"',
    );
  });

  test("switching language keeps the reader on the same page", async ({
    page,
  }) => {
    // Dropping someone at the home page is the commonest bug in a language
    // switcher, and the most annoying one.
    await page.goto("/en/work/zyuela");
    await page.getByRole("button", { name: /language/i }).click();
    await page.getByRole("menuitem", { name: "Deutsch" }).click();
    await expect(page).toHaveURL(/\/de\/work\/zyuela$/);
  });
});

test.describe("section rhythm", () => {
  /*
    Readers reported the home page as one undifferentiated scroll: five
    consecutive white sections separated by a one-pixel hairline. The fix was a
    third ground (tint) and a rule that adjacent sections never share one.
    Assert the rule, because it is the kind of thing a later section insertion
    quietly breaks.
  */
  test("no two adjacent sections share a ground", async ({ page }) => {
    await page.goto("/en");
    const grounds = await page.evaluate(() =>
      [
        ...document.querySelectorAll("main > section, main > div > section"),
      ].map((section) => {
        // Two things matter. A transparent section shows whatever is
        // behind it, so resolve up the tree rather than comparing
        // "transparent". And a gradient wash is a background-IMAGE over a
        // colour, so a colour-only comparison would call the hero plain
        // white and miss that it is visually its own ground.
        let node: Element | null = section;
        while (node && node !== document.documentElement) {
          const style = getComputedStyle(node);
          if (style.backgroundImage !== "none") {
            return `image:${style.backgroundImage.slice(0, 60)}`;
          }
          const bg = style.backgroundColor;
          if (bg && !bg.startsWith("rgba(0, 0, 0, 0)")) return bg;
          node = node.parentElement;
        }
        return "none";
      }),
    );
    expect(grounds.length).toBeGreaterThan(4);

    const repeats: string[] = [];
    for (let index = 1; index < grounds.length; index++) {
      if (grounds[index] === grounds[index - 1]) {
        repeats.push(
          `sections ${index} and ${index + 1} are both ${grounds[index]}`,
        );
      }
    }
    expect(
      repeats,
      `adjacent sections share a ground, so the page reads as one scroll: ${repeats.join("; ")}`,
    ).toEqual([]);
  });
});

test.describe("home page work cards", () => {
  /*
    Portfolio media ranges from 4:3 composites to 9:16 phone captures. Two
    things went wrong when the home page moved to a card grid, and neither is
    visible to a type check: cards sized themselves from their own media so the
    grid came out ragged, and a device-framed project kept the phone shell's
    own max width and rendered at HALF the card's, leaving rows 191px apart.
  */
  test("cards sharing a row are the same height", async ({ page }) => {
    await page.goto("/en");
    await page.evaluate(() =>
      document.querySelector("#work")?.scrollIntoView(),
    );
    await page.waitForTimeout(500);

    // Group by row before comparing. In a single column, cards stack and
    // differing heights are correct: raggedness only exists side by side.
    const rows = await page.evaluate(() => {
      const byTop = new Map<number, number[]>();
      for (const card of document.querySelectorAll("#work article")) {
        const box = card.getBoundingClientRect();
        const top = Math.round(box.top);
        const key = [...byTop.keys()].find((k) => Math.abs(k - top) < 4) ?? top;
        byTop.set(key, [...(byTop.get(key) ?? []), Math.round(box.height)]);
      }
      return [...byTop.values()];
    });

    expect(rows.length).toBeGreaterThan(0);
    for (const heights of rows) {
      if (heights.length < 2) continue;
      const spread = Math.max(...heights) - Math.min(...heights);
      expect(
        spread,
        `cards in one row differ by ${spread}px: ${heights.join(", ")}`,
      ).toBeLessThanOrEqual(2);
    }
  });

  test("the home page teases the work rather than reprinting it", async ({
    page,
  }) => {
    await page.goto("/en");
    // The editorial panels belong on /work. If they come back here the section
    // returns to four full screens, which is what readers called endless.
    const summaries = await page.evaluate(
      () => document.querySelectorAll("#work .text-marketing-body").length,
    );
    expect(summaries, "full project summaries are back on the home page").toBe(
      0,
    );
  });
});

test.describe("shipped product strip", () => {
  /*
    The strip's whole value is that the marks are REAL app icons, lifted from
    each product's own repository. A missing or broken file turns the highest
    trust section on the page into seven alt-text stubs, and nothing upstream
    catches it: the path is a string, so it type-checks and it builds.

    `content.test.ts` asserts the files exist on disk. This asserts the browser
    actually decoded them, which is the part a wrong path or a corrupt export
    would still fail.
  */
  test("every product logo loads and is not a broken image", async ({
    page,
  }) => {
    await page.goto("/en");
    const broken = await page.evaluate(() =>
      /*
        Next/Image rewrites the src through the optimiser, so the raw path
        appears percent-encoded inside the query string.

        Only the FIRST set is checked. The marquee repeats the products six
        times to fill the row, and the copies past the fold are lazy by
        design, so counting them means counting images the browser has quite
        correctly not fetched.
      */
      [...document.querySelectorAll("li:not([aria-hidden]) img")]
        .filter((image) =>
          decodeURIComponent((image as HTMLImageElement).src).includes(
            "/media/logos/",
          ),
        )
        /*
          BROKEN, not merely unloaded. `complete === false` is a lazy image
          the browser has correctly not fetched yet, which on a 393px screen
          is most of the row; `complete === true` with no intrinsic width is a
          file that failed, which is the thing worth failing a build over.
        */
        .filter(
          (image) =>
            (image as HTMLImageElement).complete &&
            (image as HTMLImageElement).naturalWidth === 0,
        )
        .map((image) => (image as HTMLImageElement).src),
    );
    expect(broken, `logos failed to load: ${broken.join(", ")}`).toEqual([]);

    const count = await page.evaluate(
      () =>
        [...document.querySelectorAll("li:not([aria-hidden]) img")].filter(
          (image) =>
            decodeURIComponent((image as HTMLImageElement).src).includes(
              "/media/logos/",
            ),
        ).length,
    );
    expect(count, "the logo strip is empty").toBeGreaterThanOrEqual(4);
  });
});

test.describe("frequently asked questions", () => {
  /*
    Regression guard. `onToggle` read `event.currentTarget.open` inside the
    state updater, which runs during a later render once React has cleared the
    event: the first click on any question threw and took the whole page to the
    error boundary. Type checking cannot see it; only clicking can.
  */
  test("a question opens and closes without crashing the page", async ({
    page,
  }) => {
    await page.goto("/en");
    const first = page.locator("#faq summary").first();
    await first.click();
    await expect(
      page.getByText("Most work lands between"),
      "the answer did not open",
    ).toBeVisible();

    await first.click();
    await expect(page.getByText("Most work lands between")).toBeHidden();
    // The error boundary replaces the whole page, so the heading is the tell.
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("motion preferences", () => {
  test("no content stays hidden when motion is reduced", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll("[data-reveal]")].filter(
          (element) => Number(getComputedStyle(element).opacity) < 0.99,
        ).length,
    );
    expect(
      hidden,
      "reveal animations left content invisible under prefers-reduced-motion",
    ).toBe(0);
  });

  test("staggered sections render fully with motion reduced", async ({
    page,
  }) => {
    /*
      The Framer Motion staggers are a SECOND motion system beside the CSS
      reveals, and they fail differently: `Reveal` is hidden by a stylesheet
      that resolves every duration to 1ms under the media query, so it cannot
      strand content. A variant-driven entrance is inline style, and if the
      reduced-motion branch is ever dropped, every logo tile, process step and
      capability card stays at opacity 0 with nothing in CSS to save it.
    */
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    const invisible = await page.evaluate(
      () =>
        [
          ...document.querySelectorAll(
            "#capabilities li, #process li, [aria-labelledby='shipped-products'] li",
          ),
        ].filter((element) => Number(getComputedStyle(element).opacity) < 0.99)
          .length,
    );
    expect(
      invisible,
      "staggered items stayed transparent under prefers-reduced-motion",
    ).toBe(0);
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
    await page.goto("/en/design-system");
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
    await page.goto("/en/design-system");
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
    await page.goto("/en/design-system");

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
