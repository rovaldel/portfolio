import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/sobre-mi',
  '/habilidades',
  '/servicios',
  '/experiencia',
  '/formacion',
  '/proyectos',
  '/proyectos/leadia',
  '/proyectos/nami',
  '/bitacora',
  '/bitacora/langgraph-para-agentes-en-produccion',
  '/contacto',
  '/privacidad',
  '/cookies',
  '/terminos',
];

test('las 15 rutas mantienen contenido principal y enlaces con JavaScript desactivado', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'no-js-chromium', 'Esta prueba sólo debe ejecutarse sin JavaScript.');
  for (const route of routes) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), route).toBe(
      true,
    );

    const primaryLink = page
      .locator(
        'main a[href]:visible, .article-header a[href]:visible, header a[href]:visible, .legal-modal a[href]:visible',
      )
      .first();
    await expect(primaryLink, route + ' debe ofrecer un enlace de navegación').toBeVisible();
    const href = await primaryLink.getAttribute('href');
    expect(href, route + ' debe tener un destino').toBeTruthy();
    if (href?.startsWith('/')) {
      const target = new URL(href, page.url()).href;
      const response = await page.request.get(target);
      expect(response.status(), route + ' -> ' + href).toBe(200);
    } else {
      expect(href).toMatch(/^(mailto:|tel:|https:\/\/)/);
    }
  }

  await page.goto('/servicios', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-service-detail]')).toHaveCount(0);
  await expect(page.locator('[data-service-open]')).toHaveCount(6);
  await page.getByRole('link', { name: 'Ver proyectos' }).click();
  await expect(page).toHaveURL(/\/proyectos$/);
});
