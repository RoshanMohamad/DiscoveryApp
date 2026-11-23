import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { ROUTES } from '../../../app/navigation/routes';
import type { HomeStackScreenProps } from '../../../app/navigation/types';
import { AppText } from '../../../shared/components/AppText';
import { EmptyView } from '../../../shared/components/EmptyView';
import { ErrorView } from '../../../shared/components/ErrorView';
import { LoadingView } from '../../../shared/components/LoadingView';
import { Screen } from '../../../shared/components/Screen';
import { SegmentedTabs } from '../../../shared/components/SegmentedTabs';
import { getErrorMessage } from '../../../shared/utils/errors';
import { formatNumber } from '../../../shared/utils/format';
import { useTheme, type Theme } from '../../../theme';
import { FavouriteButton } from '../../favourites/components/FavouriteButton';
import { ShareButton } from '../../share/components/ShareButton';
import { InfoRow } from '../components/InfoRow';
import { StatCard } from '../components/StatCard';
import { useGetCountryQuery } from '../countriesApi';
import { describeCountry } from '../describe';
import type { Country } from '../types';

const FLAG_ASPECT_RATIO = 3 / 2;
const TABS = ['Overview', 'Facts', 'Media'] as const;
type Tab = (typeof TABS)[number];
const NO_VALUE = '—';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    content: { paddingBottom: theme.spacing.xxl },
    flag: {
      width: '100%',
      aspectRatio: FLAG_ASPECT_RATIO,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surfaceAlt,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    titleText: { flex: 1 },
    region: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
      gap: theme.spacing.xs,
    },
    stats: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.lg,
    },
    tabs: { marginTop: theme.spacing.lg },
    section: { marginTop: theme.spacing.lg },
    sectionTitle: { marginBottom: theme.spacing.sm },
    placeholder: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    placeholderText: { marginTop: theme.spacing.sm, textAlign: 'center' },
  });

const isNotFound = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'status' in error &&
  error.status === 404;

type Styles = ReturnType<typeof makeStyles>;

const OverviewTab = ({
  country,
  styles,
}: {
  country: Country;
  styles: Styles;
}) => {
  const theme = useTheme();
  return (
    <>
      <View style={styles.section}>
        <AppText variant="heading" style={styles.sectionTitle}>
          About
        </AppText>
        <AppText muted>{describeCountry(country)}</AppText>
      </View>
      <View style={styles.section}>
        <AppText variant="heading" style={styles.sectionTitle}>
          Location
        </AppText>
        <View style={styles.placeholder}>
          <Feather
            name="map"
            size={theme.iconSize.xl}
            color={theme.colors.textMuted}
          />
          <AppText variant="caption" muted style={styles.placeholderText}>
            Map preview is not available in this demo.
          </AppText>
        </View>
      </View>
    </>
  );
};

const FactsTab = ({ country, styles }: { country: Country; styles: Styles }) => (
  <View style={styles.section}>
    <InfoRow icon="flag" label="Official Name" value={country.officialName} />
    <InfoRow icon="hash" label="Country Code" value={country.code} />
    {country.currencies.length > 0 ? (
      <InfoRow
        icon="dollar-sign"
        label="Currency"
        value={country.currencies.join(', ')}
      />
    ) : null}
    {country.languages.length > 0 ? (
      <InfoRow
        icon="message-circle"
        label="Languages"
        value={country.languages.join(', ')}
      />
    ) : null}
    {country.population !== null ? (
      <InfoRow
        icon="users"
        label="Population"
        value={formatNumber(country.population)}
      />
    ) : null}
    {country.areaKm2 !== null ? (
      <InfoRow
        icon="maximize-2"
        label="Area"
        value={`${formatNumber(country.areaKm2)} km²`}
      />
    ) : null}
    <InfoRow icon="map-pin" label="Region" value={country.region} />
    {country.subregion ? (
      <InfoRow icon="navigation" label="Subregion" value={country.subregion} />
    ) : null}
    {country.borders.length > 0 ? (
      <InfoRow
        icon="share-2"
        label="Borders"
        value={country.borders.join(', ')}
      />
    ) : null}
  </View>
);

const MediaTab = ({ styles }: { styles: Styles }) => {
  const theme = useTheme();
  return (
    <View style={[styles.section, styles.placeholder]}>
      <Feather
        name="image"
        size={theme.iconSize.xl}
        color={theme.colors.textMuted}
      />
      <AppText variant="caption" muted style={styles.placeholderText}>
        Photos and videos are not available in this demo.
      </AppText>
    </View>
  );
};

/** Receives ONLY the code from the route and loads everything else itself. */
export const CountryDetailsScreen = ({
  navigation,
  route,
}: HomeStackScreenProps<typeof ROUTES.CountryDetails>) => {
  const { code } = route.params;
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [tab, setTab] = useState<Tab>('Overview');
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
            style={styles.flag}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
            accessibilityLabel={`Flag of ${country.name}`}
          />
        ) : null}
        <View style={styles.titleRow}>
          <View style={styles.titleText}>
            <AppText variant="title">{country.name}</AppText>
            <AppText variant="caption" muted>
              {country.officialName}
            </AppText>
            <View style={styles.region}>
              <Feather
                name="map-pin"
                size={theme.iconSize.sm}
                color={theme.colors.primary}
              />
              <AppText variant="caption" muted>
                {country.region}
              </AppText>
            </View>
          </View>
          <FavouriteButton code={country.code} name={country.name} />
        </View>
        <View style={styles.stats}>
          <StatCard
            icon="star"
            label="Capital"
            value={country.capital ?? NO_VALUE}
          />
          <StatCard
            icon="users"
            label="Population"
            value={
              country.population !== null
                ? formatNumber(country.population)
                : NO_VALUE
            }
          />
          <StatCard
            icon="maximize-2"
            label="Area"
            value={
              country.areaKm2 !== null
                ? `${formatNumber(country.areaKm2)} km²`
                : NO_VALUE
            }
          />
        </View>
        <View style={styles.tabs}>
          <SegmentedTabs tabs={TABS} selected={tab} onSelect={setTab} />
        </View>
        {tab === 'Overview' ? (
          <OverviewTab country={country} styles={styles} />
        ) : null}
        {tab === 'Facts' ? <FactsTab country={country} styles={styles} /> : null}
        {tab === 'Media' ? <MediaTab styles={styles} /> : null}
      </ScrollView>
    </Screen>
  );
};
