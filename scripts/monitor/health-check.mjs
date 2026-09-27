import { appendFile } from 'node:fs/promises';

const endpoint = process.env.ALERT_HEALTH_URL ?? 'https://rodrigovaldelvira.com/api/salud';
const outputFile = process.env.GITHUB_OUTPUT;
if (!outputFile) throw new Error('GITHUB_OUTPUT is required');

let healthy = false;
try {
  const response = await fetch(endpoint, { signal: AbortSignal.timeout(15_000), redirect: 'manual' });
  const body = await response.text();
  healthy = response.status === 200 && body.trim() === '{"status":"ok"}';
} catch {
  healthy = false;
}

await appendFile(outputFile, 'healthy=' + healthy + '\n', { mode: 0o600 });
console.log(
  healthy ? 'La comprobación externa de salud ha pasado.' : 'La comprobación externa de salud ha fallado.',
);
