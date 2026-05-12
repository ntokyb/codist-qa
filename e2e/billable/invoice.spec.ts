import { test, expect } from '@playwright/test';

const paystackReady = () => !!process.env.PAYSTACK_SECRET_KEY?.trim();

test.describe('Billable — invoice (Paystack test mode)', () => {
  test('create → send → pay', async ({ page }) => {
    test.skip(!paystackReady(), 'Set PAYSTACK_SECRET_KEY (test mode) for payment flows');

    // TODO: authenticated session (reuse storageState from auth setup when ready)
    // TODO: create draft invoice, send to customer, open pay link
    // TODO: complete Paystack test checkout; assert paid status in app
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
});
