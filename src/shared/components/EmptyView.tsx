import React from 'react';
import { StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { spacing, useTheme } from '../../theme';
import { AppText } from './AppText';
import { Button } from './Button';

type IconName = React.ComponentProps<typeof Feather>['name'];

type Props = {
  icon?: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: { marginTop: spacing.md, textAlign: 'center' },
  message: { marginTop: spacing.sm, textAlign: 'center' },
  action: { marginTop: spacing.xl, alignSelf: 'stretch' },
});

/** "Nothing here" (and "not found") state, with an optional action. */
export const EmptyView = ({
  icon = 'inbox',
  title,
  message,
  actionLabel,
  onAction,
}: Props) => {
  const theme = useTheme();
  return (
    <View style={styles.center}>
      <Feather name={icon} size={40} color={theme.colors.textMuted} />
      <AppText variant="heading" style={styles.title}>
        {title}
      </AppText>
      {message ? (
        <AppText muted style={styles.message}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button variant="secondary" title={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
};
