import { getContent } from '../content';
import { getLocale, getUi, pathFor } from './i18n';
import type { RouteId } from './i18n';

/** Everything a server component needs to render itself in the language of the current URL. */
export const useLocale = (url: URL) => {
  const locale = getLocale(url);
  const content = getContent(locale);
  return {
    locale,
    t: getUi(locale),
    c: content,
    path: (id: RouteId) => pathFor(id, locale),
    /** The chip label of a portfolio section, e.g. "Experiencia" / "Experience". */
    actionLabel: (id: string) => content.navigationActions.find((action) => action.id === id)?.label ?? id,
  };
};
