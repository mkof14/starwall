const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1600, height: 2000 } });
  const page = await context.newPage();
  
  await page.goto('http://127.0.0.1:3000/interface');
  await page.waitForSelector('[data-testid="scenario-select"]', { timeout: 10000 });
  
  // Scroll down to AGRON Bridge
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(500);
  
  console.log('TEST 1: Reconnaissance Drone');
  await page.selectOption('[data-testid="scenario-select"]', 'recon-drone');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/s1-recon-drone.png' });
  
  console.log('TEST 2: Diver near hull');
  await page.selectOption('[data-testid="scenario-select"]', 'diver-near-hull');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/s2-diver.png' });
  
  console.log('TEST 3: Communications jamming');
  await page.selectOption('[data-testid="scenario-select"]', 'comms-jamming');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/s3-jamming.png' });
  
  console.log('TEST 4: Perimeter breach');
  await page.selectOption('[data-testid="scenario-select"]', 'perimeter-breach');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/s4-perimeter.png' });
  
  console.log('TEST 5: Reset to Normal');
  await page.click('[data-testid="reset-normal"]');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/s5-reset.png' });
  
  await browser.close();
  console.log('All tests complete!');
})();
