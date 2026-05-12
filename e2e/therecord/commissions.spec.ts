import { test, expect } from '@playwright/test';

test.describe('The Record — commissions', () => {
  test('commissions area or listing reachable', async ({ page }) => {
    const path = process.env.THERECORD_E2E_COMMISSIONS_PATH?.trim() ?? '/commissions';
    await page.goto(path);
    await expect(page.locator('body')).toBeVisible();
    // TODO: authenticated flows when THERECORD_E2E_* credentials are set
  });
});
