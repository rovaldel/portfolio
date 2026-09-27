import { expect, test } from '@playwright/test';
import { surfaces } from '../../src/lib/routes';

const canonicalHost = 'https://rodrigovaldelvira.com';
const indexableRoutes = [
  '/',
  '/sobre-mi',
  '/habilidades',
  '/servicios',
  '/experiencia',
  '/formacion',
  '/proyectos',
  '/proyectos/leadia',
  '/proyectos/nami',
  '/contacto',
];

test('cada ruta indexable tiene metadatos españoles coherentes con su contenido visible', async ({
  page,
}) => {
  for (const path of indexableRoutes) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).not.toBeEmpty();

    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    const surface = surfaces.find((item) => item.path === path);
    expect(surface?.indexable).toBe(true);
    expect(title).toBe(surface?.title);
    expect(description).toBe(surface?.description);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalHost + path);
    expect(title.trim().length).toBeGreaterThan(3);
    expect(description?.trim().length ?? 0).toBeGreaterThan(24);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content',
      description ?? '',
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonicalHost + path);
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  }
});
