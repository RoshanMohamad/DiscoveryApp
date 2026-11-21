import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../hooks';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import { AppTabs } from './AppTabs';
import { AuthStack } from './AuthStack';
import { ROUTES } from './routes';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Auth flow vs app flow, decided purely by auth state. */
export const RootNavigator = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
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
