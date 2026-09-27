import { expect, test } from '@playwright/test';

const indexableRoutes = [
  '/',
  '/sobre-mi',
  '/habilidades',
  '/servicios',
  '/experiencia',
  '/formacion',
  '/proyectos',
  '/proyectos/leadia',
  '/proyectos/nami',
  '/contacto',
];

test('sitemap y llms.txt enlazan solo rutas publicadas canónicas', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const path of indexableRoutes) {
    expect(xml).toContain('https://rodrigovaldelvira.com' + path);
  }
  expect(xml).not.toContain('/bitacora');
  expect(xml).not.toContain('/privacidad');
  expect(xml).not.toContain('/cookies');
  expect(xml).not.toContain('/terminos');
  expect(xml).not.toContain('/api/');

  const llms = await request.get('/llms.txt');
  expect(llms.status()).toBe(200);
  const text = await llms.text();
  for (const path of indexableRoutes) expect(text).toContain('https://rodrigovaldelvira.com' + path);
  expect(text).not.toContain('/privacidad');
  expect(text).not.toContain('/api/');
});

test('JSON-LD de la portada referencia su contenido y canonical aprobados', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const json = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(json ?? '{}')).toMatchObject({
    '@context': 'https://schema.org',
    '@graph': expect.arrayContaining([
      expect.objectContaining({ '@type': 'Person', name: 'Rodrigo Valdelvira Ortigosa' }),
      expect.objectContaining({ '@type': 'WebSite', url: 'https://rodrigovaldelvira.com/' }),
      expect.objectContaining({
        '@type': 'WebPage',
        url: 'https://rodrigovaldelvira.com/',
        inLanguage: 'es',
      }),
    ]),
  });
});
