import { test, expect } from '@playwright/test';

test.describe('The Record — homepage', () => {
  test('loads primary layout', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    // TODO: assert masthead / key sections when stable selectors exist
  });
});
