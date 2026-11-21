import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useTheme, type Theme } from '../../theme';
import { AppText } from './AppText';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      minHeight: theme.minTouchSize,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: { backgroundColor: theme.colors.primary },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    disabled: { opacity: 0.5 },
    pressed: { opacity: 0.8 },
  });

export const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: Props) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const isDisabled = disabled || loading;
  const textColor =
    variant === 'primary' ? theme.colors.textOnPrimary : theme.colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <AppText variant="label" style={{ color: textColor }}>
          {title}
        </AppText>
      )}
    </Pressable>
  );
};
