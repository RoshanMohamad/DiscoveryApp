import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type ViewProps,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme';

type Props = ViewProps & {
  source: ImageSourcePropType;
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

/** A photo with optional scrim and bottom fade; children sit on top of it. */
export const HeroBackground = ({
  source,
  scrim = false,
  fade = false,
  style,
  children,
  ...rest
}: Props) => {
  const theme = useTheme();
  return (
    <View {...rest} style={[styles.root, style]}>
      <Image
        source={source}
        accessibilityIgnoresInvertColors
        style={styles.image}
      />
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
