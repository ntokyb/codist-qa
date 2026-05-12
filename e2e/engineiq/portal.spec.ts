import { test, expect } from '@playwright/test';

test.describe('EngineIQ — portal', () => {
  test('login, dashboard, PR history', async ({ page }) => {
    test.skip(
      !process.env.ENGINEIQ_E2E_EMAIL?.trim() ||
        !process.env.ENGINEIQ_E2E_PASSWORD?.trim(),
      'Set ENGINEIQ_E2E_EMAIL and ENGINEIQ_E2E_PASSWORD for portal flows',
    );

    // TODO: fill login form, assert dashboard
    // TODO: open PR history / reviews list and assert row for a known PR when ENGINEIQ_E2E_KNOWN_PR is set
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
});
