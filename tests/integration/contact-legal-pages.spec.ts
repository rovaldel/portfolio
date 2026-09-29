import { expect, it } from 'vitest';
import { legalDocuments } from '../../src/content/site';
import { legalDocumentsEn } from '../../src/content/site.en';
import { readFile } from 'node:fs/promises';

const read = (path: string) => readFile(new URL(`../../src/${path}`, import.meta.url), 'utf8');

it('serves all directly routed legal documents with final approval', async () => {
  expect(legalDocuments.map(({ kind, status }) => [kind, status])).toEqual([
    ['privacy', 'approved'],
    ['cookies', 'approved'],
    ['terms', 'approved'],
  ]);
  expect(legalDocumentsEn.map(({ kind, status }) => [kind, status])).toEqual([
    ['privacy', 'approved'],
    ['cookies', 'approved'],
    ['terms', 'approved'],
  ]);

  const routes: [string, string][] = [
    ['privacidad', 'privacy'],
    ['cookies', 'cookies'],
    ['terminos', 'terms'],
    ['en/privacy', 'privacy'],
    ['en/cookies', 'cookies'],
    ['en/terms', 'terms'],
  ];
  for (const [route, kind] of routes) {
    const source = await read(`pages/${route}.astro`);
    expect(source).toContain('LegalPage');
    expect(source).toContain(`kind="${kind}"`);
  }
  const shared = await read('components/pages/LegalPage.astro');
  expect(shared).toContain('<BaseLayout');
  expect(shared).toContain('LegalDocument');

  expect(
    legalDocuments
      .find((doc) => doc.kind === 'privacy')
      ?.sections.map((section) => section.title)
      .join(' '),
  ).toMatch(/datos|conservación|derechos/i);
  expect(
    legalDocumentsEn
      .find((doc) => doc.kind === 'privacy')
      ?.sections.map((section) => section.title)
      .join(' '),
  ).toMatch(/data|retention|rights/i);
});
