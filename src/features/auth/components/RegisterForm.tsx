import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View, type TextInputProps } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { Controller, useForm, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import type { IconName } from '../../../shared/components/icons';
import { TextField } from '../../../shared/components/TextField';
import { useTheme, type Theme } from '../../../theme';
import { registerSchema, type RegisterValues } from '../schemas';

type Props = {
  onSubmit: (values: RegisterValues) => void | Promise<void>;
};

type FieldConfig = {
  name: Path<RegisterValues>;
  label: string;
  icon: IconName;
  inputProps?: TextInputProps;
};

// Declarative field list keeps the form short and every field consistent.
const FIELDS: FieldConfig[] = [
  {
    name: 'username',
    label: 'Username',
    icon: 'at-sign',
    inputProps: { autoCapitalize: 'none', autoCorrect: false },
  },
  {
    name: 'email',
    label: 'Email (optional)',
    icon: 'mail',
    inputProps: {
      autoCapitalize: 'none',
      autoCorrect: false,
      keyboardType: 'email-address',
      textContentType: 'emailAddress',
    },
  },
  {
    name: 'password',
    label: 'Password',
    icon: 'lock',
    inputProps: { secureTextEntry: true, autoCapitalize: 'none' },
  },
  {
    name: 'confirmPassword',
    label: 'Confirm password',
    icon: 'lock',
    inputProps: { secureTextEntry: true, autoCapitalize: 'none' },
  },
];

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    terms: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginTop: -theme.spacing.xs,
      marginBottom: theme.spacing.lg,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: theme.radius.sm / 2,
      borderWidth: 1,
      borderColor: theme.colors.glassBorder,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.glass,
    },
    checkboxOn: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },
    termsCopy: { flex: 1 },
    termsLink: { color: theme.colors.primary },
  });

export const RegisterForm = ({ onSubmit }: Props) => {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [agreed, setAgreed] = useState(true);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      // The compact reference design asks only for account credentials. These
      // defaults keep the simulated registration endpoint's required profile
      // fields valid without adding two non-reference fields to the screen.
      firstName: 'Passport',
      lastName: 'Traveller',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <>
      {FIELDS.map(({ name, label, icon, inputProps }) => (
        <Controller
          key={name}
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              {...inputProps}
              label={label}
              icon={icon}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors[name]?.message}
            />
          )}
        />
      ))}
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel="Agree to Terms and Privacy Policy"
        accessibilityState={{ checked: agreed }}
        onPress={() => setAgreed(value => !value)}
        style={styles.terms}
      >
        <View style={[styles.checkbox, agreed && styles.checkboxOn]}>
          {agreed ? (
            <Feather
              name="check"
              size={14}
              color={theme.colors.textOnPrimary}
            />
          ) : null}
        </View>
        <AppText variant="caption" muted style={styles.termsCopy}>
          I agree to the <AppText variant="caption" style={styles.termsLink}>Terms & Privacy Policy</AppText>
        </AppText>
      </Pressable>
      <Button
        title="Create Account"
        loading={isSubmitting}
        disabled={!agreed}
        onPress={handleSubmit(onSubmit)}
      />
    </>
  );
};
