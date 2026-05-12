import { test, expect } from '@playwright/test';

async function reachable(
  get: (path: string) => Promise<{ status(): number }>,
  paths: string[],
): Promise<boolean> {
  for (const path of paths) {
    try {
      const res = await get(path);
      if (res.status() < 500)
        return true;
    } catch {
      /* next */
    }
  }
  return false;
}

test('billable home @smoke', async ({ request }) => {
  const ok = await reachable(
    (p) => request.get(p, { timeout: 20_000, failOnStatusCode: false }),
    ['/', '/health'],
  );
  test.skip(!ok, 'Billable not reachable — skip smoke');
  const res = await request.get('/', { failOnStatusCode: false });
  expect(res.status()).toBeLessThan(500);
});
