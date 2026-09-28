import { cp, mkdir, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve('astro/package.json'))('sharp');

const source = 'assets';
const target = 'public';
const copy = async (from, to) => {
  await mkdir(join(target, to), { recursive: true });
  await cp(join(source, from), join(target, to, from.split('/').at(-1)));
};
const copyAs = async (from, to) => {
  await mkdir(join(target, to.split('/').slice(0, -1).join('/')), { recursive: true });
  await cp(join(source, from), join(target, to));
};
// The published portrait must keep an opaque white shirt and the original blue
// tie: portrait.png has a transparent shirt, portrait-home-white-shirt.png lost the tie.
await copyAs('portrait-white-shirt-tie.png', 'images/rodrigo-valdelvira.png');
await copy('leadia.webp', 'images');
await copy('nami-cover.png', 'images');
for (const { sourceFile, targetName } of [
  { sourceFile: 'portrait-white-shirt-tie.png', targetName: 'rodrigo-valdelvira' },
  { sourceFile: 'leadia.webp', targetName: 'leadia' },
  { sourceFile: 'nami-cover.png', targetName: 'nami-cover' },
]) {
  const input = join(source, sourceFile);
  await sharp(input)
    .rotate()
    .avif({ effort: 4 })
    .toFile(join(target, 'images', `${targetName}.avif`));
  if (!sourceFile.endsWith('.webp')) {
    await sharp(input)
      .rotate()
      .webp({ effort: 4 })
      .toFile(join(target, 'images', `${targetName}.webp`));
  }
}
for (const name of await readdir(join(source, 'fonts'))) await copy(`fonts/${name}`, 'fonts');
const cv = await (await import('node:fs/promises')).readFile(join(source, 'Rodrigo-Valdelvira-CV.pdf'));
if (
  createHash('sha256').update(cv).digest('hex') !==
  '889781068935b4a4838422a61709e2a3449efe74536060474ee0f0707f9cd7b4'
)
  throw new Error('El CV no coincide con la fuente aprobada.');
for (const file of [
  'images/rodrigo-valdelvira.png',
  'images/rodrigo-valdelvira.avif',
  'images/rodrigo-valdelvira.webp',
  'images/leadia.avif',
  'images/leadia.webp',
  'images/nami-cover.avif',
  'images/nami-cover.webp',
  'images/nami-cover.png',
])
  if (!(await stat(join(target, file))).isFile()) throw new Error(`Activo ausente: ${file}`);
