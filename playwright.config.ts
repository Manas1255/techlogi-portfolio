import { defineConfig, devices } from "@playwright/test";

/**
 * The sweep harness.
 *
 * These aren't feature tests — they're a systematic pass over every surface for
 * the defect classes that static analysis CANNOT see: layout shear from long
 * strings, missing validation, unreachable routes, states that only appear on a
 * slow network. `tsc` and ESLint will never catch a table that widens past its
 * container; a browser will.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Both projects share ONE dev server. Playwright's default worker count is
  // per-machine, not per-server, so two projects × N workers can saturate it
  // and tests fail on timeouts that look like product bugs. Capping keeps the
  // suite honest — it should only go red for real defects.
  workers: 4,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL: process.env.SWEEP_BASE_URL ?? "http://localhost:3100",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // Narrow viewport catches actions stranded off-screen and horizontal
    // overflow that a wide desktop window hides. Pixel 5 rather than an iPhone
    // so the sweep runs on Chromium alone — no second browser to download in CI.
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],

  /*
    A PRODUCTION build, not `next dev`.

    The sweep used to run against the dev server, which meant it could not see
    anything that only goes wrong in a real build: streaming boundaries that
    drop content from the prerendered HTML, a route that turns out to be
    client-only, CSS that does not ship. Those are exactly the defects this
    suite exists to catch, and it was structurally blind to all of them.

    It costs a build per run. That is the correct price.
  */
  webServer: {
    command: "npm run build && npm run start -- -p 3100",
    url: "http://localhost:3100/",
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
