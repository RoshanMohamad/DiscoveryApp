import React, { useMemo } from 'react';
import { Alert, Image, Pressable, StyleSheet, Switch, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { ROUTES } from '../../../app/navigation/routes';
import type { AppTabScreenProps } from '../../../app/navigation/types';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import type { IconName } from '../../../shared/components/icons';
import { Screen } from '../../../shared/components/Screen';
import { useTheme, type Theme } from '../../../theme';
import { signOut } from '../../auth/authThunks';
import { selectFavouriteCodes } from '../../favourites/selectors';
import { themeModeSet } from '../themeSlice';

const AVATAR_SIZE = 96;

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    title: { marginBottom: theme.spacing.lg },
    identity: { alignItems: 'center', marginBottom: theme.spacing.xl },
    avatar: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: theme.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primaryMuted,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    avatarImage: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: theme.radius.pill,
    },
    name: { marginTop: theme.spacing.md },
    card: {
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
    },
    row: {
      minHeight: theme.minTouchSize + theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border,
    },
    rowLabel: { flex: 1 },
    logout: { marginTop: theme.spacing.xl },
  });

type RowProps = {
  icon: IconName;
  label: string;
  onPress?: () => void;
  trailing: React.ReactNode;
};

/** One settings row: icon, label and a trailing control. Pressable when `onPress` is given. */
const Row = ({ icon, label, onPress, trailing }: RowProps) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const content = (
    <>
      <Feather
        name={icon}
        size={theme.iconSize.md}
        color={theme.colors.primary}
      />
      <AppText style={styles.rowLabel}>{label}</AppText>
      {trailing}
    </>
  );
  return onPress ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.row}
    >
      {content}
    </Pressable>
  ) : (
    <View style={styles.row}>{content}</View>
  );
};

export const ProfileScreen = ({
  navigation,
}: AppTabScreenProps<typeof ROUTES.ProfileTab>) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const savedCount = useAppSelector(selectFavouriteCodes).length;

  const chevron = (
    <Feather
      name="chevron-right"
      size={theme.iconSize.md}
      color={theme.colors.textMuted}
    />
  );

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Profile';

  return (
    <Screen safeTop>
      <AppText variant="title" style={styles.title}>
        Profile
      </AppText>

      <View style={styles.identity}>
        <View style={styles.avatar}>
          {user?.image ? (
            <Image
              source={{ uri: user.image }}
              style={styles.avatarImage}
              accessibilityIgnoresInvertColors
              accessibilityLabel={`${fullName} profile picture`}
            />
          ) : (
            <Feather
              name="user"
              size={theme.iconSize.xl}
              color={theme.colors.primary}
            />
          )}
        </View>
        <AppText variant="heading" style={styles.name}>
          {fullName}
        </AppText>
        {user ? <AppText muted>@{user.username}</AppText> : null}
      </View>

      <View style={styles.card}>
        <Row
          icon="moon"
          label="Dark Mode"
          trailing={
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
          }
        />
        <View style={styles.divider} />
        <Row
          icon="database"
          label="Saved Data"
          onPress={() => navigation.navigate(ROUTES.FavouritesTab)}
          trailing={
            <>
              <AppText variant="caption" muted>
                {savedCount} saved
              </AppText>
              {chevron}
            </>
          }
        />
        <View style={styles.divider} />
        <Row
          icon="info"
          label="About Passport"
          onPress={() =>
            Alert.alert(
              'About Passport',
              'Explore the world’s countries, build a travel wishlist and share any country with a link.',
            )
          }
          trailing={chevron}
        />
      </View>

      <View style={styles.logout}>
        <Button
          variant="danger"
          icon="log-out"
          title="Logout"
          onPress={() => dispatch(signOut())}
        />
      </View>
    </Screen>
  );
};
