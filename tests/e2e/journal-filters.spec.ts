import { expect, test } from '@playwright/test';

test('los filtros de Bitácora funcionan con teclado y anuncian el estado vacío', async ({ page }) => {
  await page.goto('/bitacora', { waitUntil: 'domcontentloaded' });
  await expect(
    page.getByRole('heading', {
      name: 'Cómo evalué tres frameworks de agentes antes de elegir LangGraph',
    }),
  ).toBeVisible();

  const category = page.getByRole('button', { name: 'Agentes' });
  await category.focus();
  await expect(category).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(category).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-journal-entry]')).toHaveCount(1);

  const search = page.getByRole('searchbox', { name: 'Filtrar artículos' });
  await search.fill('categoría sin resultados');
  await expect(page.getByRole('status')).toContainText('No hay artículos que coincidan con los filtros.');
  await expect(page.locator('[data-journal-entry]')).toBeHidden();

  await search.fill('LangGraph');
  await expect(page.locator('[data-journal-entry]')).toBeVisible();
  await page.getByRole('link', { name: 'Leer el artículo' }).click();
  await expect(page).toHaveURL(/\/bitacora\/langgraph-para-agentes-en-produccion$/);
  await expect(page.getByRole('heading', { name: /Cómo evalué tres frameworks/ })).toBeVisible();
  await page.getByRole('link', { name: 'Pregúntame sobre esto' }).click();
  await expect(page).toHaveURL(/\/#consulta-langgraph$/);
  await expect(page.locator('[data-query-turn]')).toContainText('LangGraph');
  await expect(page.locator('[data-query-turn]')).toContainText('CrewAI');
  await expect(
    page.locator('[data-query-turn] a[href="/bitacora/langgraph-para-agentes-en-produccion"]'),
  ).toHaveText('Leer la evaluación completa');
});
