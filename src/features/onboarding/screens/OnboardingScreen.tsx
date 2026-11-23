import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../../../assets/images';
import { useAppDispatch } from '../../../app/hooks';
import { ROUTES } from '../../../app/navigation/routes';
import type { AuthScreenProps } from '../../../app/navigation/types';
import { AppText } from '../../../shared/components/AppText';
import { BrandLogo } from '../../../shared/components/BrandLogo';
import { Button } from '../../../shared/components/Button';
import { HeroBackground } from '../../../shared/components/HeroBackground';
import type { IconName } from '../../../shared/components/icons';
import { useTheme, type Theme } from '../../../theme';
import { withAlpha } from '../../../theme/colors';
import { onboardingCompleted } from '../onboardingSlice';

type Slide = {
  title: string;
  text: string;
  front: ImageSourcePropType;
  back: ImageSourcePropType;
  /** Small floating badge on the illustration. */
  badge: IconName;
};

/** Page 0 is the welcome hero; these are pages 1..3. */
const SLIDES: readonly Slide[] = [
  {
    title: 'Discover the World',
    text: 'Explore countries, learn key facts, and find your next travel destination.',
    front: images.santorini,
    back: images.lake,
    badge: 'compass',
  },
  {
    title: 'Build Your Wishlist',
    text: 'Save your favourite countries and come back anytime.',
    front: images.valley,
    back: images.santorini,
    badge: 'heart',
  },
  {
    title: 'Share & Explore',
    text: 'Share countries with friends using a simple link and open them directly in the app.',
    front: images.lake,
    back: images.valley,
    badge: 'send',
  },
];

const PAGE_COUNT = SLIDES.length + 1;
const CARD_WIDTH = 190;
const CARD_HEIGHT = 230;
const BADGE_SIZE = 72;
const TILT_BACK = '-9deg';
const TILT_FRONT = '5deg';

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.background },
    fill: { flex: 1 },
    top: {
      minHeight: theme.minTouchSize,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    skip: {
      minHeight: theme.minTouchSize,
      minWidth: theme.minTouchSize,
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    heroBody: {
      flex: 1,
      alignItems: 'center',
      paddingTop: theme.spacing.xxl * 2,
      paddingHorizontal: theme.spacing.xl,
    },
    illustration: {
      width: CARD_WIDTH + theme.spacing.xxl * 2,
      height: CARD_HEIGHT + theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.xl,
    },
    card: {
      position: 'absolute',
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surfaceAlt,
    },
    cardBack: { transform: [{ rotate: TILT_BACK }, { translateX: -22 }] },
    cardFront: {
      transform: [{ rotate: TILT_FRONT }, { translateX: 14 }],
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    badge: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: BADGE_SIZE,
      height: BADGE_SIZE,
      borderRadius: theme.radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    badgeHeart: { backgroundColor: theme.colors.favourite },
    gradient: StyleSheet.absoluteFill,
    title: { textAlign: 'center' },
    text: { textAlign: 'center', marginTop: theme.spacing.md },
    tagline: {
      textAlign: 'center',
      marginTop: theme.spacing.md,
      color: theme.colors.textOnPrimary,
    },
    footer: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
    },
    dots: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: theme.spacing.lg,
    },
    dot: {
      width: theme.spacing.sm,
      height: theme.spacing.sm,
      borderRadius: theme.radius.pill,
      marginHorizontal: theme.spacing.xs,
      backgroundColor: theme.colors.border,
    },
    dotOnImage: { backgroundColor: withAlpha(theme.colors.textOnPrimary, 0.4) },
    dotActive: { backgroundColor: theme.colors.primary },
    dotActiveOnImage: { backgroundColor: theme.colors.textOnPrimary },
  });

type Styles = ReturnType<typeof makeStyles>;

const Dots = ({
  page,
  styles,
  onImage,
}: {
  page: number;
  styles: Styles;
  onImage: boolean;
}) => (
  <View
    style={styles.dots}
    accessibilityLabel={`Page ${page + 1} of ${PAGE_COUNT}`}
  >
    {Array.from({ length: PAGE_COUNT }, (_, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          onImage && styles.dotOnImage,
          index === page &&
            (onImage ? styles.dotActiveOnImage : styles.dotActive),
        ]}
      />
    ))}
  </View>
);

/** Welcome hero followed by three intro slides. Shown once, then remembered. */
export const OnboardingScreen = ({
  navigation,
}: AuthScreenProps<typeof ROUTES.Onboarding>) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);

  const isHero = page === 0;
  const isLast = page === PAGE_COUNT - 1;
  const slide = isHero ? null : SLIDES[page - 1];

  const finish = () => {
    dispatch(onboardingCompleted());
    navigation.replace(ROUTES.Login);
  };

  const button = (
    <Button
      title={isLast || isHero ? 'Get Started' : 'Next'}
      icon={isLast ? 'check' : 'arrow-right'}
      iconPosition="right"
      onPress={isLast ? finish : () => setPage(current => current + 1)}
    />
  );

  if (!slide) {
    return (
      <HeroBackground
        source={images.welcome}
        scrim
        style={styles.fill}
        accessibilityLabel="Welcome to Passport"
      >
        <View style={[styles.fill, { paddingTop: insets.top }]}>
          <View style={styles.heroBody}>
            <BrandLogo size="large" tone="onImage" />
            <AppText style={styles.tagline}>
              Explore Countries · Save Favourites · Share Destinations
            </AppText>
          </View>
          <View
            style={[
              styles.footer,
              { paddingBottom: insets.bottom + theme.spacing.lg },
            ]}
          >
            <Dots page={page} styles={styles} onImage />
            {button}
          </View>
        </View>
      </HeroBackground>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[...theme.gradients.screen]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.top}>
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
      </View>

      <View style={styles.body}>
        <View style={styles.illustration}>
          <Image
            source={slide.back}
            style={[styles.card, styles.cardBack]}
            accessibilityIgnoresInvertColors
          />
          <Image
            source={slide.front}
            style={[styles.card, styles.cardFront]}
            accessibilityIgnoresInvertColors
          />
          <View
            style={[styles.badge, slide.badge === 'heart' && styles.badgeHeart]}
          >
            {slide.badge === 'heart' ? null : (
              <LinearGradient
                colors={[...theme.gradients.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              />
            )}
            <Feather
              name={slide.badge}
              size={theme.iconSize.xl}
              color={theme.colors.textOnPrimary}
            />
          </View>
        </View>
        <AppText variant="heading" style={styles.title}>
          {slide.title}
        </AppText>
        <AppText muted style={styles.text}>
          {slide.text}
        </AppText>
      </View>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + theme.spacing.lg },
        ]}
      >
        <Dots page={page} styles={styles} onImage={false} />
        {button}
      </View>
    </View>
  );
};
