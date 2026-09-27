import { expect, test } from '@playwright/test';

test('salud, cabeceras y canonicalización cumplen el contrato', async ({ request }) => {
  const health = await request.get('/api/salud');
  expect(health.status()).toBe(200);
  expect(await health.json()).toEqual({ status: 'ok' });
  expect(health.headers()['cache-control']).toBe('no-store');
  const home = await request.get('/');
  expect(home.headers()['content-security-policy']).toContain("default-src 'self'");
  expect(home.headers()['content-security-policy']).not.toContain('unsafe-inline');
  expect(home.headers()['x-frame-options']).toBe('DENY');
  const canonical = await request.get('/SOBRE-MI/', { maxRedirects: 0 });
  expect(canonical.status()).toBe(308);
  expect(canonical.headers()['location']).toContain('/sobre-mi');
  const www = await request.get('/contacto?asunto=agentes-y-chatbots-ia', {
    headers: { host: 'www.rodrigovaldelvira.com' },
    maxRedirects: 0,
  });
  expect(www.status()).toBe(308);
  expect(www.headers()['location']).toBe(
    'https://rodrigovaldelvira.com/contacto?asunto=agentes-y-chatbots-ia',
  );
});
