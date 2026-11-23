import React from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { spacing, useTheme } from '../../../theme';
import { shareCountry, type ShareInput } from '../shareCountry';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
});

/** Header action on the Details screen. */
export const ShareButton = (input: ShareInput) => {
  const theme = useTheme();

  const handlePress = async () => {
    const outcome = await shareCountry(input);
    if (outcome === 'failed') {
      Alert.alert('Could not share', 'Something went wrong. Please try again.');
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Share ${input.name}`}
      hitSlop={spacing.sm}
      onPress={handlePress}
      style={[
        styles.button,
        { minWidth: theme.minTouchSize, minHeight: theme.minTouchSize },
      ]}
    >
      <Feather name="share-2" size={22} color={theme.colors.primary} />
    </Pressable>
  );
};
