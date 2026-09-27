import { expect, test } from '@playwright/test';

test('Rioja es inicial y el selector anuncia y conserva las cinco opciones', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'rioja');
  await page.getByRole('button', { name: 'Cambiar tema visual' }).click();
  await expect(page.getByRole('button', { name: 'Rioja' })).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-theme-id]')).toHaveCount(5);
  await page.getByRole('button', { name: 'Bosque' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'bosque');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'bosque');
});

test('un valor corrupto o storage bloqueado conserva el fallback Rioja', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('rv_theme', 'no-es-un-tema'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'rioja');
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get: () => ({
        getItem: () => {
          throw new Error('blocked');
        },
      }),
    });
  });
  await page.goto('/?storage=blocked', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'rioja');
});

test('Escape y pulsación exterior cierran el selector y restauran foco', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const trigger = page.getByRole('button', { name: 'Cambiar tema visual' });
  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.locator('main').click({ position: { x: 5, y: 5 } });
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toBeFocused();
});
