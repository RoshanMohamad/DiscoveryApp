import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, type ColorPalette } from './colors';
import { MIN_TOUCH_SIZE, radius, spacing } from './spacing';
import { typography, type TypographyVariant } from './typography';

export type Theme = {
  isDark: boolean;
  colors: ColorPalette;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  minTouchSize: number;
};

export const buildTheme = (isDark: boolean): Theme => ({
  isDark,
  colors: isDark ? darkColors : lightColors,
  spacing,
  radius,
  typography,
  minTouchSize: MIN_TOUCH_SIZE,
});

/**
 * Returns the active theme. For now it follows the system colour scheme;
 * the persisted dark-mode toggle (themeSlice) will override this later.
 */
export const useTheme = (): Theme => {
  const isDark = useColorScheme() === 'dark';
  return useMemo(() => buildTheme(isDark), [isDark]);
};

export { lightColors, darkColors, spacing, radius, typography };
export type { ColorPalette, TypographyVariant };
