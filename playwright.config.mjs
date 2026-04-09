import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PLAYWRIGHT_PORT || 4173);
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    },
  },
  reporter: 'list',
  fullyParallel: false,
  use: {
    ...devices['Desktop Chrome'],
    baseURL,
    viewport: { width: 1440, height: 1100 },
    trace: 'on-first-retry',
  },
  webServer: {
    command: `python3 -m http.server ${PORT}`,
    cwd: '.',
    reuseExistingServer: !process.env.CI,
    url: baseURL,
  },
  projects: [
    {
      name: 'chromium',
    },
  ],
});
