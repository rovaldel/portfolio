import { expect, test } from '@playwright/test';

test('explora el portfolio y vuelve a portada', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: /Soy Rodrigo, AI Engineer/ })).toBeVisible();
  await page.getByRole('link', { name: 'Ver proyectos' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('[data-conversation-thread]')).toContainText('Proyecto 1 de 2');
  await expect(page.getByRole('link', { name: /Rodrigo Valdelvira, volver a portada/ })).toBeVisible();

  await page.goto('/proyectos', { waitUntil: 'domcontentloaded' });
  const nami = page.getByRole('link', { name: 'Abrir proyecto Nami', exact: true });
  await expect(nami).toBeVisible();
  await nami.click();
  await expect(page).toHaveURL(/\/proyectos\/nami$/);
  await page.getByRole('link', { name: 'Cerrar detalle del proyecto' }).click();
  await expect(page).toHaveURL(/\/proyectos$/);
  await page.getByRole('link', { name: /Rodrigo Valdelvira, volver a portada/ }).click();
  await expect(page).toHaveURL(/\/$/);
});
