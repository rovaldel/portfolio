import type { Locale } from './i18n';
import { getIntents, type PortfolioIntent } from './intents';

export type IntentDecision =
  | { state: 'recognized'; intent: PortfolioIntent }
  | { state: 'unknown' }
  | { state: 'ambiguous'; candidates: PortfolioIntent[] };

export const normalizeQuery = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-ES')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

export const resolveIntent = (query: string, locale: Locale = 'es'): IntentDecision => {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) return { state: 'unknown' };

  const candidates = getIntents(locale).filter((intent) =>
    intent.phrases.some((phrase) => {
      const normalizedPhrase = normalizeQuery(phrase);
      return (' ' + normalizedQuery + ' ').includes(' ' + normalizedPhrase + ' ');
    }),
  );

  if (candidates.length === 0) return { state: 'unknown' };
  if (candidates.length > 1) return { state: 'ambiguous', candidates };
  return { state: 'recognized', intent: candidates[0]! };
};
