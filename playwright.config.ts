import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['html'],
    ['github'],
    ['junit', { outputFile: 'results.xml' }],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'billable',
      testDir: './e2e/billable',
      testIgnore: ['**/public/**', 'public.spec.ts'],
      use: {
        baseURL:
          process.env.BILLABLE_URL ?? 'https://mybillable.co.za',
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'billable-public',
      testDir: './e2e/billable',
      testMatch: ['public.spec.ts', '**/public/**/*.spec.ts'],
      use: {
        baseURL:
          process.env.BILLABLE_PUBLIC_URL ?? 'https://mybillable.co.za',
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'engineiq',
      testDir: './e2e/engineiq',
      use: {
        baseURL:
          process.env.ENGINEIQ_URL ?? 'https://app.engineiq.co.za',
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'therecord',
      testDir: './e2e/therecord',
      use: {
        baseURL:
          process.env.THERECORD_URL ?? 'https://therecord.co.za',
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'mobile-web',
      testDir: './e2e/mobile',
      use: {
        baseURL:
          process.env.MOBILE_WEB_URL ??
          process.env.BILLABLE_URL ??
          'https://mybillable.co.za',
        ...devices['iPhone 14'],
      },
    },
  ],
});
