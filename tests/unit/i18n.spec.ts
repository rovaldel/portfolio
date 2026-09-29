import { describe, expect, it } from 'vitest';
import { getContent } from '../../src/content';
import { experiences, internationalExperience } from '../../src/content/site';
import { validateLocaleParity } from '../../src/lib/content';
import { getContactSubject } from '../../src/lib/contact';
import {
  alternatePath,
  formatMonthYear,
  getLocale,
  locales,
  pathFor,
  routePaths,
  ui,
} from '../../src/lib/i18n';
import type { RouteId } from '../../src/lib/i18n';
import { resolveIntent } from '../../src/lib/intent-matching';
import { getIntents } from '../../src/lib/intents';
import { allSurfaces, canonicalPaths, indexableSurfaces, surfaces } from '../../src/lib/routes';

/** The shape of a value: same keys, same primitive kinds, recursively. */
const shape = (value: unknown): unknown =>
  value && typeof value === 'object'
    ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
    : typeof value;

describe('idioma de la URL', () => {
  it('trata /en como inglés y todo lo demás como español', () => {
    expect(getLocale('/')).toBe('es');
    expect(getLocale('/experiencia')).toBe('es');
    expect(getLocale('/en')).toBe('en');
    expect(getLocale('/en/experience')).toBe('en');
    expect(getLocale('/english')).toBe('es');
    expect(getLocale(new URL('https://rodrigovaldelvira.com/en/about'))).toBe('en');
  });

  it('cada ruta tiene su equivalente en el otro idioma y el cambio es reversible', () => {
    for (const id of Object.keys(routePaths) as RouteId[]) {
      const es = pathFor(id, 'es');
      const en = pathFor(id, 'en');
      expect(en === '/en' || en.startsWith('/en/')).toBe(true);
      expect(alternatePath(es, 'en')).toBe(en);
      expect(alternatePath(en, 'es')).toBe(es);
    }
    expect(alternatePath('/ruta-desconocida', 'en')).toBe('/en');
  });

  it('publica las mismas páginas en ambos idiomas con rutas canónicas propias', () => {
    const byLocale = (locale: string) => allSurfaces.filter((surface) => surface.locale === locale);
    expect(byLocale('es')).toHaveLength(surfaces.length);
    expect(byLocale('en')).toHaveLength(surfaces.length);
    expect(new Set(allSurfaces.map((surface) => surface.path)).size).toBe(allSurfaces.length);
    expect(canonicalPaths.size).toBe(allSurfaces.length);
    for (const surface of byLocale('en')) {
      expect(surface.alternates.es).toBe(pathFor(surface.routeId, 'es'));
      // Project pages are named after the project itself, which is not translated.
      if (surface.kind !== 'detail') {
        expect(surface.title).not.toBe(
          byLocale('es').find((item) => item.routeId === surface.routeId)?.title,
        );
      }
    }
    expect(indexableSurfaces.filter((surface) => surface.locale === 'en')).toHaveLength(
      indexableSurfaces.filter((surface) => surface.locale === 'es').length,
    );
  });
});

describe('contenido traducido', () => {
  it('mantiene los catálogos alineados entre idiomas', () => {
    expect(validateLocaleParity).not.toThrow();
  });

  it('las cadenas de interfaz tienen la misma estructura en español e inglés', () => {
    expect(shape(ui.en)).toEqual(shape(ui.es));
  });

  it('el inglés no reutiliza el texto español en el contenido visible', () => {
    const es = getContent('es');
    const en = getContent('en');
    expect(en.siteProfile.professionalSummary).not.toBe(es.siteProfile.professionalSummary);
    expect(en.navigationActions.map((action) => action.label)).toEqual([
      'About me',
      'Skills',
      'Services',
      'Projects',
      'Experience',
      'Education',
      'Contact',
    ]);
    for (const [index, service] of en.services.entries()) {
      expect(service.title).not.toBe(es.services[index]!.title);
      expect(service.description).not.toBe(es.services[index]!.description);
    }
    for (const [index, item] of en.experiences.entries()) {
      expect(item.role).not.toBe('');
      expect(item.highlights).not.toEqual(es.experiences[index]!.highlights);
    }
    expect(en.legalDocuments.map((document) => document.title)).toEqual([
      'Privacy',
      'Cookies and local storage',
      'Legal notice and terms of use',
    ]);
  });

  it('el idioma se refleja en los asuntos de contacto', () => {
    expect(getContactSubject('agentes-y-chatbots-ia', 'en')).toBe('Enquiry about: AI agents and chatbots');
    expect(getContactSubject('agentes-y-chatbots-ia', 'es')).toBe('Consulta sobre: Agentes y chatbots IA');
    expect(getContactSubject('invalido', 'en')).toBeNull();
  });

  it('formatea los meses según el idioma', () => {
    expect(formatMonthYear('2012-09', 'en')).toBe('Sep 2012');
    expect(formatMonthYear('2025-12', 'es')).toMatch(/^dic/);
    expect(formatMonthYear(null, 'es')).toBe('actualidad');
    expect(formatMonthYear(null, 'en')).toBe('present');
  });
});

describe('experiencia completa según el CV', () => {
  const byId = (id: string) => experiences.find((item) => item.id === id)!;

  it('recoge cada responsabilidad y logro del CV', () => {
    expect(byId('cidatum').highlights).toHaveLength(4);
    expect(byId('cidatum').highlights.join(' ')).toContain('ActivaIA');
    expect(byId('cidatum').organizationDetail).toBe('Centro Tecnológico del Dato');
    expect(byId('talenttools').highlights).toHaveLength(6);
    expect(byId('talenttools').achievements).toHaveLength(3);
    expect(byId('talenttools').achievements?.join(' ')).toContain('65%');
    expect(byId('cmp').highlights).toHaveLength(4);
    expect(byId('pope').highlights).toHaveLength(2);
    expect(byId('gi-teneco').highlights).toHaveLength(2);
    expect(byId('pope').organizationDetail).toBe('Building Services Consulting Engineers');
  });

  it('incluye la experiencia internacional en ambos idiomas', () => {
    expect(
      internationalExperience.map((stay) => [stay.place, stay.country, stay.duration, stay.year]),
    ).toEqual([
      ['Chichester', 'UK', '10 meses', 2012],
      ['Koblenz', 'DE', '4 meses', 2016],
      ['Berlin', 'DE', '2 meses', 2017],
    ]);
    expect(getContent('en').internationalExperience.map((stay) => stay.duration)).toEqual([
      '10 months',
      '4 months',
      '2 months',
    ]);
  });
});

describe('consulta local en inglés', () => {
  it('tiene el mismo catálogo de intenciones que el español', () => {
    expect(getIntents('en').map((intent) => intent.id)).toEqual(getIntents('es').map((intent) => intent.id));
  });

  it('envía cada intención inglesa a una ruta inglesa existente', () => {
    for (const intent of getIntents('en')) {
      expect(intent.destination.startsWith('/en')).toBe(true);
      expect(canonicalPaths.has(intent.destination)).toBe(true);
    }
    expect(locales).toEqual(['es', 'en']);
  });

  it('reconoce preguntas en inglés y no confunde los idiomas', () => {
    const recognized = (query: string, locale: 'es' | 'en') => {
      const decision = resolveIntent(query, locale);
      return decision.state === 'recognized' ? decision.intent.id : decision.state;
    };
    expect(recognized('Tell me about your skills', 'en')).toBe('skills');
    expect(recognized('Who is Rodrigo?', 'en')).toBe('about');
    expect(recognized('What do you do at Cidatum', 'en')).toBe('cidatum');
    expect(recognized('LangGraph', 'en')).toBe('agent-frameworks');
    expect(recognized('experience', 'en')).toBe('experience-cv');
    expect(recognized('¿Quién es Rodrigo?', 'en')).toBe('unknown');
    expect(recognized('¿Quién es Rodrigo?', 'es')).toBe('about');
  });

  it('responde con el texto inglés aprobado', () => {
    const decision = resolveIntent('cidatum', 'en');
    expect(decision.state).toBe('recognized');
    if (decision.state === 'recognized') {
      expect(decision.intent.response).toBe(
        'Artificial Intelligence Engineer at Cidatum, Logroño, on-site, from December 2025 to the present.',
      );
      expect(decision.intent.destination).toBe('/en/experience');
    }
  });
});
