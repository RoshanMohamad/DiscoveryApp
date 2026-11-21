import React from 'react';
import { Button } from 'react-native';
import { ROUTES } from '../../../app/navigation/routes';
import type { HomeStackScreenProps } from '../../../app/navigation/types';
import { AppText } from '../../../shared/components/AppText';
import { Screen } from '../../../shared/components/Screen';

/** Placeholder: country list (RTK Query) comes in the countries commits. */
export const HomeScreen = ({
  navigation,
}: HomeStackScreenProps<typeof ROUTES.Home>) => (
  <Screen>
    <AppText variant="title">Home</AppText>
    <Button
      title="Open Sri Lanka"
      onPress={() =>
        navigation.navigate(ROUTES.CountryDetails, { code: 'LKA' })
      }
    />
  </Screen>
);
