import { test, expect } from '@playwright/test';

const paystackReady = () =>
  !!process.env.PAYSTACK_SECRET_KEY?.trim() &&
  !!process.env.BILLABLE_E2E_PAYMENT_INVOICE_ID?.trim();

test.describe('Billable — payment', () => {
  test('partial payment and payment plan', async ({ page }) => {
    test.skip(
      !paystackReady(),
      'Set PAYSTACK_SECRET_KEY and BILLABLE_E2E_PAYMENT_INVOICE_ID for payment scenarios',
    );

    // TODO: open invoice, apply partial amount; assert balance
    // TODO: configure or assert payment plan instalments
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
});
