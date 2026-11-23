export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

/** Feather icon sizes. */
export const iconSize = {
  sm: 14,
  md: 20,
  lg: 24,
  xl: 40,
} as const;

/** Minimum touch target: 48dp (Android) / 44pt (iOS). Use the larger. */
export const MIN_TOUCH_SIZE = 48;
