import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useAppDispatch } from '../../../app/hooks';
import { ROUTES } from '../../../app/navigation/routes';
import type { AuthScreenProps } from '../../../app/navigation/types';
import { AppText } from '../../../shared/components/AppText';
import { BrandLogo } from '../../../shared/components/BrandLogo';
import { Button } from '../../../shared/components/Button';
import type { IconName } from '../../../shared/components/icons';
import { Screen } from '../../../shared/components/Screen';
import { useTheme, type Theme } from '../../../theme';
import { onboardingCompleted } from '../onboardingSlice';

type Slide = { icon: IconName; title: string; text: string };

/** Page 0 is the welcome hero; these are pages 1..3. */
const SLIDES: readonly Slide[] = [
  {
    icon: 'globe',
    title: 'Discover the World',
    text: 'Explore countries, learn key facts, and find your next travel destination.',
  },
  {
    icon: 'heart',
    title: 'Build Your Wishlist',
    text: 'Save your favourite countries and come back anytime.',
  },
  {
    icon: 'send',
    title: 'Share & Explore',
    text: 'Share countries with friends using a simple link and open them directly in the app.',
  },
];

const PAGE_COUNT = SLIDES.length + 1;
const ILLUSTRATION_SIZE = 160;
const TILT_DEGREES = 8;

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    screen: { justifyContent: 'space-between' },
    top: {
      minHeight: theme.minTouchSize,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    skip: {
      minHeight: theme.minTouchSize,
      minWidth: theme.minTouchSize,
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    illustration: {
      width: ILLUSTRATION_SIZE,
      height: ILLUSTRATION_SIZE,
      marginBottom: theme.spacing.xxl,
    },
    cardBack: {
      position: 'absolute',
      width: ILLUSTRATION_SIZE,
      height: ILLUSTRATION_SIZE,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.primaryMuted,
      transform: [{ rotate: `-${TILT_DEGREES}deg` }],
    },
    cardFront: {
      width: ILLUSTRATION_SIZE,
      height: ILLUSTRATION_SIZE,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ rotate: `${TILT_DEGREES}deg` }],
    },
    title: { textAlign: 'center', marginTop: theme.spacing.lg },
    text: { textAlign: 'center', marginTop: theme.spacing.md },
    dots: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: theme.spacing.xl,
    },
    dot: {
      width: theme.spacing.sm,
      height: theme.spacing.sm,
      borderRadius: theme.radius.pill,
      marginHorizontal: theme.spacing.xs,
      backgroundColor: theme.colors.border,
    },
    dotActive: { backgroundColor: theme.colors.primary },
    footer: { paddingBottom: theme.spacing.lg },
  });

/** Welcome hero followed by three intro slides. Shown once, then remembered. */
export const OnboardingScreen = ({
  navigation,
}: AuthScreenProps<typeof ROUTES.Onboarding>) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);

  const isHero = page === 0;
  const isLast = page === PAGE_COUNT - 1;
  const slide = isHero ? null : SLIDES[page - 1];

  const finish = () => {
    dispatch(onboardingCompleted());
    navigation.replace(ROUTES.Login);
  };

  return (
    <Screen safeTop style={styles.screen}>
      <View style={styles.top}>
        {isHero ? null : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip"
            onPress={finish}
            style={styles.skip}
          >
            <AppText variant="label" muted>
              Skip
            </AppText>
          </Pressable>
        )}
      </View>

      <View style={styles.body}>
        {slide ? (
          <>
            <View style={styles.illustration}>
              <View style={styles.cardBack} />
              <View style={styles.cardFront}>
                <Feather
                  name={slide.icon}
                  size={theme.iconSize.xl * 2}
                  color={theme.colors.primary}
                />
              </View>
            </View>
            <AppText variant="heading" style={styles.title}>
              {slide.title}
            </AppText>
            <AppText muted style={styles.text}>
              {slide.text}
            </AppText>
          </>
        ) : (
          <>
            <BrandLogo size="large" />
            <AppText muted style={styles.text}>
              Explore Countries · Save Favourites · Share Destinations
            </AppText>
          </>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.dots} accessibilityLabel={`Page ${page + 1} of ${PAGE_COUNT}`}>
          {Array.from({ length: PAGE_COUNT }, (_, index) => (
            <View
              key={index}
              style={[styles.dot, index === page && styles.dotActive]}
            />
          ))}
        </View>
        <Button
          title={isHero ? 'Get Started' : isLast ? 'Get Started' : 'Next'}
          icon={isLast ? 'check' : 'arrow-right'}
          iconPosition="right"
          onPress={isLast ? finish : () => setPage(current => current + 1)}
        />
      </View>
    </Screen>
  );
};
