const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/opt/cursor/artifacts';

// Ensure artifact directory exists
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

const pages = [
  { name: 'hub', url: 'file:///agent/repos/moon-detective/index.html', tabs: [] },
  { name: 'review', url: 'file:///agent/repos/moon-detective/review/index.html', tabs: [] },
  { name: 'nature-index', url: 'file:///agent/repos/moon-detective/nature/index.html', tabs: [] },
  { name: 'nature-quest', url: 'file:///agent/repos/moon-detective/nature/quest/index.html', tabs: [] },
  { 
    name: 'nature-sound-light', 
    url: 'file:///agent/repos/moon-detective/nature/sound-light/index.html',
    tabs: ['首頁', '4-1聲音', '4-2光', '4-3應用', '挑戰']
  }
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ 
    viewport: { width: 390, height: 844 }
  });
  
  let totalErrors = 0;
  const results = [];

  for (const page of pages) {
    console.log(`\n=== Testing ${page.name} ===`);
    console.log(`URL: ${page.url}`);
    
    const p = await context.newPage();
    const errors = [];
    
    // Capture console messages
    p.on('console', msg => {
      const type = msg.type();
      if (type === 'error' || type === 'warning') {
        const text = msg.text();
        errors.push({ type, text });
        console.log(`  [${type.toUpperCase()}] ${text}`);
      }
    });
    
    // Capture page errors
    p.on('pageerror', error => {
      errors.push({ type: 'pageerror', text: error.message });
      console.log(`  [PAGEERROR] ${error.message}`);
    });
    
    try {
      await p.goto(page.url, { waitUntil: 'networkidle', timeout: 30000 });
      await p.waitForTimeout(1000);
      
      // Take screenshot of initial load
      const screenshotPath = path.join(ARTIFACT_DIR, `${page.name}-initial.png`);
      await p.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`  Screenshot saved: ${screenshotPath}`);
      
      // Click through tabs if specified
      if (page.tabs && page.tabs.length > 0) {
        for (const tab of page.tabs) {
          console.log(`  Clicking tab: ${tab}`);
          try {
            // Try different selectors for tabs
            const selectors = [
              `text="${tab}"`,
              `button:has-text("${tab}")`,
              `a:has-text("${tab}")`,
              `.tab:has-text("${tab}")`,
              `[data-tab]:has-text("${tab}")`
            ];
            
            let clicked = false;
            for (const selector of selectors) {
              try {
                await p.click(selector, { timeout: 2000 });
                clicked = true;
                break;
              } catch (e) {
                // Try next selector
              }
            }
            
            if (clicked) {
              await p.waitForTimeout(500);
              const tabScreenshotPath = path.join(ARTIFACT_DIR, `${page.name}-${tab.replace(/[^a-zA-Z0-9]/g, '-')}.png`);
              await p.screenshot({ path: tabScreenshotPath, fullPage: false });
              console.log(`    Tab screenshot saved: ${tabScreenshotPath}`);
            } else {
              console.log(`    Could not find tab: ${tab}`);
            }
          } catch (e) {
            console.log(`    Error clicking tab ${tab}: ${e.message}`);
          }
        }
      }
      
      // Check for console errors after interactions
      await p.waitForTimeout(1000);
      
    } catch (error) {
      errors.push({ type: 'navigation', text: error.message });
      console.log(`  [NAVIGATION ERROR] ${error.message}`);
    }
    
    await p.close();
    
    // Filter out known harmless warnings
    const realErrors = errors.filter(e => {
      const text = e.text.toLowerCase();
      // Ignore common harmless warnings
      if (text.includes('favicon') || text.includes('icon')) return false;
      if (text.includes('service worker')) return false;
      if (text.includes('manifest')) return false;
      return true;
    });
    
    const errorCount = realErrors.length;
    totalErrors += errorCount;
    
    results.push({
      page: page.name,
      url: page.url,
      errors: errorCount,
      details: realErrors
    });
    
    if (errorCount === 0) {
      console.log(`  ✅ No console errors`);
    } else {
      console.log(`  ❌ ${errorCount} error(s) found`);
    }
  }
  
  await browser.close();
  
  console.log('\n' + '='.repeat(70));
  console.log('SUMMARY');
  console.log('='.repeat(70));
  
  results.forEach(r => {
    const status = r.errors === 0 ? '✅' : '❌';
    console.log(`${status} ${r.page}: ${r.errors} error(s)`);
  });
  
  console.log('\nTotal errors across all pages:', totalErrors);
  
  if (totalErrors > 0) {
    console.log('\n❌ FAILED: Found console errors');
    process.exit(1);
  } else {
    console.log('\n✅ PASSED: All pages loaded without errors at 390px width');
  }
})();
