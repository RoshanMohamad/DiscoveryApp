import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useAppSelector } from '../../../app/hooks';
import { ROUTES } from '../../../app/navigation/routes';
import type { AppTabScreenProps } from '../../../app/navigation/types';
import { AppText } from '../../../shared/components/AppText';
import { EmptyView } from '../../../shared/components/EmptyView';
import { ErrorView } from '../../../shared/components/ErrorView';
import { LoadingView } from '../../../shared/components/LoadingView';
import { Screen } from '../../../shared/components/Screen';
import { getErrorMessage } from '../../../shared/utils/errors';
import { spacing, useTheme } from '../../../theme';
import { CountryCard } from '../../countries/components/CountryCard';
import { useGetCountriesQuery } from '../../countries/countriesApi';
import { selectFavouriteCodes } from '../selectors';

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  header: { marginBottom: spacing.lg },
  count: { marginTop: spacing.xs },
  list: { paddingBottom: spacing.lg },
  separator: { height: spacing.md },
});

const Separator = () => <View style={styles.separator} />;

/** The travel wishlist. Reads the already-cached list, so no extra requests. */
export const FavouritesScreen = ({
  navigation,
}: AppTabScreenProps<typeof ROUTES.FavouritesTab>) => {
  const theme = useTheme();
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

  const header = (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Feather
          name="heart"
          size={theme.iconSize.lg}
          color={theme.colors.favourite}
        />
        <AppText variant="title">Favourites</AppText>
      </View>
      <AppText muted>Your travel wishlist</AppText>
      <AppText variant="caption" muted style={styles.count}>
        {codes.length} {codes.length === 1 ? 'country' : 'countries'}
      </AppText>
    </View>
  );

  let body: React.ReactNode;
  if (codes.length === 0) {
    body = (
      <EmptyView
        icon="heart"
        title="Your wishlist is empty"
        message="Tap the heart on any country to save it here."
        actionLabel="Explore countries"
        onAction={() =>
          navigation.navigate(ROUTES.HomeTab, { screen: ROUTES.Home })
        }
      />
    );
  } else if (isLoading) {
    body = <LoadingView message="Loading your wishlist…" />;
  } else if (error && !data) {
    body = <ErrorView message={getErrorMessage(error)} onRetry={refetch} />;
  } else {
    body = (
      <FlatList
        data={favourites}
        keyExtractor={item => item.code}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => (
          <CountryCard country={item} onPress={openCountry} />
        )}
      />
    );
  }

  return (
    <Screen safeTop>
      {header}
      {body}
    </Screen>
  );
};
