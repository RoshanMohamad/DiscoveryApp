import React, { useMemo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useTheme, type Theme } from '../../theme';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
    },
  });

/** Themed full-screen container. Headers/tabs handle the safe-area insets. */
export const Screen = ({ style, ...rest }: ViewProps) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return <View {...rest} style={[styles.root, style]} />;
};
