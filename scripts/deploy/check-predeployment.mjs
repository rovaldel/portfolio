import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const requiredDecisions = ['D-01', 'D-02', 'D-03', 'D-04', 'D-05', 'D-06', 'D-07'];
const requiredReviews = ['public-content-and-channels', 'privacy-and-legal'];
const requiredLegalDocuments = ['privacy', 'cookies', 'terms'];

export function evaluatePredeploymentReadiness({ closureEvidence, contentSource, today }) {
  const errors = [];
  const find = (list, id) => (Array.isArray(list) ? list.find((entry) => entry.id === id) : undefined);

  for (const id of requiredDecisions) {
    const decision = find(closureEvidence?.decisions, id);
    if (decision?.result !== 'pass' || !decision.evidence) {
      errors.push(`${id} no está aprobada con evidencia.`);
    }
  }

  const d08 = find(closureEvidence?.decisions, 'D-08');
  const ca18 = find(closureEvidence?.criteria, 'CA-18');
  const ca31 = find(closureEvidence?.criteria, 'CA-31');
  const spec000 = find(closureEvidence?.dependencies, 'spec-000');
  const recheckAt = d08?.recheckAt;
  const validException = (entry) =>
    entry?.result === 'approved-exception' &&
    Boolean(entry.evidence) &&
    Boolean(entry.approver) &&
    Boolean(entry.rationale) &&
    entry.recheckAt === recheckAt;
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(recheckAt ?? '') ||
    recheckAt < today ||
    !validException(d08) ||
    !validException(ca18) ||
    !validException(ca31) ||
    !validException(spec000)
  ) {
    errors.push('D-08 debe estar aprobada y vigente para la excepción visual heredada.');
  }

  const unexpectedCriteriaExceptions = (closureEvidence?.criteria ?? [])
    .filter((entry) => entry.result === 'approved-exception' && !['CA-18', 'CA-31'].includes(entry.id))
    .map((entry) => entry.id);
  const unexpectedDependencyExceptions = (closureEvidence?.dependencies ?? [])
    .filter((entry) => entry.result === 'approved-exception' && entry.id !== 'spec-000')
    .map((entry) => entry.id);
  if (unexpectedCriteriaExceptions.length || unexpectedDependencyExceptions.length) {
    errors.push('Hay excepciones técnicas adicionales fuera del alcance D-08.');
  }

  for (const id of requiredReviews) {
    const review = find(closureEvidence?.reviews, id);
    if (review?.result !== 'pass' || !review.evidence) {
      errors.push(
        id === 'privacy-and-legal'
          ? 'La revisión privacy-and-legal sigue pendiente de verificar las garantías de Google fuera del EEE.'
          : `La revisión humana ${id} sigue pendiente.`,
      );
    }
  }

  for (const id of requiredLegalDocuments) {
    const document = find(closureEvidence?.legal, id);
    if (document?.result !== 'pass' || !document.evidence) {
      errors.push(`La condición de publicación legal ${id} sigue pendiente.`);
    }
  }

  const legalSection =
    String(contentSource ?? '')
      .split('export const legalDocuments: LegalDocument[] = [')[1]
      ?.split('];')[0] ?? '';
  const statuses = [...legalSection.matchAll(/["']?status["']?\s*:\s*["'](working-draft|approved)["']/g)].map(
    (match) => match[1],
  );
  if (statuses.length !== 3 || statuses.some((status) => status !== 'approved')) {
    errors.push('Las tres páginas legales deben estar approved; no puede quedar ninguna en working-draft.');
  }

  return { allowed: errors.length === 0, errors };
}

async function main() {
  const closureEvidence = JSON.parse(
    await readFile('specs/002-contacto-operacion-cierre/closure-evidence.json', 'utf8'),
  );
  const contentSource = await readFile('src/content/site.ts', 'utf8');
  const report = evaluatePredeploymentReadiness({
    closureEvidence,
    contentSource,
    today: new Date().toISOString().slice(0, 10),
  });
  if (!report.allowed) {
    console.error(JSON.stringify(report, null, 2));
    process.exitCode = 1;
    return;
  }
  console.log('Decisiones, revisión legal, condiciones de publicación y excepción D-08 verificadas.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
