const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  
  await page.goto('http://127.0.0.1:3000/interface');
  await page.waitForSelector('[data-testid="scenario-select"]', { timeout: 10000 });
  
  console.log('\n========== TEST 1: Reconnaissance Drone ==========');
  await page.selectOption('[data-testid="scenario-select"]', 'recon-drone');
  await page.waitForTimeout(1000);
  
  const risk1 = await page.textContent('[data-testid="event-log-newest-row"]');
  console.log('New log entry:', risk1);
  await page.screenshot({ path: '/tmp/test-1-recon-drone.png', fullPage: false });
  
  console.log('\n========== TEST 2: Diver near hull ==========');
  await page.selectOption('[data-testid="scenario-select"]', 'diver-near-hull');
  await page.waitForTimeout(1000);
  
  const risk2 = await page.textContent('[data-testid="event-log-newest-row"]');
  console.log('New log entry:', risk2);
  await page.screenshot({ path: '/tmp/test-2-diver.png', fullPage: false });
  
  console.log('\n========== TEST 3: Communications jamming ==========');
  await page.selectOption('[data-testid="scenario-select"]', 'comms-jamming');
  await page.waitForTimeout(1000);
  
  const risk3 = await page.textContent('[data-testid="event-log-newest-row"]');
  console.log('New log entry:', risk3);
  await page.screenshot({ path: '/tmp/test-3-jamming.png', fullPage: false });
  
  console.log('\n========== TEST 4: Perimeter breach ==========');
  await page.selectOption('[data-testid="scenario-select"]', 'perimeter-breach');
  await page.waitForTimeout(1000);
  
  const risk4 = await page.textContent('[data-testid="event-log-newest-row"]');
  console.log('New log entry:', risk4);
  await page.screenshot({ path: '/tmp/test-4-perimeter.png', fullPage: false });
  
  console.log('\n========== TEST 5: Reset to Normal ==========');
  await page.click('[data-testid="reset-normal"]');
  await page.waitForTimeout(1000);
  
  const risk5 = await page.textContent('[data-testid="event-log-newest-row"]');
  console.log('New log entry:', risk5);
  await page.screenshot({ path: '/tmp/test-5-reset.png', fullPage: false });
  
  await browser.close();
  console.log('\n========== Tests Complete! ==========');
})();
