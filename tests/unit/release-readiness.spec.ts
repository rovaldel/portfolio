import { describe, expect, it } from 'vitest';
import type { ClosureEvidence } from '../../scripts/release-readiness.mjs';
import type { EvidenceResult } from '../../scripts/release-readiness.mjs';
import { evaluateReadiness } from '../../scripts/release-readiness.mjs';

function completeEvidence(): ClosureEvidence {
  return {
    criteria: Array.from({ length: 34 }, (_, index) => ({
      id: `CA-${String(index + 1).padStart(2, '0')}`,
      result: 'pass',
      evidence: `artifacts/CA-${index + 1}`,
    })),
    reviews: ['content', 'privacy', 'operations'].map((id) => ({
      id,
      result: 'pass',
      evidence: `reviews/${id}`,
    })),
    decisions: Array.from({ length: 8 }, (_, index) => ({
      id: `D-${index + 1}`,
      result: 'pass',
      evidence: `decisions/${index + 1}`,
    })),
    dependencies: ['spec-000', 'spec-010'].map((id) => ({ id, result: 'pass', evidence: `${id}/closure` })),
    legal: ['privacy', 'cookies', 'terms'].map((id) => ({ id, result: 'pass', evidence: `legal/${id}` })),
  };
}

describe('release readiness', () => {
  it('allows only complete evidence with all reviews, decisions and dependencies', () => {
    expect(evaluateReadiness(completeEvidence()).allowed).toBe(true);
  });
  it.each(['pending', 'fail', 'not-run'] as EvidenceResult[])('blocks criterion state %s', (result) => {
    const evidence = completeEvidence();
    evidence.criteria[0]!.result = result;
    expect(evaluateReadiness(evidence).allowed).toBe(false);
  });
  it('blocks missing criteria and missing evidence', () => {
    const evidence = completeEvidence();
    evidence.criteria.pop();
    evidence.criteria[0]!.evidence = null;
    const report = evaluateReadiness(evidence);
    expect(report.allowed).toBe(false);
    expect(report.blockers.some((blocker) => blocker.includes('expected 34'))).toBe(true);
  });
  it('accepts an exception only when evidence is linked', () => {
    const evidence = completeEvidence();
    evidence.criteria[0]!.result = 'approved-exception';
    evidence.criteria[0]!.evidence = null;
    expect(evaluateReadiness(evidence).allowed).toBe(false);
    evidence.criteria[0]!.evidence = 'approved-exceptions/CA-01';
    evidence.criteria[0]!.approver = 'reviewer-role';
    evidence.criteria[0]!.rationale = 'documented';
    evidence.criteria[0]!.recheckAt = '2026-12-01';
    expect(evaluateReadiness(evidence).allowed).toBe(true);
  });
  it('does not let an exception replace human approval or dependency closure', () => {
    const evidence = completeEvidence();
    evidence.reviews[0]!.result = 'approved-exception';
    evidence.reviews[0]!.evidence = 'exceptions/review';
    expect(evaluateReadiness(evidence).allowed).toBe(false);
  });
  it('blocks pending human review, decision, legal approval or prior spec closure', () => {
    const evidence = completeEvidence();
    evidence.reviews[0]!.result = 'pending';
    evidence.decisions[0]!.result = 'pending';
    evidence.dependencies[0]!.result = 'pending';
    evidence.legal[0]!.result = 'pending';
    expect(evaluateReadiness(evidence).allowed).toBe(false);
  });
});
