import { test, expect } from '@playwright/test';

/**
 * Uses BILLABLE_PUBLIC_URL (billable-public project). Optional deep link:
 * BILLABLE_E2E_PUBLIC_INVOICE_PATH — e.g. /i/abc123
 */
test.describe('Billable — public', () => {
  test('public invoice page', async ({ page, baseURL }) => {
    const suffix = process.env.BILLABLE_E2E_PUBLIC_INVOICE_PATH?.trim() ?? '/';
    const url = `${baseURL?.replace(/\/$/, '') ?? ''}${suffix.startsWith('/') ? suffix : `/${suffix}`}`;
    await page.goto(url);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Paystack redirect after initiating payment', async ({ page }) => {
    test.skip(
      !process.env.BILLABLE_E2E_PUBLIC_PAY_URL?.trim(),
      'Set BILLABLE_E2E_PUBLIC_PAY_URL to the hosted pay / redirect entry you want to exercise',
    );

    await page.goto(process.env.BILLABLE_E2E_PUBLIC_PAY_URL!.trim());
    await expect(page).toHaveURL(/paystack|checkout/i);
  });
});
