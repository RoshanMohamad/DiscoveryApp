import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import LinearGradient from 'react-native-linear-gradient';
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
  /** Custom leading element (e.g. a brand logo) instead of a Feather icon. */
  leading?: React.ReactNode;
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
    // Primary buttons draw a gradient behind the label (see below).
    primary: { overflow: 'hidden' },
    gradient: StyleSheet.absoluteFill,
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
  leading,
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
      {variant === 'primary' ? (
        <LinearGradient
          colors={[...theme.gradients.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
          pointerEvents="none"
        />
      ) : null}
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {leading ?? null}
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
