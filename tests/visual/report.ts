import Ajv2020 from 'ajv/dist/2020.js';
import { readFile } from 'node:fs/promises';

export const contractChecksFor = (facts: Record<string, boolean>, externalRequests: string[]) => ({
  tokens: facts['theme'] ? 'pass' : 'fail',
  fonts: facts['fonts'] ? 'pass' : 'fail',
  fontWeights: facts['fontWeights'] ? 'pass' : 'fail',
  radii: facts['radii'] ? 'pass' : 'fail',
  borders: facts['borders'] ? 'pass' : 'fail',
  shadows: facts['shadows'] ? 'pass' : 'fail',
  assets: facts['assets'] && externalRequests.length === 0 ? 'pass' : 'fail',
});

export const validateVisualReport = async (report: unknown, schemaPath: string) => {
  const schema = JSON.parse(await readFile(schemaPath, 'utf8'));
  const validate = new Ajv2020({ strict: false, formats: { 'date-time': true } }).compile(schema);
  if (!validate(report))
    throw new Error(
      `El informe visual no satisface el esquema: ${validate.errors
        ?.map((error) => `${error.instancePath} ${error.message}`)
        .join(', ')}`,
    );
};
