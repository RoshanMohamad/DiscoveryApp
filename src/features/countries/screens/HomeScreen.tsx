import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '../../../app/hooks';
import { images } from '../../../assets/images';
import { ROUTES } from '../../../app/navigation/routes';
import type { HomeStackScreenProps } from '../../../app/navigation/types';
import type { AppStackParamList } from '../../../app/navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText } from '../../../shared/components/AppText';
import { BrandLogo } from '../../../shared/components/BrandLogo';
import { HeroBackground } from '../../../shared/components/HeroBackground';
import { EmptyView } from '../../../shared/components/EmptyView';
import { ErrorView } from '../../../shared/components/ErrorView';
import { LoadingView } from '../../../shared/components/LoadingView';
import { Screen } from '../../../shared/components/Screen';
import { SearchBar } from '../../../shared/components/SearchBar';
import { getErrorMessage } from '../../../shared/utils/errors';
import { showNotAvailable } from '../../../shared/utils/notAvailable';
import { spacing, useTheme, type Theme } from '../../../theme';
import { CountryCard } from '../components/CountryCard';
import { RegionChips } from '../components/RegionChips';
import { RegionFilterSheet } from '../components/RegionFilterSheet';
import { useGetCountriesQuery } from '../countriesApi';
import { ALL_REGIONS } from '../regionIcons';
import type { Country } from '../types';

/** Two columns from tablet width upwards. */
const TABLET_BREAKPOINT = 600;
const HERO_HEIGHT = 250;

const separatorStyles = StyleSheet.create({
  separator: { height: spacing.md },
});

const Separator = () => <View style={separatorStyles.separator} />;

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: { padding: 0 },
    hero: { height: HERO_HEIGHT },
    header: {
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    iconButton: {
      width: theme.minTouchSize,
      height: theme.minTouchSize,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: -theme.spacing.sm,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      marginTop: -theme.spacing.xl,
      zIndex: 1,
    },
    filterButton: {
      width: theme.minTouchSize,
      height: theme.minTouchSize,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.glassBorder,
      backgroundColor: theme.colors.glass,
      alignItems: 'center',
      justifyContent: 'center',
    },
    filterActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryMuted,
    },
    list: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.lg },
    column: { gap: theme.spacing.md },
    cell: { flex: 1 },
  });

const matchesSearch = (country: Country, query: string): boolean => {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }
  return (
    country.name.toLowerCase().includes(needle) ||
    (country.capital?.toLowerCase().includes(needle) ?? false)
  );
};

export const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const firstName = useAppSelector(state => state.auth.user?.firstName);
  const { data, isLoading, isFetching, error, refetch } =
    useGetCountriesQuery();
  const [region, setRegion] = useState(ALL_REGIONS);
  const [search, setSearch] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const { width } = useWindowDimensions();
  const numColumns = width >= TABLET_BREAKPOINT ? 2 : 1;

  const regions = useMemo(
    () => Array.from(new Set((data ?? []).map(c => c.region))).sort(),
    [data],
  );
  const visible = useMemo(
    () =>
      (data ?? []).filter(
        c =>
          (region === ALL_REGIONS || c.region === region) &&
          matchesSearch(c, search),
      ),
    [data, region, search],
  );

  const openCountry = useCallback(
    (code: string) => navigation.navigate(ROUTES.CountryDetails, { code }),
    [navigation],
  );

  const clearFilters = () => {
    setRegion(ALL_REGIONS);
    setSearch('');
  };

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
        message="Try another search or region."
        actionLabel="Show all"
        onAction={clearFilters}
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
        keyboardShouldPersistTaps="handled"
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
      <HeroBackground source={images.night} scrim fade style={styles.hero}>
        <View
          style={[styles.header, { paddingTop: insets.top + theme.spacing.sm }]}
        >
          <View style={styles.topRow}>
            <BrandLogo tone="onImage" />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              onPress={() => showNotAvailable('Notifications')}
              style={styles.iconButton}
            >
              <Feather
                name="bell"
                size={theme.iconSize.lg}
                color={theme.colors.textOnPrimary}
              />
            </Pressable>
          </View>
          <View>
            <AppText variant="title">
              {firstName ? `Hello, ${firstName} 👋` : 'Explore'}
            </AppText>
            <AppText muted>Where to next?</AppText>
          </View>
        </View>
      </HeroBackground>
      {data ? (
        <>
          <View style={styles.searchRow}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search countries, capitals..."
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Filter by region"
              onPress={() => setSheetOpen(true)}
              style={[
                styles.filterButton,
                region !== ALL_REGIONS && styles.filterActive,
              ]}
            >
              <Feather
                name="sliders"
                size={theme.iconSize.md}
                color={
                  region !== ALL_REGIONS
                    ? theme.colors.primary
                    : theme.colors.textMuted
                }
              />
            </Pressable>
          </View>
          <RegionChips
            regions={regions}
            selected={region}
            onSelect={setRegion}
          />
          <RegionFilterSheet
            visible={sheetOpen}
            regions={regions}
            selected={region}
            onApply={next => {
              setRegion(next);
              setSheetOpen(false);
            }}
            onClose={() => setSheetOpen(false)}
          />
        </>
      ) : null}
      {content}
    </Screen>
  );
};
