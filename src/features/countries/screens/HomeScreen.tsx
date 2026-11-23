import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useAppSelector } from '../../../app/hooks';
import { ROUTES } from '../../../app/navigation/routes';
import type { HomeStackScreenProps } from '../../../app/navigation/types';
import { AppText } from '../../../shared/components/AppText';
import { EmptyView } from '../../../shared/components/EmptyView';
import { ErrorView } from '../../../shared/components/ErrorView';
import { LoadingView } from '../../../shared/components/LoadingView';
import { Screen } from '../../../shared/components/Screen';
import { getErrorMessage } from '../../../shared/utils/errors';
import { spacing } from '../../../theme';
import { CountryCard } from '../components/CountryCard';
import { ALL_REGIONS, RegionChips } from '../components/RegionChips';
import { useGetCountriesQuery } from '../countriesApi';

/** Two columns from tablet width upwards. */
const TABLET_BREAKPOINT = 600;

const styles = StyleSheet.create({
  screen: { padding: 0 },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  list: { padding: spacing.lg },
  separator: { height: spacing.md },
  column: { gap: spacing.md },
  cell: { flex: 1 },
});

export const HomeScreen = ({
  navigation,
}: HomeStackScreenProps<typeof ROUTES.Home>) => {
  const firstName = useAppSelector(state => state.auth.user?.firstName);
  const { data, isLoading, isFetching, error, refetch } =
    useGetCountriesQuery();
  const [region, setRegion] = useState(ALL_REGIONS);
  const { width } = useWindowDimensions();
  const numColumns = width >= TABLET_BREAKPOINT ? 2 : 1;

  const regions = useMemo(
    () => Array.from(new Set((data ?? []).map(c => c.region))).sort(),
    [data],
  );
  const visible = useMemo(
    () =>
      region === ALL_REGIONS
        ? data ?? []
        : (data ?? []).filter(c => c.region === region),
    [data, region],
  );

  const openCountry = useCallback(
    (code: string) => navigation.navigate(ROUTES.CountryDetails, { code }),
    [navigation],
  );

  let content: React.ReactNode;
  if (isLoading) {
    content = <LoadingView message="Loading countries…" />;
  } else if (error && !data) {
    content = <ErrorView message={getErrorMessage(error)} onRetry={refetch} />;
  } else if (visible.length === 0) {
    content = (
      <EmptyView
        icon="globe"
        title="No countries found"
        message="Try another region."
        actionLabel="Show all"
        onAction={() => setRegion(ALL_REGIONS)}
      />
    );
  } else {
    content = (
      <FlatList
        // Changing numColumns on the fly needs a new key.
        key={`columns-${numColumns}`}
        data={visible}
        keyExtractor={item => item.code}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.column : undefined}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <CountryCard country={item} onPress={openCountry} />
          </View>
        )}
        refreshing={isFetching && !isLoading}
        onRefresh={refetch}
        initialNumToRender={10}
        windowSize={7}
      />
    );
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.header}>
        <AppText variant="title">
          {firstName ? `Hello, ${firstName}` : 'Explore'}
        </AppText>
        <AppText muted>Where to next?</AppText>
      </View>
      {data ? (
        <RegionChips regions={regions} selected={region} onSelect={setRegion} />
      ) : null}
      {content}
    </Screen>
  );
};

const Separator = () => <View style={styles.separator} />;
