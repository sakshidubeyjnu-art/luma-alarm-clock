import type { ThemeId } from './types';

export interface ThemeDef {
  id: ThemeId;
  name: string;
  subtitle: string;
  premium: boolean;
  dark: boolean;
  accent: string;
  textOn: string;
  swatch: string;
  swatch2: string;
}

export const themes: ThemeDef[] = [
  { id: 'sf-fog', name: 'SF Fog', subtitle: 'Soft San Francisco fog', premium: false, dark: false, accent: '#6b7a85', textOn: '#1a1a1f', swatch: '#dfe3e8', swatch2: '#c5ccd4' },
  { id: 'golden-gate', name: 'Golden Gate Morning', subtitle: 'Warm sunrise over the bay', premium: false, dark: false, accent: '#d77f38', textOn: '#3a2a1a', swatch: '#f4d2b5', swatch2: '#e2995a' },
  { id: 'pacific', name: 'Pacific', subtitle: 'Calm ocean', premium: false, dark: false, accent: '#367490', textOn: '#1a2a30', swatch: '#b5d6e1', swatch2: '#5193b0' },
  { id: 'clouds', name: 'Clouds', subtitle: 'Soft clouds', premium: false, dark: false, accent: '#8a9aa8', textOn: '#1a1a1f', swatch: '#eef2f5', swatch2: '#cdd6df' },
  { id: 'forest', name: 'Forest', subtitle: 'Peaceful forest', premium: false, dark: false, accent: '#5d7a61', textOn: '#1a2a1a', swatch: '#c7d6c9', swatch2: '#7e9a82' },
  { id: 'blush', name: 'Blush', subtitle: 'Subtle pink', premium: false, dark: false, accent: '#c66f58', textOn: '#3a1a1a', swatch: '#f7e8e4', swatch2: '#e4b3a4' },
  { id: 'night', name: 'Night', subtitle: 'Deep navy sky', premium: false, dark: true, accent: '#6d758f', textOn: '#e7e9ee', swatch: '#1c2133', swatch2: '#333a55' },
  { id: 'cozy-morning', name: 'Cozy Morning', subtitle: 'Warm bedroom sunlight', premium: false, dark: false, accent: '#cda33f', textOn: '#3a2a1a', swatch: '#fae9d9', swatch2: '#ecb585' },
  { id: 'paris-coffee', name: 'Paris Coffee Morning', subtitle: 'A slow morning in Paris', premium: false, dark: false, accent: '#a8825a', textOn: '#2a1f1a', swatch: '#e8d9c9', swatch2: '#c9a886' },
  { id: 'malibu', name: 'Malibu Morning', subtitle: 'Coastal golden hour', premium: true, dark: false, accent: '#e2995a', textOn: '#3a2a1a', swatch: '#f4d2b5', swatch2: '#85b8cc' },
  { id: 'rainy-window', name: 'Rainy Window', subtitle: 'Soft rain against glass', premium: true, dark: true, accent: '#5193b0', textOn: '#dfe3e8', swatch: '#2a3540', swatch2: '#4a5170' },
  { id: 'japanese-garden', name: 'Japanese Garden', subtitle: 'Quiet greenery', premium: true, dark: false, accent: '#5d7a61', textOn: '#1a2a1a', swatch: '#c7d6c9', swatch2: '#a3bba6' },
  { id: 'alpine', name: 'Alpine Morning', subtitle: 'Mountain dawn', premium: true, dark: false, accent: '#5193b0', textOn: '#1a2a30', swatch: '#dfe8ee', swatch2: '#9aa0b2' },
  { id: 'botanical', name: 'Botanical', subtitle: 'Lush stillness', premium: true, dark: false, accent: '#48604c', textOn: '#1a2a1a', swatch: '#e3ebe4', swatch2: '#7e9a82' },
  { id: 'midnight-pacific', name: 'Midnight Pacific', subtitle: 'Deep ocean night', premium: true, dark: true, accent: '#367490', textOn: '#dfe3e8', swatch: '#141826', swatch2: '#264c61' },
];

export function getTheme(id: ThemeId): ThemeDef {
  return themes.find((t) => t.id === id) ?? themes[0];
}
