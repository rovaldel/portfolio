import { expect, test } from '@playwright/test';
import { canonicalUrl } from '../../src/lib/site-urls';

const publicRoutes = [
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
];

test('cada destino público abre y conserva su canonical al recargar', async ({ page }) => {
  for (const path of publicRoutes) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalUrl(path));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toBeVisible();
  }
});

test('la cabecera no duplica secciones y el prompt conserva la exploración', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('navigation', { name: 'Navegación principal' })).toHaveCount(0);
  const navigation = page.getByRole('navigation', { name: 'Secciones del portfolio' });
  await navigation.getByRole('link', { name: 'Sobre mí' }).click();
  await expect(page.locator('[data-conversation-thread]')).toBeVisible();
  await expect(page.locator('[data-conversation-thread]')).toContainText('Rodrigo Valdelvira');
  await expect(page).toHaveURL(/\/$/);
});
