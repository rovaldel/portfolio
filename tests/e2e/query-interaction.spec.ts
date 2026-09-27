import { expect, test } from '@playwright/test';

test('consulta vacía, límite de texto y teclado', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const query = page.getByRole('textbox', { name: 'Escribe tu pregunta' });
  const turns = page.locator('[data-conversation-thread] [data-query-turn]');

  await query.fill('   ');
  await query.press('Enter');
  await expect(turns).toHaveCount(0);

  await query.fill('¿Quién es Rodrigo?');
  await query.press('Enter');
  await expect(turns).toHaveCount(1);
  await expect(turns.last()).toContainText('Un perfil que combina ingeniería');

  await query.fill('Línea uno');
  await query.press('Shift+Enter');
  await expect(query).toHaveValue('Línea uno\n');

  await query.fill('x'.repeat(301));
  await expect(query).toHaveValue('x'.repeat(300));
  await expect(page.locator('#query-count')).toHaveText('300 de 300 caracteres');
  await query.press('Enter');
  await expect(turns).toHaveCount(2);
});

test('una consulta no reconocida ofrece las secciones disponibles', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const query = page.getByRole('textbox', { name: 'Escribe tu pregunta' });

  await query.fill('¿Cuál es tu receta favorita?');
  await query.press('Enter');

  const thread = page.locator('[data-conversation-thread]');
  await expect(thread).toContainText('Puedo ayudarte con:');
  await expect(thread.getByRole('link', { name: 'Proyectos' })).toBeVisible();
  await expect(thread.getByRole('link', { name: 'Habilidades' })).toBeVisible();
});
