import { expect, it } from 'vitest';
import { legalDocuments } from '../../src/content/site';
import { readFile } from 'node:fs/promises';

it('keeps all directly routed legal documents in draft until human approval', async () => {
  expect(legalDocuments.map(({ kind, status }) => [kind, status])).toEqual([
    ['privacy', 'working-draft'],
    ['cookies', 'working-draft'],
    ['terms', 'working-draft'],
  ]);
  for (const route of ['privacidad', 'cookies', 'terminos']) {
    const source = await readFile(new URL(`../../src/pages/${route}.astro`, import.meta.url), 'utf8');
    expect(source).toContain('<BaseLayout');
    expect(source).toContain('LegalDocument');
  }
  expect(
    legalDocuments
      .find((doc) => doc.kind === 'privacy')
      ?.sections.map((section) => section.title)
      .join(' '),
  ).toMatch(/datos|conservación|derechos/i);
});
