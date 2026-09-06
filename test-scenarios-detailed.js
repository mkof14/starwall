const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  
  await page.goto('http://127.0.0.1:3000/interface');
  
  // Scroll to AGRON Bridge section
  await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2, h3')).find(h => h.textContent.includes('AGRON Bridge'));
    if (heading) heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  await page.waitForTimeout(1000);
  
  await page.waitForSelector('[data-testid="scenario-select"]', { timeout: 10000 });
  
  console.log('\n========== TEST 1: Reconnaissance Drone ==========');
  await page.selectOption('[data-testid="scenario-select"]', 'recon-drone');
  await page.waitForTimeout(1500);
  
  // Get details
  const sitPicture1 = await page.textContent('.situational-picture, [class*="situational"]') || 'N/A';
  const riskBadge1 = await page.evaluate(() => {
    const badge = document.querySelector('[class*="ATTENTION"], [data-testid*="risk"]');
    return badge ? badge.textContent : 'N/A';
  });
  const action1 = await page.evaluate(() => {
    const action = document.evaluate("//div[contains(text(), 'Maintain visual track') or contains(text(), 'RECOMMENDED ACTION')]/following-sibling::*[1] | //div[contains(text(), 'Maintain visual track')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    return action ? action.textContent : document.querySelector('[class*="recommended"], [class*="action"]')?.textContent || 'N/A';
  });
  const logRow1 = await page.textContent('[data-testid="event-log-newest-row"]');
  
  console.log('Panel type: SITUATIONAL PICTURE (Radar expected)');
  console.log('Risk badge:', riskBadge1);
  console.log('Recommended action:', action1.substring(0, 100));
  console.log('Log entry:', logRow1);
  
  await page.screenshot({ path: '/tmp/detailed-test-1-recon-drone.png', fullPage: true });
  
  console.log('\n========== TEST 2: Diver near hull ==========');
  await page.selectOption('[data-testid="scenario-select"]', 'diver-near-hull');
  await page.waitForTimeout(1500);
  
  const logRow2 = await page.textContent('[data-testid="event-log-newest-row"]');
  console.log('Log entry:', logRow2);
  await page.screenshot({ path: '/tmp/detailed-test-2-diver.png', fullPage: true });
  
  console.log('\n========== TEST 3: Communications jamming ==========');
  await page.selectOption('[data-testid="scenario-select"]', 'comms-jamming');
  await page.waitForTimeout(1500);
  
  const logRow3 = await page.textContent('[data-testid="event-log-newest-row"]');
  console.log('Log entry:', logRow3);
  await page.screenshot({ path: '/tmp/detailed-test-3-jamming.png', fullPage: true });
  
  console.log('\n========== TEST 4: Perimeter breach ==========');
  await page.selectOption('[data-testid="scenario-select"]', 'perimeter-breach');
  await page.waitForTimeout(1500);
  
  const logRow4 = await page.textContent('[data-testid="event-log-newest-row"]');
  console.log('Log entry:', logRow4);
  await page.screenshot({ path: '/tmp/detailed-test-4-perimeter.png', fullPage: true });
  
  console.log('\n========== TEST 5: Reset to Normal ==========');
  await page.click('[data-testid="reset-normal"]');
  await page.waitForTimeout(1500);
  
  const logRow5 = await page.textContent('[data-testid="event-log-newest-row"]');
  console.log('Log entry:', logRow5);
  await page.screenshot({ path: '/tmp/detailed-test-5-reset.png', fullPage: true });
  
  await browser.close();
  console.log('\n========== Tests Complete! ==========');
})();
