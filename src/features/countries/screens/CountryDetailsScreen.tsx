import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../../../assets/images';
import { ROUTES } from '../../../app/navigation/routes';
import type { HomeStackScreenProps } from '../../../app/navigation/types';
import { AppText } from '../../../shared/components/AppText';
import { CircleButton } from '../../../shared/components/CircleButton';
import { EmptyView } from '../../../shared/components/EmptyView';
import { HeroBackground } from '../../../shared/components/HeroBackground';
import { ErrorView } from '../../../shared/components/ErrorView';
import { LoadingView } from '../../../shared/components/LoadingView';
import { Screen } from '../../../shared/components/Screen';
import { SegmentedTabs } from '../../../shared/components/SegmentedTabs';
import type { IconName } from '../../../shared/components/icons';
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

const HERO_HEIGHT = 330;
const FLAG_WIDTH = 56;
const FLAG_HEIGHT = 40;
const TABS = ['Overview', 'Facts', 'Media'] as const;
type Tab = (typeof TABS)[number];
const NO_VALUE = '—';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: { padding: 0 },
    content: { paddingBottom: theme.spacing.xxl },
    topBar: { paddingHorizontal: theme.spacing.lg },
    hero: { height: HERO_HEIGHT },
    heroContent: {
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    heroActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    heroRight: { flexDirection: 'row', gap: theme.spacing.sm },
    heroTitle: { flexDirection: 'row', alignItems: 'center' },
    flag: {
      width: FLAG_WIDTH,
      height: FLAG_HEIGHT,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      borderColor: theme.colors.overlay,
      backgroundColor: theme.colors.surfaceAlt,
      marginRight: theme.spacing.md,
    },
    titleText: { flex: 1 },
    region: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
      gap: theme.spacing.xs,
    },
    body: { paddingHorizontal: theme.spacing.lg },
    stats: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.lg,
    },
    tabs: { marginTop: theme.spacing.lg },
    section: { marginTop: theme.spacing.lg },
    sectionTitle: { marginBottom: theme.spacing.sm },
    // One glass card holding every fact row, separated by hairlines.
    factsCard: {
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.glassBorder,
      backgroundColor: theme.colors.glass,
      overflow: 'hidden',
    },
    placeholder: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.colors.glassBorder,
      backgroundColor: theme.colors.glass,
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

type Fact = { icon: IconName; label: string; value: string | null };

/** Facts in display order; a null value means "unknown", and that row is skipped. */
const buildFacts = (country: Country): Fact[] => [
  { icon: 'globe', label: 'Official Name', value: country.officialName },
  {
    icon: 'dollar-sign',
    label: 'Currency',
    value: country.currencies.length > 0 ? country.currencies.join(', ') : null,
  },
  {
    icon: 'message-square',
    label: 'Languages',
    value: country.languages.length > 0 ? country.languages.join(', ') : null,
  },
  {
    icon: 'users',
    label: 'Population',
    value:
      country.population !== null ? formatNumber(country.population) : null,
  },
  {
    icon: 'maximize-2',
    label: 'Area',
    value:
      country.areaKm2 !== null ? `${formatNumber(country.areaKm2)} km²` : null,
  },
  { icon: 'map', label: 'Region', value: country.region },
  { icon: 'navigation', label: 'Subregion', value: country.subregion ?? null },
  {
    icon: 'share-2',
    label: 'Borders',
    value: country.borders.length > 0 ? country.borders.join(', ') : null,
  },
];

const FactsTab = ({
  country,
  styles,
}: {
  country: Country;
  styles: Styles;
}) => {
  const facts = buildFacts(country).filter(
    (fact): fact is Fact & { value: string } => Boolean(fact.value),
  );
  return (
    <View style={[styles.section, styles.factsCard]}>
      {facts.map((fact, index) => (
        <InfoRow
          key={fact.label}
          icon={fact.icon}
          label={fact.label}
          value={fact.value}
          divider={index < facts.length - 1}
        />
      ))}
    </View>
  );
};

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

/** Back button on its own row, for states that have no photo hero. */
const TopBar = ({ styles, onBack }: { styles: Styles; onBack: () => void }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.topBar, { paddingTop: insets.top }]}>
      <CircleButton
        icon="arrow-left"
        label="Go back"
        tone="plain"
        onPress={onBack}
      />
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
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('Overview');
  const { data: country, isLoading, error, refetch } = useGetCountryQuery(code);
  const goBack = () => navigation.goBack();

  if (isLoading) {
    return (
      <Screen style={styles.screen}>
        <TopBar styles={styles} onBack={goBack} />
        <LoadingView message="Loading country…" />
      </Screen>
    );
  }

  if (isNotFound(error)) {
    return (
      <Screen style={styles.screen}>
        <TopBar styles={styles} onBack={goBack} />
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
      <Screen style={styles.screen}>
        <TopBar styles={styles} onBack={goBack} />
        <ErrorView message={getErrorMessage(error)} onRetry={refetch} />
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HeroBackground source={images.valley} fade style={styles.hero}>
          <View
            style={[
              styles.heroContent,
              { paddingTop: insets.top + theme.spacing.sm },
            ]}
          >
            <View style={styles.heroActions}>
              <CircleButton
                icon="arrow-left"
                label="Go back"
                onPress={goBack}
              />
              <View style={styles.heroRight}>
                <FavouriteButton
                  code={country.code}
                  name={country.name}
                  tone="overlay"
                />
                <ShareButton
                  code={country.code}
                  name={country.name}
                  flagEmoji={country.flagEmoji}
                />
              </View>
            </View>
            <View style={styles.heroTitle}>
              {country.flagUrl ? (
                <Image
                  source={{ uri: country.flagUrl }}
                  style={styles.flag}
                  resizeMode="cover"
                  accessibilityIgnoresInvertColors
                  accessibilityLabel={`Flag of ${country.name}`}
                />
              ) : null}
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
            </View>
          </View>
        </HeroBackground>
        <View style={styles.body}>
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
          {tab === 'Facts' ? (
            <FactsTab country={country} styles={styles} />
          ) : null}
          {tab === 'Media' ? <MediaTab styles={styles} /> : null}
        </View>
      </ScrollView>
    </Screen>
  );
};
