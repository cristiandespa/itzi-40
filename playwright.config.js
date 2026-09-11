import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  globalSetup: './tests/setup.js',
  fullyParallel: true,
  timeout: 60000,
  expect: { timeout: 10000 },
  reporter: 'list',
  workers: 3,
  use: { baseURL: 'http://127.0.0.1:4173', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: { command: 'npm run dev', url: 'http://127.0.0.1:4173', reuseExistingServer: true },
  projects: [
    { name: 'chromium-mobile', use: { ...devices['Pixel 7'] } },
    { name: 'webkit-iphone', use: { ...devices['iPhone 13'] } },
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
});
