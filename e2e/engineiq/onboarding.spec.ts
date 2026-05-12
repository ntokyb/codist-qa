import { test, expect } from '@playwright/test';

test.describe('EngineIQ — onboarding', () => {
  test('register tenant and obtain API key', async ({ page }) => {
    test.skip(
      !process.env.ENGINEIQ_E2E_TENANT_EMAIL?.trim() ||
        !process.env.ENGINEIQ_E2E_TENANT_PASSWORD?.trim(),
      'Set ENGINEIQ_E2E_TENANT_EMAIL and ENGINEIQ_E2E_TENANT_PASSWORD for full onboarding',
    );

    // TODO: navigate signup / register-tenant flow
    // TODO: assert API key or token visible in dashboard or API response
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
});
