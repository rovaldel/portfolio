import { existsSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const CONFIG_PATH = join(ROOT, 'design', 'golden.config.json');

export function loadConfig() {
  if (!existsSync(CONFIG_PATH)) throw new Error('Falta design/golden.config.json');
  const cfg = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
  if (cfg.schemaVersion !== 1) throw new Error('golden.config.json debe declarar schemaVersion: 1');
  if (!cfg.project?.name) throw new Error('Falta project.name en golden.config.json');
  if (!cfg.golden?.dir || !Array.isArray(cfg.golden.sources) || !cfg.golden.sources.length) {
    throw new Error('golden.sources debe contener al menos una fuente');
  }
  const ids = cfg.golden.sources.map((source) => source.id);
  if (ids.some((id) => !id) || new Set(ids).size !== ids.length) {
    throw new Error('Cada fuente necesita un id único');
  }
  return cfg;
}

export function rootPath(...parts) {
  const path = resolve(ROOT, ...parts);
  const rel = relative(ROOT, path);
  if (rel.startsWith('..') || isAbsolute(rel)) throw new Error(`Ruta fuera del proyecto: ${parts.join('/')}`);
  return path;
}

export function sourceFor(cfg, id) {
  const source = cfg.golden.sources.find((item) => item.id === id);
  if (!source) throw new Error(`Fuente desconocida en golden.config.json: ${id}`);
  return source;
}

export function sourcePath(cfg, id) {
  const source = sourceFor(cfg, id);
  return rootPath(cfg.golden.dir, source.file);
}

export function readSource(cfg, id) {
  const path = sourcePath(cfg, id);
  if (!existsSync(path)) throw new Error(`No existe la fuente «${id}»: ${relative(ROOT, path)}`);
  return readFileSync(path, 'utf8');
}

const RESERVED = new Set(['if', 'for', 'while', 'switch', 'catch', 'with']);

export function scanFunctions(cfg) {
  const found = [];
  const ignored = new Set(cfg.inventory?.ignore || []);
  for (const source of cfg.golden.sources) {
    if (source.inventory === false) continue;
    const lines = readSource(cfg, source.id).split('\n');
    lines.forEach((line, index) => {
      const declaration = line.match(/^\s*(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/);
      const assigned = line.match(/^\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:function\b|\()/);
      const method = line.match(/^\s{2,}(?:async\s+)?([A-Za-z_$][\w$]*)\s*\([^;]*\)\s*\{/);
      const name = declaration?.[1] || assigned?.[1] || method?.[1];
      if (!name || RESERVED.has(name) || ignored.has(name)) return;
      let note = '';
      for (let cursor = index - 1; cursor >= 0 && cursor > index - 8; cursor--) {
        const candidate = lines[cursor].trim();
        if (!candidate) continue;
        if (/^(\/\*|\*|\/\/|\*\/)/.test(candidate)) {
          note = candidate.replace(/^[/*\s]+|[*/\s]+$/g, '').trim() + (note ? ` ${note}` : '');
          continue;
        }
        break;
      }
      found.push({ name, line: index + 1, note, source: source.id, file: source.file });
    });
  }
  return found;
}

export function outputPath(value, fallback) {
  return rootPath(value || fallback);
}
