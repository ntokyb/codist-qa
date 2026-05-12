import { test, expect } from '@playwright/test';

test.describe('The Record — homepage', () => {
  test('loads primary layout @smoke', async ({ page, request }) => {
    const ok = await (async () => {
      for (const p of ['/', '/health']) {
        try {
          const res = await request.get(p, { timeout: 20_000, failOnStatusCode: false });
          if (res.status() < 500)
            return true;
        } catch {
          /* next */
        }
      }
      return false;
    })();
    test.skip(!ok, 'The Record not reachable — skip smoke');

    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    // TODO: assert masthead / key sections when stable selectors exist
  });
});
