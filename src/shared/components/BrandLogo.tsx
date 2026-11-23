import React from 'react';
import { StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { spacing, useTheme } from '../../theme';
import { AppText } from './AppText';

type Props = {
  /** `large` for the auth/onboarding screens, `small` for headers. */
  size?: 'large' | 'small';
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  column: { alignItems: 'center' },
  nameInline: { marginLeft: spacing.sm },
  nameStacked: { marginTop: spacing.sm },
});

/** The Passport wordmark: a paper-plane glyph and the app name. */
export const BrandLogo = ({ size = 'small' }: Props) => {
  const theme = useTheme();
  const isLarge = size === 'large';
  return (
    <View
      style={isLarge ? styles.column : styles.row}
      accessible
      accessibilityLabel="Passport"
    >
      <Feather
        name="send"
        size={isLarge ? theme.iconSize.xl : theme.iconSize.md}
        color={theme.colors.primary}
      />
      <AppText
        variant={isLarge ? 'title' : 'heading'}
        style={isLarge ? styles.nameStacked : styles.nameInline}
      >
        Passport
      </AppText>
    </View>
  );
};
