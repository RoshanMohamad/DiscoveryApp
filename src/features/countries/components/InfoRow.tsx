import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useTheme, type Theme } from '../../../theme';
import { AppText } from '../../../shared/components/AppText';
import type { IconName } from '../../../shared/components/icons';

type Props = { label: string; value: string; icon: IconName };

const ICON_BOX = 40;

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.glassBorder,
      backgroundColor: theme.colors.glass,
    },
    iconBox: {
      width: ICON_BOX,
      height: ICON_BOX,
      borderRadius: theme.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
      backgroundColor: theme.colors.primaryMuted,
    },
    text: { flex: 1 },
  });

/** A labelled fact with an icon, used on the Facts tab. */
export const InfoRow = ({ label, value, icon }: Props) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={styles.row}
    >
      <View style={styles.iconBox}>
        <Feather
          name={icon}
          size={theme.iconSize.md}
          color={theme.colors.primary}
        />
      </View>
      <View style={styles.text}>
        <AppText variant="caption" muted>
          {label}
        </AppText>
        <AppText variant="label">{value}</AppText>
      </View>
    </View>
  );
};
