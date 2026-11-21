import React from 'react';
import { Button } from 'react-native';
import { ROUTES } from '../../../app/navigation/routes';
import type { AuthScreenProps } from '../../../app/navigation/types';
import { useAppDispatch } from '../../../app/hooks';
import { AppText } from '../../../shared/components/AppText';
import { Screen } from '../../../shared/components/Screen';
import { signedIn } from '../authSlice';

/** Placeholder: real form (react-hook-form + Zod) comes in the auth commit. */
export const LoginScreen = ({
  navigation,
}: AuthScreenProps<typeof ROUTES.Login>) => {
  const dispatch = useAppDispatch();
  return (
    <Screen>
      <AppText variant="title">Login</AppText>
      <Button
        title="Dev sign in"
        onPress={() =>
          dispatch(signedIn({ id: 1, username: 'emilys', firstName: 'Emily' }))
        }
      />
      <Button
        title="Go to Register"
        onPress={() => navigation.navigate(ROUTES.Register)}
      />
    </Screen>
  );
};
