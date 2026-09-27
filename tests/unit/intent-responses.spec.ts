import { describe, expect, it } from 'vitest';
import {
  education,
  experiences,
  navigationActions,
  projects,
  services,
  siteProfile,
} from '../../src/content/site';
import { intents } from '../../src/lib/intents';
import { surfaces } from '../../src/lib/routes';

const byId = (id: string) => {
  const intent = intents.find((item) => item.id === id);
  if (!intent) throw new Error('No existe la intención ' + id);
  return intent;
};

describe('respuestas aprobadas de las intenciones', () => {
  it('usa la respuesta aprobada de las acciones de navegación', () => {
    for (const id of ['about', 'skills', 'services', 'projects', 'contact']) {
      const action = navigationActions.find((item) => item.id === id);
      expect(byId(id).response).toBe(action?.response);
    }
  });

  it('conserva el contenido publicado de cada destino específico', () => {
    expect(byId('leadia').response).toBe(projects.find((project) => project.slug === 'leadia')?.description);
    expect(byId('nami').response).toContain(projects.find((project) => project.slug === 'nami')?.description);
    expect(byId('talenttools-inclunia').response).toBe(
      experiences.find((experience) => experience.id === 'talenttools')?.highlights.join(' '),
    );
    expect(byId('experience-cv').response).toBe(siteProfile.totalExperienceLabel);
    expect(byId('languages').response).toContain(siteProfile.languages.join(', '));
    expect(byId('interests').response).toContain(siteProfile.interests.join(', '));
    expect(byId('education').response).toBe(
      education
        .map((record) => record.title + ' (' + record.institution + ', ' + record.years + ')')
        .join('; '),
    );
    expect(byId('agent-frameworks').response).toContain('en preparación');
    expect(byId('agent-frameworks').destination).toBe('/proyectos');
    expect(byId('services').contentRefs).toContain('services');
    expect(services).toHaveLength(6);
  });

  it('mantiene un destino canónico para cada respuesta', () => {
    const canonicalPaths = new Set(surfaces.map((surface) => surface.canonicalPath));
    for (const intent of intents) expect(canonicalPaths.has(intent.destination)).toBe(true);
  });
});
