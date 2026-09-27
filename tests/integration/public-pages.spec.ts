import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/sobre-mi',
  '/habilidades',
  '/servicios',
  '/experiencia',
  '/formacion',
  '/proyectos',
  '/proyectos/leadia',
  '/proyectos/nami',
  '/bitacora',
  '/bitacora/langgraph-para-agentes-en-produccion',
  '/contacto',
  '/privacidad',
  '/cookies',
  '/terminos',
];
test('todas las superficies entregan HTML español útil', async ({ request }) => {
  for (const route of routes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    const html = await response.text();
    expect(html).toContain('<html lang="es"');
    expect((html.match(/<h1/g) ?? []).length, route).toBe(1);
    expect(html).toContain('<main');
  }
});
