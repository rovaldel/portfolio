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

test('las 15 rutas hacen reflow a 320 px, 390 × 844 y sin recursos externos', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4311')) external.push(request.url());
  });
  for (const viewport of [
    { width: 320, height: 700 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    for (const route of routes) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        route,
      ).toBe(true);
    }
  }
  expect(external).toEqual([]);
});

test('la consulta y la respuesta siguen alcanzables con tamaño de texto ampliado', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/sobre-mi', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    const sheet = [...document.styleSheets].find((candidate) => candidate.href?.startsWith(location.origin));
    if (!sheet) throw new Error('No hay una hoja de estilos propia para simular texto ampliado');
    sheet.insertRule('html { font-size: 200% !important; }', sheet.cssRules.length);
  });
  await page.getByRole('link', { name: 'Servicios' }).last().click();
  const thread = page.locator('[data-conversation-thread]');
  await expect(thread).toBeVisible();
  await expect(thread.locator('.conversation-response-link')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('las 15 rutas hacen reflow al ancho CSS equivalente a zoom 200 %', async ({ page }) => {
  // 720 × 450 CSS px representa una ventana de 1440 × 900 al 200 % de zoom.
  await page.setViewportSize({ width: 720, height: 450 });
  for (const route of routes) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      `${route} a 200 %`,
    ).toBe(true);
    await expect(page.locator('h1')).toBeVisible();
  }
});

test('la respuesta y la consulta permanecen visibles con viewport reducido como teclado móvil', async ({
  page,
}) => {
  // Playwright no abre un teclado virtual físico; reducir la altura ejercita el resize de la ventana visual.
  await page.setViewportSize({ width: 390, height: 420 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-portfolio-action][href="/servicios"]').click();

  const dock = page.locator('[data-action-dock]');
  const thread = page.locator('[data-conversation-thread]');
  await expect(thread).toBeVisible();
  await expect(thread.locator('[data-service]').first()).toBeVisible();
  await expect(dock.getByRole('link', { name: 'Servicios', exact: true })).toBeInViewport({ ratio: 1 });
});

test('el fallback de imagen conserva su caja comprensible', async ({ page }) => {
  await page.route('**/images/rodrigo-valdelvira.*', (route) => route.abort());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Retrato de Rodrigo Valdelvira no disponible')).toBeVisible();
});
