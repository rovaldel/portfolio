const accepted = new Set(['pass', 'approved-exception']);
const addBlock = (blockers, label, result, evidence, entry = {}) => {
  if (!accepted.has(result) || !evidence)
    blockers.push(`${label}: ${result ?? 'missing'}${evidence ? '' : ' (evidence missing)'}`);
  if (
    result === 'approved-exception' &&
    (!evidence || !entry.approver || !entry.rationale || !entry.recheckAt)
  )
    blockers.push(`${label}: exception approval metadata missing`);
};

export function evaluateReadiness(evidence) {
  const blockers = [];
  const criteria = Array.isArray(evidence.criteria) ? evidence.criteria : [];
  if (criteria.length !== 34) blockers.push(`criteria: expected 34 entries, found ${criteria.length}`);
  for (let i = 1; i <= 34; i++) {
    const id = `CA-${String(i).padStart(2, '0')}`;
    const item = criteria.find((entry) => entry.id === id);
    if (!item) blockers.push(`${id}: missing`);
    else addBlock(blockers, id, item.result, item.evidence, item, true);
  }
  for (const [label, entries, expected] of [
    ['reviews', evidence.reviews, 3],
    ['decisions', evidence.decisions, 8],
    ['dependencies', evidence.dependencies, 2],
    ['legal', evidence.legal, 3],
  ]) {
    const list = Array.isArray(entries) ? entries : [];
    if (list.length !== expected)
      blockers.push(`${label}: expected ${expected} entries, found ${list.length}`);
    for (const entry of list) addBlock(blockers, `${label} ${entry.id}`, entry.result, entry.evidence, entry);
  }
  return {
    allowed: blockers.length === 0,
    technical: criteria.map(({ id, result, evidence: ref }) => ({ id, result, evidence: ref ?? null })),
    human: [...(evidence.reviews ?? []), ...(evidence.decisions ?? [])].map(
      ({ id, result, evidence: ref }) => ({ id, result, evidence: ref ?? null }),
    ),
    exceptions: criteria.filter((item) => item.result === 'approved-exception'),
    risks: evidence.openRisks ?? [],
    blockers,
  };
}
