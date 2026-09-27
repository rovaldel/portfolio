import { describe, expect, it } from 'vitest';
import { normalizeQuery, resolveIntent } from '../../src/lib/intent-matching';

describe('normalización y resolución de intenciones', () => {
  it('ignora mayúsculas, acentos y espacios repetidos', () => {
    expect(normalizeQuery('  ¿QUÉ   tecnologías usa Rodrigo?  ')).toBe('que tecnologias usa rodrigo');
  });

  it('reconoce una intención publicada tras normalizar la consulta', () => {
    const decision = resolveIntent('  QUIÉN   ES RODRIGO  ');
    expect(decision.state).toBe('recognized');
    if (decision.state === 'recognized') expect(decision.intent.id).toBe('about');
  });

  it('devuelve estado desconocido sin elegir una respuesta', () => {
    expect(resolveIntent('consulta sin relación con el portfolio')).toEqual({ state: 'unknown' });
  });

  it('pide aclaración cuando aparecen destinos de varias intenciones', () => {
    const decision = resolveIntent('¿Qué me cuentas de Leadia y Nami?');
    expect(decision.state).toBe('ambiguous');
    if (decision.state === 'ambiguous') {
      expect(decision.candidates.map((intent) => intent.id)).toEqual(['leadia', 'nami']);
    }
  });
});
