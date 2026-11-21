export type ColorPalette = {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  textOnPrimary: string;
  primary: string;
  primaryMuted: string;
  danger: string;
  success: string;
  favourite: string;
  overlay: string;
};

export const lightColors: ColorPalette = {
  background: '#F6F7FB',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF0F6',
  border: '#DDE1EC',
  text: '#12151F',
  textMuted: '#5B6275',
  textOnPrimary: '#FFFFFF',
  primary: '#2F6BFF',
  primaryMuted: '#DCE6FF',
  danger: '#D93025',
  success: '#1E8E3E',
  favourite: '#E8384F',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

export const darkColors: ColorPalette = {
  background: '#0E1118',
  surface: '#171B26',
  surfaceAlt: '#212637',
  border: '#2E3447',
  text: '#F2F4FA',
  textMuted: '#9AA1B5',
  textOnPrimary: '#FFFFFF',
  primary: '#5B8CFF',
  primaryMuted: '#1F2C52',
  danger: '#FF6B61',
  success: '#4CC774',
  favourite: '#FF5C75',
  overlay: 'rgba(0, 0, 0, 0.6)',
};
