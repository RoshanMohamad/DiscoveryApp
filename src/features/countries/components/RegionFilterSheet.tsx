import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { useTheme, type Theme } from '../../../theme';
import { ALL_REGIONS, iconForRegion } from '../regionIcons';

type Props = {
  visible: boolean;
  regions: string[];
  selected: string;
  onApply: (region: string) => void;
  onClose: () => void;
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: theme.colors.overlay,
    },
    // Floating card with all corners rounded, inset from the screen edges.
    sheet: {
      maxHeight: '85%',
      marginHorizontal: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.sheet,
      borderWidth: 1,
      borderColor: theme.colors.glassBorder,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    close: {
      width: theme.minTouchSize,
      height: theme.minTouchSize,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: -theme.spacing.sm,
    },
    row: {
      minHeight: theme.minTouchSize,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.glassBorder,
      gap: theme.spacing.md,
    },
    rowSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryMuted,
    },
    rowLabel: { flex: 1 },
    // Radio: outlined ring, with a filled dot inside when selected.
    radio: {
      width: 22,
      height: 22,
      borderRadius: theme.radius.pill,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioSelected: { borderColor: theme.colors.primary },
    radioDot: {
      width: 10,
      height: 10,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.primary,
    },
    apply: { marginTop: theme.spacing.md },
  });

/** Bottom sheet with one radio row per region. Nothing changes until "Apply Filter". */
export const RegionFilterSheet = ({
  visible,
  regions,
  selected,
  onApply,
  onClose,
}: Props) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState(selected);

  // Each time the sheet opens, start from the filter that is currently applied.
  useEffect(() => {
    if (visible) {
      setDraft(selected);
    }
  }, [visible, selected]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel="Close filter"
          onPress={onClose}
        />
        <View
          style={[
            styles.sheet,
            { marginBottom: Math.max(insets.bottom, theme.spacing.lg) },
          ]}
        >
          <View style={styles.header}>
            <AppText variant="heading">Filter by Region</AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onClose}
              style={styles.close}
            >
              <Feather
                name="x"
                size={theme.iconSize.lg}
                color={theme.colors.text}
              />
            </Pressable>
          </View>
          <ScrollView>
            {[ALL_REGIONS, ...regions].map(region => {
              const isSelected = region === draft;
              return (
                <Pressable
                  key={region}
                  accessibilityRole="radio"
                  accessibilityLabel={`Region ${region}`}
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => setDraft(region)}
                  style={[styles.row, isSelected && styles.rowSelected]}
                >
                  <Feather
                    name={iconForRegion(region)}
                    size={theme.iconSize.md}
                    color={theme.colors.textMuted}
                  />
                  <AppText style={styles.rowLabel}>
                    {region === ALL_REGIONS ? 'All Regions' : region}
                  </AppText>
                  <View
                    style={[styles.radio, isSelected && styles.radioSelected]}
                  >
                    {isSelected ? <View style={styles.radioDot} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
          <View style={styles.apply}>
            <Button title="Apply Filter" onPress={() => onApply(draft)} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
