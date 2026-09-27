import { readFile } from 'node:fs/promises';
import { evaluateReadiness } from './release-readiness.mjs';

let report;
try {
  const evidence = JSON.parse(
    await readFile(
      new URL('../specs/002-contacto-operacion-cierre/closure-evidence.json', import.meta.url),
      'utf8',
    ),
  );
  report = evaluateReadiness(evidence);
} catch {
  report = {
    allowed: false,
    technical: [],
    human: [],
    exceptions: [],
    risks: [],
    blockers: ['closure-evidence.json missing or invalid'],
  };
}
console.log(JSON.stringify(report, null, 2));
if (!report.allowed) process.exitCode = 1;
