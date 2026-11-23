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

// Indigo / violet palette, matching the design mock-ups. Flat colours only.
export const lightColors: ColorPalette = {
  background: '#F4F3FF',
  surface: '#FFFFFF',
  surfaceAlt: '#ECEAFF',
  border: '#D9D6F2',
  text: '#16133A',
  textMuted: '#5E5B85',
  textOnPrimary: '#FFFFFF',
  primary: '#5B4BF5',
  primaryMuted: '#E1DEFF',
  danger: '#D93025',
  success: '#1E8E3E',
  favourite: '#E8384F',
  overlay: 'rgba(10, 8, 40, 0.45)',
};

export const darkColors: ColorPalette = {
  background: '#0C0B26',
  surface: '#16153B',
  surfaceAlt: '#201F4D',
  border: '#2E2D63',
  text: '#F4F3FF',
  textMuted: '#A3A1CC',
  textOnPrimary: '#FFFFFF',
  primary: '#6F63FF',
  primaryMuted: '#2B2977',
  danger: '#FF6B7A',
  success: '#4CC774',
  favourite: '#FF4D6D',
  overlay: 'rgba(5, 4, 25, 0.7)',
};
