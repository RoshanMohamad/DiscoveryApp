import React, { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useTheme, type Theme } from '../../theme';
import type { IconName } from './icons';

type Props = {
  icon: IconName;
  label: string;
  onPress: () => void;
  /** `overlay` sits on photos (dark translucent disc); `plain` has no background. */
  tone?: 'overlay' | 'plain';
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      width: theme.minTouchSize,
      height: theme.minTouchSize,
      borderRadius: theme.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    overlay: { backgroundColor: theme.colors.overlay },
  });

/** Round icon-only button with a 48dp touch target (back, share, close...). */
export const CircleButton = ({
  icon,
  label,
  onPress,
  tone = 'overlay',
}: Props) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.base, tone === 'overlay' && styles.overlay]}
    >
      <Feather name={icon} size={theme.iconSize.lg} color={theme.colors.text} />
    </Pressable>
  );
};
