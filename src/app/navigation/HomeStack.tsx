import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../../features/countries/screens/HomeScreen';
import { ROUTES } from './routes';
import type { HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShadowVisible: false }}>
    <Stack.Screen
      name={ROUTES.Home}
      component={HomeScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);
