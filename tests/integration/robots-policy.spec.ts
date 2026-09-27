import { expect, test } from '@playwright/test';

test('robots permite OAI-SearchBot y bloquea GPTBot', async ({ request }) => {
  const response = await request.get('/robots.txt');
  expect(response.status()).toBe(200);
  const text = await response.text();
  expect(text).toMatch(/User-agent:\s*OAI-SearchBot[\s\S]*?Allow:\s*\//i);
  expect(text).toMatch(/User-agent:\s*GPTBot[\s\S]*?Disallow:\s*\//i);
  expect(text).toContain('Sitemap: https://rodrigovaldelvira.com/sitemap.xml');
});
