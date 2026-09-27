#!/usr/bin/env node
/** Extrae custom properties CSS desde selectores declarados en la configuración. */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative } from 'node:path';
import { ROOT, loadConfig, outputPath, readSource } from './common.mjs';

const check = process.argv.includes('--check');
const stripComments = (value) => value.replace(/\/\*[\s\S]*?\*\//g, '');

function blocks(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...css.matchAll(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, 'g'))].map((match) => match[1]).join(';');
}

function declarations(body, ignored) {
  const values = {};
  for (const item of stripComments(body).split(';')) {
    const separator = item.indexOf(':');
    if (separator < 0) continue;
    const name = item.slice(0, separator).trim();
    const value = item.slice(separator + 1).trim();
    if (name.startsWith('--') && value && !ignored.has(name)) values[name.slice(2)] = value;
  }
  return values;
}

function writeOrCheck(outputs) {
  let drift = false;
  for (const [path, body] of outputs) {
    if (check) {
      if (!existsSync(path) || readFileSync(path, 'utf8') !== body) {
        console.error(`✗ desactualizado: ${relative(ROOT, path)}`);
        drift = true;
      }
    } else {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, body);
    }
  }
  if (drift) throw new Error('Los tokens versionados no coinciden con el golden master');
}

try {
  const cfg = loadConfig();
  const tokenCfg = cfg.tokens;
  if (!tokenCfg?.enabled) {
    console.log('↷ Extracción de tokens desactivada en golden.config.json');
    process.exit(0);
  }

  const source = readSource(cfg, tokenCfg.source);
  const css = [...source.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/gi)].map((match) => match[1]).join('\n');
  if (!css) throw new Error(`La fuente «${tokenCfg.source}» no contiene bloques <style>`);
  const ignored = new Set(tokenCfg.ignore || []);
  const global = tokenCfg.globalSelector ? declarations(blocks(css, tokenCfg.globalSelector), ignored) : {};
  const themes = {};
  for (const theme of tokenCfg.themes || []) {
    themes[theme.key] = {
      $label: theme.label || theme.key,
      $default: theme.default === true,
      ...declarations(blocks(css, theme.selector), ignored),
    };
  }

  const minimum = tokenCfg.minimum || {};
  const required = tokenCfg.required || [];
  const errors = [];
  if (Object.keys(global).length < (minimum.global || 0)) errors.push(`tokens globales: ${Object.keys(global).length}; mínimo ${minimum.global}`);
  for (const [key, values] of Object.entries(themes)) {
    const count = Object.keys(values).filter((name) => !name.startsWith('$')).length;
    if (count < (minimum.perTheme || 0)) errors.push(`tema «${key}»: ${count} tokens; mínimo ${minimum.perTheme}`);
    for (const name of required) if (!(name in values) && !(name in global)) errors.push(`tema «${key}» no define --${name}`);
  }
  if (errors.length) throw new Error(`Contrato de tokens incumplido:\n  · ${errors.join('\n  · ')}`);

  const json = {
    $meta: {
      generatedBy: 'design/scripts/extract-tokens.mjs',
      source: `${cfg.golden.dir}/${cfg.golden.sources.find((item) => item.id === tokenCfg.source).file}`,
      warning: 'GENERADO. No editar a mano.',
    },
    global,
    themes,
  };
  const outputs = [[outputPath(tokenCfg.output?.json, 'design/tokens.json'), `${JSON.stringify(json, null, 2)}\n`]];
  if (tokenCfg.output?.css) {
    const cssOutput = ['/* GENERADO. No editar a mano. */'];
    if (Object.keys(global).length) {
      cssOutput.push(':root {');
      for (const [name, value] of Object.entries(global)) cssOutput.push(`  --${name}: ${value};`);
      cssOutput.push('}');
    }
    for (const theme of tokenCfg.themes || []) {
      cssOutput.push(`${theme.selector} {`);
      for (const [name, value] of Object.entries(themes[theme.key])) {
        if (!name.startsWith('$')) cssOutput.push(`  --${name}: ${value};`);
      }
      cssOutput.push('}');
    }
    outputs.push([outputPath(tokenCfg.output.css), `${cssOutput.join('\n')}\n`]);
  }

  writeOrCheck(outputs);
  console.log(`✓ ${Object.keys(global).length} tokens globales · ${Object.keys(themes).length} temas`);
  outputs.forEach(([path]) => console.log(`  → ${relative(ROOT, path)}`));
} catch (error) {
  console.error(`✗ ${error.message}`);
  process.exit(1);
}
