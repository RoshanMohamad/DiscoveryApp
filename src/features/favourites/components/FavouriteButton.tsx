import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { spacing, useTheme } from '../../../theme';
import { favouriteToggled } from '../favouritesSlice';
import { selectIsFavourite } from '../selectors';

type Props = { code: string; name: string };

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
});

/** Heart toggle used on both the country card and the Details screen. */
export const FavouriteButton = ({ code, name }: Props) => {
  const theme = useTheme();
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
      hitSlop={spacing.sm}
      onPress={() => dispatch(favouriteToggled(code))}
      style={[
        styles.button,
        { minWidth: theme.minTouchSize, minHeight: theme.minTouchSize },
      ]}
    >
      <Feather
        name="heart"
        size={24}
        color={isFavourite ? theme.colors.favourite : theme.colors.textMuted}
      />
    </Pressable>
  );
};
