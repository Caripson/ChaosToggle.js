import { expect, test } from '@playwright/test';

async function seedChaos(page: import('@playwright/test').Page): Promise<void> {
  await page.evaluate(() => {
    const ct = (window as Window & typeof globalThis & { ChaosToggle?: any }).ChaosToggle;
    if (!ct) return;
    ct.updateSettings({
      cooldownMs: 0,
      probability: 1,
      randomSeed: 'playwright-visual-seed',
      shortcutsEnabled: false,
      safeMode: false,
      duration: 3200,
    });
    ct.reset();
  });
}

test('landing page matches baseline', async ({ page }) => {
  await page.goto('/docs/index.html');
  const hero = page.locator('.hero.hero--split');
  await expect(hero).toBeVisible();
  await expect(page.locator('[data-preview-policy]')).toHaveText('demo');
  await expect(page.locator('[data-preview-theme]')).toHaveText('default');
  await expect(hero).toHaveScreenshot('landing-page.png');
});

test('playground page loads locally and matches baseline', async ({ page }) => {
  await page.goto('/docs/demo/index.html');
  await expect(page.locator('#ct-status')).toContainText('loaded');
  await expect(page.locator('.pg-section').first()).toBeVisible();
  await expect(page.locator('.demo-page')).toHaveScreenshot('playground-page.png');
});

test('examples page with panel open matches baseline', async ({ page }) => {
  await page.goto('/examples/index.html');
  await seedChaos(page);
  await page.locator('[data-chaos="openPanel"]').click();
  await expect(page.locator('[data-chaos-panel]').locator('.panel')).toBeVisible();
  await expect(page.locator('body')).toHaveScreenshot('examples-panel.png');
});

test('patriotic signature overlay stays visually stable', async ({ page }) => {
  await page.goto('/examples/index.html');
  await seedChaos(page);

  await page.evaluate(() => (window as Window & typeof globalThis & { ChaosToggle: any }).ChaosToggle.runTheme('4th-of-july'));
  await expect(page.locator('.ct-star-spangled-banner')).toBeVisible();
  await expect(page.locator('.ct-star-spangled-banner')).toHaveScreenshot('theme-july4-banner.png');
});
