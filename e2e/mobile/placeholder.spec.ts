import { test, expect } from '@playwright/test';

test('mobile-web scaffold: home responds', async ({ request, baseURL }) => {
  const res = await request.get(baseURL ?? '/');
  expect(res.status(), await res.text()).toBeLessThan(500);
});
