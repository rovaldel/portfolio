import { expect, test } from '@playwright/test';

test('Contacto ignora asuntos ajenos y la API de contacto no existe', async ({ request }) => {
  const invalid = await request.get('/contacto?asunto=<script>alert(1)</script>');
  expect(await invalid.text()).not.toContain('alert(1)');
  expect((await request.post('/api/contacto')).status()).not.toBe(200);
});
