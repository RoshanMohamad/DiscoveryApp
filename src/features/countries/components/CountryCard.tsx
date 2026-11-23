import React, { memo, useMemo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { radius, spacing, useTheme, type Theme } from '../../../theme';
import { AppText } from '../../../shared/components/AppText';
import { formatNumber } from '../../../shared/utils/format';
import { FavouriteButton } from '../../favourites/components/FavouriteButton';
import type { Country } from '../types';

type Props = {
  country: Country;
  onPress: (code: string) => void;
};

const FLAG_WIDTH = 72;
const FLAG_HEIGHT = 48;

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: radius.md,
      padding: spacing.md,
    },
    press: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: theme.minTouchSize,
    },
    flag: {
      width: FLAG_WIDTH,
      height: FLAG_HEIGHT,
      borderRadius: radius.sm,
      backgroundColor: theme.colors.surfaceAlt,
    },
    body: { flex: 1, marginHorizontal: spacing.md },
  });

/** One row in the list: flag, name, region / capital / population, heart. */
const CountryCardBase = ({ country, onPress }: Props) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const details = [
    country.region,
    country.capital,
    country.population !== null
      ? `${formatNumber(country.population)} people`
      : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${country.name}. ${details}`}
        onPress={() => onPress(country.code)}
        style={styles.press}
      >
        {country.flagUrl ? (
          <Image
            source={{ uri: country.flagUrl }}
            style={styles.flag}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View style={styles.flag} />
        )}
        <View style={styles.body}>
          <AppText variant="heading" numberOfLines={1}>
            {country.name}
          </AppText>
          <AppText variant="caption" muted numberOfLines={2}>
            {details}
          </AppText>
        </View>
      </Pressable>
      <FavouriteButton code={country.code} name={country.name} />
    </View>
  );
};

export const CountryCard = memo(CountryCardBase);
