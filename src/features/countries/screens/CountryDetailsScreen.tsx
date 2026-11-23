import React, { useLayoutEffect } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { ROUTES } from '../../../app/navigation/routes';
import type { HomeStackScreenProps } from '../../../app/navigation/types';
import { AppText } from '../../../shared/components/AppText';
import { EmptyView } from '../../../shared/components/EmptyView';
import { ErrorView } from '../../../shared/components/ErrorView';
import { LoadingView } from '../../../shared/components/LoadingView';
import { Screen } from '../../../shared/components/Screen';
import { getErrorMessage } from '../../../shared/utils/errors';
import { formatNumber } from '../../../shared/utils/format';
import { radius, spacing, useTheme } from '../../../theme';
import { FavouriteButton } from '../../favourites/components/FavouriteButton';
import { ShareButton } from '../../share/components/ShareButton';
import { InfoRow } from '../components/InfoRow';
import { useGetCountryQuery } from '../countriesApi';

const FLAG_ASPECT_RATIO = 3 / 2;

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.xxl },
  flag: {
    width: '100%',
    aspectRatio: FLAG_ASPECT_RATIO,
    borderRadius: radius.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  titleText: { flex: 1 },
  info: { marginTop: spacing.lg },
});

const isNotFound = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'status' in error &&
  error.status === 404;

/** Receives ONLY the code from the route and loads everything else itself. */
export const CountryDetailsScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<typeof ROUTES.CountryDetails>) => {
  const { code } = route.params;
  const theme = useTheme();
  const { data: country, isLoading, error, refetch } = useGetCountryQuery(code);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: country?.name ?? 'Country',
      headerRight: country
        ? () => (
            <ShareButton
              code={country.code}
              name={country.name}
              flagEmoji={country.flagEmoji}
            />
          )
        : undefined,
    });
  }, [navigation, country]);

  if (isLoading) {
    return (
      <Screen>
        <LoadingView message="Loading country…" />
      </Screen>
    );
  }

  if (isNotFound(error)) {
    return (
      <Screen>
        <EmptyView
          icon="map-pin"
          title="Country not found"
          message={`We couldn't find a country for "${code}". The link may be wrong or out of date.`}
          actionLabel="Back to countries"
          onAction={() => navigation.popTo(ROUTES.Home)}
        />
      </Screen>
    );
  }

  if (error || !country) {
    return (
      <Screen>
        <ErrorView message={getErrorMessage(error)} onRetry={refetch} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        {country.flagUrl ? (
          <Image
            source={{ uri: country.flagUrl }}
            style={[styles.flag, { backgroundColor: theme.colors.surfaceAlt }]}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
            accessibilityLabel={`Flag of ${country.name}`}
          />
        ) : null}
        <View style={styles.titleRow}>
          <View style={styles.titleText}>
            <AppText variant="title">{country.name}</AppText>
            <AppText muted>{country.officialName}</AppText>
          </View>
          <FavouriteButton code={country.code} name={country.name} />
        </View>
        <View style={styles.info}>
          <InfoRow label="Code" value={country.code} />
          {country.capital ? (
            <InfoRow label="Capital" value={country.capital} />
          ) : null}
          <InfoRow label="Region" value={country.region} />
          {country.subregion ? (
            <InfoRow label="Subregion" value={country.subregion} />
          ) : null}
          {country.population !== null ? (
            <InfoRow
              label="Population"
              value={formatNumber(country.population)}
            />
          ) : null}
          {country.areaKm2 !== null ? (
            <InfoRow
              label="Area"
              value={`${formatNumber(country.areaKm2)} km²`}
            />
          ) : null}
          {country.currencies.length > 0 ? (
            <InfoRow label="Currencies" value={country.currencies.join(', ')} />
          ) : null}
          {country.languages.length > 0 ? (
            <InfoRow label="Languages" value={country.languages.join(', ')} />
          ) : null}
          {country.borders.length > 0 ? (
            <InfoRow label="Borders" value={country.borders.join(', ')} />
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
};
