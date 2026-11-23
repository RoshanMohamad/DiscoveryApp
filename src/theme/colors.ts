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
  /** Frosted-glass panel fill (translucent, so the gradient behind shows through). */
  glass: string;
  /** Thin light edge that makes a glass panel read as glass. */
  glassBorder: string;
  /** Near-opaque glass for bottom sheets and the tab bar. */
  sheet: string;
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
  glass: 'rgba(255, 255, 255, 0.72)',
  glassBorder: 'rgba(91, 75, 245, 0.20)',
  sheet: 'rgba(255, 255, 255, 0.97)',
};

export const darkColors: ColorPalette = {
  background: '#080722',
  surface: '#1A1850',
  surfaceAlt: '#262470',
  border: '#3B3984',
  text: '#F4F3FF',
  textMuted: '#B2B0DD',
  textOnPrimary: '#FFFFFF',
  primary: '#6C5CFF',
  primaryMuted: '#34308F',
  danger: '#FF6B7A',
  success: '#4CC774',
  favourite: '#FF4D6D',
  overlay: 'rgba(5, 4, 25, 0.7)',
  glass: 'rgba(255, 255, 255, 0.07)',
  glassBorder: 'rgba(255, 255, 255, 0.16)',
  sheet: 'rgba(24, 21, 82, 0.97)',
};

/** "#RRGGBB" + alpha -> "rgba(r, g, b, a)". Used to fade images into the screen background. */
export const withAlpha = (hex: string, alpha: number): string => {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/** Brand gradient for primary buttons (two stops, left -> right). */
export const primaryGradient = {
  light: ['#7A6CFF', '#5B4BF5'],
  dark: ['#8576FF', '#5B4BF5'],
} as const;

/** Page background: a soft diagonal wash instead of one flat colour. */
export const screenGradient = {
  light: ['#F4F3FF', '#E7E3FF', '#F4F3FF'],
  dark: ['#080722', '#15124F', '#0B0A2C'],
} as const;
