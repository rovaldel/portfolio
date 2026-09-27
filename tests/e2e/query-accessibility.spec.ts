import { expect, test } from '@playwright/test';

test('la consulta anuncia respuestas sin mover el foco ni el desplazamiento', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const query = page.getByRole('textbox', { name: 'Escribe tu pregunta' });
  await expect(query).toHaveAttribute('aria-describedby', 'query-guidance query-count');
  await expect(page.locator('[data-conversation-thread]')).toHaveAttribute('role', 'log');
  await expect(page.locator('[data-conversation-thread]')).toHaveAttribute('aria-live', 'polite');

  await query.fill('¿Quién es Rodrigo?');
  const before = await page.evaluate(() => ({
    activeId: (document.activeElement as HTMLElement | null)?.id,
    scrollY: window.scrollY,
  }));
  await query.press('Enter');
  await expect(page.locator('[data-conversation-thread]')).toContainText('Un perfil que combina ingeniería');
  const after = await page.evaluate(() => ({
    activeId: (document.activeElement as HTMLElement | null)?.id,
    scrollY: window.scrollY,
  }));
  expect(after).toEqual(before);
});

test('el límite de caracteres se comunica mediante un estado accesible', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const query = page.getByRole('textbox', { name: 'Escribe tu pregunta' });
  await query.fill('x'.repeat(300));
  await expect(page.locator('[data-query-limit]')).toHaveText('Límite de 300 caracteres alcanzado.');
});

test('el prompt no dibuja un borde de foco granate', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const query = page.getByRole('textbox', { name: 'Escribe tu pregunta' });
  await query.focus();
  expect(await query.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe('none');
});
