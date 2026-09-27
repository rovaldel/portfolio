#!/usr/bin/env node
/** Genera un índice de funciones del mockup y las asigna a specs por configuración. */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative } from 'node:path';
import { ROOT, loadConfig, outputPath, scanFunctions } from './common.mjs';

const check = process.argv.includes('--check');

try {
  const cfg = loadConfig();
  const functions = scanFunctions(cfg);
  const specs = cfg.specs?.map || {};
  const owners = new Map();

  for (const [spec, info] of Object.entries(specs)) {
    for (const name of info.functions || []) {
      if (owners.has(name)) throw new Error(`La función ${name} está asignada a más de una spec`);
      owners.set(name, { spec, area: info.title });
    }
  }

  const groups = new Map();
  for (const fn of functions) {
    const owner = owners.get(fn.name) || { spec: '???', area: 'Sin asignar' };
    const key = `${owner.spec}|${owner.area}|${fn.source}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(fn);
  }

  let markdown = `# Inventario de comportamiento del golden master\n\n` +
    `> **GENERADO** por \`node design/scripts/build-inventory.mjs\`. No editar a mano.\n\n` +
    `**${functions.length} funciones** · ${new Set(functions.map((fn) => fn.source)).size} fuentes · ${groups.size} zonas\n\n`;

  for (const key of [...groups.keys()].sort()) {
    const [spec, area, source] = key.split('|');
    const list = groups.get(key).sort((a, b) => a.line - b.line);
    markdown += `## spec ${spec} · ${area}\n\n`;
    markdown += `${list.length} funciones · fuente \`${source}\` · \`${cfg.golden.dir}/${list[0].file}\`\n\n`;
    markdown += '| Función | Línea | Nota cercana |\n|---|---:|---|\n';
    for (const fn of list) {
      const note = (fn.note || '—').replace(/\|/g, '·').slice(0, 160);
      markdown += `| \`${fn.source}#${fn.name}()\` | ${fn.line} | ${note} |\n`;
    }
    markdown += '\n';
  }

  const out = outputPath(cfg.inventory?.output, 'design/behavior-inventory.md');
  if (check) {
    if (!existsSync(out) || readFileSync(out, 'utf8') !== markdown) throw new Error(`${relative(ROOT, out)} está desactualizado`);
  } else {
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, markdown);
  }
  const unassigned = functions.filter((fn) => !owners.has(fn.name));
  console.log(`✓ ${functions.length} funciones inventariadas · ${unassigned.length} sin asignar`);
  console.log(`  → ${relative(ROOT, out)}`);
} catch (error) {
  console.error(`✗ ${error.message}`);
  process.exit(1);
}
