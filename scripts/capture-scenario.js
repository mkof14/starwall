const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const BASE = "http://localhost:3000";
const OUT = path.join(__dirname, "..", "public", "bridge");

async function stitchBadgeAndRadar(page, outPath) {
  const badgePng = await page.getByTestId("risk-badge").screenshot();
  const radarPng = await page.getByTestId("radar-panel").screenshot();
  const data = await page.evaluate(
    async ([badgeB64, radarB64]) => {
      function load(src) {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = src;
        });
      }
      const badge = await load(`data:image/png;base64,${badgeB64}`);
      const radar = await load(`data:image/png;base64,${radarB64}`);
      const gap = 12;
      const width = Math.max(badge.width, radar.width);
      const height = badge.height + gap + radar.height;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#0A0F14";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(badge, width - badge.width, 0);
      ctx.drawImage(radar, 0, badge.height + gap);
      return canvas.toDataURL("image/png").split(",")[1];
    },
    [badgePng.toString("base64"), radarPng.toString("base64")],
  );
  fs.writeFileSync(outPath, Buffer.from(data, "base64"));
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
  await stitchBadgeAndRadar(page, path.join(OUT, "risk-elevated.png"));

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
