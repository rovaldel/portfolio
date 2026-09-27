import { expect, test } from '@playwright/test';

test('servicios llevan a contacto honesto y Nami no ofrece enlace vacío', async ({ page }) => {
  await page.goto('/servicios', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Servicios' })).toBeVisible();
  await page.getByRole('link', { name: 'Agentes y chatbots IA' }).click();
  const serviceDialog = page.getByRole('dialog', { name: 'Agentes y chatbots IA' });
  await expect(serviceDialog).toBeVisible();
  await serviceDialog.getByRole('link', { name: 'Hablar de esto' }).click();
  await expect(page.getByText('Consulta sobre: Agentes y chatbots IA')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enviar mensaje' })).toBeEnabled();
  await expect(page.locator('.contact-card__privacy')).toBeVisible();
  await page.goto('/proyectos/nami', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('En fase de diseño.')).toBeVisible();
  await expect(page.getByRole('link', { name: /Visitar Leadia/ })).toHaveCount(0);
});
