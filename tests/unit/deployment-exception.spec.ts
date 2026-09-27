import { expect, it } from 'vitest';
import { verifyApprovedVisualException } from '../../scripts/deploy/approved-visual-exception.mjs';

const stepNames = [
  'Fuentes y trazabilidad',
  'Formato',
  'Lint',
  'Tipos',
  'Unitarias',
  'Auditoría de producción',
  'Build',
  'HTTP, Chromium y Firefox',
  'Navegación sin JavaScript',
  'Movimiento reducido',
  'Contenedor endurecido',
];
const approvals = {
  decisions: [
    {
      id: 'D-08',
      result: 'approved-exception',
      evidence: 'decision',
      approver: 'owner',
      rationale: '19/19 visual scenes',
      recheckAt: '2026-10-27',
    },
  ],
  criteria: [
    {
      id: 'CA-18',
      result: 'approved-exception',
      evidence: 'visual report',
      approver: 'owner',
      rationale: 'visual exception',
      recheckAt: '2026-10-27',
    },
    {
      id: 'CA-31',
      result: 'approved-exception',
      evidence: 'visual report',
      approver: 'owner',
      rationale: 'visual exception',
      recheckAt: '2026-10-27',
    },
  ],
  dependencies: [
    {
      id: 'spec-000',
      result: 'approved-exception',
      evidence: 'closure decision',
      approver: 'owner',
      rationale: 'visual exception',
      recheckAt: '2026-10-27',
    },
  ],
};
const summary = {
  status: 'fail',
  results: [
    ...stepNames.map((name) => ({ name, status: 'pass', exitCode: 0 })),
    { name: 'Evidencia visual', status: 'fail', exitCode: 1 },
  ],
};
const visualReport = {
  overallStatus: 'fail',
  scenes: Array.from({ length: 19 }, () => ({ status: 'fail' })),
};
const base = {
  summary,
  visualReport,
  closureEvidence: approvals,
  accessibilityReview: 'Pendiente de revisión humana',
  today: '2026-09-27',
};

it('permits only the explicitly approved 19-scene visual exception', () => {
  expect(verifyApprovedVisualException(base).allowed).toBe(true);
});

it('rejects failures before the visual suite', () => {
  const result = verifyApprovedVisualException({
    ...base,
    summary: {
      ...summary,
      results: [{ name: 'Fuentes y trazabilidad', status: 'fail', exitCode: 1 }, ...summary.results.slice(1)],
    },
  });
  expect(result.allowed).toBe(false);
});

it('rejects a different scene count or an expired exception', () => {
  expect(
    verifyApprovedVisualException({
      ...base,
      visualReport: { ...visualReport, scenes: visualReport.scenes.slice(1) },
    }).allowed,
  ).toBe(false);
  expect(verifyApprovedVisualException({ ...base, today: '2026-10-28' }).allowed).toBe(false);
});
