import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useAppSelector } from '../app/hooks';
import { selectThemeMode } from '../features/settings/themeSlice';
import {
  darkColors,
  lightColors,
  primaryGradient,
  screenGradient,
  withAlpha,
  type ColorPalette,
} from './colors';
import { iconSize, MIN_TOUCH_SIZE, radius, spacing } from './spacing';
import { typography, type TypographyVariant } from './typography';

export type Theme = {
  isDark: boolean;
  colors: ColorPalette;
  spacing: typeof spacing;
  radius: typeof radius;
  iconSize: typeof iconSize;
  gradients: {
    /** Page background wash (top-left -> bottom-right). */
    screen: readonly [string, string, string];
    /** Left -> right fill for primary buttons. */
    primary: readonly [string, string];
    /** Transparent at the top, solid screen background at the bottom: fades photos into the page. */
    fadeToBackground: readonly [string, string];
    /** Light dark-tint over photos so text on top stays readable. */
    scrim: readonly [string, string];
  };
  typography: typeof typography;
  minTouchSize: number;
};

export const buildTheme = (isDark: boolean): Theme => {
  const colors = isDark ? darkColors : lightColors;
  return {
    isDark,
    colors,
    spacing,
    radius,
    iconSize,
    typography,
    minTouchSize: MIN_TOUCH_SIZE,
    gradients: {
      screen: isDark ? screenGradient.dark : screenGradient.light,
      primary: isDark ? primaryGradient.dark : primaryGradient.light,
      fadeToBackground: [withAlpha(colors.background, 0), colors.background],
      scrim: ['rgba(120, 80, 220, 0.30)', 'rgba(30, 20, 90, 0.55)'],
    },
  };
};

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

export { lightColors, darkColors, spacing, radius, iconSize, typography };
export type { ColorPalette, TypographyVariant };
