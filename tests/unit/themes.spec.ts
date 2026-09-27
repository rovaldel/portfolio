import { expect, it } from 'vitest';
import { defaultTheme, isThemeId, themes } from '../../src/lib/themes';

it('tiene cinco temas cerrados y Rioja por defecto', () => {
  expect(themes.map((theme) => theme.label)).toEqual(['Claro', 'Oscuro', 'Cobalto', 'Rioja', 'Bosque']);
  expect(defaultTheme).toBe('rioja');
  expect(themes.filter((theme) => theme.isDefault).map((theme) => theme.id)).toEqual(['rioja']);
  expect(themes.map((theme) => theme.order)).toEqual([1, 2, 3, 4, 5]);
  expect(isThemeId('bosque')).toBe(true);
  expect(isThemeId('otro')).toBe(false);
});
