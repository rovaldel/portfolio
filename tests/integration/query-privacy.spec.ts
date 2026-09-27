import { expect, test } from '@playwright/test';

test('la consulta vive solo en la pestaña y se descarta al recargar o volver al inicio', async ({ page }) => {
  const queryText = '¿Quién es Rodrigo?';
  const requestData: string[] = [];
  const consoleOutput: string[] = [];
  page.on('request', (request) => requestData.push(request.url() + ' ' + (request.postData() ?? '')));
  page.on('console', (message) => consoleOutput.push(message.text()));

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const query = page.getByRole('textbox', { name: 'Escribe tu pregunta' });
  await query.fill(queryText);
  await query.press('Enter');
  await expect(page.locator('[data-query-turn]')).toContainText(queryText);

  expect(requestData.join('\n')).not.toContain(encodeURIComponent(queryText));
  expect(requestData.join('\n')).not.toContain(queryText);
  expect(consoleOutput.join('\n')).not.toContain(queryText);
  expect(
    await page.evaluate(() =>
      JSON.stringify({ local: localStorage, session: sessionStorage, cookie: document.cookie }),
    ),
  ).not.toContain(queryText);

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-query-turn]')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText(queryText);

  const reloadedQuery = page.getByRole('textbox', { name: 'Escribe tu pregunta' });
  await reloadedQuery.fill(queryText);
  await reloadedQuery.press('Enter');
  await page.getByRole('link', { name: 'Rodrigo Valdelvira, volver a portada' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('[data-query-turn]')).toHaveCount(0);
});
