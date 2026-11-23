import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useAppSelector } from '../app/hooks';
import { selectThemeMode } from '../features/settings/themeSlice';
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
 * Returns the active theme. The persisted toggle wins; until the user picks a
 * side ("system") it follows the phone's colour scheme.
 */
export const useTheme = (): Theme => {
  const mode = useAppSelector(selectThemeMode);
  const systemIsDark = useColorScheme() === 'dark';
  const isDark = mode === 'system' ? systemIsDark : mode === 'dark';
  return useMemo(() => buildTheme(isDark), [isDark]);
};

export { lightColors, darkColors, spacing, radius, typography };
export type { ColorPalette, TypographyVariant };
