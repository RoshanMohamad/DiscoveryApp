import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { radius, spacing, useTheme } from '../../../theme';
import { AppText } from '../../../shared/components/AppText';

export const ALL_REGIONS = 'All';

type Props = {
  regions: string[];
  selected: string;
  onSelect: (region: string) => void;
};

const styles = StyleSheet.create({
  scroller: { flexGrow: 0 },
  row: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  chip: {
    paddingHorizontal: spacing.lg,
    marginRight: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
  },
});

/** Horizontal region filter ("All" + one chip per region found in the data). */
export const RegionChips = ({ regions, selected, onSelect }: Props) => {
  const theme = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroller}
    >
      {[ALL_REGIONS, ...regions].map(region => {
        const isSelected = region === selected;
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
                minHeight: theme.minTouchSize,
                backgroundColor: isSelected
                  ? theme.colors.primary
                  : theme.colors.surface,
                borderColor: isSelected
                  ? theme.colors.primary
                  : theme.colors.border,
              },
            ]}
          >
            <AppText
              variant="label"
              style={{
                color: isSelected
                  ? theme.colors.textOnPrimary
                  : theme.colors.text,
              }}
            >
              {region}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};
