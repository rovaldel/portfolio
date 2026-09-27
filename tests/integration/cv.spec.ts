import { createHash } from 'node:crypto';
import { expect, test } from '@playwright/test';

test('el CV conserva bytes, nombre y cabeceras', async ({ request }) => {
  const response = await request.get('/Rodrigo-Valdelvira-CV.pdf');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-disposition']).toContain('Rodrigo-Valdelvira-CV.pdf');
  expect(response.headers()['x-robots-tag']).toContain('noindex');
  expect(
    createHash('sha256')
      .update(await response.body())
      .digest('hex'),
  ).toBe('889781068935b4a4838422a61709e2a3449efe74536060474ee0f0707f9cd7b4');
});
