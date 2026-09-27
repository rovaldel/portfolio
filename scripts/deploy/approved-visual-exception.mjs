import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const expectedBeforeVisual = [
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
const allowedVisualSteps = new Set(['Evidencia visual', 'Contrato visual completo heredado']);

export function verifyApprovedVisualException({
  summary,
  visualReport,
  closureEvidence,
  accessibilityReview,
  today = new Date().toISOString().slice(0, 10),
}) {
  const errors = [];
  const results = Array.isArray(summary?.results) ? summary.results : [];
  if (summary?.status !== 'fail') errors.push('La ejecución no terminó con un fallo documentado.');
  if (results.length !== expectedBeforeVisual.length + 1)
    errors.push('La ejecución no llegó hasta una única comprobación visual final.');
  for (let index = 0; index < expectedBeforeVisual.length; index += 1) {
    if (
      results[index]?.name !== expectedBeforeVisual[index] ||
      results[index]?.status !== 'pass' ||
      results[index]?.exitCode !== 0
    ) {
      errors.push('Falló una comprobación distinta de la excepción visual aprobada.');
      break;
    }
  }
  const lastResult = results.at(-1);
  if (
    !allowedVisualSteps.has(lastResult?.name) ||
    lastResult?.status !== 'fail' ||
    lastResult?.exitCode === 0
  ) {
    errors.push('El último resultado no es el fallo visual aprobado.');
  }
  if (
    visualReport?.overallStatus !== 'fail' ||
    visualReport?.scenes?.length !== 19 ||
    !visualReport.scenes.every((scene) => scene.status === 'fail')
  ) {
    errors.push('La evidencia no coincide con las 19 escenas fallidas autorizadas.');
  }

  const d08 = closureEvidence?.decisions?.find((entry) => entry.id === 'D-08');
  const ca18 = closureEvidence?.criteria?.find((entry) => entry.id === 'CA-18');
  const ca31 = closureEvidence?.criteria?.find((entry) => entry.id === 'CA-31');
  const spec000 = closureEvidence?.dependencies?.find((entry) => entry.id === 'spec-000');
  const approvals = [d08, ca18, ca31, spec000];
  const recheckAt = d08?.recheckAt;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(recheckAt ?? '') || recheckAt < today)
    errors.push('La excepción D-08 no tiene fecha futura de revisión.');
  if (
    approvals.some(
      (entry) =>
        entry?.result !== 'approved-exception' ||
        !entry.evidence ||
        !entry.approver ||
        !entry.rationale ||
        entry.recheckAt !== recheckAt,
    )
  ) {
    errors.push('La excepción no está aprobada y registrada en cada puerta visual afectada.');
  }
  if (!String(accessibilityReview ?? '').includes('Pendiente de revisión humana')) {
    errors.push('La revisión humana de accesibilidad no está documentada como pendiente.');
  }
  return { allowed: errors.length === 0, errors };
}

async function main() {
  const summaryPath = process.env.VERIFY_SUMMARY ?? 'artifacts/spec-000/verification-summary.json';
  const summary = JSON.parse(await readFile(summaryPath, 'utf8'));
  const visualReport = JSON.parse(await readFile('artifacts/spec-000/visual-report.json', 'utf8'));
  const closureEvidence = JSON.parse(
    await readFile('specs/002-contacto-operacion-cierre/closure-evidence.json', 'utf8'),
  );
  const accessibilityReview = await readFile(
    'specs/000-esqueleto-visual-funcional/accessibility-review.md',
    'utf8',
  );
  const report = verifyApprovedVisualException({
    summary,
    visualReport,
    closureEvidence,
    accessibilityReview,
  });
  if (!report.allowed) {
    for (const error of report.errors) console.error(`::error title=D-08::${error}`);
    console.error(JSON.stringify(report, null, 2));
    process.exitCode = 1;
    return;
  }
  console.log(
    'Se acepta solo la excepción D-08: el resto de la verificación pasó; las 19 escenas visuales siguen fallidas y accesibilidad permanece pendiente.',
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
