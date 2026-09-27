import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { readFile, writeFile } from 'node:fs/promises';

export interface PixelRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

const excludedPixelCount = (regions: PixelRegion[], width: number, height: number) => {
  const excluded = new Uint8Array(width * height);
  for (const region of regions) {
    const left = Math.max(0, Math.floor(region.x));
    const top = Math.max(0, Math.floor(region.y));
    const right = Math.min(width, Math.ceil(region.x + region.width));
    const bottom = Math.min(height, Math.ceil(region.y + region.height));
    for (let y = top; y < bottom; y += 1) for (let x = left; x < right; x += 1) excluded[y * width + x] = 1;
  }
  return excluded;
};

export const comparePngFiles = async (
  goldenPath: string,
  candidatePath: string,
  diffPath: string,
  excludedRegions: PixelRegion[] = [],
) => {
  const golden = PNG.sync.read(await readFile(goldenPath));
  const candidate = PNG.sync.read(await readFile(candidatePath));
  const sameSize = golden.width === candidate.width && golden.height === candidate.height;
  const totalPixels = golden.width * golden.height;
  const excluded = excludedPixelCount(excludedRegions, golden.width, golden.height);
  const excludedPixels = excluded.reduce((count, value) => count + value, 0);
  const comparedPixels = Math.max(1, totalPixels - excludedPixels);
  const diff = new PNG({ width: golden.width, height: golden.height });
  let changedPixels = 0;

  if (sameSize) {
    const goldenData = Buffer.from(golden.data);
    const candidateData = Buffer.from(candidate.data);
    for (let pixel = 0; pixel < excluded.length; pixel += 1) {
      if (!excluded[pixel]) continue;
      const byte = pixel * 4;
      goldenData.fill(0, byte, byte + 4);
      candidateData.fill(0, byte, byte + 4);
    }
    const rawChanged = pixelmatch(goldenData, candidateData, diff.data, golden.width, golden.height, {
      threshold: 0.1,
    });
    changedPixels = rawChanged;
  } else {
    changedPixels = comparedPixels;
    diff.data.fill(255);
  }

  await writeFile(diffPath, PNG.sync.write(diff));
  return {
    totalPixels,
    comparedPixels,
    excludedPixels,
    changedPixels,
    changedPixelRatio: changedPixels / comparedPixels,
    pixelThreshold: 0.1,
  };
};

export const compareBoxes = (
  golden: Record<string, number>,
  candidate: Record<string, number>,
  fields: readonly string[] = ['x', 'y', 'width', 'height'],
) => {
  if (fields.length === 0) throw new Error('Un anclaje necesita al menos una medida explícita.');
  const deltas = Object.fromEntries(
    fields.map((field) => [field, Math.abs(Number(golden[field]) - Number(candidate[field]))]),
  );
  const maximumDeltaCssPx = Math.max(...Object.values(deltas));
  return { fields, deltas, maximumDeltaCssPx, status: maximumDeltaCssPx <= 2 ? 'pass' : 'fail' };
};
