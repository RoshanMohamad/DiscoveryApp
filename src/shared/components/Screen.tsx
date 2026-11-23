import React, { useMemo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, type Theme } from '../../theme';

type Props = ViewProps & {
  /** Pad the top by the status-bar inset. Use on screens with no navigation header. */
  safeTop?: boolean;
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
    },
  });

/** Themed full-screen container. Headers/tabs handle the other safe-area insets. */
export const Screen = ({ style, safeTop = false, ...rest }: Props) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View
      {...rest}
      style={[styles.root, style, safeTop && { paddingTop: insets.top }]}
    />
  );
};
