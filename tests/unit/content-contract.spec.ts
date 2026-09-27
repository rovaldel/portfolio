import { describe, expect, it } from 'vitest';
import {
  education,
  experiences,
  legalDocuments,
  projects,
  services,
  siteProfile,
  skillGroups,
} from '../../src/content/site';
import { validatePublicContent, validatePublicMetadata } from '../../src/lib/content';
import { surfaces } from '../../src/lib/routes';

describe('contrato de contenido público', () => {
  it('valida los invariantes de la fuente única', () => expect(validatePublicContent).not.toThrow());
  it('valida metadatos e indexabilidad de las rutas públicas', () =>
    expect(validatePublicMetadata).not.toThrow());
  it('mantiene los catálogos cerrados y datos aprobados', () => {
    expect(surfaces).toHaveLength(15);
    expect(projects.map((project) => project.slug)).toEqual(['leadia', 'nami']);
    expect(services).toHaveLength(6);
    expect(education).toHaveLength(6);
    expect(skillGroups.flatMap((group) => group.skills.map((skill) => skill.name)).join('')).not.toMatch(
      /★|⭐/,
    );
    expect(experiences.find((item) => item.id === 'cidatum')?.start).toBe('2025-12');
    expect(experiences.find((item) => item.id === 'talenttools')?.end).toBe('2025-12');
    expect(siteProfile.channels.email.value).toBe('rodrigo.valdelvira@gmail.com');
    expect(
      legalDocuments.every(
        (document) =>
          document.status === 'approved' && Boolean(document.reviewedAt) && document.sections.length > 0,
      ),
    ).toBe(true);
    expect(
      surfaces.every((surface) => surface.canonicalPath === surface.path && surface.contentRefs.length > 0),
    ).toBe(true);
    expect(experiences.find((item) => item.id === 'cidatum')).toMatchObject({ current: true, order: 1 });
    expect(education.map((item) => item.order)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(siteProfile.channels.phone.displayValue).toBe('+34 653 850 674');
    expect(siteProfile.portrait.sources.map((source) => source.type)).toEqual(['image/avif', 'image/webp']);
  });
});
