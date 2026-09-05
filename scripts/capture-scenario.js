const path = require("path");
const { chromium } = require("playwright");

const BASE = "http://localhost:3000";
const OUT = path.join(__dirname, "..", "public", "bridge");

function unionBox(a, b) {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  const right = Math.max(a.x + a.width, b.x + b.width);
  const bottom = Math.max(a.y + a.height, b.y + b.height);
  return {
    x: Math.max(0, x),
    y: Math.max(0, y),
    width: right - Math.max(0, x),
    height: bottom - Math.max(0, y),
  };
}

async function scrollTargetIntoView(page, testId) {
  await page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo(0, Math.max(0, top));
  }, testId);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1400 },
  });

  await page.goto(`${BASE}/interface`, { waitUntil: "networkidle" });
  await page.getByTestId("radar-panel").waitFor({ state: "visible" });

  await scrollTargetIntoView(page, "radar-panel");
  await page.getByTestId("radar-panel").screenshot({
    path: path.join(OUT, "radar-normal.png"),
  });

  await page.getByTestId("simulate-alert").click();
  await page.waitForTimeout(500);

  await scrollTargetIntoView(page, "risk-badge");
  const badge = await page.getByTestId("risk-badge").boundingBox();
  const radar = await page.getByTestId("radar-panel").boundingBox();
  if (!badge || !radar) {
    throw new Error("Could not measure risk-badge or radar-panel");
  }
  await page.screenshot({
    path: path.join(OUT, "risk-elevated.png"),
    clip: unionBox(badge, radar),
  });

  await page.getByTestId("recommended-action-panel").screenshot({
    path: path.join(OUT, "recommended-action.png"),
  });

  const newest = page.getByTestId("event-log-newest-row");
  await newest.scrollIntoViewIfNeeded();
  await newest.screenshot({
    path: path.join(OUT, "event-log-new.png"),
  });

  await browser.close();
  console.log("Done — 4 screenshots saved to public/bridge/");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
