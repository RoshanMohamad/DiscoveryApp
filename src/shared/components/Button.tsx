import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useTheme, type Theme } from '../../theme';
import { AppText } from './AppText';
import type { IconName } from './icons';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: IconName;
  iconPosition?: 'left' | 'right';
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      minHeight: theme.minTouchSize,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    primary: { backgroundColor: theme.colors.primary },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    danger: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.danger,
    },
    reverse: { flexDirection: 'row-reverse' },
    disabled: { opacity: 0.5 },
    pressed: { opacity: 0.8 },
  });

export const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  icon,
  iconPosition = 'left',
}: Props) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const isDisabled = disabled || loading;
  const textColor = {
    primary: theme.colors.textOnPrimary,
    secondary: theme.colors.text,
    danger: theme.colors.danger,
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        icon && iconPosition === 'right' && styles.reverse,
        isDisabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon ? (
            <Feather name={icon} size={theme.iconSize.md} color={textColor} />
          ) : null}
          <AppText variant="label" style={{ color: textColor }}>
            {title}
          </AppText>
        </>
      )}
    </Pressable>
  );
};
