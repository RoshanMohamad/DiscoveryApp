import React from 'react';
import { Text, type TextProps } from 'react-native';
import { useTheme, type TypographyVariant } from '../../theme';

type Props = TextProps & {
  variant?: TypographyVariant;
  muted?: boolean;
};

export const AppText = ({
  variant = 'body',
  muted = false,
  style,
  ...rest
}: Props) => {
  const theme = useTheme();
  return (
    <Text
      {...rest}
      style={[
        theme.typography[variant],
        { color: muted ? theme.colors.textMuted : theme.colors.text },
        style,
      ]}
    />
  );
};
