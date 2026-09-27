import { expect, test } from '@playwright/test';

test('Tab, Shift+Tab y controles devuelven foco con nombre visible', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Saltar al contenido' });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Tab');
  const cv = page.getByRole('link', { name: 'Descargar CV en PDF' });
  await expect(cv).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(skip).toBeFocused();

  const themeTrigger = page.getByRole('button', { name: 'Cambiar tema visual' });
  await themeTrigger.click();
  await expect(page.getByRole('button', { name: 'Rioja' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(themeTrigger).toBeFocused();

  await page.goto('/servicios', { waitUntil: 'domcontentloaded' });
  const serviceLink = page.getByRole('link', { name: 'Agentes y chatbots IA', exact: true });
  await serviceLink.focus();
  await expect(serviceLink).toBeFocused();
  await page.keyboard.press('Enter');
  const serviceDialog = page.getByRole('dialog', { name: 'Agentes y chatbots IA' });
  await expect(serviceDialog.getByRole('link', { name: 'Cerrar detalle del servicio' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/servicios$/);
});

test('diálogo de servicio atrapa el foco y Escape vuelve al índice', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'no-js-chromium', 'El diálogo modal se mejora con JavaScript.');
  await page.goto('/servicios?servicio=agentes-y-chatbots-ia', { waitUntil: 'domcontentloaded' });
  const dialog = page.getByRole('dialog', { name: 'Agentes y chatbots IA' });
  await expect(dialog.getByRole('link', { name: 'Cerrar detalle del servicio' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/servicios$/);
});

test('diálogo de proyecto contiene Tab y Escape recupera el índice canónico', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'no-js-chromium', 'El diálogo modal se mejora con JavaScript.');
  await page.goto('/proyectos/leadia', { waitUntil: 'domcontentloaded' });
  const dialog = page.getByRole('dialog', { name: /Detalle de Leadia/ });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'Cerrar detalle del proyecto' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  const lastLink = dialog.getByRole('link', { name: /Visitar proyecto/ });
  await expect(lastLink).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('link', { name: 'Cerrar detalle del proyecto' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/proyectos$/);
});

test('reduce movimiento y evita escritura o desplazamiento suave', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const values = await page.evaluate(() => ({
    scroll: getComputedStyle(document.documentElement).scrollBehavior,
    animation: getComputedStyle(document.body).animationDuration,
  }));
  expect(values.scroll).not.toBe('smooth');
  expect(Number.parseFloat(values.animation)).toBeLessThanOrEqual(0.01);
});

test('la respuesta de consulta aparece completa al usar movimiento reducido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const query = page.getByRole('textbox', { name: 'Escribe tu pregunta' });
  await query.fill('¿Quién es Rodrigo?');
  await query.press('Enter');
  const response = page.locator('[data-conversation-thread]');
  await expect(response).toContainText(
    'Un perfil que combina ingeniería, datos e inteligencia artificial aplicada.',
  );
  await expect(response.locator('.conversation-response-link')).toHaveCount(0);
  await expect(query).toBeFocused();
});
