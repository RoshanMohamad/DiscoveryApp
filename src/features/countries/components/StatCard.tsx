import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { AppText } from '../../../shared/components/AppText';
import type { IconName } from '../../../shared/components/icons';
import { useTheme, type Theme } from '../../../theme';

type Props = { icon: IconName; value: string; label: string };

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      flex: 1,
      alignItems: 'center',
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    value: { marginTop: theme.spacing.sm, textAlign: 'center' },
  });

/** One of the three headline numbers under the country title. */
export const StatCard = ({ icon, value, label }: Props) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View
      style={styles.card}
      accessible
      accessibilityLabel={`${label}: ${value}`}
    >
      <Feather
        name={icon}
        size={theme.iconSize.lg}
        color={theme.colors.primary}
      />
      <AppText variant="label" style={styles.value} numberOfLines={2}>
        {value}
      </AppText>
      <AppText variant="caption" muted>
        {label}
      </AppText>
    </View>
  );
};
