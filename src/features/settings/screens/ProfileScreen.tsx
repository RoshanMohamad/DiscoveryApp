import React, { useMemo } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { Screen } from '../../../shared/components/Screen';
import { spacing, useTheme, type Theme } from '../../../theme';
import { signOut } from '../../auth/authThunks';
import { themeModeSet } from '../themeSlice';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    section: { marginTop: spacing.xl },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: theme.minTouchSize,
    },
  });

export const ProfileScreen = () => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  return (
    <Screen>
      <AppText variant="title">
        {user ? `${user.firstName} ${user.lastName}` : 'Profile'}
      </AppText>
      {user ? <AppText muted>@{user.username}</AppText> : null}

      <View style={styles.section}>
        <View style={styles.row}>
          <AppText>Dark mode</AppText>
          <Switch
            accessibilityLabel="Dark mode"
            value={theme.isDark}
            onValueChange={isDark => {
              dispatch(themeModeSet(isDark ? 'dark' : 'light'));
            }}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Button
          variant="secondary"
          title="Log out"
          onPress={() => dispatch(signOut())}
        />
      </View>
    </Screen>
  );
};
