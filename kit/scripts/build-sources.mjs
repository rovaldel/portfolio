#!/usr/bin/env node
/** Genera el mapa de fuentes que consume la skill Servilleta. */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative } from 'node:path';
import { ROOT, loadConfig, outputPath, scanFunctions } from './common.mjs';

const check = process.argv.includes('--check');

try {
  const cfg = loadConfig();
  const specs = cfg.specs?.map || {};
  const functions = scanFunctions(cfg);
  const byName = new Map();
  for (const fn of functions) {
    const list = byName.get(fn.name) || [];
    list.push(fn);
    byName.set(fn.name, list);
  }

  let markdown = `# Mapa de fuentes por especificación\n\n` +
    `> **GENERADO** por \`node design/scripts/build-sources.mjs\`. No editar a mano.\n` +
    `> Si una spec no aparece, primero hay que declararla en \`design/golden.config.json\`.\n\n` +
    `## Fuentes que se consultan siempre\n\n` +
    `| Fuente | Para qué |\n|---|---|\n` +
    `| \`.specify/memory/constitution.md\` | Reglas que prevalecen |\n` +
    `| \`${cfg.specs?.master || 'docs/ESPECIFICACION_MAESTRA.md'}\` | Objetivo y reglas del producto |\n` +
    `| \`docs/DECISIONES.md\` | Decisiones ya cerradas, si existe |\n` +
    `| \`specs/*/cierre.md\` | Aprendizajes de specs terminadas, si existen |\n` +
    `| \`design/behavior-inventory.md\` | Punteros al comportamiento del mockup |\n`;
  if (cfg.tokens?.enabled) markdown += `| \`${cfg.tokens.output?.json || 'design/tokens.json'}\` | Valores visuales extraídos |\n`;
  if (cfg.content?.enabled) markdown += `| \`${cfg.content.output || `content/${cfg.project.locale || 'es'}.json`}\` | Contenido estructurado extraído |\n`;
  markdown += '\n---\n\n';

  for (const [spec, info] of Object.entries(specs)) {
    markdown += `## spec ${spec} · ${info.title}\n\n`;
    markdown += `**Especificación maestra:** ${(info.master || []).map((item) => `\`${item}\``).join(' · ') || '⚠️ pendiente de mapear'}\n\n`;
    const refs = [];
    for (const name of info.functions || []) {
      const hits = byName.get(name) || [];
      if (!hits.length) refs.push(`⚠️ \`${name}\` no existe en las fuentes configuradas`);
      else refs.push(...hits.map((fn) => `\`${fn.source}#${fn.name}:${fn.line}\` (\`${cfg.golden.dir}/${fn.file}\`)`));
    }
    markdown += `**Golden master:** ${refs.join(' · ') || 'sin comportamiento previo declarado'}\n\n`;
    const captures = info.captures || [];
    markdown += `**Capturas:** ${captures.map((item) => `\`${item}.png\``).join(' · ') || 'ninguna declarada'}\n\n---\n\n`;
  }

  const out = outputPath(cfg.specs?.sourcesOutput, 'docs/servilletas/FUENTES.md');
  if (check) {
    if (!existsSync(out) || readFileSync(out, 'utf8') !== markdown) throw new Error(`${relative(ROOT, out)} está desactualizado`);
  } else {
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, markdown);
  }
  console.log(`✓ ${Object.keys(specs).length} specs mapeadas`);
  console.log(`  → ${relative(ROOT, out)}`);
} catch (error) {
  console.error(`✗ ${error.message}`);
  process.exit(1);
}
