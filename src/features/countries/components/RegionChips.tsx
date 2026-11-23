import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useTheme, type Theme } from '../../../theme';
import { AppText } from '../../../shared/components/AppText';
import { ALL_REGIONS, iconForRegion } from '../regionIcons';

type Props = {
  regions: string[];
  selected: string;
  onSelect: (region: string) => void;
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    // RN ScrollViews shrink by default, which would clip the chips' labels.
    scroller: { flexGrow: 0, flexShrink: 0 },
    row: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
    },
    chip: {
      minWidth: theme.minTouchSize + theme.spacing.lg,
      minHeight: theme.minTouchSize + theme.spacing.lg,
      marginRight: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
    },
  });

/** Horizontal region filter ("All" + one chip per region found in the data). */
export const RegionChips = ({ regions, selected, onSelect }: Props) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroller}
    >
      {[ALL_REGIONS, ...regions].map(region => {
        const isSelected = region === selected;
        const tint = isSelected
          ? theme.colors.textOnPrimary
          : theme.colors.textMuted;
        return (
          <Pressable
            key={region}
            accessibilityRole="button"
            accessibilityLabel={`Filter by ${region}`}
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelect(region)}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected
                  ? theme.colors.primary
                  : theme.colors.surface,
                borderColor: isSelected
                  ? theme.colors.primary
                  : theme.colors.border,
              },
            ]}
          >
            <Feather
              name={iconForRegion(region)}
              size={theme.iconSize.md}
              color={tint}
            />
            <AppText variant="caption" style={{ color: tint }}>
              {region}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};
