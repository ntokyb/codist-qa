import { createHmac } from 'crypto';
import { test, expect } from '@playwright/test';

function githubSignature256(secret: string, rawBody: string) {
  const hex = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
  return `sha256=${hex}`;
}

test.describe('EngineIQ — GitHub webhook', () => {
  test('simulates PR opened webhook with valid signature', async ({
    request,
    baseURL,
  }) => {
    const secret = process.env.ENGINEIQ_WEBHOOK_SECRET?.trim();
    test.skip(!secret, 'Set ENGINEIQ_WEBHOOK_SECRET to match the API webhook signing key');

    const path =
      process.env.ENGINEIQ_WEBHOOK_PATH?.trim() ?? '/api/webhooks/github';
    const url = new URL(path, baseURL).toString();
    const body = JSON.stringify({
      action: 'opened',
      number: 1,
      pull_request: {
        html_url: 'https://github.com/acme/repo/pull/1',
        head: { sha: 'abc123' },
        base: { ref: 'main' },
      },
      repository: { full_name: 'acme/repo' },
    });

    const res = await request.post(url, {
      headers: {
        'content-type': 'application/json',
        'X-GitHub-Event': 'pull_request',
        'X-Hub-Signature-256': githubSignature256(secret, body),
      },
      data: body,
    });

    expect(
      res.status(),
      await res.text(),
    ).toBeLessThan(500);
  });
});
