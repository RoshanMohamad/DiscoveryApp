import React from 'react';
import type { HomeStackScreenProps } from '../../../app/navigation/types';
import { ROUTES } from '../../../app/navigation/routes';
import { AppText } from '../../../shared/components/AppText';
import { Screen } from '../../../shared/components/Screen';

/** Placeholder: only receives the code, will fetch its own data later. */
export const CountryDetailsScreen = ({
  route,
}: HomeStackScreenProps<typeof ROUTES.CountryDetails>) => (
  <Screen>
    <AppText variant="title">{route.params.code}</AppText>
  </Screen>
);
