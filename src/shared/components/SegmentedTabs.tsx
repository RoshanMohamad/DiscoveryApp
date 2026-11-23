import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme, type Theme } from '../../theme';
import { AppText } from './AppText';

type Props<T extends string> = {
  tabs: readonly T[];
  selected: T;
  onSelect: (tab: T) => void;
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      padding: theme.spacing.xs,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    tab: {
      flex: 1,
      minHeight: theme.minTouchSize - theme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.sm,
    },
    active: { backgroundColor: theme.colors.primary },
  });

/** Pill-style segmented control (Overview / Facts / Media). */
export const SegmentedTabs = <T extends string>({
  tabs,
  selected,
  onSelect,
}: Props<T>) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {tabs.map(tab => {
        const isActive = tab === selected;
        return (
          <Pressable
            key={tab}
            accessibilityRole="tab"
            accessibilityLabel={tab}
            accessibilityState={{ selected: isActive }}
            onPress={() => onSelect(tab)}
            style={[styles.tab, isActive && styles.active]}
          >
            <AppText
              variant="label"
              style={{
                color: isActive
                  ? theme.colors.textOnPrimary
                  : theme.colors.textMuted,
              }}
            >
              {tab}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};
