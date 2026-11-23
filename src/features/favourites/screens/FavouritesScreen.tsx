import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useAppSelector } from '../../../app/hooks';
import { ROUTES } from '../../../app/navigation/routes';
import type { AppTabScreenProps } from '../../../app/navigation/types';
import { EmptyView } from '../../../shared/components/EmptyView';
import { ErrorView } from '../../../shared/components/ErrorView';
import { LoadingView } from '../../../shared/components/LoadingView';
import { Screen } from '../../../shared/components/Screen';
import { getErrorMessage } from '../../../shared/utils/errors';
import { spacing } from '../../../theme';
import { CountryCard } from '../../countries/components/CountryCard';
import { useGetCountriesQuery } from '../../countries/countriesApi';
import { selectFavouriteCodes } from '../selectors';

const styles = StyleSheet.create({
  list: { paddingBottom: spacing.lg },
  separator: { height: spacing.md },
});

const Separator = () => <View style={styles.separator} />;

/** The travel wishlist. Reads the already-cached list, so no extra requests. */
export const FavouritesScreen = ({
  navigation,
}: AppTabScreenProps<typeof ROUTES.FavouritesTab>) => {
  const codes = useAppSelector(selectFavouriteCodes);
  const { data, isLoading, error, refetch } = useGetCountriesQuery(undefined, {
    skip: codes.length === 0,
  });

  const favourites = useMemo(() => {
    const byCode = new Map((data ?? []).map(c => [c.code, c]));
    return codes.flatMap(code => byCode.get(code) ?? []);
  }, [codes, data]);

  const openCountry = useCallback(
    (code: string) =>
      navigation.navigate(ROUTES.HomeTab, {
        screen: ROUTES.CountryDetails,
        params: { code },
        initial: false,
      }),
    [navigation],
  );

  if (codes.length === 0) {
    return (
      <Screen>
        <EmptyView
          icon="heart"
          title="Your wishlist is empty"
          message="Tap the heart on any country to save it here."
          actionLabel="Explore countries"
          onAction={() =>
            navigation.navigate(ROUTES.HomeTab, { screen: ROUTES.Home })
          }
        />
      </Screen>
    );
  }
  if (isLoading) {
    return (
      <Screen>
        <LoadingView message="Loading your wishlist…" />
      </Screen>
    );
  }
  if (error && !data) {
    return (
      <Screen>
        <ErrorView message={getErrorMessage(error)} onRetry={refetch} />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={favourites}
        keyExtractor={item => item.code}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => (
          <CountryCard country={item} onPress={openCountry} />
        )}
      />
    </Screen>
  );
};
