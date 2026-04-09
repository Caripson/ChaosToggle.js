import { expect, test } from '@playwright/test';

const themeSignatures: Array<{ theme: string; selector: string }> = [
  { theme: 'easter', selector: '.ct-spring-parade' },
  { theme: 'new-year', selector: '.ct-midnight-burst' },
  { theme: '4th-of-july', selector: '.ct-star-spangled-banner' },
  { theme: 'thanksgiving', selector: '.ct-harvest-table' },
  { theme: 'black-friday', selector: '.ct-doorbuster-marquee' },
  { theme: 'cyber-monday', selector: '.ct-protocol-grid' },
  { theme: 'valentines-day', selector: '.ct-love-letters' },
  { theme: 'birthday', selector: '.ct-party-balloons' },
  { theme: 'christmas', selector: '.ct-holiday-lights' },
  { theme: 'halloween', selector: '.ct-haunted-eyes' },
  { theme: 'hacker', selector: '.ct-hacker-hud' },
  { theme: 'retro', selector: '.ct-retro-broadcast' },
  { theme: 'office', selector: '.ct-office-sticky-notes' },
  { theme: 'apocalypse', selector: '.ct-evacuation-tape' },
  { theme: 'drunk', selector: '.ct-last-call' },
  { theme: 'jumpscare', selector: '.ct-panic-alarm' },
];

test('core themes expose signature effects in a real browser', async ({ page }) => {
  await page.goto('/examples/index.html');
  await page.evaluate(() => {
    const ct = (window as Window & typeof globalThis & { ChaosToggle: any }).ChaosToggle;
    ct.updateSettings({
      cooldownMs: 0,
      probability: 1,
      randomSeed: 'playwright-smoke-seed',
      shortcutsEnabled: false,
      safeMode: false,
      duration: 3200,
    });
  });

  for (const { theme, selector } of themeSignatures) {
    await page.evaluate((nextTheme) => {
      const ct = (window as Window & typeof globalThis & { ChaosToggle: any }).ChaosToggle;
      ct.reset();
      ct.runTheme(nextTheme);
    }, theme);

    await expect(page.locator(selector)).toBeVisible();
  }
});
