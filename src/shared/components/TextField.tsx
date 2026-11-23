import React, { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { useTheme, type Theme } from '../../theme';
import { AppText } from './AppText';
import type { IconName } from './icons';

type Props = TextInputProps & {
  /** Used as the placeholder and the accessibility label. */
  label: string;
  error?: string;
  /** Feather icon shown at the start of the field. */
  icon?: IconName;
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: { marginBottom: theme.spacing.md },
    field: {
      minHeight: theme.minTouchSize,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.surface,
    },
    fieldError: { borderColor: theme.colors.danger },
    icon: { marginRight: theme.spacing.sm },
    input: {
      flex: 1,
      minHeight: theme.minTouchSize,
      color: theme.colors.text,
      ...theme.typography.body,
    },
    toggle: {
      minWidth: theme.minTouchSize,
      minHeight: theme.minTouchSize,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: -theme.spacing.md,
    },
    error: { marginTop: theme.spacing.xs, color: theme.colors.danger },
  });

/** Input with a leading icon, an inline error underneath and a show/hide toggle for passwords. */
export const TextField = ({
  label,
  error,
  icon,
  style,
  secureTextEntry,
  ...rest
}: Props) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [hidden, setHidden] = useState(true);
  const isPassword = secureTextEntry === true;

  return (
    <View style={styles.container}>
      <View style={[styles.field, error ? styles.fieldError : null]}>
        {icon ? (
          <Feather
            name={icon}
            size={theme.iconSize.md}
            color={theme.colors.textMuted}
            style={styles.icon}
          />
        ) : null}
        <TextInput
          accessibilityLabel={label}
          placeholder={label}
          placeholderTextColor={theme.colors.textMuted}
          {...rest}
          secureTextEntry={isPassword && hidden}
          style={[styles.input, style]}
        />
        {isPassword ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            onPress={() => setHidden(value => !value)}
            style={styles.toggle}
          >
            <Feather
              name={hidden ? 'eye-off' : 'eye'}
              size={theme.iconSize.md}
              color={theme.colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText
          variant="caption"
          style={styles.error}
          accessibilityRole="alert"
        >
          {error}
        </AppText>
      ) : null}
    </View>
  );
};
