import { describe, expect, it } from 'vitest';
import { intents, approvedIntentContentRefs, approvedIntentProvenance } from '../../src/lib/intents';
import { surfaces } from '../../src/lib/routes';

describe('catálogo local de intenciones', () => {
  it('tiene identificadores únicos y contenido aprobado con procedencia', () => {
    expect(new Set(intents.map((intent) => intent.id)).size).toBe(intents.length);
    expect(intents.length).toBeGreaterThan(0);
    for (const intent of intents) {
      expect(intent.phrases.length).toBeGreaterThan(0);
      expect(intent.response.trim()).not.toBe('');
      expect(intent.contentRefs.length).toBeGreaterThan(0);
      expect(intent.contentRefs.every((ref) => approvedIntentContentRefs.has(ref))).toBe(true);
      expect(intent.provenance.length).toBeGreaterThan(0);
      expect(intent.provenance.every((ref) => approvedIntentProvenance.has(ref))).toBe(true);
    }
  });

  it('envía cada intención a una ruta canónica existente', () => {
    const canonicalPaths = new Set(surfaces.map((surface) => surface.canonicalPath));
    for (const intent of intents) {
      expect(intent.destination.startsWith('/')).toBe(true);
      expect(canonicalPaths.has(intent.destination)).toBe(true);
    }
  });

  it('cubre las categorías aprobadas del alcance', () => {
    expect(intents.map((intent) => intent.id)).toEqual(
      expect.arrayContaining([
        'about',
        'skills',
        'services',
        'projects',
        'leadia',
        'nami',
        'experience-cv',
        'cidatum',
        'talenttools-inclunia',
        'education',
        'languages',
        'interests',
        'contact',
        'agent-frameworks',
      ]),
    );
  });
});
