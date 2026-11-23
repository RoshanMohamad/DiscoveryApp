import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type ViewProps,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Path,
  Stop,
} from 'react-native-svg';
import { useTheme } from '../../theme';

type Props = ViewProps & {
  /** Photo to show. Ignored when `twilight` is set. */
  source?: ImageSourcePropType;
  /** Draw the purple twilight mountain scene (vector artwork) instead of a photo. */
  twilight?: boolean;
  /** Darken the photo so text on top stays readable. */
  scrim?: boolean;
  /** Blend the bottom edge into the screen background. */
  fade?: boolean;
};

const styles = StyleSheet.create({
  root: { overflow: 'hidden' },
  fill: StyleSheet.absoluteFill,
  // resizeMode lives in the style on current React Native (the prop is deprecated).
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

const STARS = [
  [40, 22, 1.4],
  [95, 55, 1],
  [150, 18, 1.2],
  [215, 40, 1.5],
  [270, 14, 1],
  [330, 48, 1.3],
  [372, 24, 1],
] as const;

/**
 * Hand-drawn dusk scene: indigo sky glowing pink at the horizon with three
 * mountain ridges. Illustration colours are fixed on purpose (artwork, not UI).
 */
const TwilightScene = () => (
  <Svg
    style={styles.fill}
    viewBox="0 0 400 230"
    preserveAspectRatio="xMidYMid slice"
  >
    <Defs>
      <SvgGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#140E4F" />
        <Stop offset="0.5" stopColor="#4A2C9C" />
        <Stop offset="0.8" stopColor="#9B4DB5" />
        <Stop offset="1" stopColor="#E0709F" />
      </SvgGradient>
    </Defs>
    <Path d="M0 0H400V230H0Z" fill="url(#sky)" />
    {STARS.map(([cx, cy, r]) => (
      <Circle
        key={`${cx}-${cy}`}
        cx={cx}
        cy={cy}
        r={r}
        fill="#FFFFFF"
        opacity={0.8}
      />
    ))}
    <Path
      d="M0 150L50 108L95 140L150 82L210 135L265 92L320 140L370 104L400 124V230H0Z"
      fill="#4A2F94"
      opacity={0.95}
    />
    <Path
      d="M0 178L60 136L120 172L190 118L250 166L310 130L400 172V230H0Z"
      fill="#2A1C6C"
    />
    <Path
      d="M0 204L70 166L140 198L220 160L300 198L360 172L400 192V230H0Z"
      fill="#190F4D"
    />
  </Svg>
);

/** A photo with optional scrim and bottom fade; children sit on top of it. */
export const HeroBackground = ({
  source,
  twilight = false,
  scrim = false,
  fade = false,
  style,
  children,
  ...rest
}: Props) => {
  const theme = useTheme();
  return (
    <View {...rest} style={[styles.root, style]}>
      {twilight || !source ? (
        <TwilightScene />
      ) : (
        <Image
          source={source}
          accessibilityIgnoresInvertColors
          style={styles.image}
        />
      )}
      {scrim ? (
        <LinearGradient
          colors={[...theme.gradients.scrim]}
          style={styles.fill}
          pointerEvents="none"
        />
      ) : null}
      {fade ? (
        <LinearGradient
          colors={[...theme.gradients.fadeToBackground]}
          style={styles.fill}
          pointerEvents="none"
        />
      ) : null}
      {children}
    </View>
  );
};
