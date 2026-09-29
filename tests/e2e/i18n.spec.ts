import { expect, test } from '@playwright/test';
import { allSurfaces } from '../../src/lib/routes';

const canonicalHost = 'https://rodrigovaldelvira.com';
const englishIndexable = allSurfaces.filter((surface) => surface.locale === 'en' && surface.indexable);

test('el selector de idioma lleva a la página equivalente y vuelve', async ({ page }) => {
  await page.goto('/experiencia', { waitUntil: 'domcontentloaded' });
  const toEnglish = page.getByRole('link', { name: 'View the site in English' });
  await expect(toEnglish).toHaveAttribute('href', '/en/experience');
  await toEnglish.click();

  await expect(page).toHaveURL(/\/en\/experience$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toHaveText('Experience');

  const toSpanish = page.getByRole('link', { name: 'Ver el sitio en español' });
  await expect(toSpanish).toHaveAttribute('href', '/experiencia');
  await toSpanish.click();
  await expect(page).toHaveURL(/\/experiencia$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});

test('el cambio de idioma conserva el servicio y el asunto de contacto', async ({ page }) => {
  await page.goto('/contacto?asunto=agentes-y-chatbots-ia', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('link', { name: 'View the site in English' })).toHaveAttribute(
    'href',
    '/en/contact?asunto=agentes-y-chatbots-ia',
  );
  await page.goto('/en/contact?asunto=agentes-y-chatbots-ia', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.contact-form-preview .tag')).toHaveText(
    'Enquiry about: AI agents and chatbots',
  );
});

test('cada página inglesa indexable declara su idioma, canonical y alternativas', async ({ page }) => {
  for (const surface of englishIndexable) {
    await page.goto(surface.path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('h1')).toBeVisible();
    expect(await page.title()).toBe(surface.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', surface.description);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalHost + surface.path);
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute(
      'href',
      canonicalHost + surface.alternates.es,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      'href',
      canonicalHost + surface.path,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      canonicalHost + surface.alternates.es,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_GB');
  }
});

test('el sitemap lista las dos versiones con sus alternativas', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  for (const surface of englishIndexable) expect(xml).toContain(canonicalHost + surface.path);
  expect(xml).toContain('hreflang="en" href="' + canonicalHost + '/en/experience"');
  expect(xml).not.toContain('/en/journal');
  expect(xml).not.toContain('/en/privacy');
});

test('la experiencia recoge el CV completo en español e inglés', async ({ page }) => {
  const openAll = () =>
    page.evaluate(() => document.querySelectorAll('details').forEach((item) => (item.open = true)));

  await page.goto('/experiencia', { waitUntil: 'domcontentloaded' });
  await openAll();
  const spanish = page.locator('.experience-list');
  await expect(spanish).toContainText('Programa ActivaIA');
  await expect(spanish).toContainText('Consultoría estratégica de IA');
  await expect(spanish).toContainText('Coordinación del área de datos');
  await expect(spanish).toContainText('Logros destacados');
  await expect(spanish).toContainText('Reducción del tiempo de análisis de datos de talento en un 65%');
  await expect(spanish).toContainText('Seguimiento técnico con clientes internacionales');
  await expect(spanish).toContainText('Apoyo en el dimensionamiento de sistemas de energías renovables');
  await expect(spanish).toContainText('Estimación del potencial de biomasa');
  await expect(spanish).toContainText('Experiencia internacional');
  await expect(spanish).toContainText('Chichester, UK');
  await expect(spanish).toContainText('10 meses · 2012');
  await expect(spanish).toContainText('Koblenz, DE');
  await expect(spanish).toContainText('Berlin, DE');

  await page.goto('/en/experience', { waitUntil: 'domcontentloaded' });
  await openAll();
  const english = page.locator('.experience-list');
  await expect(english).toContainText('ActivaIA Programme');
  await expect(english).toContainText('Strategic AI consulting');
  await expect(english).toContainText('Data area coordination');
  await expect(english).toContainText('Key achievements');
  await expect(english).toContainText('Reduced talent data analysis time by 65%');
  await expect(english).toContainText('Technical follow-up with international customers');
  await expect(english).toContainText('International experience');
  await expect(english).toContainText('10 months · 2012');
  await expect(english).toContainText('Sep 2012');
  await expect(english).not.toContainText('Logros destacados');
});

test('las páginas inglesas no muestran interfaz en español', async ({ page }) => {
  for (const path of ['/en', '/en/about', '/en/skills', '/en/services', '/en/education', '/en/contact']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const text = await page.locator('body').innerText();
    for (const spanish of [
      'Saltar al contenido',
      'Habilidades',
      'Sobre mí',
      'Descargar',
      'Pregúntame',
      'Próximamente',
    ]) {
      expect(text, `${path} muestra "${spanish}"`).not.toContain(spanish);
    }
  }
});

test('la consulta local responde en inglés y ofrece seguimientos ingleses', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en', { waitUntil: 'domcontentloaded' });
  const thread = page.locator('[data-conversation-thread]');

  await page.locator('[data-actions]').getByRole('link', { name: 'Experience' }).click();
  await expect(thread.locator('[data-query-turn]').first()).toContainText('Cidatum');
  await expect(thread.locator('.conversation-user').first()).toHaveText('Experience');

  const query = page.getByRole('textbox', { name: 'Type your question' });
  await query.fill('Tell me about your skills');
  await query.press('Enter');
  await expect(thread.locator('[data-query-turn]').last()).toContainText('AI / Machine Learning');

  await query.fill('¿Quién es Rodrigo?');
  await query.press('Enter');
  await expect(thread.locator('[data-query-turn]').last()).toContainText(
    'I don’t have a clear answer for that. I can help you with:',
  );
  await expect(thread.getByRole('link', { name: 'Projects' }).last()).toHaveAttribute('href', '/en/projects');
});

test('el formulario de contacto inglés envía su idioma y está traducido', async ({ page }) => {
  await page.goto('/en/contact', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('form[data-contact-form]')).toHaveAttribute('action', '/api/contacto?lang=en');
  await expect(page.getByRole('textbox', { name: 'Your name' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible();
  await expect(page.locator('.contact-card__privacy a')).toHaveAttribute('href', '/en/privacy');
});

test('los textos legales ingleses indican que son una traducción', async ({ page }) => {
  await page.goto('/en/privacy', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.legal-document h1')).toHaveText('Privacy');
  await expect(page.locator('.legal-document')).toContainText('Courtesy translation of the Spanish original');
  await expect(page.locator('.modal-close')).toHaveAttribute('href', '/en');
});

test('el artículo inglés se publica en su propia ruta', async ({ page }) => {
  await page.goto('/en/journal', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toHaveText('Journal');
  const link = page.getByRole('link', {
    name: 'How I evaluated three agent frameworks before choosing LangGraph',
  });
  await expect(link.first()).toHaveAttribute('href', '/en/journal/langgraph-for-production-agents');
  await link.first().click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('article h1')).toHaveText(
    'How I evaluated three agent frameworks before choosing LangGraph',
  );
  await expect(page.locator('.article-meta')).toContainText('15 May 2025');
});

test.describe('menú móvil', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('el botón del CV no muestra «(PDF)» y el idioma se cambia desde el menú', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('.mobile-menu__trigger').click();
    const cv = page.locator('.mobile-menu__cv');
    await expect(cv).toHaveText('Descargar CV');
    await expect(cv).not.toContainText('PDF');

    const language = page.locator('.mobile-menu__language');
    await expect(language).toHaveText('English');
    await language.click();
    await expect(page).toHaveURL(/\/en$/);
    await page.locator('.mobile-menu__trigger').click();
    await expect(page.locator('.mobile-menu__cv')).toHaveText('Download CV');
    await expect(page.locator('.mobile-menu__language')).toHaveText('Español');
  });

  test('sin el rectángulo azul del navegador al tocar, con feedback propio', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'Solo Chromium expone -webkit-tap-highlight-color.');
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const highlights = await page.evaluate(() =>
      ['html', 'a', 'button', 'summary'].map((selector) => {
        const element = document.querySelector(selector);
        return element ? getComputedStyle(element).getPropertyValue('-webkit-tap-highlight-color') : null;
      }),
    );
    expect(highlights.filter(Boolean)).not.toHaveLength(0);
    for (const value of highlights.filter(Boolean)) expect(value).toBe('rgba(0, 0, 0, 0)');
    // Keyboard focus rings are untouched: only the tap flash is removed.
    await expect(page.locator('html')).toHaveCSS('-webkit-tap-highlight-color', 'rgba(0, 0, 0, 0)');
  });
});
