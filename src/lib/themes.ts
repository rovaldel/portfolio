import type { ThemeId } from '../content/site';

export interface Theme {
  id: ThemeId;
  label: string;
  swatch: string;
  order: number;
  isDefault: boolean;
  tokens: Record<string, string>;
}

export const themes: Theme[] = [
  {
    id: 'light',
    order: 1,
    isDefault: false,
    label: 'Claro',
    swatch: '#ebe9e4',
    tokens: {
      bg: '#ebe9e4',
      surface: '#ffffff',
      'surface-2': '#f3f1ec',
      line: '#dcdad4',
      text: '#1b1b1d',
      muted: '#6a6a6e',
      pill: '#ffffff',
      fill: '#1b1b1d',
      'fill-text': '#ffffff',
      blob: '#ffffff',
      shadow: 'rgba(0,0,0,.12)',
    },
  },
  {
    id: 'dark',
    order: 2,
    isDefault: false,
    label: 'Oscuro',
    swatch: '#1b1b1d',
    tokens: {
      bg: '#1b1b1d',
      surface: '#27272a',
      'surface-2': '#323236',
      line: '#3a3a3e',
      text: '#f4f3f0',
      muted: '#9a9a9f',
      pill: '#27272a',
      fill: '#f4f3f0',
      'fill-text': '#1b1b1d',
      blob: '#ffffff',
      shadow: 'rgba(0,0,0,.4)',
    },
  },
  {
    id: 'cobalto',
    order: 3,
    isDefault: false,
    label: 'Cobalto',
    swatch: '#0f1830',
    tokens: {
      bg: '#0f1830',
      surface: '#182238',
      'surface-2': '#212d48',
      line: '#2d3a58',
      text: '#eef2fb',
      muted: '#92a1c2',
      pill: '#182238',
      fill: '#f0a830',
      'fill-text': '#1a1206',
      blob: '#f0a830',
      shadow: 'rgba(0,0,0,.45)',
    },
  },
  {
    id: 'rioja',
    order: 4,
    isDefault: true,
    label: 'Rioja',
    swatch: '#fff9f0',
    tokens: {
      bg: '#f3ece1',
      surface: '#fff9f0',
      'surface-2': '#efe3d2',
      line: '#e0d1bb',
      text: '#2a1a1b',
      muted: '#8a6f62',
      pill: '#fff9f0',
      fill: '#8e2c3b',
      'fill-text': '#fff9f0',
      blob: '#d99a86',
      shadow: 'rgba(90,40,30,.15)',
    },
  },
  {
    id: 'bosque',
    order: 5,
    isDefault: false,
    label: 'Bosque',
    swatch: '#0f1b16',
    tokens: {
      bg: '#0f1b16',
      surface: '#16241d',
      'surface-2': '#1f3128',
      line: '#2c4538',
      text: '#eaf2ec',
      muted: '#92ab9d',
      pill: '#16241d',
      fill: '#7cc69a',
      'fill-text': '#0c1611',
      blob: '#7cc69a',
      shadow: 'rgba(0,0,0,.45)',
    },
  },
];

export const defaultTheme: ThemeId = 'rioja';
export const themeIds = themes.map((theme) => theme.id);
export const isThemeId = (value: string | null): value is ThemeId => themeIds.includes(value as ThemeId);
