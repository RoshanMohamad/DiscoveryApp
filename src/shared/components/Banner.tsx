import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, type Theme } from '../../theme';
import { AppText } from './AppText';

type Props = {
  kind: 'error' | 'success';
  message: string;
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      borderRadius: theme.radius.md,
      borderWidth: 1,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
    },
    error: { borderColor: theme.colors.danger },
    success: { borderColor: theme.colors.success },
  });

/** Inline feedback message (API errors, "account created"). */
export const Banner = ({ kind, message }: Props) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View
      style={[styles.base, styles[kind]]}
      accessibilityRole={kind === 'error' ? 'alert' : undefined}
      accessibilityLiveRegion="polite"
    >
      <AppText
        style={{
          color: kind === 'error' ? theme.colors.danger : theme.colors.success,
        }}
      >
        {message}
      </AppText>
    </View>
  );
};
