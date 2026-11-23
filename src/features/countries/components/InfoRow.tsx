import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useTheme, type Theme } from '../../../theme';
import { AppText } from '../../../shared/components/AppText';
import type { IconName } from '../../../shared/components/icons';

type Props = {
  label: string;
  value: string;
  icon: IconName;
  /** Draw a hairline under the row (every row in a group except the last). */
  divider?: boolean;
};

const ICON_BOX = 40;

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm + theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
    },
    divider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.glassBorder,
    },
    // Rounded square, not a circle, to match the Facts mock-up.
    iconBox: {
      width: ICON_BOX,
      height: ICON_BOX,
      borderRadius: theme.radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
      backgroundColor: theme.colors.primaryMuted,
    },
    text: { flex: 1 },
  });

/** A labelled fact with an icon. Meant to sit inside a grouped card (see FactsTab). */
export const InfoRow = ({ label, value, icon, divider = false }: Props) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={[styles.row, divider && styles.divider]}
    >
      <View style={styles.iconBox}>
        <Feather
          name={icon}
          size={theme.iconSize.md}
          color={theme.colors.primary}
        />
      </View>
      <View style={styles.text}>
        <AppText variant="label">{label}</AppText>
        <AppText variant="caption" muted>
          {value}
        </AppText>
      </View>
    </View>
  );
};
