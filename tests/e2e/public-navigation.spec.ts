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

test('los enlaces canónicos funcionan con atrás y adelante', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const navigation = page.getByRole('navigation', { name: 'Navegación principal' });
  await navigation.getByRole('link', { name: 'Sobre mí' }).click();
  await expect(page).toHaveURL(/\/sobre-mi$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/sobre-mi$/);
  await expect(page.locator('h1')).toHaveText('Sobre mí');
});
