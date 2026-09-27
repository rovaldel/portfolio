import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const steps = [
  ['Fuentes y trazabilidad', 'pnpm', ['run', 'verify:kit']],
  ['Formato', 'pnpm', ['run', 'format:check']],
  ['Lint', 'pnpm', ['run', 'lint']],
  ['Tipos', 'pnpm', ['run', 'check']],
  ['Unitarias', 'pnpm', ['run', 'test:unit']],
  ['Auditoría de producción', 'pnpm', ['audit', '--prod']],
  ['Build', 'pnpm', ['run', 'build']],
  ['HTTP, Chromium y Firefox', 'pnpm', ['run', 'test:e2e']],
  ['Navegación sin JavaScript', 'pnpm', ['run', 'test:no-js']],
  ['Movimiento reducido', 'pnpm', ['run', 'test:reduced-motion']],
  [
    'Contenedor endurecido',
    'pnpm',
    ['exec', 'playwright', 'test', 'tests/integration/container.spec.ts', '--project=chromium'],
    { RUN_CONTAINER_TESTS: '1', PORT: '4317' },
  ],
  ['Evidencia visual', 'pnpm', ['run', 'test:visual']],
];

const results = [];
const packageManifest = JSON.parse(await readFile('package.json', 'utf8'));
const run = (command, args, extraEnv = {}) =>
  new Promise((resolve) => {
    const child = spawn(command, args, { stdio: 'inherit', env: { ...process.env, ...extraEnv } });
    child.on('error', () => resolve(127));
    child.on('close', (code) => resolve(code ?? 1));
  });

let failed = false;
try {
  for (const [name, command, args, extraEnv] of steps) {
    const exitCode = await run(command, args, extraEnv);
    results.push({ name, exitCode, status: exitCode === 0 ? 'pass' : 'fail' });
    if (exitCode !== 0) {
      failed = true;
      break;
    }
  }
} finally {
  await mkdir('artifacts/spec-000', { recursive: true });
  await writeFile(
    'artifacts/spec-000/verification-summary.json',
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        node: process.version,
        packageManager: packageManifest.packageManager,
        evidence: {
          visualReport: 'artifacts/spec-000/visual-report.json',
          accessibilityReview: 'specs/000-esqueleto-visual-funcional/accessibility-review.md',
          containerTest: 'tests/integration/container.spec.ts',
          workflow: '.github/workflows/verification.yml',
          scanners: ['Gitleaks', 'CodeQL', 'Trivy'],
        },
        publication: {
          legalDocuments: 'working-draft',
          humanAccessibilityReview: 'pending',
        },
        results,
        status: failed ? 'fail' : 'pass',
      },
      null,
      2,
    ),
  );
}
if (failed) process.exitCode = 1;
