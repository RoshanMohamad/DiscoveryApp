import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../hooks';
import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { RegisterScreen } from '../../features/auth/screens/RegisterScreen';
import { selectOnboardingCompleted } from '../../features/onboarding/onboardingSlice';
import { OnboardingScreen } from '../../features/onboarding/screens/OnboardingScreen';
import { ROUTES } from './routes';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/** First launch starts on the intro slides; after that, straight to Login. */
export const AuthStack = () => {
  const onboardingCompleted = useAppSelector(selectOnboardingCompleted);
  return (
    <Stack.Navigator
      // Only read on mount: finishing the intro must not re-route by itself.
      initialRouteName={onboardingCompleted ? ROUTES.Login : ROUTES.Onboarding}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={ROUTES.Onboarding} component={OnboardingScreen} />
      <Stack.Screen name={ROUTES.Login} component={LoginScreen} />
      <Stack.Screen name={ROUTES.Register} component={RegisterScreen} />
    </Stack.Navigator>
  );
};
