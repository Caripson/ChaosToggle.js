import { expect, test } from '@playwright/test';

test('landing mode buttons now expose distinct panic, celebration, and nuclear layers', async ({ page }) => {
  await page.goto('/docs/index.html');

  await page.locator('[data-landing-mode="celebration"]').first().click();
  await expect(page.locator('.ct-party-balloons')).toBeVisible();
  await expect(page.locator('.ct-popup')).toHaveCount(0);

  await page.locator('[data-landing-mode="panic"]').first().click();
  await expect(page.locator('.ct-panic-alarm')).toBeVisible();
  await expect(page.locator('.ct-reality-tear')).toHaveCount(0);

  await page.locator('[data-landing-mode="nuclear"]').first().click();
  await expect(page.locator('.ct-panic-alarm')).toBeVisible();
  await expect(page.locator('.ct-reality-tear')).toBeVisible();
});

test('playground gives effect feedback and supports inverted scroll setup', async ({ page }) => {
  await page.goto('/docs/demo/index.html');

  const sample = page.locator('#chaos-target');
  await expect(sample).toBeVisible();
  await expect(sample.evaluate((node) => node.scrollHeight > node.clientHeight)).resolves.toBe(true);

  await page.locator('[data-effect="autoTypo"]').click();
  await expect(page.locator('#ct-status')).toContainText('Type in the sample input');

  await page.locator('[data-effect="invertedScroll"]').click();
  await expect(page.locator('#ct-status')).toContainText('backwards');
});
