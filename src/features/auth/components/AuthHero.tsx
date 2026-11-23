import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../../../assets/images';
import { AppText } from '../../../shared/components/AppText';
import { BrandLogo } from '../../../shared/components/BrandLogo';
import { CircleButton } from '../../../shared/components/CircleButton';
import { HeroBackground } from '../../../shared/components/HeroBackground';
import { useTheme, type Theme } from '../../../theme';

type Props = {
  title: string;
  subtitle: string;
  /** Shows a back button instead of the centred logo (Register). */
  onBack?: () => void;
};

const HERO_HEIGHT = 300;

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    hero: { height: HERO_HEIGHT },
    content: {
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    top: { alignItems: 'center' },
    backRow: { alignItems: 'flex-start' },
    subtitle: { marginTop: theme.spacing.xs },
  });

/** Photo header shared by Login and Register: brand/back on top, title at the bottom. */
export const AuthHero = ({ title, subtitle, onBack }: Props) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  return (
    <HeroBackground source={images.night} scrim fade style={styles.hero}>
      <View
        style={[styles.content, { paddingTop: insets.top + theme.spacing.sm }]}
      >
        <View style={onBack ? styles.backRow : styles.top}>
          {onBack ? (
            <CircleButton icon="arrow-left" label="Go back" onPress={onBack} />
          ) : (
            <BrandLogo size="large" tone="onImage" />
          )}
        </View>
        <View>
          <AppText variant="title">{title}</AppText>
          <AppText muted style={styles.subtitle}>
            {subtitle}
          </AppText>
        </View>
      </View>
    </HeroBackground>
  );
};
