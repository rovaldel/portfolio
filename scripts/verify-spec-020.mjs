import { readFile } from 'node:fs/promises';
import { evaluateReadiness } from './release-readiness.mjs';

const evidence = JSON.parse(
  await readFile(
    new URL('../specs/002-contacto-operacion-cierre/closure-evidence.json', import.meta.url),
    'utf8',
  ),
);
const report = evaluateReadiness(evidence);
if (report.allowed) {
  console.error('La puerta 020 no puede declarar cierre sin evidencia verificable.');
  process.exit(1);
}
console.log(
  JSON.stringify(
    {
      verifier: 'spec-020',
      contract: 'pass',
      releaseAllowed: false,
      expectedBlockers: report.blockers.length,
    },
    null,
    2,
  ),
);
