import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from '@react-native-vector-icons/feather';
import { FavouritesScreen } from '../../features/favourites/screens/FavouritesScreen';
import { ProfileScreen } from '../../features/settings/screens/ProfileScreen';
import { radius, spacing, useTheme } from '../../theme';
import { HomeStack } from './HomeStack';
import { ROUTES } from './routes';
import type { AppTabParamList } from './types';

const Tab = createBottomTabNavigator<AppTabParamList>();

type IconName = React.ComponentProps<typeof Feather>['name'];

const TAB_ICONS: Record<keyof AppTabParamList, IconName> = {
  [ROUTES.HomeTab]: 'home',
  [ROUTES.FavouritesTab]: 'heart',
  [ROUTES.ProfileTab]: 'user',
};

type TabIconProps = { color: string; size: number; focused: boolean };

const styles = StyleSheet.create({
  // Sits behind the icon and sticks out around it, so the fixed-size icon box
  // that React Navigation gives us does not clip or move the glyph.
  pill: {
    position: 'absolute',
    top: -spacing.xs,
    bottom: -spacing.xs,
    left: -spacing.lg,
    right: -spacing.lg,
    borderRadius: radius.pill,
  },
});

/** Built once per route at module level, so it is not a new component each render. */
const makeTabIcon = (routeName: keyof AppTabParamList) =>
  function TabIcon({ color, size, focused }: TabIconProps) {
    const theme = useTheme();
    return (
      <View>
        {focused ? (
          <View
            style={[
              styles.pill,
              { backgroundColor: theme.colors.primaryMuted },
            ]}
          />
        ) : null}
        <Feather name={TAB_ICONS[routeName]} color={color} size={size} />
      </View>
    );
  };

const TAB_BAR_ICONS = {
  [ROUTES.HomeTab]: makeTabIcon(ROUTES.HomeTab),
  [ROUTES.FavouritesTab]: makeTabIcon(ROUTES.FavouritesTab),
  [ROUTES.ProfileTab]: makeTabIcon(ROUTES.ProfileTab),
};

export const AppTabs = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Each tab draws its own in-screen title, so no native header.
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarIcon: TAB_BAR_ICONS[route.name],
        tabBarStyle: {
          backgroundColor: theme.colors.sheet,
          borderColor: theme.colors.glassBorder,
          borderTopWidth: 1,
          borderTopLeftRadius: radius.lg,
          borderTopRightRadius: radius.lg,
          height: 68,
          paddingTop: spacing.xs,
          paddingBottom: spacing.sm,
          display: 'flex',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name={ROUTES.HomeTab}
        component={HomeStack}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name={ROUTES.FavouritesTab}
        component={FavouritesScreen}
        options={{ title: 'Favourites' }}
      />
      <Tab.Screen
        name={ROUTES.ProfileTab}
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};
