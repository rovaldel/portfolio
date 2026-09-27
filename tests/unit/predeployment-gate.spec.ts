import { expect, it } from 'vitest';
import { evaluatePredeploymentReadiness } from '../../scripts/deploy/check-predeployment.mjs';

const exception = (id: string) => ({
  id,
  result: 'approved-exception',
  evidence: 'visual-report',
  approver: 'titular',
  rationale: 'D-08 visual exception',
  recheckAt: '2026-10-27',
});
const approved = {
  decisions: [
    ...Array.from({ length: 7 }, (_, index) => ({
      id: `D-${String(index + 1).padStart(2, '0')}`,
      result: 'pass',
      evidence: 'human-decisions.md',
    })),
    exception('D-08'),
  ],
  reviews: [
    { id: 'public-content-and-channels', result: 'pass', evidence: 'review.md' },
    { id: 'privacy-and-legal', result: 'pass', evidence: 'review.md' },
  ],
  legal: ['privacy', 'cookies', 'terms'].map((id) => ({
    id,
    result: 'pass',
    evidence: 'human-decisions.md',
  })),
  criteria: [exception('CA-18'), exception('CA-31')],
  dependencies: [exception('spec-000')],
};
const contentSource = `export const legalDocuments: LegalDocument[] = [
  { "status": "approved" },
  { "status": "approved" },
  { "status": "approved" },
];`;
const base = { closureEvidence: approved, contentSource, today: '2026-09-27' };

it('permits publication when all legal gates pass and only the D-08 visual exception remains', () => {
  expect(evaluatePredeploymentReadiness(base).allowed).toBe(true);
});

it('blocks drafts and unresolved legal conditions even when the copy decision passed', () => {
  const report = evaluatePredeploymentReadiness({
    ...base,
    closureEvidence: {
      ...approved,
      legal: approved.legal.map((entry) => ({ ...entry, result: 'pending' })),
    },
    contentSource: contentSource.replace('"approved"', '"working-draft"'),
  });
  expect(report.allowed).toBe(false);
  expect(report.errors.some((error) => error.includes('working-draft'))).toBe(true);
  expect(report.errors.some((error) => error.includes('sigue pendiente'))).toBe(true);
});

it('rejects expired D-08 approvals and exceptions outside the authorized visual scope', () => {
  expect(evaluatePredeploymentReadiness({ ...base, today: '2026-10-28' }).allowed).toBe(false);
  expect(
    evaluatePredeploymentReadiness({
      ...base,
      closureEvidence: { ...approved, criteria: [...approved.criteria, exception('CA-19')] },
    }).allowed,
  ).toBe(false);
});

it('recognizes the approved TypeScript status form used by the formatted content source', () => {
  const source = `export const legalDocuments: LegalDocument[] = [
  { status: "approved" },
  { status: "approved" },
  { status: "approved" },
];`;
  expect(evaluatePredeploymentReadiness({ ...base, contentSource: source }).allowed).toBe(true);
});
