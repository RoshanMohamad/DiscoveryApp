import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppText } from '../../../shared/components/AppText';
import { Button } from '../../../shared/components/Button';
import { TextField } from '../../../shared/components/TextField';
import { spacing, useTheme } from '../../../theme';
import { MIN_TOUCH_SIZE } from '../../../theme/spacing';
import { loginSchema, type LoginValues } from '../schemas';

type Props = {
  onSubmit: (values: LoginValues) => void | Promise<void>;
  onForgotPassword: () => void;
};

const styles = StyleSheet.create({
  forgot: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    minHeight: MIN_TOUCH_SIZE,
    marginBottom: spacing.sm,
  },
});

export const LoginForm = ({ onSubmit, onForgotPassword }: Props) => {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  return (
    <>
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label="Username"
            icon="user"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.username?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label="Password"
            icon="lock"
            secureTextEntry
            autoCapitalize="none"
            textContentType="password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
          />
        )}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Forgot password?"
        onPress={onForgotPassword}
        style={styles.forgot}
      >
        <AppText variant="caption" style={{ color: theme.colors.primary }}>
          Forgot password?
        </AppText>
      </Pressable>
      <Button
        title="Sign In"
        loading={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      />
    </>
  );
};
