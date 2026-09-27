import { expect, it } from 'vitest';
import { getContactSubject } from '../../src/lib/contact';

it('solo acepta asuntos permitidos', () => {
  expect(getContactSubject('agentes-y-chatbots-ia')).toBe('Consulta sobre: Agentes y chatbots IA');
  expect(getContactSubject('invalido')).toBeNull();
  expect(getContactSubject('x'.repeat(81))).toBeNull();
});
