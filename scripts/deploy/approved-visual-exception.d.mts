export interface VerificationStep {
  name: string;
  status: string;
  exitCode: number;
}
export interface VerificationSummary {
  status: string;
  results: VerificationStep[];
}
export interface VisualScene {
  status: string;
}
export interface VisualReport {
  overallStatus: string;
  scenes: VisualScene[];
}
export interface ApprovalRecord {
  id: string;
  result: string;
  evidence?: string | null;
  approver?: string;
  rationale?: string;
  recheckAt?: string;
}
export interface ClosureEvidence {
  decisions?: ApprovalRecord[];
  criteria?: ApprovalRecord[];
  dependencies?: ApprovalRecord[];
}
export function verifyApprovedVisualException(input: {
  summary: VerificationSummary;
  visualReport: VisualReport;
  closureEvidence: ClosureEvidence;
  accessibilityReview: string;
  today?: string;
}): { allowed: boolean; errors: string[] };
