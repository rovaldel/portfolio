type GateEntry = {
  id: string;
  result: string;
  evidence?: string;
  approver?: string;
  rationale?: string;
  recheckAt?: string;
};

type ClosureEvidence = {
  decisions?: GateEntry[];
  criteria?: GateEntry[];
  dependencies?: GateEntry[];
  reviews?: GateEntry[];
  legal?: GateEntry[];
};

export function evaluatePredeploymentReadiness(input: {
  closureEvidence: ClosureEvidence;
  contentSource: string;
  today: string;
}): { allowed: boolean; errors: string[] };
