import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { allSurfaces } from '../../src/lib/routes';

const articles = [
  { locale: 'es', file: 'langgraph-para-agentes-en-produccion.md' },
  { locale: 'en', file: 'langgraph-for-production-agents.md' },
] as const;

describe('contenido publicado de Bitácora', () => {
  it('publica solo el artículo aprobado en cada idioma', async () => {
    const directory = resolve(process.cwd(), 'src/content/bitacora');
    const files = (await readdir(directory)).filter((file) => file.endsWith('.md')).sort();
    expect(files).toEqual(articles.map((article) => article.file).sort());
  });

  for (const { locale, file } of articles) {
    it(`publica el artículo completo en ${locale} con título coherente`, async () => {
      const source = await readFile(resolve(process.cwd(), 'src/content/bitacora', file), 'utf8');
      const [, frontmatter, body] = source.split(/^---\s*$/m);
      const title = frontmatter?.match(/^title:\s*(.+)$/m)?.[1];
      const publishedStatus = frontmatter?.match(/^status:\s*(.+)$/m)?.[1];
      const articleLocale = frontmatter?.match(/^locale:\s*(.+)$/m)?.[1] ?? 'es';
      const route = allSurfaces.find(
        (surface) => surface.locale === locale && surface.routeId === 'journal.langgraph',
      );

      expect(publishedStatus).toBe('published');
      expect(articleLocale).toBe(locale);
      expect(title).toBe(route?.title);
      expect(route?.h1).toBe(title);
      expect(route?.path.endsWith(frontmatter?.match(/^slug:\s*(.+)$/m)?.[1] ?? '')).toBe(true);
      expect(body?.trim().length).toBeGreaterThan(800);
      expect(body).toContain('LangGraph');
      expect(body).toContain('CrewAI');
      expect(body).toContain('AutoGen');
    });
  }
});
