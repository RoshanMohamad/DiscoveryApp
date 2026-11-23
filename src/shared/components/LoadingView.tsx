import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { spacing, useTheme } from '../../theme';
import { AppText } from './AppText';

type Props = { message?: string };

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  text: { marginTop: spacing.md },
});

export const LoadingView = ({ message }: Props) => {
  const theme = useTheme();
  return (
    <View
      style={styles.center}
      accessibilityRole="progressbar"
      accessibilityLabel={message ?? 'Loading'}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message ? (
        <AppText muted style={styles.text}>
          {message}
        </AppText>
      ) : null}
    </View>
  );
};
