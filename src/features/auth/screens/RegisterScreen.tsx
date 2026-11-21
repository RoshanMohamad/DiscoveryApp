import React from 'react';
import { Button } from 'react-native';
import { ROUTES } from '../../../app/navigation/routes';
import type { AuthScreenProps } from '../../../app/navigation/types';
import { AppText } from '../../../shared/components/AppText';
import { Screen } from '../../../shared/components/Screen';

/** Placeholder: real form comes in the auth commit. */
export const RegisterScreen = ({
  navigation,
}: AuthScreenProps<typeof ROUTES.Register>) => (
  <Screen>
    <AppText variant="title">Register</AppText>
    <Button title="Back to Login" onPress={() => navigation.goBack()} />
  </Screen>
);
