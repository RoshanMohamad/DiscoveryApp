import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { RegisterScreen } from '../../features/auth/screens/RegisterScreen';
import { ROUTES } from './routes';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name={ROUTES.Login} component={LoginScreen} />
    <Stack.Screen name={ROUTES.Register} component={RegisterScreen} />
  </Stack.Navigator>
);
