import React, { memo, useMemo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useTheme, type Theme } from '../../../theme';
import { AppText } from '../../../shared/components/AppText';
import type { IconName } from '../../../shared/components/icons';
import { formatNumber } from '../../../shared/utils/format';
import { FavouriteButton } from '../../favourites/components/FavouriteButton';
import type { Country } from '../types';

type Props = {
  country: Country;
  onPress: (code: string) => void;
};

const FLAG_WIDTH = 72;
const FLAG_HEIGHT = 56;

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: theme.radius.md,
      padding: theme.spacing.md,
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
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colors.surfaceAlt,
    },
    body: { flex: 1, marginHorizontal: theme.spacing.md },
    line: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    metaGap: { marginLeft: theme.spacing.md },
  });

type MetaProps = { icon: IconName; text: string; gap?: boolean };

/** Small icon + caption pair used for the card's secondary lines. */
const Meta = ({ icon, text, gap = false }: MetaProps) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={[styles.meta, gap && styles.metaGap]}>
      <Feather
        name={icon}
        size={theme.iconSize.sm}
        color={theme.colors.primary}
      />
      <AppText variant="caption" muted numberOfLines={1}>
        {text}
      </AppText>
    </View>
  );
};

/** One row in the list: flag, name, region / capital / population, heart. */
const CountryCardBase = ({ country, onPress }: Props) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const population =
    country.population !== null ? formatNumber(country.population) : null;
  const details = [
    country.region,
    country.capital,
    population !== null ? `${population} people` : null,
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
          <View style={styles.line}>
            <Meta icon="map-pin" text={country.region} />
          </View>
          <View style={styles.line}>
            {country.capital ? (
              <Meta icon="star" text={country.capital} />
            ) : null}
            {population !== null ? (
              <Meta icon="users" text={population} gap />
            ) : null}
          </View>
        </View>
      </Pressable>
      <FavouriteButton code={country.code} name={country.name} />
    </View>
  );
};

export const CountryCard = memo(CountryCardBase);
