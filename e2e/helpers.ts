import { expect, type Page } from "@playwright/test";

/** A string long enough to break any layout that isn't explicitly constrained. */
export const PATHOLOGICAL_TEXT =
  "Internationale Handelsgesellschaft für Speditionslogistik und Warenumschlag mbH & Co. Kommanditgesellschaft";

/** An unbroken token — worse than a long sentence, because it cannot wrap. */
export const PATHOLOGICAL_TOKEN = "A".repeat(120);

/**
 * Assert the page never scrolls sideways.
 *
 * Horizontal page scroll is the visible symptom of the min-content bug: some
 * descendant reported a minimum width larger than its container and pushed the
 * layout open. A few pixels of tolerance avoids false positives from scrollbar
 * rounding.
 */
export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth - doc.clientWidth;
  });
  expect(
    overflow,
    "page scrolls horizontally — a child's min-content is wider than its container",
  ).toBeLessThanOrEqual(2);
}

/**
 * Find elements that CLIP their content without any way to reveal it.
 *
 * Clipping is fine — that's what truncation is — but a clipped value with no
 * tooltip, no title and no expand affordance is data the user simply cannot
 * read. Returns offending selectors so failures name the actual element.
 */
export async function findUnreachableClipping(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const offenders: string[] = [];
    const elements = document.querySelectorAll<HTMLElement>("body *");

    for (const element of elements) {
      // `sr-only` is clipped ON PURPOSE — it's visually hidden precisely so
      // assistive tech can read it. It's the opposite of unreachable, and
      // flagging it is the kind of false positive that teaches people to
      // ignore the whole check.
      if (element.classList.contains("sr-only")) continue;
      // A framed picture that extends past its frame is a CROP, not a truncated
      // value. `MediaFrame` marks those subtrees so a deliberate composition
      // crop isn't reported as content the user can't reach — the same reason
      // `sr-only` is skipped above.
      if (element.closest("[data-media-crop]") !== null) continue;
      if (element.querySelector("[data-media-crop]") !== null) continue;

      const style = getComputedStyle(element);
      // A scrollable container isn't hiding anything — scrolling IS the way to
      // reach the rest. Only a container that clips with no scroll and no
      // reveal affordance is a finding.
      if (style.overflowX === "auto" || style.overflowX === "scroll") continue;
      if (style.overflowY === "auto" || style.overflowY === "scroll") continue;

      const clips =
        style.overflow !== "visible" || style.textOverflow === "ellipsis";
      if (!clips) continue;
      if (element.scrollWidth <= element.clientWidth + 1) continue;
      // A tooltip trigger, a title attribute, or an accessible description all
      // count as "the user can get to the full value".
      if (
        element.hasAttribute("title") ||
        element.closest("[data-slot='tooltip-trigger']") ||
        element.hasAttribute("aria-describedby")
      ) {
        continue;
      }
      const tag = element.tagName.toLowerCase();
      const cls = element.className?.toString().slice(0, 60) ?? "";
      offenders.push(`${tag}.${cls}`);
    }
    return offenders.slice(0, 10);
  });
}

/** Every interactive control must have an accessible name. */
export async function findUnnamedControls(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const offenders: string[] = [];
    // Scoped to the page's own landmarks and any open dialog, NOT the whole
    // document: Next's dev overlay injects its own unlabelled controls in dev,
    // and a check that fails on the framework's debug UI is a check people
    // learn to ignore.
    const roots = document.querySelectorAll<HTMLElement>(
      "main, header, footer, [role='dialog']",
    );
    const controls = [...roots].flatMap((root) => [
      ...root.querySelectorAll<HTMLElement>(
        "button, a[href], input, select, textarea",
      ),
    ]);

    for (const control of controls) {
      // Not in the accessibility tree, so "has no accessible name" is not a
      // finding: Radix renders a hidden bubble <input> beside each radio and
      // checkbox purely so native form submission still works.
      if (control.getAttribute("aria-hidden") === "true") continue;
      if (control.closest("[aria-hidden='true']") !== null) continue;

      const text = control.textContent?.trim() ?? "";
      const named =
        text.length > 0 ||
        control.hasAttribute("aria-label") ||
        control.hasAttribute("aria-labelledby") ||
        (control.id && document.querySelector(`label[for="${control.id}"]`));
      if (!named) {
        offenders.push(
          `${control.tagName.toLowerCase()}.${control.className?.toString().slice(0, 40)}`,
        );
      }
    }
    return offenders.slice(0, 10);
  });
}
