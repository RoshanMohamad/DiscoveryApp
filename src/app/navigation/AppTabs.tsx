import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from '@react-native-vector-icons/feather';
import { FavouritesScreen } from '../../features/favourites/screens/FavouritesScreen';
import { ProfileScreen } from '../../features/settings/screens/ProfileScreen';
import { useTheme } from '../../theme';
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

type TabIconProps = { color: string; size: number };

/** Built once per route at module level, so it is not a new component each render. */
const makeTabIcon = (routeName: keyof AppTabParamList) =>
  function TabIcon({ color, size }: TabIconProps) {
    return <Feather name={TAB_ICONS[routeName]} color={color} size={size} />;
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
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
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
