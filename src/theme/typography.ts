import type { TextStyle } from 'react-native';

type TypeStyle = Pick<TextStyle, 'fontSize' | 'lineHeight' | 'fontWeight'>;

export const typography = {
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
  label: { fontSize: 14, lineHeight: 18, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
} as const satisfies Record<string, TypeStyle>;

export type TypographyVariant = keyof typeof typography;
