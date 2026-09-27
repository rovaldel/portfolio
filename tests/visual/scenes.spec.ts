import { expect, test } from '@playwright/test';

test('la portada se captura sin solicitudes externas', async ({ page }, testInfo) => {
  const external: string[] = [];
  const baseUrl = String(testInfo.project.use.baseURL);
  const localOrigin = new URL(baseUrl).origin;
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== localOrigin && url.protocol !== 'data:' && url.protocol !== 'blob:')
      external.push(request.url());
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Soy Rodrigo/ })).toBeVisible();
  expect(external).toEqual([]);
});
