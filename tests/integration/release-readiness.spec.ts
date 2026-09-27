import { expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import type { ClosureEvidence } from '../../scripts/release-readiness.mjs';
import { evaluateReadiness } from '../../scripts/release-readiness.mjs';

it('reports machine checks, human approvals, exceptions and open risks separately and blocks publication', async () => {
  const source = await readFile(
    new URL('../../specs/002-contacto-operacion-cierre/closure-evidence.json', import.meta.url),
    'utf8',
  );
  const report = evaluateReadiness(JSON.parse(source) as ClosureEvidence);
  expect(report.allowed).toBe(false);
  expect(report.technical).toHaveLength(34);
  expect(report.human.length).toBeGreaterThanOrEqual(11);
  expect(report.exceptions.map(({ id }) => id)).toEqual(['CA-18', 'CA-31']);
  expect(report.exceptions[0]).toMatchObject({
    approver: 'titular del portfolio',
    recheckAt: '2026-10-27',
  });
  expect(report.risks.length).toBeGreaterThan(0);
  expect(report.blockers.length).toBeGreaterThan(0);
});
