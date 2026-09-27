import AxeBuilder from '@axe-core/playwright';
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
const themes = ['light', 'dark', 'cobalto', 'rioja', 'bosque'];

for (const route of routes)
  test(`H1 visible, landmarks y axe: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const heading = page.locator('h1');
    await expect(heading).toHaveCount(1);
    await expect(heading).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    if (route === '/') {
      const presentation = page.getByRole('region', { name: 'Presentación de Rodrigo' });
      await expect(presentation.getByRole('link', { name: 'Sobre mí' })).toBeVisible();
      await expect(presentation.getByRole('link', { name: 'Ver proyectos' })).toBeVisible();
      await expect(page.getByRole('navigation', { name: 'Secciones del portfolio' })).toBeVisible();
    } else if (route.startsWith('/bitacora/langgraph-')) {
      await expect(page.getByRole('link', { name: 'Volver a Bitácora' })).toBeVisible();
    } else if (route === '/bitacora') {
      await expect(page.getByRole('link', { name: 'Volver a portada' })).toBeVisible();
    } else if (route === '/contacto') {
      await expect(page.getByRole('region', { name: 'Información de contacto' })).toBeVisible();
    } else {
      await expect(page.getByRole('navigation', { name: 'Secciones del portfolio' })).toBeVisible();
    }
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? '')),
    ).toEqual([]);
  });

for (const theme of themes)
  test(`axe y selector anuncian el tema ${theme}`, async ({ page }) => {
    await page.addInitScript((selectedTheme) => localStorage.setItem('rv_theme', selectedTheme), theme);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    const trigger = page.getByRole('button', { name: 'Cambiar tema visual' });
    await trigger.click();
    await expect(page.locator(`[data-theme-id="${theme}"]`)).toHaveAttribute('aria-current', 'true');
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact ?? '')),
    ).toEqual([]);
  });

test('axe cubre catálogo de servicios y diálogos de servicio y proyecto', async ({ page }) => {
  await page.goto('/servicios', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('region', { name: 'Catálogo de servicios' })).toBeVisible();
  const serviceResults = await new AxeBuilder({ page }).analyze();
  expect(
    serviceResults.violations.filter((issue) => ['critical', 'serious'].includes(issue.impact ?? '')),
  ).toEqual([]);

  await page.goto('/servicios?servicio=agentes-y-chatbots-ia', { waitUntil: 'domcontentloaded' });
  const serviceDialog = page.getByRole('dialog', { name: 'Agentes y chatbots IA' });
  await expect(serviceDialog).toBeVisible();
  const serviceDialogResults = await new AxeBuilder({ page }).analyze();
  expect(
    serviceDialogResults.violations.filter((issue) => ['critical', 'serious'].includes(issue.impact ?? '')),
  ).toEqual([]);

  await page.goto('/proyectos/leadia', { waitUntil: 'domcontentloaded' });
  const dialog = page.getByRole('dialog', { name: /Detalle de Leadia/ });
  await expect(dialog).toBeVisible();
  const dialogResults = await new AxeBuilder({ page }).analyze();
  expect(
    dialogResults.violations.filter((issue) => ['critical', 'serious'].includes(issue.impact ?? '')),
  ).toEqual([]);
});

for (const route of ['/privacidad', '/cookies', '/terminos'])
  test(`legal ${route} muestra la aprobación final y no presenta banner de consentimiento`, async ({
    page,
  }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.legal-document__status')).toContainText(
      'Revisión final aprobada por el titular',
    );
    await expect(page.locator('[data-cookie-consent], [role="alert"][aria-label*="cookie" i]')).toHaveCount(
      0,
    );
  });

test('contacto enlaza la información de privacidad antes del envío', async ({ page }) => {
  await page.goto('/contacto', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('link', { name: 'Privacidad' }).first()).toHaveAttribute('href', '/privacidad');
});
