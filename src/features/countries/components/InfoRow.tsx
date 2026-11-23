import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing, useTheme } from '../../../theme';
import { AppText } from '../../../shared/components/AppText';

type Props = { label: string; value: string };

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: { flexShrink: 0, marginRight: spacing.lg },
  value: { flex: 1, textAlign: 'right' },
});

export const InfoRow = ({ label, value }: Props) => {
  const theme = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={[styles.row, { borderBottomColor: theme.colors.border }]}
    >
      <AppText muted style={styles.label}>
        {label}
      </AppText>
      <AppText variant="label" style={styles.value}>
        {value}
      </AppText>
    </View>
  );
};
