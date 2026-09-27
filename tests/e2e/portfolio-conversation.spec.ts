import { expect, test } from '@playwright/test';

const actions = [
  { label: 'Sobre mí', content: 'AI Engineer y Data Scientist' },
  { label: 'Habilidades', content: 'IA / Machine Learning' },
  { label: 'Servicios', content: 'Agentes y chatbots IA' },
  { label: 'Proyectos', content: 'Leadia' },
  { label: 'Experiencia', content: 'Cidatum' },
  { label: 'Formación', content: 'AENOR' },
  { label: 'Contacto', content: 'Si buscas un AI Engineer para tu equipo, hablemos.' },
];

test('cada chip añade su respuesta completa al historial de chat visible', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const thread = page.locator('[data-conversation-thread]');
  const routeContent = page.locator('[data-route-content]');

  for (const [index, action] of actions.entries()) {
    await page.locator('[data-actions]').getByRole('link', { name: action.label }).click();
    await expect(thread).toBeVisible();
    await expect(routeContent).toBeHidden();
    const turns = thread.locator('[data-query-turn]');
    await expect(turns).toHaveCount(index + 1);
    await expect(turns.nth(index).locator('.conversation-user')).toHaveText(action.label);
    await expect(turns.nth(index)).toContainText(action.content);
  }

  await expect(thread.locator('#turn-5-experiencia-title')).toHaveCount(1);
  await expect(thread.locator('#turn-6-formacion-title')).toHaveCount(1);
});

test('elegir un servicio abre su detalle modal desde la respuesta del chat', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-actions]').getByRole('link', { name: 'Servicios' }).click();
  const thread = page.locator('[data-conversation-thread]');
  await expect(thread).toContainText('Analítica y visualización');
  const serviceLink = thread.getByRole('link', { name: 'Agentes y chatbots IA' });
  await expect(serviceLink).toHaveAttribute('href', '/servicios?servicio=agentes-y-chatbots-ia');
  await serviceLink.click();

  const dialog = page.getByRole('dialog', { name: 'Agentes y chatbots IA' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/diseño y construyo agentes conversacionales/i)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(serviceLink).toBeFocused();
  await expect(thread).toContainText('Agentes y chatbots IA');
});

test('elegir un proyecto abre el modal con cierre por fondo y enlace canónico', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-actions]').getByRole('link', { name: 'Proyectos' }).click();
  const thread = page.locator('[data-conversation-thread]');
  await expect(thread).toContainText('Proyecto 1 de 2');
  const projectLink = thread.getByRole('link', { name: 'Abrir proyecto Leadia', exact: true });
  await expect(projectLink).toHaveAttribute('href', '/proyectos/leadia');
  await projectLink.click();

  const dialog = page.getByRole('dialog', { name: /Detalle de Leadia/ });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Leadia');
  await page.locator('[data-conversation-dialog-backdrop]').click({ position: { x: 8, y: 8 } });
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(projectLink).toBeFocused();
  await expect(thread).toContainText('Proyecto 2 de 2');
});

test('Hablar de esto devuelve la explicación al chat sin añadir enlaces genéricos', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-actions]').getByRole('link', { name: 'Servicios' }).click();
  const thread = page.locator('[data-conversation-thread]');
  await thread.getByRole('link', { name: 'Agentes y chatbots IA' }).click();
  const dialog = page.getByRole('dialog', { name: 'Agentes y chatbots IA' });
  await dialog.getByRole('link', { name: 'Hablar de esto' }).click();

  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page).toHaveURL(/\/$/);
  await expect(thread).toContainText('Cuéntame más sobre agentes y chatbots ia');
  await expect(thread).toContainText('Diseño y construyo agentes conversacionales');
  await expect(thread.locator('.conversation-response-link')).toHaveCount(0);
});

test('los botones sugeridos encadenan respuestas con el estado de razonamiento', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-actions]').getByRole('link', { name: 'Sobre mí' }).click();
  const thread = page.locator('[data-conversation-thread]');
  await expect(thread.getByRole('link', { name: 'Ver habilidades' })).toBeVisible();

  await thread.getByRole('link', { name: 'Ver habilidades' }).click();
  await expect(thread.locator('[data-query-turn]')).toHaveCount(2);
  await expect(thread.locator('.conversation-response-pending')).toBeVisible();
  await expect(thread.locator('[data-query-turn]').last()).toContainText('IA / Machine Learning');
});

test('Ver trayectoria también encadena una respuesta con razonamiento', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-actions]').getByRole('link', { name: 'Sobre mí' }).click();
  const thread = page.locator('[data-conversation-thread]');
  await expect(thread.getByRole('link', { name: 'Ver trayectoria' })).toBeVisible();

  await thread.getByRole('link', { name: 'Ver trayectoria' }).click();
  await expect(thread.locator('[data-query-turn]')).toHaveCount(2);
  await expect(thread.locator('.conversation-response-pending')).toBeVisible();
  await expect(thread.locator('[data-query-turn]').last()).toContainText('Cidatum');
});

test('Contacto muestra los canales y el formulario ancho del mockup', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-actions]').getByRole('link', { name: 'Contacto' }).click();
  const contactTurn = page.locator('[data-query-turn]').last();

  await expect(contactTurn.getByRole('region', { name: 'Información de contacto' })).toBeVisible();
  await expect(contactTurn.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
  await expect(contactTurn.getByText('Teléfono')).toBeVisible();
  await expect(contactTurn.getByText('Ubicación')).toBeVisible();
  await expect(contactTurn.getByRole('button', { name: 'Enviar mensaje' })).toBeVisible();
});

test('las tarjetas de proyectos del chat abren su modal directamente', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-actions]').getByRole('link', { name: 'Proyectos' }).click();
  const thread = page.locator('[data-conversation-thread]');

  const nami = thread.getByRole('link', { name: 'Abrir proyecto Nami', exact: true });
  await expect(nami).toBeVisible();
  await nami.click();
  await expect(page.getByRole('dialog', { name: /Detalle de Nami/ })).toBeVisible();
});

test('los botones de la portada abren el mismo hilo conversacional que los chips', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await page
    .getByRole('region', { name: 'Presentación de Rodrigo' })
    .getByRole('link', { name: 'Sobre mí' })
    .click();
  const thread = page.locator('[data-conversation-thread]');
  await expect(page).toHaveURL(/\/$/);
  await expect(thread).toContainText('AI Engineer y Data Scientist');
  await expect(page.getByRole('link', { name: /Rodrigo Valdelvira, volver a portada/ })).toBeVisible();

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page
    .getByRole('region', { name: 'Presentación de Rodrigo' })
    .getByRole('link', { name: 'Ver proyectos' })
    .click();
  const projectsThread = page.locator('[data-conversation-thread]');
  await expect(projectsThread.locator('[data-query-turn]')).toHaveCount(1);
  await expect(projectsThread).toContainText('Proyecto 1 de 2');
});
