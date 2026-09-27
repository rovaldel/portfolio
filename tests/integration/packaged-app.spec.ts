import { expect, test } from '@playwright/test';

test('el build empaquetado entrega seguridad, activos locales y recuperación', async ({ request }) => {
  const home = await request.get('/');
  expect(home.status()).toBe(200);
  expect(home.headers()['content-security-policy']).toContain("font-src 'self'");
  expect(await home.text()).not.toContain('fonts.googleapis.com');
  expect((await request.get('/ruta-no-existe')).status()).toBe(404);
  expect((await request.post('/api/salud')).status()).toBe(405);
});
