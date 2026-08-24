import { chromium } from "@playwright/test";
const [, , url, outPrefix, width, height, mode] = process.argv;
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(width), height: Number(height) },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text()}`); });
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
await page.goto(url, { waitUntil: "networkidle" });
const h = Number(height);
const total = await page.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 80));
  }
  window.scrollTo(0, 0);
  return document.body.scrollHeight;
});
await page.waitForTimeout(600);
if (mode === "panes") {
  const panes = Math.min(Math.ceil(total / h), 14);
  for (let i = 0; i < panes; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * h);
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${outPrefix}-${String(i).padStart(2, "0")}.png` });
  }
  console.log(`panes=${panes} totalHeight=${total}`);
} else {
  await page.screenshot({ path: `${outPrefix}.png`, fullPage: mode === "full" });
}
if (errors.length) console.log("CONSOLE:\n" + errors.join("\n"));
await browser.close();
