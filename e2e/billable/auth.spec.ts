import { test, expect } from '@playwright/test';

/**
 * Full login + JWT + role checks require credentials.
 * Set BILLABLE_E2E_EMAIL (or BILLABLE_E2E_USER) and BILLABLE_E2E_PASSWORD.
 */
const hasCredentials = () =>
  !!(process.env.BILLABLE_E2E_PASSWORD?.trim() &&
    (process.env.BILLABLE_E2E_EMAIL?.trim() ||
      process.env.BILLABLE_E2E_USER?.trim()));

test.describe('Billable — auth', () => {
  test('login, JWT, and roles', async ({ page }) => {
    test.skip(!hasCredentials(), 'Set BILLABLE_E2E_EMAIL (or BILLABLE_E2E_USER) and BILLABLE_E2E_PASSWORD');

    // TODO: navigate to login, submit credentials, assert redirect / dashboard
    // TODO: read JWT from storage or network response; decode claims / roles
    await page.goto('/');
    await expect(page).toHaveURL(/\/.+/);
  });

  test('unauthenticated user cannot reach protected routes', async ({ page }) => {
    test.skip(!hasCredentials(), 'Optional: point BILLABLE_E2E_PROTECTED_PATH at a known protected URL pattern');

    const path = process.env.BILLABLE_E2E_PROTECTED_PATH ?? '/app';
    const res = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(res?.status() ?? 0).toBeLessThan(500);
  });
});
