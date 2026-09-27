import { expect, test } from '@playwright/test';
import config from '../../design/golden.config.json' with { type: 'json' };
import { allowedContractScenes, validateVisualExceptions, visualExceptions } from './exceptions';
import { compareBoxes } from './compare';

test('declara las 19 escenas una sola vez y condiciones reproducibles', () => {
  expect(config.captures.scenes).toHaveLength(19);
  expect(new Set(config.captures.scenes.map((scene) => scene.name)).size).toBe(19);
  expect(config.captures.scenes.every((scene) => scene.precondition.length > 0)).toBe(true);
});

test('solo Habilidades y Artículo LangGraph usan excepciones contractuales completas', () => {
  const contractScenes = config.captures.comparison.contractScenes;
  const declared = Object.keys(contractScenes) as (keyof typeof contractScenes)[];
  declared.sort();
  expect(declared).toEqual([...allowedContractScenes].sort());
  expect(() => validateVisualExceptions()).not.toThrow();

  for (const sceneName of declared) {
    const contract = contractScenes[sceneName];
    const exception = visualExceptions.find((entry) => entry.scene === sceneName);
    expect(contract.rationale.length).toBeGreaterThan(20);
    expect(contract.anchors.length).toBeGreaterThanOrEqual(3);
    expect(exception?.mode).toBe('contract');
    expect(exception?.anchors.map((anchor) => anchor.selector)).not.toContain('body');
    expect(exception?.anchors.map((anchor) => anchor.selector)).not.toContain('html');
    expect(
      exception?.excludedRegions.every((region) => region.description.length > 15 && region.boxes.length > 0),
    ).toBe(true);
    expect(exception?.beforeEvidence).toContain('design/screenshots/portfolio/');
    expect(exception?.afterEvidence).toContain('artifacts/spec-000/scenes/');
  }
});

test('anclajes comparan componentes y solo las medidas declaradas', () => {
  expect(compareBoxes({ x: 20, y: 40 }, { x: 21, y: 200, width: 400, height: 500 }, ['x'])).toMatchObject({
    maximumDeltaCssPx: 1,
    status: 'pass',
  });
  expect(compareBoxes({ x: 20, y: 40 }, { x: 25, y: 40, width: 400, height: 500 }, ['x', 'y']).status).toBe(
    'fail',
  );
  expect(() => compareBoxes({ x: 0 }, { x: 0 }, [])).toThrow();
});
