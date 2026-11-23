import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
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
    sheet: {
      maxHeight: '85%',
      padding: theme.spacing.lg,
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
      backgroundColor: theme.colors.sheet,
      borderTopWidth: 1,
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
      marginRight: -theme.spacing.md,
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
        <View style={styles.sheet}>
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
                  <Feather
                    name={isSelected ? 'check-circle' : 'circle'}
                    size={theme.iconSize.md}
                    color={
                      isSelected ? theme.colors.primary : theme.colors.border
                    }
                  />
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
