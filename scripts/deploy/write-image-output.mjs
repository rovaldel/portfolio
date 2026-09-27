import { appendFileSync, readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const [metadataPath, imageName, outputPath] = process.argv.slice(2);
assert.ok(
  metadataPath && imageName && outputPath,
  'Usage: write-image-output.mjs METADATA IMAGE_NAME GITHUB_OUTPUT',
);
assert.match(imageName, /^ghcr\.io\/[a-z0-9._/-]+$/);
const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
const digest = metadata['containerimage.digest'];
assert.match(digest ?? '', /^sha256:[a-f0-9]{64}$/);
appendFileSync(outputPath, 'image_ref=' + imageName + '@' + digest + '\n');
