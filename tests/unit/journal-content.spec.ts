import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { surfaces } from '../../src/lib/routes';

describe('contenido publicado de Bitácora', () => {
  it('publica el artículo completo con título coherente y excluye registros incompletos', async () => {
    const directory = resolve(process.cwd(), 'src/content/bitacora');
    const files = (await readdir(directory)).filter((file) => file.endsWith('.md'));
    expect(files).toEqual(['langgraph-para-agentes-en-produccion.md']);

    const source = await readFile(resolve(directory, files[0]!), 'utf8');
    const [, frontmatter, body] = source.split(/^---\s*$/m);
    const title = frontmatter?.match(/^title:\s*(.+)$/m)?.[1];
    const publishedStatus = frontmatter?.match(/^status:\s*(.+)$/m)?.[1];
    const route = surfaces.find(
      (surface) => surface.path === '/bitacora/langgraph-para-agentes-en-produccion',
    );

    expect(publishedStatus).toBe('published');
    expect(title).toBe(route?.title);
    expect(route?.h1).toBe(title);
    expect(body?.trim().length).toBeGreaterThan(800);
    expect(body).toContain('LangGraph');
    expect(body).toContain('CrewAI');
    expect(body).toContain('AutoGen');
  });
});
