#!/usr/bin/env node
/** Captura escenas del mockup declaradas en golden.config.json con Chrome/Chromium. */
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { ROOT, loadConfig, outputPath, sourceFor, sourcePath } from './common.mjs';

const only = (process.argv.find((item) => item.startsWith('--only=')) || '').split('=')[1];

function browser(configured) {
  const candidates = [configured, 'google-chrome', 'chromium', 'chromium-browser'].filter(Boolean);
  return candidates.find((candidate) => spawnSync(candidate, ['--version'], { stdio: 'ignore' }).status === 0);
}

try {
  const cfg = loadConfig();
  const captureCfg = cfg.captures;
  if (!captureCfg?.enabled || !(captureCfg.scenes || []).length) {
    console.log('↷ Capturas desactivadas o sin escenas');
    process.exit(0);
  }
  const executable = browser(captureCfg.browser);
  if (!executable) throw new Error('No se encontró Google Chrome o Chromium');
  const outDir = outputPath(captureCfg.output, 'design/screenshots');
  const tempRoot = mkdtempSync(join(tmpdir(), 'golden-capture-'));
  cpSync(outputPath(cfg.golden.dir), tempRoot, { recursive: true });
  let captured = 0;
  let failed = 0;

  for (const scene of captureCfg.scenes) {
    if (only && !scene.name.includes(only)) continue;
    if (scene.name.includes('..') || scene.name.startsWith('/')) throw new Error(`Nombre de escena inseguro: ${scene.name}`);
    const source = sourceFor(cfg, scene.source);
    const original = sourcePath(cfg, scene.source);
    const tempFile = join(tempRoot, source.file);
    let html = readFileSync(original, 'utf8');
    const freeze = captureCfg.freezeAnimations === false ? '' : '<style>*,*::before,*::after{animation:none!important;transition:none!important}</style>';
    const preparation = captureCfg.preparation?.[scene.source] || '';
    html = html.replace(/<\/head>/i, `${freeze}<script>${preparation}</script></head>`);
    html = html.replace(/<\/body>/i, `<script>setTimeout(()=>{try{${scene.script || ''}}catch(error){console.error(error)}},${captureCfg.delayMs || 500})</script></body>`);
    writeFileSync(tempFile, html);
    const out = join(outDir, `${scene.name}.png`);
    mkdirSync(dirname(out), { recursive: true });
    try {
      execFileSync(executable, [
        '--headless', '--disable-gpu', '--hide-scrollbars',
        `--window-size=${scene.width || 1440},${scene.height || 1000}`,
        `--virtual-time-budget=${captureCfg.virtualTimeMs || 5000}`,
        `--screenshot=${out}`, `file://${tempFile}`,
      ], { stdio: 'pipe', timeout: captureCfg.timeoutMs || 60000 });
      if (!existsSync(out)) throw new Error('Chrome no produjo el fichero');
      captured++;
      console.log(`  ✓ ${scene.name}`);
    } catch (error) {
      failed++;
      console.error(`  ✗ ${scene.name}: ${String(error.message).slice(0, 120)}`);
    }
  }
  rmSync(tempRoot, { recursive: true, force: true });
  console.log(`✓ ${captured} capturas en ${relative(ROOT, outDir)}${failed ? ` · ${failed} fallidas` : ''}`);
  process.exit(failed ? 1 : 0);
} catch (error) {
  console.error(`✗ ${error.message}`);
  process.exit(1);
}
