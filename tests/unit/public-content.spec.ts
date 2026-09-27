import { expect, it } from 'vitest';
import { projects, services } from '../../src/content/site';

it('expone solo Leadia y Nami y seis servicios con contacto', () => {
  expect(projects).toHaveLength(2);
  expect(projects[0]?.externalUrl).toBe('https://leadia.es');
  expect(projects[1]?.externalUrl).toBeNull();
  expect(services.every((service) => service.description && service.slug)).toBe(true);
});
