#!/usr/bin/env node
/** Verifica punteros `fuente#función:línea` de las servilletas al mockup. */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT, loadConfig, scanFunctions } from './common.mjs';

const fix = process.argv.includes('--fix');

function markdownFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? markdownFiles(path) : (entry.endsWith('.md') ? [path] : []);
  });
}

try {
  const cfg = loadConfig();
  const index = new Map();
  const byName = new Map();
  for (const fn of scanFunctions(cfg)) {
    index.set(`${fn.source}#${fn.name}`, fn);
    const list = byName.get(fn.name) || [];
    list.push(fn);
    byName.set(fn.name, list);
  }

  let valid = 0;
  let invalid = 0;
  let corrected = 0;
  for (const path of markdownFiles(join(ROOT, 'docs', 'servilletas'))) {
    let source = readFileSync(path, 'utf8');
    const failures = [];
    source = source.replace(/`(?:(?<source>[A-Za-z0-9_-]+)#)?(?<name>[A-Za-z_$][\w$]*):(?<line>\d{1,7})`/g,
      (whole, _source, _name, _line, _offset, _text, groups) => {
        const hits = groups.source ? [index.get(`${groups.source}#${groups.name}`)].filter(Boolean) : (byName.get(groups.name) || []);
        if (!hits.length) {
          failures.push(`${groups.source ? `${groups.source}#` : ''}${groups.name} no existe`);
          invalid++;
          return whole;
        }
        if (hits.length > 1) {
          failures.push(`${groups.name} es ambiguo; cita fuente#función:línea`);
          invalid++;
          return whole;
        }
        const actual = hits[0];
        if (actual.line === Number(groups.line)) {
          valid++;
          return whole;
        }
        failures.push(`${groups.name}:${groups.line} → línea real ${actual.line}`);
        invalid++;
        if (!fix) return whole;
        corrected++;
        return `\`${actual.source}#${actual.name}:${actual.line}\``;
      });
    if (fix && failures.length) writeFileSync(path, source);
    if (failures.length) {
      console.log(`${fix ? '⟳' : '✗'} ${relative(ROOT, path)}`);
      failures.forEach((failure) => console.log(`    ${failure}`));
    }
  }

  if (!fix && invalid) throw new Error(`${invalid} referencias incorrectas · ${valid} correctas`);
  console.log(fix ? `✓ ${corrected} referencias corregidas · ${valid} correctas` : `✓ ${valid} referencias al golden verificadas`);
} catch (error) {
  console.error(`✗ ${error.message}`);
  process.exit(1);
}
