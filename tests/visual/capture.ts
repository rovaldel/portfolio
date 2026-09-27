import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import type { Page } from '@playwright/test';

export const candidateRoutes: Record<string, string> = {
  'portada-rioja-desktop': '/',
  'portada-rioja-mobile': '/',
  'portada-claro-desktop': '/',
  'portada-oscuro-desktop': '/',
  'portada-cobalto-desktop': '/',
  'portada-bosque-desktop': '/',
  'selector-tema': '/',
  'sobre-mi': '/sobre-mi',
  habilidades: '/habilidades',
  servicios: '/servicios',
  'servicio-detalle': '/servicios?servicio=agentes-y-chatbots-ia',
  proyectos: '/proyectos',
  'proyecto-leadia': '/proyectos/leadia',
  experiencia: '/experiencia',
  formacion: '/formacion',
  contacto: '/contacto',
  bitacora: '/bitacora',
  'articulo-langgraph': '/bitacora/langgraph-para-agentes-en-produccion',
  'legal-privacidad': '/privacidad',
};

export const themeForScene = (scene: string) =>
  (
    ({
      'portada-claro-desktop': 'light',
      'portada-oscuro-desktop': 'dark',
      'portada-cobalto-desktop': 'cobalto',
      'portada-bosque-desktop': 'bosque',
    }) as Record<string, string>
  )[scene] ?? 'rioja';

export const sha256 = async (path: string) =>
  createHash('sha256')
    .update(await readFile(path))
    .digest('hex');

export const installDeterministicRuntime = async (page: Page, theme: string) => {
  await page.addInitScript((selectedTheme: string) => {
    localStorage.setItem('rv_theme', selectedTheme);
  }, theme);
  await page.addInitScript(
    (timestamp: number) => {
      Object.defineProperty(Date, 'now', { configurable: true, value: () => timestamp });
    },
    Date.UTC(2026, 0, 1),
  );
};

export const applyScenePrecondition = async (page: Page, scene: string) => {
  if (scene === 'selector-tema') {
    await page.getByRole('button', { name: 'Cambiar tema visual' }).click();
    return;
  }
  if (scene.startsWith('portada-') || scene === 'articulo-langgraph' || scene === 'legal-privacidad') return;
  await page.locator('main').evaluate((main) => {
    main.scrollTop = main.scrollHeight;
  });
};

export const readContractFacts = async (page: Page, expectedTheme: string) =>
  page.evaluate((theme: string) => {
    const heading = document.querySelector('h1');
    const headingStyles = heading ? getComputedStyle(heading) : null;
    const article = document.querySelector<HTMLElement>('.article-content');
    const query = document.querySelector<HTMLElement>('.conversation-dock__panel');
    const surface = query ?? document.querySelector<HTMLElement>('.article-meta__category');
    const surfaceStyles = surface ? getComputedStyle(surface) : null;
    const queryStyles = query ? getComputedStyle(query) : null;
    const articleStyles = article ? getComputedStyle(article) : null;
    const rootStyles = getComputedStyle(document.documentElement);
    return {
      theme: document.documentElement.dataset['theme'] === theme,
      fonts: Boolean(headingStyles?.fontFamily.includes('Gabarito')) && document.fonts.status === 'loaded',
      fontWeights: Number(headingStyles?.fontWeight ?? 0) >= 600,
      radii: Number.parseFloat(surfaceStyles?.borderTopLeftRadius ?? '0') > 0,
      borders:
        Number.parseFloat(surfaceStyles?.borderTopWidth ?? '0') > 0 &&
        surfaceStyles?.borderTopStyle !== 'none',
      shadows: article
        ? articleStyles?.boxShadow === 'none'
        : Boolean(queryStyles?.boxShadow && queryStyles.boxShadow !== 'none'),
      assets: Array.from(document.images).every((image) => image.currentSrc.startsWith(location.origin)),
      rootBackground: rootStyles.backgroundColor,
    };
  }, expectedTheme);

export const measureAnchor = async (page: Page, selector: string) =>
  page.evaluate((anchorSelector: string) => {
    const element = document.querySelector(anchorSelector);
    if (!element) return null;
    const { x, y, width, height } = element.getBoundingClientRect();
    return { x, y, width, height };
  }, selector);
