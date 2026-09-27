#!/usr/bin/env node
/** Extrae literales de datos declarados por el proyecto, sin asumir su dominio. */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative } from 'node:path';
import { runInNewContext } from 'node:vm';
import { ROOT, loadConfig, outputPath, readSource } from './common.mjs';

const check = process.argv.includes('--check');

function escaped(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function literal(source, expression) {
  const declaration = new RegExp(`(?:(?:const|let|var)\\s+)?${escaped(expression)}\\s*=`);
  const found = declaration.exec(source);
  if (!found) throw new Error(`No se encontró «${expression}»`);
  let start = found.index + found[0].length;
  while (/\s/.test(source[start])) start++;
  const opening = source[start];
  const closing = opening === '[' ? ']' : opening === '{' ? '}' : null;
  if (!closing) throw new Error(`«${expression}» debe ser un literal de lista u objeto`);
  let depth = 0;
  let quote = null;
  let escapedCharacter = false;
  for (let index = start; index < source.length; index++) {
    const character = source[index];
    if (quote) {
      if (escapedCharacter) escapedCharacter = false;
      else if (character === '\\') escapedCharacter = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === "'" || character === '"' || character === '`') { quote = character; continue; }
    if (character === opening) depth++;
    if (character === closing && --depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`Literal sin cerrar en «${expression}»`);
}

function selectFields(value, fields) {
  if (!fields) return value;
  return Object.fromEntries(Object.entries(fields).map(([output, input]) => [output, value[input]]));
}

function assertStaticLiteral(code, expression) {
  const withoutStrings = code
    .replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');
  const dangerousWord = /\b(?:new|function|class|this|globalThis|process|require|import|eval|constructor|__proto__)\b/;
  const callOrMember = /=>|\.[A-Za-z_$]|[A-Za-z_$][\w$]*\s*\(/;
  if (dangerousWord.test(withoutStrings) || callOrMember.test(withoutStrings)) {
    throw new Error(`«${expression}» no es un literal de datos estático`);
  }
}

try {
  const cfg = loadConfig();
  const contentCfg = cfg.content;
  if (!contentCfg?.enabled) {
    console.log('↷ Extracción de contenido desactivada en golden.config.json');
    process.exit(0);
  }
  const source = readSource(cfg, contentCfg.source);
  const content = {
    $meta: {
      generatedBy: 'design/scripts/extract-content.mjs',
      source: `${cfg.golden.dir}/${cfg.golden.sources.find((item) => item.id === contentCfg.source).file}`,
      warning: 'GENERADO. No editar a mano.',
    },
  };

  for (const structure of contentCfg.structures || []) {
    const code = literal(source, structure.expression);
    assertStaticLiteral(code, structure.expression);
    const value = runInNewContext(`(${code})`, Object.create(null), {
      timeout: 100,
      contextCodeGeneration: { strings: false, wasm: false },
    });
    const size = Array.isArray(value) ? value.length : Object.keys(value).length;
    if (structure.expected !== undefined && size !== structure.expected) {
      throw new Error(`«${structure.expression}» tiene ${size} entradas; se esperaban ${structure.expected}`);
    }
    if (structure.minimum !== undefined && size < structure.minimum) {
      throw new Error(`«${structure.expression}» tiene ${size} entradas; mínimo ${structure.minimum}`);
    }
    if (Array.isArray(value)) {
      const mapped = value.map((item) => selectFields(item, structure.fields));
      if (structure.key) {
        const keys = value.map((item, index) => item[structure.key] ?? index);
        if (new Set(keys).size !== keys.length) throw new Error(`«${structure.expression}» contiene claves duplicadas en ${structure.key}`);
        content[structure.output] = Object.fromEntries(keys.map((key, index) => [key, mapped[index]]));
      } else content[structure.output] = mapped;
    } else {
      content[structure.output] = selectFields(value, structure.fields);
    }
  }

  const out = outputPath(contentCfg.output, `content/${cfg.project.locale || 'es'}.json`);
  const body = `${JSON.stringify(content, null, 2)}\n`;
  if (check) {
    if (!existsSync(out) || readFileSync(out, 'utf8') !== body) throw new Error(`${relative(ROOT, out)} no coincide con el golden master`);
  } else {
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, body);
  }
  console.log(`✓ ${(contentCfg.structures || []).length} estructuras de contenido`);
  console.log(`  → ${relative(ROOT, out)}`);
} catch (error) {
  console.error(`✗ ${error.message}`);
  process.exit(1);
}
