import React, { useMemo } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { useTheme, type Theme } from '../../theme';
import { AppText } from './AppText';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: { marginBottom: theme.spacing.lg },
    label: { marginBottom: theme.spacing.xs },
    input: {
      minHeight: theme.minTouchSize,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      ...theme.typography.body,
    },
    inputError: { borderColor: theme.colors.danger },
    error: { marginTop: theme.spacing.xs, color: theme.colors.danger },
  });

/** Labelled input with an inline error message underneath. */
export const TextField = ({ label, error, style, ...rest }: Props) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={styles.container}>
      <AppText variant="label" style={styles.label}>
        {label}
      </AppText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={theme.colors.textMuted}
        {...rest}
        style={[styles.input, error ? styles.inputError : null, style]}
      />
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
