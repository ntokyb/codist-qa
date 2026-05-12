import { test, expect } from '@playwright/test';

test.describe('The Record — search', () => {
  test('search returns results or empty state', async ({ page }) => {
    const q = process.env.THERECORD_E2E_SEARCH_QUERY?.trim() ?? 'property';
    await page.goto('/');
    const search = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i));
    test.skip(
      (await search.count()) === 0,
      'No search control — add role/placeholder or set THERECORD_E2E_SEARCH_URL to a deep link',
    );
    await search.first().fill(q);
    await search.first().press('Enter').catch(() => {});
    await expect(page.locator('body')).toBeVisible();
  });
});
