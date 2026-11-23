import React, { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import Svg, { Path } from 'react-native-svg';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useTheme, type Theme } from '../../../theme';
import { favouriteToggled } from '../favouritesSlice';
import { selectIsFavourite } from '../selectors';

type Props = {
  code: string;
  name: string;
  /** `overlay` sits on a photo (dark translucent disc). */
  tone?: 'plain' | 'overlay';
};

const HEART_SIZE = 24;
// Feather's heart outline, reused as a filled shape (Feather itself cannot fill).
const HEART_PATH =
  'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: theme.minTouchSize,
      minHeight: theme.minTouchSize,
      padding: theme.spacing.sm,
    },
    overlay: {
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.overlay,
    },
  });

/** Heart toggle used on both the country card and the Details screen. */
export const FavouriteButton = ({ code, name, tone = 'plain' }: Props) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const dispatch = useAppDispatch();
  // Selecting a boolean: only this button re-renders when its country changes.
  const isFavourite = useAppSelector(state => selectIsFavourite(state, code));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        isFavourite
          ? `Remove ${name} from favourites`
          : `Add ${name} to favourites`
      }
      accessibilityState={{ selected: isFavourite }}
      hitSlop={theme.spacing.sm}
      onPress={() => dispatch(favouriteToggled(code))}
      style={[styles.button, tone === 'overlay' && styles.overlay]}
    >
      {isFavourite ? (
        <Svg width={HEART_SIZE} height={HEART_SIZE} viewBox="0 0 24 24">
          <Path
            d={HEART_PATH}
            fill={theme.colors.favourite}
            stroke={theme.colors.favourite}
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </Svg>
      ) : (
        <Feather
          name="heart"
          size={HEART_SIZE}
          color={
            tone === 'overlay' ? theme.colors.text : theme.colors.textMuted
          }
        />
      )}
    </Pressable>
  );
};
