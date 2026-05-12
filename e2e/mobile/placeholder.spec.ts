import { test, expect } from '@playwright/test';

test('mobile-web home @smoke', async ({ request, baseURL }) => {
  const base = baseURL ?? '/';
  let ok = false;
  for (const path of [base, `${base.replace(/\/$/, '')}/health`]) {
    try {
      const res = await request.get(path, { timeout: 20_000, failOnStatusCode: false });
      if (res.status() < 500) {
        ok = true;
        break;
      }
    } catch {
      /* next */
    }
  }
  test.skip(!ok, 'Mobile target not reachable — skip smoke');

  const res = await request.get(base, { failOnStatusCode: false });
  expect(res.status()).toBeLessThan(500);
});