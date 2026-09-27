export type EvidenceResult = 'pass' | 'fail' | 'pending' | 'not-run' | 'approved-exception';
export interface EvidenceItem {
  id: string;
  result: EvidenceResult;
  evidence?: string | null;
  summary?: string;
  approver?: string;
  rationale?: string;
  recheckAt?: string;
}
export interface ClosureEvidence {
  criteria: EvidenceItem[];
  reviews: EvidenceItem[];
  decisions: EvidenceItem[];
  dependencies: EvidenceItem[];
  legal: EvidenceItem[];
  openRisks?: string[];
}
export function evaluateReadiness(evidence: ClosureEvidence): {
  allowed: boolean;
  technical: Array<{ id: string; result: EvidenceResult; evidence: string | null }>;
  human: Array<{ id: string; result: EvidenceResult; evidence: string | null }>;
  exceptions: EvidenceItem[];
  risks: string[];
  blockers: string[];
};
