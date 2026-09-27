import { expect, test } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

test('descargar CV entrega el PDF real desde el botón', async ({ page }) => {
  await page.goto('/');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Descargar CV en PDF' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('Rodrigo-Valdelvira-CV.pdf');
  const file = await download.path();
  expect(file).toBeTruthy();
  expect(
    createHash('sha256')
      .update(await readFile(file!))
      .digest('hex'),
  ).toBe('889781068935b4a4838422a61709e2a3449efe74536060474ee0f0707f9cd7b4');
});

test('navegación en una fila y recursos próximos separados', async ({ page }, info) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const actions = page.locator('[data-actions] a');
  await expect(actions).toHaveCount(7);
  const tops = await actions.evaluateAll((links) => links.map((link) => link.getBoundingClientRect().top));
  expect(new Set(tops).size).toBe(1);
  await expect(page.locator('.upcoming-resources')).toContainText('Toolkit IA');
  await expect(page.locator('.upcoming-resources')).toContainText('Bitácora');
  await expect(page.locator('.upcoming-resources small')).toHaveCount(2);
  await expect(page.locator('.mockup-hero__quote > span')).toHaveCount(0);
  await expect
    .poll(() =>
      page
        .locator('.mockup-hero__title .eyebrow')
        .evaluate((element) => getComputedStyle(element, '::after').content),
    )
    .toBe('none');
  await page.screenshot({ path: info.outputPath('home-desktop.png') });
});

test('habilidades legibles y estrellas accesibles en móvil', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/habilidades');
  await expect(page.getByRole('img', { name: 'Nivel orientativo: 5 de 5' })).toHaveCount(8);
  await expect(page.locator('.skill-rating')).toHaveCount(22);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.screenshot({ path: info.outputPath('skills-mobile.png') });
});

test('contacto visible, LinkedIn seguro y campos con foco sutil', async ({ page }, info) => {
  await page.goto('/contacto');
  const linkedin = page.locator('[data-channel-kind="linkedin"]');
  await expect(linkedin).toHaveAttribute('target', '_blank');
  await expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(linkedin.locator('svg')).toHaveAttribute('fill', 'currentColor');
  await expect(page.locator('.contact-card__privacy')).toBeVisible();
  await page.getByRole('textbox', { name: 'Tu nombre' }).focus();
  await expect(page.getByRole('textbox', { name: 'Tu nombre' })).toHaveCSS('outline-width', '2px');
  await page.screenshot({ path: info.outputPath('contact-desktop.png') });
});

test('la tarjeta completa abre el modal con teclado y devuelve el foco', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('[data-actions]').getByRole('link', { name: 'Proyectos' }).click();
  const card = page.locator('[data-conversation-thread] .project-card').first();
  await expect(card).not.toContainText('Ver detalles');
  await card.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: /Detalle de Leadia/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(card).toBeFocused();
  await page.screenshot({ path: info.outputPath('projects-desktop.png') });
});
