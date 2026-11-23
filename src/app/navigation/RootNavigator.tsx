import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import {
  pendingLinkCleared,
  selectPendingLinkCode,
} from '../../features/share/pendingLinkSlice';
import { AppTabs } from './AppTabs';
import { AuthStack } from './AuthStack';
import { ROUTES } from './routes';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Auth flow vs app flow, decided purely by auth state. */
export const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const pendingCode = useAppSelector(selectPendingLinkCode);

  // A link opened while logged out: once signed in, open that country.
  useEffect(() => {
    if (isAuthenticated && pendingCode) {
      navigation.navigate(ROUTES.App, {
        screen: ROUTES.HomeTab,
        params: {
          screen: ROUTES.CountryDetails,
          params: { code: pendingCode },
          initial: false,
        },
      });
      dispatch(pendingLinkCleared());
    }
  }, [isAuthenticated, pendingCode, navigation, dispatch]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name={ROUTES.App} component={AppTabs} />
      ) : (
        <Stack.Screen name={ROUTES.Auth} component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};
