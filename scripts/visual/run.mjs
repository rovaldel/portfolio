import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { platform } from 'node:os';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import {
  applyScenePrecondition,
  candidateRoutes,
  installDeterministicRuntime,
  readContractFacts,
  sha256,
  themeForScene,
} from '../../tests/visual/capture.ts';
import { compareBoxes, comparePngFiles } from '../../tests/visual/compare.ts';
import { contractChecksFor, validateVisualReport } from '../../tests/visual/report.ts';
import { visualExceptions } from '../../tests/visual/exceptions.ts';

const rootPath = fileURLToPath(new URL('../..', import.meta.url));
const artifactRoot = join(rootPath, 'artifacts/spec-000');
const visualPort = 4312;
const baseUrl = `http://127.0.0.1:${visualPort}`;
const configPath = join(rootPath, 'design/golden.config.json');
const config = JSON.parse(await readFile(configPath, 'utf8'));
const scenes = config.captures.scenes;
const contractScenes = config.captures.comparison.contractScenes;
const updateMode = process.argv.includes('--update');
const captureOnly = process.env['VISUAL_UPDATE_CAPTURE_ONLY'] === '1';

const sourceFiles = {
  'Portfolio Conversacional.html': 'mockup/Portfolio Conversacional.html',
  'support.js': 'mockup/support.js',
  'Rodrigo_Valdelvira_CV_AI_Engineer.pdf': 'mockup/Rodrigo_Valdelvira_CV_AI_Engineer.pdf',
  'portafolio.png': 'mockup/portafolio.png',
  'leadia.webp': 'mockup/leadia.webp',
  'nami-cover.png': 'mockup/nami-cover.png',
};

const waitForHealth = async () => {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      if ((await fetch(`${baseUrl}/api/salud`)).ok) return;
    } catch {
      // The standalone server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('El servidor empaquetado no alcanzó /api/salud en el puerto de verificación.');
};

const run = (command, args, options = {}) =>
  new Promise((resolve) => {
    const child = spawn(command, args, options);
    child.on('close', (code) => resolve(code ?? 1));
    child.on('error', () => resolve(1));
  });

const gitCommit = async () => {
  const child = spawn('git', ['rev-parse', 'HEAD'], { cwd: rootPath });
  let output = '';
  child.stdout.on('data', (chunk) => {
    output += chunk;
  });
  await new Promise((resolve) => child.on('close', resolve));
  return /^[0-9a-f]{40}$/.test(output.trim()) ? output.trim() : '0000000000000000000000000000000000000000';
};

const copyApprovedGolden = async () => {
  if (process.env['ALLOW_GOLDEN_UPDATE'] !== '1')
    throw new Error(
      'visual:update requiere revisión humana y ALLOW_GOLDEN_UPDATE=1; verify:spec:000 nunca establece esa variable.',
    );
  const status = await run('node', [new URL('./run.mjs', import.meta.url).pathname.replace(/%20/g, ' ')], {
    cwd: rootPath,
    env: { ...process.env, VISUAL_UPDATE_CAPTURE_ONLY: '1' },
    stdio: 'inherit',
  });
  if (status !== 0) process.exit(status);
  for (const scene of scenes) {
    const slug = scene.name.replace('portfolio/', '');
    await copyFile(
      join(artifactRoot, 'scenes', slug, 'candidate.png'),
      join(rootPath, 'design/screenshots', `${scene.name}.png`),
    );
  }
};

if (updateMode) {
  await copyApprovedGolden();
  process.exit(0);
}

if (!existsSync(join(rootPath, 'dist/server/entry.mjs')))
  throw new Error('Ejecuta pnpm run build antes de test:visual.');

await rm(artifactRoot, { recursive: true, force: true });
await mkdir(artifactRoot, { recursive: true });

process.env.ASTRO_NODE_AUTOSTART = 'disabled';
process.env.ASTRO_NODE_LOGGING = 'disabled';
process.env.HOST = '127.0.0.1';
process.env.PORT = String(visualPort);
const serverModule = await import('../../dist/server/entry.mjs');
const serverInstance = serverModule.startServer();
const server = serverInstance.server.server;
let serverOutput = '';
server.on('error', (error) => {
  serverOutput += error.message;
});
let browser;
try {
  try {
    await waitForHealth();
  } catch (error) {
    throw new Error(String(error) + '\n' + serverOutput);
  }
  browser = await chromium.launch();
  const sourceHashes = Object.fromEntries(
    await Promise.all(
      Object.entries(sourceFiles).map(async ([name, path]) => [name, await sha256(join(rootPath, path))]),
    ),
  );
  const fontDirectory = join(rootPath, 'public/fonts');
  const fontHashes = Object.fromEntries(
    await Promise.all(
      [
        'gabarito-latin.woff2',
        'hanken-grotesk-latin.woff2',
        'ibm-plex-mono-400-latin.woff2',
        'ibm-plex-mono-500-latin.woff2',
      ].map(async (font) => [font, await sha256(join(fontDirectory, font))]),
    ),
  );
  const results = [];

  for (const scene of scenes) {
    const slug = scene.name.replace('portfolio/', '');
    const directory = join(artifactRoot, 'scenes', slug);
    const golden = join(rootPath, 'design/screenshots', `${scene.name}.png`);
    const candidate = join(directory, 'candidate.png');
    const diff = join(directory, 'diff.png');
    const metricsPath = join(directory, 'metrics.json');
    await mkdir(directory, { recursive: true });
    await copyFile(golden, join(directory, 'golden.png'));
    const theme = themeForScene(slug);
    const externalRequests = [];
    const page = await browser.newPage({
      viewport: { width: scene.width, height: scene.height },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    await page.route('**/*', async (route) => {
      const requestUrl = new URL(route.request().url());
      if (
        requestUrl.origin !== baseUrl &&
        requestUrl.protocol !== 'data:' &&
        requestUrl.protocol !== 'blob:'
      ) {
        externalRequests.push(requestUrl.href);
        await route.abort();
        return;
      }
      await route.continue();
    });
    await installDeterministicRuntime(page, theme);
    await page.goto(`${baseUrl}${candidateRoutes[slug]}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await applyScenePrecondition(page, slug);
    await page.screenshot({ path: candidate, animations: 'disabled', caret: 'hide' });

    const isContract = Object.hasOwn(contractScenes, scene.name);
    const contractDefinition = isContract ? contractScenes[scene.name] : null;
    const exception = visualExceptions.find((entry) => entry.scene === scene.name);
    const excludedRegions = exception?.excludedRegions.flatMap((region) => region.boxes) ?? [];
    const metrics = await comparePngFiles(join(directory, 'golden.png'), candidate, diff, excludedRegions);
    await writeFile(metricsPath, JSON.stringify(metrics, null, 2));

    const facts = isContract ? await readContractFacts(page, theme) : null;
    const checks = facts ? contractChecksFor(facts, externalRequests) : null;
    const anchors = isContract
      ? await Promise.all(
          contractDefinition.anchors.map(async (definition) => {
            const candidateBox = await page.locator(definition.selector).boundingBox();
            const measured = candidateBox ?? { x: -1, y: -1, width: 0, height: 0 };
            const comparison = compareBoxes(definition.golden, measured, definition.fields);
            return {
              name: definition.name,
              selector: definition.selector,
              fields: definition.fields,
              golden: definition.golden,
              candidate: measured,
              maximumDeltaCssPx: comparison.maximumDeltaCssPx,
              deltas: comparison.deltas,
              status: candidateBox ? comparison.status : 'fail',
            };
          }),
        )
      : [];
    const beforeEvidenceExists = Boolean(exception && existsSync(join(rootPath, exception.beforeEvidence)));
    const afterEvidenceExists = Boolean(exception && existsSync(candidate));
    const evidenceComplete = beforeEvidenceExists && afterEvidenceExists;
    const exceptionApproved = exception?.approval === 'approved' && evidenceComplete;
    const excludedRegionEvidence =
      exception?.excludedRegions.map((region) => ({
        id: region.id,
        description: region.description,
        boxes: region.boxes,
        ignoredPixels: metrics.excludedPixels,
      })) ?? [];

    if (isContract)
      await writeFile(
        join(directory, 'anchor-metrics.json'),
        JSON.stringify({ anchors, contractChecks: checks, excludedRegions: excludedRegionEvidence }, null, 2),
      );
    await page.close();

    const contractPasses = Boolean(checks && Object.values(checks).every((check) => check === 'pass'));
    const anchorsPass = anchors.length > 0 && anchors.every((anchor) => anchor.status === 'pass');
    const pixelsPass = metrics.changedPixelRatio <= config.captures.comparison.maximumChangedPixelRatio;
    const status = isContract
      ? contractPasses && anchorsPass && pixelsPass && externalRequests.length === 0 && exceptionApproved
        ? 'pass'
        : 'fail'
      : pixelsPass && externalRequests.length === 0
        ? 'pass'
        : 'fail';
    results.push({
      sceneId: scene.name,
      candidatePath: candidateRoutes[slug],
      theme,
      viewport: { width: scene.width, height: scene.height },
      precondition: scene.precondition,
      mode: isContract ? 'contract' : 'pixel',
      ...(isContract
        ? {
            exceptionRef: `tests/visual/exceptions.ts#${slug}`,
            exceptionApproval: exception?.approval ?? 'missing',
            exceptionEvidence: { beforeExists: beforeEvidenceExists, afterExists: afterEvidenceExists },
            excludedRegions: excludedRegionEvidence,
            anchors,
            contractChecks: checks,
          }
        : {}),
      artifacts: {
        golden: `artifacts/spec-000/scenes/${slug}/golden.png`,
        candidate: `artifacts/spec-000/scenes/${slug}/candidate.png`,
        diff: `artifacts/spec-000/scenes/${slug}/diff.png`,
        metrics: `artifacts/spec-000/scenes/${slug}/metrics.json`,
      },
      metrics,
      status,
    });
  }

  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    commit: await gitCommit(),
    sources: sourceHashes,
    environment: {
      node: process.version,
      playwright: JSON.parse(
        await readFile(join(rootPath, 'node_modules/@playwright/test/package.json'), 'utf8'),
      ).version,
      browser: 'chromium',
      browserVersion: browser.version(),
      operatingSystem: platform(),
      deviceScaleFactor: 1,
      fontHashes,
    },
    configuration: {
      configPath: 'design/golden.config.json',
      configSha256: createHash('sha256')
        .update(await readFile(configPath))
        .digest('hex'),
      pixelThreshold: 0.1,
      maximumChangedPixelRatio: 0.005,
      maximumAnchorDeltaCssPx: 2,
      animationsFrozen: true,
      clockFrozen: true,
      fontsReady: true,
      externalNetworkBlocked: true,
    },
    scenes: results,
    overallStatus:
      results.length === 19 && results.every((scene) => scene.status === 'pass') ? 'pass' : 'fail',
  };
  await writeFile(join(artifactRoot, 'environment.json'), JSON.stringify(report.environment, null, 2));
  await writeFile(join(artifactRoot, 'visual-report.json'), JSON.stringify(report, null, 2));
  await validateVisualReport(
    report,
    join(rootPath, 'specs/000-esqueleto-visual-funcional/contracts/visual-evidence.schema.json'),
  );
  if (!captureOnly && report.overallStatus !== 'pass')
    throw new Error('La comparación visual falló: consulta artifacts/spec-000/visual-report.json.');
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(() => resolve()));
}
