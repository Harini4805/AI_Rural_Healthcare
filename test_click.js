const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log("Navigating to login...");
    await page.goto('http://localhost:5173/login');
    await page.selectOption('select.form-select', 'District Health Officer');
    await page.click('button[type="submit"]');
    
    console.log("Waiting for dashboard to load...");
    await page.waitForSelector('h2:has-text("District Officer View")');
    
    console.log("Waiting for Risk Table...");
    await page.waitForSelector('table tbody tr');
    
    console.log("Clicking the first village in the table...");
    await page.click('table tbody tr:first-child');
    
    console.log("Waiting for Village Detail panel...");
    // Give it a moment to render
    await page.waitForTimeout(2000);
    
    const hasDetail = await page.evaluate(() => {
      return document.body.innerText.includes('Village Details');
    });
    
    if (hasDetail) {
      console.log("SUCCESS: Village Details panel appeared!");
    } else {
      console.log("ERROR: Still showing 'Select a village' fallback.");
    }
    
    await page.screenshot({ path: 'test_dashboard.png' });
    console.log("Screenshot saved as test_dashboard.png");
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await browser.close();
  }
})();
