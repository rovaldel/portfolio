#!/usr/bin/env bash
# Crea un proyecto Spec Kit desde una base neutral y un mockup.
#
#   ./kit/bin/nuevo-proyecto.sh <destino> <nombre> <ruta-al-mockup>
set -euo pipefail

DEST_INPUT="${1:?destino}"
PROJECT_NAME="${2:?nombre del proyecto}"
MOCKUP_INPUT="${3:?ruta al mockup}"
KIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

command -v node >/dev/null || { echo "✗ Falta Node.js para las herramientas del kit"; exit 1; }
command -v git >/dev/null || { echo "✗ Falta Git"; exit 1; }
[ -d "$MOCKUP_INPUT" ] || { echo "✗ No existe el mockup: $MOCKUP_INPUT"; exit 1; }
[ -n "$PROJECT_NAME" ] || { echo "✗ El nombre no puede estar vacío"; exit 1; }

MOCKUP_DIR="$(cd "$MOCKUP_INPUT" && pwd)"
if [ -d "$DEST_INPUT" ] && [ -n "$(find "$DEST_INPUT" -mindepth 1 -maxdepth 1 -print -quit 2>/dev/null)" ]; then
  echo "✗ El destino ya existe y no está vacío: $DEST_INPUT"
  exit 1
fi

mkdir -p "$DEST_INPUT"
DEST_DIR="$(cd "$DEST_INPUT" && pwd)"
mkdir -p "$DEST_DIR"/specs "$DEST_DIR"/docs/servilletas/borradores \
  "$DEST_DIR"/docs/plantillas "$DEST_DIR"/design/golden "$DEST_DIR"/design/scripts \
  "$DEST_DIR"/content "$DEST_DIR"/compliance "$DEST_DIR"/docker "$DEST_DIR"/.github/workflows

echo "▸ 1/6 · Spec Kit"
cd "$DEST_DIR"
if command -v specify >/dev/null; then
  specify init --here --integration claude --ignore-agent-tools --force >/dev/null
elif command -v uvx >/dev/null; then
  uvx --from git+https://github.com/github/spec-kit.git specify init --here \
    --integration claude --ignore-agent-tools --force >/dev/null
else
  echo "✗ Falta specify o uvx (https://docs.astral.sh/uv/)"
  exit 1
fi

echo "▸ 2/6 · Golden master"
cp -a "$MOCKUP_DIR"/. design/golden/
find design/golden -type f -exec chmod a-w {} +
GOLDEN_PATH="$(find design/golden -type f -iname '*.html' -print -quit)"
if [ -z "$GOLDEN_PATH" ]; then GOLDEN_PATH="$(find design/golden -type f -print -quit)"; fi
[ -n "$GOLDEN_PATH" ] || { echo "✗ El mockup no contiene ficheros"; exit 1; }
GOLDEN_ENTRY="${GOLDEN_PATH#design/golden/}"

echo "▸ 3/6 · Método y fuentes"
cp "$KIT_DIR"/scripts/*.mjs design/scripts/
mkdir -p .claude/skills/servilleta
cp "$KIT_DIR"/skills/servilleta-SKILL.md .claude/skills/servilleta/SKILL.md
cp "$KIT_DIR"/templates/cierre.md docs/plantillas/
cp "$KIT_DIR"/templates/000-esqueleto-funcional.md docs/servilletas/
cp "$KIT_DIR"/templates/constitution.md .specify/memory/constitution.md
cp "$KIT_DIR"/security/BASELINE_OWASP.md compliance/
cp "$KIT_DIR"/security/servilleta-seguridad.md docs/servilletas/001-seguridad-proporcional.md
cp "$KIT_DIR"/METODO.md docs/GUIA_ESPECIFICACIONES.md
cp "$KIT_DIR"/config/golden.config.example.json design/golden.config.json
cp "$KIT_DIR"/docker/README.md docker/README.md
cp "$KIT_DIR"/docker/.dockerignore .dockerignore
cp "$KIT_DIR"/ci/verificacion.yml .github/workflows/verificacion.yml

PROJECT_NAME="$PROJECT_NAME" GOLDEN_ENTRY="$GOLDEN_ENTRY" node --input-type=module <<'NODE'
import { readFileSync, writeFileSync } from 'node:fs';

for (const path of ['.specify/memory/constitution.md', 'docs/GUIA_ESPECIFICACIONES.md']) {
  writeFileSync(path, readFileSync(path, 'utf8').replaceAll('{{NOMBRE}}', process.env.PROJECT_NAME));
}
const path = 'design/golden.config.json';
const config = JSON.parse(readFileSync(path, 'utf8'));
config.project.name = process.env.PROJECT_NAME;
config.golden.sources[0].file = process.env.GOLDEN_ENTRY;
writeFileSync(path, `${JSON.stringify(config, null, 2)}\n`);
NODE

echo "▸ 4/6 · Herramientas neutrales"
PROJECT_NAME="$PROJECT_NAME" node --input-type=module <<'NODE'
import { writeFileSync } from 'node:fs';

const safeName = process.env.PROJECT_NAME.toLowerCase().normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'proyecto';
const pkg = {
  name: safeName,
  private: true,
  scripts: {
    'design:tokens': 'node design/scripts/extract-tokens.mjs',
    'design:content': 'node design/scripts/extract-content.mjs',
    'design:capture': 'node design/scripts/capture-golden.mjs',
    'design:inventory': 'node design/scripts/build-inventory.mjs',
    'design:sources': 'node design/scripts/build-sources.mjs',
    'design:regen': 'npm run design:tokens && npm run design:content && npm run design:inventory && npm run design:sources',
    'refs:check': 'node design/scripts/check-refs.mjs',
    'refs:fix': 'node design/scripts/check-refs.mjs --fix',
    'verify:kit': 'node design/scripts/extract-tokens.mjs --check && node design/scripts/extract-content.mjs --check && node design/scripts/build-inventory.mjs --check && node design/scripts/build-sources.mjs --check && node design/scripts/check-refs.mjs'
  }
};
writeFileSync('package.json', `${JSON.stringify(pkg, null, 2)}\n`);
NODE

GITIGNORE_TEMPLATE="$KIT_DIR/config/gitignore.example" node --input-type=module <<'NODE'
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const current = existsSync('.gitignore') ? readFileSync('.gitignore', 'utf8').split('\n') : [];
const base = readFileSync(process.env.GITIGNORE_TEMPLATE, 'utf8').split('\n');
writeFileSync('.gitignore', `${[...new Set([...current, ...base])].filter(Boolean).join('\n')}\n`);
NODE

echo "▸ 5/6 · Inventario inicial"
npm run design:regen >/dev/null
npm run verify:kit >/dev/null

echo "▸ 6/6 · Git"
git init -q -b main 2>/dev/null || true

cat <<TXT

✓ Proyecto «$PROJECT_NAME» creado en $DEST_DIR

Siguiente:
1. Completa docs/ESPECIFICACION_MAESTRA.md.
2. Declara en design/golden.config.json tokens, contenido, escenas y mapa de specs que realmente existan.
3. Ejecuta npm run design:regen.
4. Sustituye todos los marcadores ⚠️ de la constitución y de la spec 000.
5. El plan de la spec 000 elige stack e instancia Docker y las puertas de CI correspondientes.

No ejecutes /servilleta hasta que FUENTES.md y la constitución estén adaptados.
TXT
